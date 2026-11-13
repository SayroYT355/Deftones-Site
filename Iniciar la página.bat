@echo off
chcp 65001 >nul
color 0A
title Iniciar la pagina Deftones

cd /d "%~dp0"
if not exist "js\server.js" goto missing_server
where node >nul 2>&1
if errorlevel 1 goto missing_node

echo Iniciando el servidor local de Deftones...
start "Deftones - Servidor local" cmd /k "cd /d ""%~dp0"" && node js\server.js"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4173/"
echo.
echo La pagina se abrio en el navegador.
echo Deja abierta la ventana del servidor mientras uses el sitio.
echo Para apagarlo, cierra la ventana del servidor.
echo.
echo Presiona Enter para cerrar este iniciador...
pause >nul
exit /b 0

:missing_server
echo ERROR: No encuentro js\server.js. Este archivo debe estar en la carpeta principal del proyecto.
goto finish_error

:missing_node
echo ERROR: Node.js no esta instalado o no esta agregado al PATH.
echo Instala Node.js y vuelve a ejecutar este archivo.

:finish_error
echo.
echo Presiona Enter para cerrar...
pause >nul
exit /b 1