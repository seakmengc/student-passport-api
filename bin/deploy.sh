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

up_mysql() {
    local user=auth_user
    local password=password
    local db=auth_api

    local api_container_id=$(docker ps -f name=erp_mysql -q | head -n1)

    docker exec $api_container_id mysql -uroot -proot -e "CREATE USER IF NOT EXISTS $user@'%' IDENTIFIED BY '$password'; CREATE DATABASE IF NOT EXISTS $db; GRANT ALL ON $db.* TO $user@'%';"

    echo "MySQL is UP!"
}

up_container() {
    docker service rm $service_name
    
    docker service create --update-order start-first --update-failure-action rollback --rollback-order stop-first --restart-condition on-failure --restart-max-attempts 3 --replicas $replica --network $container_network --name $service_name $container_image
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

  up_mysql

  up_container $replica
}

commands() {
  local command_to_run=("yarn seed:run:prod -s EmailSeeder")
  # local api_container_id=$(docker ps -f name=$service_name -q | head -n1)

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

determine_deployment_strategy() {
  if [[ $(is_service_up $service_name) = "0" ]]; then
    echo "No server is up... use deploy strategy!"
    deploy

    commands
  else
    echo "One server is up... use update strategy!"
    commands

    update_server
  fi

  echo "DONE !"
}

# call func
determine_deployment_strategy