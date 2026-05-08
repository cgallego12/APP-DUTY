#!/bin/bash

# Función para limpiar procesos al salir
cleanup() {
    echo "Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID
    exit
}

trap cleanup SIGINT SIGTERM

echo "Iniciando APP-DUTY..."

# Iniciar Backend
echo "Iniciando Backend (FastAPI)..."
cd /home/ubuntu/APP-DUTY/app/backend
# Agregar el directorio actual al PYTHONPATH para resolver importaciones
export PYTHONPATH=$PYTHONPATH:$(pwd)
python3 main.py > ../backend.log 2>&1 &
BACKEND_PID=$!

# Iniciar Frontend
echo "Iniciando Frontend (Vite)..."
cd /home/ubuntu/APP-DUTY/app/frontend
pnpm dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Servidores en ejecución."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Mantener el script en ejecución para ver los logs o esperar
wait
