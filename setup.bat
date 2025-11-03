@echo off
REM InvoiceFlow Quick Setup Script for Windows

echo ==========================================
echo    InvoiceFlow Quick Setup
echo ==========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

echo Docker is running
echo.

REM Check if docker-compose is available
docker-compose version >nul 2>&1
if errorlevel 1 (
    echo Error: docker-compose is not installed.
    pause
    exit /b 1
)

echo docker-compose is available
echo.

:menu
echo What would you like to do?
echo.
echo 1) Fresh install (build, migrate, seed data)
echo 2) Reset database and reseed data
echo 3) Just seed data (keep existing data)
echo 4) Create superuser
echo 5) Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto fresh_install
if "%choice%"=="2" goto reset_database
if "%choice%"=="3" goto seed_only
if "%choice%"=="4" goto create_superuser
if "%choice%"=="5" goto exit_script
echo Invalid choice. Please try again.
echo.
goto menu

:fresh_install
echo.
echo Starting fresh installation...
echo.

echo Building Docker containers...
docker-compose build

echo.
echo Starting containers...
docker-compose up -d

echo.
echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo.
echo Running migrations...
docker-compose exec backend python manage.py migrate

echo.
echo Seeding database with sample data...
docker-compose exec backend python manage.py seed_data

echo.
echo Setup complete!
echo.
echo Demo Users:
echo   - demo@invoiceflow.com (password: password123)
echo   - john@consulting.com (password: password123)
echo   - sarah@design.studio (password: password123)
echo.
echo Access the application:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:8000/api
echo   - Admin Panel: http://localhost:8000/admin
goto end

:reset_database
echo.
echo Resetting database...

echo Stopping containers...
docker-compose down

echo Removing database volume...
docker volume rm invoiceflow_postgres_data 2>nul

echo Starting containers...
docker-compose up -d

echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo.
echo Running migrations...
docker-compose exec backend python manage.py migrate

echo.
echo Seeding database with sample data...
docker-compose exec backend python manage.py seed_data

echo.
echo Database reset complete!
echo.
echo Demo Users:
echo   - demo@invoiceflow.com (password: password123)
echo   - john@consulting.com (password: password123)
echo   - sarah@design.studio (password: password123)
goto end

:seed_only
echo.
echo Seeding database...
docker-compose exec backend python manage.py seed_data

echo.
echo Seeding complete!
goto end

:create_superuser
echo.
echo Creating superuser...
docker-compose exec backend python manage.py createsuperuser

echo.
echo Superuser created!
goto end

:exit_script
echo Goodbye!
exit /b 0

:end
echo.
echo ==========================================
echo Need help? Check out:
echo   - README.md for general information
echo   - SEED_DATA.md for seed data details
echo ==========================================
echo.
pause
