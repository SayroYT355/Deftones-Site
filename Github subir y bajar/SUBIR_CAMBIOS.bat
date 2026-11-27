@echo off
chcp 65001 >nul
color 0A
title Deftones - Subir cambios

set "PROJECT_DIR=%~dp0"
if exist "%PROJECT_DIR%.git\" goto repo_found
for %%I in ("%~dp0..") do set "PROJECT_DIR=%%~fI"
if exist "%PROJECT_DIR%\.git\" goto repo_found

echo ERROR: No encuentro la carpeta .git junto a este archivo ni en la carpeta superior.
goto finish_error

:repo_found
pushd "%PROJECT_DIR%"
for /f "delims=" %%B in ('git branch --show-current') do set "CURRENT_BRANCH=%%B"
if "%CURRENT_BRANCH%"=="" goto no_branch
set /p "comision=Ingresa el nombre de la comisión: "
if "%comision%"=="" goto empty_commission

echo.
echo Preparando los cambios del proyecto...
git add -A
if errorlevel 1 goto git_error

git diff --cached --quiet
if errorlevel 2 goto git_error
if errorlevel 1 goto commit_changes
goto sync_changes

:commit_changes
git commit -m "Comision %comision%"
if errorlevel 1 goto git_error

:sync_changes
echo.
echo Integrando cambios recientes de GitHub...
git pull --rebase origin main
if errorlevel 1 goto rebase_error

echo.
echo Subiendo cambios a GitHub...
git push --set-upstream origin "%CURRENT_BRANCH%"
if errorlevel 1 goto git_error

echo.
echo Cambios subidos correctamente desde la rama %CURRENT_BRANCH%.
popd
goto finish_ok

:empty_commission
echo Tenés que ingresar el nombre de la comisión.
goto git_error

:no_branch
echo ERROR: No hay una rama actual. Crea o selecciona una rama antes de subir cambios.
goto git_error

:rebase_error
echo.
echo No se pudo completar la integracion. Si hay conflictos, resolvelos y luego ejecuta:
echo   git add -A
echo   git rebase --continue
echo Despues volve a ejecutar este archivo para subir.
popd
goto finish_error

:git_error
echo.
echo Hubo un error. Lee el mensaje de Git arriba antes de volver a intentar.
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