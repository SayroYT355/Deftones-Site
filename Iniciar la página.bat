@echo off
chcp 65001 >nul
color 0A
title Iniciar la pagina Deftones con PHP

cd /d "%~dp0"
if not exist "server.php" goto missing_server
where php >nul 2>&1
if errorlevel 1 goto missing_php

php -r "if (PHP_VERSION_ID < 80100 || !extension_loaded('sodium')) exit(1);"
if errorlevel 1 goto php_requirements

netstat -ano -p tcp | findstr /R /C:":4173 .*LISTENING" >nul
if not errorlevel 1 goto server_already_running

echo Iniciando el servidor PHP local de Deftones...
start "Deftones - Servidor PHP" cmd /k "cd /d ""%~dp0"" && php -S 127.0.0.1:4173 -t . server.php"
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
echo ERROR: No encuentro server.php en la carpeta principal del proyecto.
goto finish_error

:missing_php
echo ERROR: PHP no esta instalado o no esta agregado al PATH.
echo Instala PHP 8.1 o posterior y vuelve a ejecutar este archivo.
goto finish_error

:php_requirements
echo ERROR: Se necesita PHP 8.1 o posterior con la extension sodium habilitada.
echo Sodium permite migrar las cuentas creadas con el servidor Node anterior.
goto finish_error

:server_already_running
echo Ya hay un servidor usando el puerto 4173.
echo Cierra la ventana del servidor anterior y volve a ejecutar este archivo.
goto finish_error

:finish_error
echo.
echo Presiona Enter para cerrar...
pause >nul
exit /b 1
