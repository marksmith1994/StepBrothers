#!/bin/bash

# StepTracker Development Environment - Cross-platform script
# Works on Windows (Git Bash/WSL), macOS, and Linux

COMPOSE_FILE="docker/docker-compose.dev.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "StepTracker Development Environment"
    echo ""
    echo "Usage: $0 {start|stop|restart|logs|frontend-logs|backend-logs|rebuild|clean|status|shell-frontend|shell-backend|help}"
    echo ""
    echo "Commands:"
    echo "  start           - Start development environment"
    echo "  stop            - Stop development environment"
    echo "  restart         - Restart services"
    echo "  logs            - Show all logs"
    echo "  frontend-logs   - Show frontend logs only"
    echo "  backend-logs    - Show backend logs only"
    echo "  rebuild         - Rebuild and restart containers"
    echo "  clean           - Clean up containers and volumes"
    echo "  status          - Show service status"
    echo "  shell-frontend  - Open shell in frontend container"
    echo "  shell-backend   - Open shell in backend container"
    echo "  help            - Show this help message"
    echo ""
    echo "Quick Start:"
    echo "  $0 start        # Start the development environment"
    echo "  $0 logs         # View logs"
    echo "  $0 stop         # Stop the environment"
}

# Main command handler
case "$1" in
    "start")
        print_info "🚀 Starting StepTracker Development Environment..."
        check_docker
        
        print_warning "🛑 Stopping existing containers..."
        docker-compose -f $COMPOSE_FILE down
        
        print_warning "🧹 Cleaning up..."
        docker-compose -f $COMPOSE_FILE down -v --remove-orphans
        
        print_info "🔨 Building and starting development environment..."
        docker-compose -f $COMPOSE_FILE up --build -d
        
        print_warning "⏳ Waiting for services to be ready..."
        sleep 10
        
        print_info "🔍 Checking service status..."
        docker-compose -f $COMPOSE_FILE ps
        
        echo ""
        print_status "Development environment is ready!"
        echo ""
        print_info "🌐 Frontend: http://localhost:5173"
        print_info "🔧 Backend:  http://localhost:5120"
        echo ""
        print_info "📝 Useful commands:"
        echo "  View logs:     $0 logs"
        echo "  Stop services: $0 stop"
        echo "  Restart:       $0 restart"
        echo ""
        print_status "🔄 File changes will automatically trigger hot reloads!"
        ;;
    "stop")
        print_warning "🛑 Stopping development environment..."
        docker-compose -f $COMPOSE_FILE down
        print_status "Services stopped!"
        ;;
    "restart")
        print_warning "🔄 Restarting development environment..."
        docker-compose -f $COMPOSE_FILE restart
        print_status "Services restarted!"
        ;;
    "logs")
        print_info "📋 Showing logs..."
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    "frontend-logs")
        print_info "📋 Showing frontend logs..."
        docker-compose -f $COMPOSE_FILE logs -f frontend
        ;;
    "backend-logs")
        print_info "📋 Showing backend logs..."
        docker-compose -f $COMPOSE_FILE logs -f backend
        ;;
    "rebuild")
        print_warning "🔨 Rebuilding containers..."
        docker-compose -f $COMPOSE_FILE down
        docker-compose -f $COMPOSE_FILE up --build -d
        print_status "Containers rebuilt!"
        ;;
    "clean")
        print_warning "🧹 Cleaning up containers and volumes..."
        docker-compose -f $COMPOSE_FILE down -v --remove-orphans
        docker system prune -f
        print_status "Cleanup complete!"
        ;;
    "status")
        print_info "🔍 Service status:"
        docker-compose -f $COMPOSE_FILE ps
        ;;
    "shell-frontend")
        print_info "🐚 Opening frontend shell..."
        docker-compose -f $COMPOSE_FILE exec frontend sh
        ;;
    "shell-backend")
        print_info "🐚 Opening backend shell..."
        docker-compose -f $COMPOSE_FILE exec backend sh
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 