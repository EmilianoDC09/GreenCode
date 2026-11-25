@echo off
REM GreenCode: levanta el backend (Spring Boot, puerto 8080) y el frontend (Vite, puerto 5173)
REM en dos ventanas y abre el navegador. Uso: doble clic o "iniciar.cmd" desde la raiz del repo.
setlocal
set "RAIZ=%~dp0"

where mvn >nul 2>nul || (echo [ERROR] No se encontro Maven ^(mvn^) en el PATH. & pause & exit /b 1)
where npm >nul 2>nul || (echo [ERROR] No se encontro Node/npm en el PATH. & pause & exit /b 1)

echo Instalando/actualizando dependencias del frontend...
pushd "%RAIZ%frontend"
call npm install --no-audit --no-fund
popd

start "GreenCode - backend" cmd /k "cd /d "%RAIZ%backend" && mvn spring-boot:run"
start "GreenCode - frontend" cmd /k "cd /d "%RAIZ%frontend" && npm run dev"

echo.
echo Backend:  http://localhost:8080   (espera "Tomcat started on port 8080")
echo Frontend: http://localhost:5173
echo Para detener todo, cierra las dos ventanas.
timeout /t 10 /nobreak >nul
start "" http://localhost:5173
