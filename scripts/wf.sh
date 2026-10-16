set -euo pipefail

PORT="${PORT:-46701}"
WF="$HOME/wildfly"

case "${1:-}" in
    start)
        unset _JAVA_OPTIONS JAVA_TOOL_OPTIONS
        export JAVA_OPTS="-Xms64m -Xmx512m -XX:MetaspaceSize=96m -XX:MaxMetaspaceSize=256m"

        mkdir -p "$WF/standalone/log"
        nohup "$WF/bin/standalone.sh" -b 127.0.0.1 -bmanagement 127.0.0.1 \
            -Djboss.http.port="$PORT" \
            -Djboss.management.http.port=$((PORT + 1)) \
            -Djboss.https.port=$((PORT + 2)) \
            >"$WF/standalone/log/stdout.log" 2>&1 </dev/null &
        echo "WildFly запускается, лог: $WF/standalone/log/stdout.log"
        ;;
    stop)
        unset _JAVA_OPTIONS JAVA_TOOL_OPTIONS
        export JAVA_OPTS="-Xms16m -Xmx128m"
        "$WF/bin/jboss-cli.sh" --connect --controller="127.0.0.1:$((PORT + 1))" --command=":shutdown"
        ;;
esac