main() {
    local mysql_user=root
    local mysql_password=root
    local mysql_service_name=erp_mysql
    local container_network=erp_network

    docker service create --health-cmd "mysql -u$mysql_user -p$mysql_password -e 'SELECT 1'" --health-interval 5s --health-retries 3 --health-start-period 5s --health-timeout 3s --update-order start-first --update-failure-action rollback --rollback-order stop-first --restart-condition on-failure --restart-max-attempts 3 -e MYSQL_ROOT_PASSWORD=root -p 3306 --name $mysql_service_name --network $container_network --mount type=bind,source=/dockers/mysql,destination=/var/lib/mysql mysql:8.0.25
}

main