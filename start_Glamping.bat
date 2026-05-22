@echo off
title Sistema Glamping - Instaldor y Lanzador Automático
setlocal enabledelayedexpansion

:: Definir rutas dinámicas basadas en la ubicación del script
set "ROOT_PATH=%~dp0"
set "REPO_FOLDER=Proyecto-glamping"
set "PROJECT_PATH=%ROOT_PATH%%REPO_FOLDER%"
set "FRONTEND_PATH=%PROJECT_PATH%\FrontEnd"
set "BACKEND_PATH=%PROJECT_PATH%\BackEnd"

echo =======================================================
echo     SISTEMA GLAMPING - DESPLIEGUE LOCAL AUTOMATICO
echo =======================================================
echo.

:: --- 1. VERIFICAR COMPONENTES DEL ENTORNO ---

:: Validar Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [SISTEMA] Node.js no detectado. Instalando version LTS...
    winget install -e --id OpenJS.NodeJS.LTS
    echo [SISTEMA] Por favor, reinicia este script tras completar la instalacion de Node.js.
    pause & exit
) else (
    echo [SISTEMA] Node.js ya esta instalado.
)

:: Validar Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [SISTEMA] Git no detectado. Instalando Git...
    winget install -e --id Git.Git
    echo [SISTEMA] Por favor, reinicia este script tras completar la instalacion de Git.
    pause & exit
) else (
    echo [SISTEMA] Git ya esta instalado.
)

echo.
:: --- 2. VERIFICAR Y CLONAR PROYECTO ---
if not exist "%PROJECT_PATH%" (
    echo [SISTEMA] El proyecto no existe localmente. Clonando repositorio...
    cd /d "%ROOT_PATH%"
    git clone https://github.com/ElIsaacM/Proyecto-glamping.git
    if !errorlevel! neq 0 (
        echo [ERROR] Hubo un problema al clonar el repositorio. Verifica tu conexion.
        pause & exit
    )
) else (
    echo [SISTEMA] Repositorio ya clonado en: %PROJECT_PATH%
)

echo.
:: --- 3. CONFIGURAR ARCHIVO .ENV EN EL BACKEND ---
if not exist "%BACKEND_PATH%\.env" (
    echo [SISTEMA] Creando archivo .env en la raiz del Backend...
    (
        echo EMAIL_USER=glampinglosbosques9@gmail.com
        echo EMAIL_PASS=wbwwfhpypusserir
        echo DATABASE_URL=postgresql://neondb_owner:npg_c3HXQDauSf5h@ep-summer-hat-antuh6ta-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require^&channel_binding=require
        echo JWT_SECRET=e5cbb44372ef2d57adec49ec3880938c0dca64ddee0740c97cf832ffe6d3680e
        echo CLOUDINARY_URL=cloudinary://988922896642611:kXxV0xd010GemNIuNVaIF8gAIP0@di1xs8vma
        echo PORT=3000
    ) > "%BACKEND_PATH%\.env"
    echo [SISTEMA] Archivo .env configurado con exito.
) else (
    echo [SISTEMA] El archivo .env ya existe en el Backend.
)

echo.
:: --- 4. VERIFICAR E INSTALAR DEPENDENCIAS (Omitir si ya existen) ---

:: Dependencias Backend
if not exist "%BACKEND_PATH%\node_modules" (
    echo [BACKEND] Instalando dependencias de Node (puede tardar un momento)...
    cd /d "%BACKEND_PATH%"
    call npm install
) else (
    echo [BACKEND] Las dependencias de node_modules ya estan instaladas.
)

:: Dependencias Frontend
if not exist "%FRONTEND_PATH%\node_modules" (
    echo [FRONTEND] Instalando dependencias de Vite (puede tardar un momento)...
    cd /d "%FRONTEND_PATH%"
    call npm install
) else (
    echo [FRONTEND] Las dependencias de node_modules ya estan instaladas.
)

echo.
:: --- 5. INICIAR SERVIDORES Y ABRIR NAVEGADOR ---

:: Lanzar Backend en segundo plano
cd /d "%BACKEND_PATH%"
echo [BACKEND] Lanzando API en puerto 3000...
start "Node Backend" cmd /k "npm run dev"

:: Lanzar Frontend en segundo plano
cd /d "%FRONTEND_PATH%"
echo [FRONTEND] Lanzando interfaz Vite en puerto 5173...
start "Vite Frontend" cmd /k "npm run dev"

:: Esperar a que los procesos carguen y levantar navegador
echo [SISTEMA] Esperando a que los servicios se estabilicen...
timeout /t 5 >nul

echo [EXITO] Abriendo el sistema en tu navegador predeterminado...
start http://localhost:5173

exit