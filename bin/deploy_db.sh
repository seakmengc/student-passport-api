main() {
    local service_name=mongo
    local container_network=mynetwork

    mkdir -p /docker/db

    docker service create --update-order start-first --update-failure-action rollback --rollback-order stop-first --restart-condition on-failure --restart-max-attempts 3 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root --name $service_name --network $container_network --mount type=bind,source=/docker/db,destination=/data/db mongo:5.0.8-focal
}

main