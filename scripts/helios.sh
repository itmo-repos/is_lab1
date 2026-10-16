set -euo pipefail

PORT="${PORT:-46701}"
WAR="${WAR:-target/is_lab1.war}"

case "${1:-}" in
    start)
        ssh helios "PORT=$PORT bash -s -- start" < scripts/wf.sh
        ;;
    stop)
        ssh helios "PORT=$PORT bash -s -- stop" < scripts/wf.sh
        ;;
    deploy)
        [[ -f "$WAR" ]] || { echo "Нет $WAR" >&2; exit 1; }
        scp "$WAR" helios:wildfly/standalone/deployments/is_lab1.war.part
        ssh helios "cd wildfly/standalone/deployments && mv is_lab1.war.part is_lab1.war"
        echo "war залит."
        ;;
    db-reset)
        ssh helios "psql -h pg -d studs -v ON_ERROR_STOP=1 -q -f -" < sql/schema.sql
        echo "БД пересоздана."
        ;;
esac