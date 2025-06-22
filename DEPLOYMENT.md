# Azure App Service Deployment Guide

This guide will help you deploy your StepTracker application to Azure App Service.

## Prerequisites

1. Azure subscription
2. GitHub repository with your code
3. Google Sheets API credentials

## Step 1: Create Azure App Services

### Backend App Service
1. Go to Azure Portal
2. Create a new App Service
3. Choose:
   - **Runtime stack**: .NET 8 (LTS)
   - **Operating System**: Windows
   - **Region**: Choose closest to your users
   - **App Service Plan**: Basic B1 or higher (for HTTPS support)

### Frontend App Service
1. Create another App Service
2. Choose:
   - **Runtime stack**: Node.js 18 LTS
   - **Operating System**: Windows
   - **Region**: Same as backend
   - **App Service Plan**: Basic B1 or higher

## Step 2: Configure App Settings

### Backend App Settings
In your backend App Service, go to **Configuration** > **Application settings** and add:

```
GoogleSheets__ApiKey = YOUR_GOOGLE_API_KEY
GoogleSheets__SpreadsheetId = YOUR_SPREADSHEET_ID
GoogleSheets__SheetRange = YOUR_SHEET_RANGE
```

### Frontend App Settings
In your frontend App Service, go to **Configuration** > **Application settings** and add:

```
VITE_API_URL = https://your-backend-app-name.azurewebsites.net
```

## Step 3: Configure GitHub Secrets

In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions** and add:

### For Backend Deployment:
- `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from your backend App Service

### For Frontend Deployment:
- `AZURE_FRONTEND_PUBLISH_PROFILE`: Download from your frontend App Service
- `VITE_API_URL`: Your backend App Service URL

## Step 4: Update Configuration Files

### Update Backend Configuration
1. In `backend/azure-deploy.yml`, change:
   ```yaml
   AZURE_WEBAPP_NAME: your-backend-app-name
   ```

2. In `backend/Program.cs`, update the CORS origins:
   ```csharp
   "https://your-frontend-app-name.azurewebsites.net"
   ```

### Update Frontend Configuration
1. In `frontend/azure-deploy.yml`, change:
   ```yaml
   AZURE_WEBAPP_NAME: your-frontend-app-name
   ```

2. In `frontend/env.production`, update:
   ```
   VITE_API_URL=https://your-backend-app-name.azurewebsites.net
   ```

## Step 5: Deploy

1. Push your changes to the main branch
2. GitHub Actions will automatically deploy both apps
3. Monitor the deployment in the **Actions** tab

## Step 6: Configure Custom Domains (Optional)

1. In each App Service, go to **Custom domains**
2. Add your domain and configure DNS
3. Enable HTTPS

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure the frontend URL is correctly added to backend CORS policy
2. **API Key Issues**: Verify Google Sheets API key is correctly set in App Settings
3. **Build Failures**: Check GitHub Actions logs for specific error messages
4. **404 Errors**: Ensure the web.config is properly configured for .NET Core

### Logs:
- Backend logs: App Service > **Log stream**
- Frontend logs: App Service > **Log stream**
- GitHub Actions logs: Repository > **Actions**

## Security Notes

1. Never commit API keys to source control
2. Use Azure Key Vault for sensitive configuration in production
3. Enable HTTPS for all communications
4. Regularly rotate API keys

## Cost Optimization

1. Use Basic B1 plan for development
2. Scale up only when needed
3. Consider using Azure Static Web Apps for frontend (free tier available)
4. Monitor usage in Azure Cost Management 