#!/bin/bash

LOCAL_PORT="${LOCAL_PORT:-8080}"
PORT="${PORT:-46701}"
PORT_2=$((PORT + 1))

echo "Приложение:     http://localhost:$LOCAL_PORT/is_lab1/"
echo "Консоль WildFly: http://localhost:9990/"
echo "Ctrl+C для остановки."

exec ssh -N -o ExitOnForwardFailure=yes -L $LOCAL_PORT:127.0.0.1:$PORT -L 9990:127.0.0.1:$PORT_2 helios
