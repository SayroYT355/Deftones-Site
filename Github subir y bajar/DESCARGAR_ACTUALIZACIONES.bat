@echo off
chcp 65001 >nul
color 0A
title Deftones - Descargar actualizaciones

set "PROJECT_DIR=%~dp0"
if exist "%PROJECT_DIR%.git\" goto repo_found
for %%I in ("%~dp0..") do set "PROJECT_DIR=%%~fI"
if exist "%PROJECT_DIR%\.git\" goto repo_found

echo ERROR: No encuentro la carpeta .git junto a este archivo ni en la carpeta superior.
goto finish_error

:repo_found
pushd "%PROJECT_DIR%"
set /p "continuar=Presiona Enter para descargar las actualizaciones"
echo.
echo Descargando actualizaciones de Deftones desde GitHub...
git pull --ff-only origin main
if errorlevel 1 goto pull_error

echo.
echo Proyecto actualizado correctamente.
popd
goto finish_ok

:pull_error
echo.
echo No se pudo actualizar. Revisa la conexion, tus cambios locales o posibles conflictos.
popd
goto finish_error

:finish_error
echo.
echo Presiona Enter para continuar (o cualquier otra tecla)...
pause >nul
exit /b 1

:finish_ok
echo.
echo Presiona Enter para continuar (o cualquier otra tecla)...
pause >nul
exit /b 0