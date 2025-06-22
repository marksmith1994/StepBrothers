# StepTracker Development Environment - PowerShell Script
# For Windows users who prefer PowerShell

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

$COMPOSE_FILE = "docker/docker-compose.dev.yml"

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if .env file exists
function Test-EnvFile {
    return Test-Path "docker\.env"
}

# Function to create .env file from template
function New-EnvFile {
    if (Test-Path "docker\.env.template") {
        Copy-Item "docker\.env.template" "docker\.env"
        Write-Host "Created docker\.env from template" -ForegroundColor Green
        Write-Host "Please edit docker\.env with your actual Google Sheets credentials" -ForegroundColor Yellow
    }
    else {
        Write-Host "Template file docker\.env.template not found" -ForegroundColor Red
    }
}

# Function to show help
function Show-Help {
    Write-Host "StepTracker Development Environment" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\docker\dev.ps1 {start|stop|restart|logs|frontend-logs|backend-logs|rebuild|clean|status|setup|help}" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  start           - Start development environment" -ForegroundColor White
    Write-Host "  stop            - Stop development environment" -ForegroundColor White
    Write-Host "  restart         - Restart services" -ForegroundColor White
    Write-Host "  logs            - Show all logs" -ForegroundColor White
    Write-Host "  frontend-logs   - Show frontend logs only" -ForegroundColor White
    Write-Host "  backend-logs    - Show backend logs only" -ForegroundColor White
    Write-Host "  rebuild         - Rebuild and restart containers" -ForegroundColor White
    Write-Host "  clean           - Clean up containers and volumes" -ForegroundColor White
    Write-Host "  status          - Show service status" -ForegroundColor White
    Write-Host "  setup           - Set up environment variables" -ForegroundColor White
    Write-Host "  help            - Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Quick Start:" -ForegroundColor Yellow
    Write-Host "  .\docker\dev.ps1 setup       # Set up environment variables first" -ForegroundColor White
    Write-Host "  .\docker\dev.ps1 start       # Start the development environment" -ForegroundColor White
    Write-Host "  .\docker\dev.ps1 logs        # View logs" -ForegroundColor White
    Write-Host "  .\docker\dev.ps1 stop        # Stop the environment" -ForegroundColor White
}

# Main command handler
switch ($Command.ToLower()) {
    "setup" {
        Write-Host "Setting up environment variables..." -ForegroundColor Green
        
        if (-not (Test-EnvFile)) {
            Write-Host "Creating .env file from template..." -ForegroundColor Yellow
            New-EnvFile
        }
        else {
            Write-Host ".env file already exists" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Edit docker\.env with your Google Sheets credentials" -ForegroundColor White
        Write-Host "2. Run .\docker\dev.ps1 start to start the environment" -ForegroundColor White
    }
    
    "start" {
        Write-Host "Starting StepTracker Development Environment..." -ForegroundColor Green
        
        if (-not (Test-Docker)) {
            Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
            exit 1
        }
        
        if (-not (Test-EnvFile)) {
            Write-Host "Environment file not found. Running setup..." -ForegroundColor Yellow
            New-EnvFile
            Write-Host "Please edit docker\.env with your credentials and run start again" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "Stopping existing containers..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_FILE down
        
        Write-Host "Cleaning up..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_FILE down -v --remove-orphans
        
        Write-Host "Building and starting development environment..." -ForegroundColor Green
        docker-compose -f $COMPOSE_FILE up --build -d
        
        Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        Write-Host "Checking service status..." -ForegroundColor Green
        docker-compose -f $COMPOSE_FILE ps
        
        Write-Host ""
        Write-Host "Development environment is ready!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
        Write-Host "Backend:  http://localhost:5120" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Useful commands:" -ForegroundColor White
        Write-Host "  View logs:     .\docker\dev.ps1 logs" -ForegroundColor Gray
        Write-Host "  Stop services: .\docker\dev.ps1 stop" -ForegroundColor Gray
        Write-Host "  Restart:       .\docker\dev.ps1 restart" -ForegroundColor Gray
        Write-Host ""
        Write-Host "File changes will automatically trigger hot reloads!" -ForegroundColor Green
    }
    
    "stop" {
        Write-Host "Stopping development environment..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_FILE down
        Write-Host "Services stopped!" -ForegroundColor Green
    }
    
    "restart" {
        Write-Host "Restarting development environment..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_FILE restart
        Write-Host "Services restarted!" -ForegroundColor Green
    }
    
    "logs" {
        Write-Host "Showing logs..." -ForegroundColor Green
        docker-compose -f $COMPOSE_FILE logs -f
    }
    
    "frontend-logs" {
        Write-Host "Showing frontend logs..." -ForegroundColor Green
        docker-compose -f $COMPOSE_FILE logs -f frontend
    }
    
    "backend-logs" {
        Write-Host "Showing backend logs..." -ForegroundColor Green
        docker-compose -f $COMPOSE_FILE logs -f backend
    }
    
    "rebuild" {
        Write-Host "Rebuilding containers..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_FILE down
        docker-compose -f $COMPOSE_FILE up --build -d
        Write-Host "Containers rebuilt!" -ForegroundColor Green
    }
    
    "clean" {
        Write-Host "Cleaning up containers and volumes..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_FILE down -v --remove-orphans
        docker system prune -f
        Write-Host "Cleanup complete!" -ForegroundColor Green
    }
    
    "status" {
        Write-Host "Service status:" -ForegroundColor Green
        docker-compose -f $COMPOSE_FILE ps
    }
    
    "help" {
        Show-Help
    }
    
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
        exit 1
    }
} 