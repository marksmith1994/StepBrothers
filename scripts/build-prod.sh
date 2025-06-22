#!/bin/bash

# Production Build Script for StepTracker
echo "🏗️ Building StepTracker for production..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Clean previous builds
print_warning "Cleaning previous builds..."
rm -rf frontend/dist
rm -rf backend/bin
rm -rf backend/obj

# Build frontend
print_warning "Building frontend..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    print_status "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi
cd ..

# Build backend
print_warning "Building backend..."
cd backend
dotnet build -c Release
if [ $? -eq 0 ]; then
    print_status "Backend built successfully"
else
    print_error "Backend build failed"
    exit 1
fi
cd ..

# Create production artifacts
print_warning "Creating production artifacts..."
mkdir -p dist
cp -r frontend/dist/* dist/
cp -r backend/bin/Release/net8.0/* dist/backend/

# Create production environment template
cat > dist/.env.production.template << EOF
# Production Environment Variables
# Copy this file to .env.production and update with your actual values

# Frontend
VITE_API_URL=https://your-backend-domain.com

# Backend
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_SHEET_RANGE=dashboard!C2:G367
EOF

# Create deployment instructions
cat > dist/DEPLOYMENT.md << EOF
# StepTracker Production Deployment

## Frontend Deployment

1. Upload the contents of this folder to your hosting provider
2. Set up environment variables:
   - Copy .env.production.template to .env.production
   - Update VITE_API_URL with your backend URL

## Backend Deployment

1. Deploy the backend/ folder to your hosting provider
2. Set up environment variables:
   - GOOGLE_SHEETS_API_KEY
   - GOOGLE_SHEETS_SPREADSHEET_ID
   - GOOGLE_SHEETS_SHEET_RANGE

## Environment Variables

### Frontend (.env.production)
\`\`\`env
VITE_API_URL=https://your-backend-domain.com
\`\`\`

### Backend
\`\`\`env
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_SHEET_RANGE=dashboard!C2:G367
\`\`\`
EOF

print_status "Production build complete!"
echo ""
print_warning "Next steps:"
echo "1. Review the dist/ folder"
echo "2. Set up environment variables"
echo "3. Deploy to your hosting provider"
echo "4. Test all functionality"
echo ""
print_status "Build artifacts are ready in the dist/ folder" 