# Security Checklist

## Before Pushing to GitHub

### ✅ Check these items:

1. **No API Keys in Code**
   - [ ] No Google API keys in any `.cs` or `.js` files
   - [ ] No hardcoded spreadsheet IDs
   - [ ] No credentials in comments

2. **Configuration Files**
   - [ ] `appsettings.Development.json` is in `.gitignore`
   - [ ] `appsettings.Production.json` is in `.gitignore`
   - [ ] No `.env` files are committed
   - [ ] `credentials.json` is in `.gitignore`

3. **Environment Variables**
   - [ ] All secrets are in environment variables or config files
   - [ ] No secrets in `appsettings.json` (only template)

4. **URLs and Endpoints**
   - [ ] Frontend uses localhost URLs (safe for public repos)
   - [ ] No production URLs with credentials

5. **Git Status Check**
   ```bash
   git status
   ```
   - [ ] No sensitive files showing as modified/added

6. **Git Diff Check**
   ```bash
   git diff --cached
   ```
   - [ ] No API keys, passwords, or secrets visible

## Files That Should NEVER Be Committed

- `backend/credentials.json`
- `backend/appsettings.Development.json`
- `backend/appsettings.Production.json`
- `.env` (any environment file)
- `secrets.json`
- `config.json` (if containing secrets)

## Safe to Commit

- `appsettings.template.json` (template only)
- `appsettings.json` (basic config)
- Frontend constants (localhost URLs)
- Source code
- Documentation

## If You Accidentally Commit Secrets

1. **Immediate Action**
   ```bash
   git reset --soft HEAD~1  # Undo last commit
   # OR
   git reset --hard HEAD~1  # Undo last commit and changes
   ```

2. **If Already Pushed**
   - Change your API keys immediately
   - Use `git filter-branch` or BFG Repo-Cleaner to remove from history
   - Force push: `git push --force-with-lease`

## Production Deployment

For production, use:
- Environment variables
- Azure Key Vault
- AWS Secrets Manager
- Or similar secure secret management

## Quick Security Test

Run this command to check for potential secrets:
```bash
git diff --cached | grep -i "api\|key\|secret\|password\|token"
```

If anything shows up, review it carefully before committing. 