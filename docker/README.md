# 🐳 Docker Development Environment

This folder contains everything needed to run StepTracker in a Docker development environment with hot reloading.

## 📁 File Structure

```
docker/
├── docker-compose.dev.yml      # Development environment configuration
├── docker-compose.yml          # Production environment configuration
├── Dockerfile.frontend.dev     # Frontend development container
├── Dockerfile.backend.dev      # Backend development container
├── Dockerfile.frontend         # Frontend production container
├── Dockerfile.backend          # Backend production container
├── dev.sh                      # Cross-platform development script
└── README.md                   # This file
```

## 🚀 Quick Start

### Single Command Setup

```bash
# Make the script executable (first time only)
chmod +x docker/dev.sh

# Start development environment
./docker/dev.sh start
```

### Access Your Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5120

## 🛠️ Development Commands

All commands use the single `dev.sh` script:

```bash
./docker/dev.sh start          # Start development environment
./docker/dev.sh stop           # Stop development environment
./docker/dev.sh restart        # Restart services
./docker/dev.sh logs           # View all logs
./docker/dev.sh frontend-logs  # View frontend logs only
./docker/dev.sh backend-logs   # View backend logs only
./docker/dev.sh rebuild        # Rebuild containers
./docker/dev.sh clean          # Clean up everything
./docker/dev.sh status         # Check service status
./docker/dev.sh help           # Show all commands
```

## ✨ Features

- **Hot Reloading**: Both frontend and backend automatically reload on file changes
- **File Watching**: Optimized for Windows with polling enabled
- **Volume Mounting**: Your local files are mounted into containers
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Single Script**: One script handles all development tasks

## 🔧 Manual Docker Commands

If you prefer to use Docker commands directly:

```bash
# Start development environment
docker-compose -f docker/docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.dev.yml down
```

## 🧹 Cleanup

To completely clean up Docker resources:

```bash
./docker/dev.sh clean
```

This will:
- Stop all containers
- Remove volumes
- Clean up unused Docker resources
