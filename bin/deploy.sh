container_image=$1
container_network=mynetwork

service_name=api

is_service_up() {
  local service_name=$1

  if [[ -z $(docker ps -f name=$service_name -q | head -n1) ]]; then
    echo "0"
  else
    echo "1"
  fi
}

up_container() {
    docker service rm $service_name
    
    docker service create --update-order start-first --update-failure-action rollback --rollback-order stop-first --restart-condition on-failure --restart-max-attempts 3 --replicas $replica --network $container_network --mount type=bind,source=/docker/storage,destination=/app/storage --name $service_name $container_image
}

update_server() {
  docker service update --force --update-order start-first --update-failure-action rollback --rollback-order stop-first --restart-condition on-failure --restart-max-attempts 3 --replicas 1 $service_name

  # deployment error
  if [[ $(docker service inspect $service_name --format "{{.UpdateStatus.State}}") = "rollback_completed" ]]; then
    echo "Deployment rollback..."
    exit 1
  fi
}

deploy() {
  local replica=1

  docker network create -d overlay $container_network --attachable

  up_container $replica
}

determine_deployment_strategy() {  
  if [[ $(is_service_up $container_image) = "0" ]]; then
    echo "No server is up... use deploy strategy!"

    commands=()
    run_commands "${commands[@]}" 

    deploy

  else
    echo "One server is up... use update strategy!"
    commands=("yarn seed:run:prod")

    run_commands "${commands[@]}"

    update_server
  fi

  echo "DONE !"
}

run_commands() {
  local command_to_run=("$@")

  # docker exec $api_container_id yarn seed:run
  for command in "${command_to_run[@]}"; do
    local container_id=$(docker run -d --network=$container_network $container_image $command)

    local container_rc=$(docker wait $container_id) # produces its exit status
    docker rm "$container_id"

    if [[ "$container_rc" -ne 0 ]]; then
        echo "Failed to run ${command}!"
        exit $container_rc
    else
      echo "Run command: ${command}";
    fi
  done

  echo "Done running commands!";
}

# call func
determine_deployment_strategy
