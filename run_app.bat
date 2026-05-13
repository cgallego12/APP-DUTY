@echo off

REM Script de automatización para iniciar el backend y frontend de APP-DUTY en Windows 11

REM Navegar al directorio raíz del proyecto
cd /d "%~dp0"

REM --- Iniciar Backend ---
echo. 
echo Iniciando Backend...
start cmd /k "cd app\backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && python main.py"

REM --- Iniciar Frontend ---
echo. 
echo Iniciando Frontend...
start cmd /k "cd app\frontend && pnpm install && pnpm dev"

echo. 
echo Ambos, Backend y Frontend, se estan iniciando en nuevas ventanas de consola.
echo Por favor, verifica las ventanas para ver el progreso y los posibles errores.

pause
