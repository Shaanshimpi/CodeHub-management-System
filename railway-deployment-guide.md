# Railway Deployment Guide for CodeHub ERP

This guide will help you deploy your CodeHub ERP application to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. A MongoDB database (MongoDB Atlas recommended for production)
3. Git repository with your code

## Deployment Steps

### 1. Prepare Your Repository

Make sure all the configuration files are in place:
- `railway.json` - Railway configuration (uses Dockerfile)
- `Dockerfile` - Docker build configuration
- `nixpacks.toml` - Alternative build configuration
- `Procfile` - Process definition
- `env.example` - Environment variables template
- `.dockerignore` - Docker ignore file

### 2. Deploy to Railway

1. **Connect your repository:**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure environment variables:**
   - In your Railway project dashboard, go to "Variables" tab
   - Add the following environment variables:

   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   JWT_REFRESH_EXPIRE=90d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FRONTEND_URL=https://your-app.railway.app
   VITE_API_URL=https://your-app.railway.app
   ```

3. **Deploy:**
   - Railway will automatically detect the Dockerfile and start building
   - The build process will:
     - Install root dependencies
     - Install backend dependencies (production only)
     - Install frontend dependencies
     - Build the React frontend
     - Start the Node.js server
   - If Dockerfile fails, Railway will fall back to Nixpacks configuration

### 3. Database Setup

1. **MongoDB Atlas (Recommended):**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Add it to Railway environment variables as `MONGO_URI`

2. **Seed the database:**
   - After deployment, you can run the seed script by connecting to your Railway service
   - Or run it locally with the production database URL

### 4. Domain Configuration

1. **Custom Domain (Optional):**
   - In Railway dashboard, go to "Settings" → "Domains"
   - Add your custom domain
   - Update the `FRONTEND_URL` and `VITE_API_URL` environment variables

2. **Default Railway Domain:**
   - Railway provides a default domain like `your-app.railway.app`
   - Update your environment variables with this URL

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/codehub-erp` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-key` |
| `JWT_EXPIRE` | JWT token expiration | `30d` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | `90d` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `your-email@gmail.com` |
| `SMTP_PASS` | Email password/app password | `your-app-password` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.railway.app` |
| `VITE_API_URL` | API base URL for frontend | `https://your-app.railway.app` |

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check that all dependencies are properly installed
   - Ensure Node.js version compatibility
   - Check build logs in Railway dashboard

2. **Database Connection Issues:**
   - Verify MongoDB connection string
   - Check if IP whitelist includes Railway IPs
   - Ensure database user has proper permissions

3. **Frontend Not Loading:**
   - Check if frontend build completed successfully
   - Verify static file serving configuration
   - Check browser console for errors

4. **API Calls Failing:**
   - Verify `VITE_API_URL` environment variable
   - Check CORS configuration
   - Ensure API routes are properly configured

### Monitoring

- Use Railway dashboard to monitor:
  - Build logs
  - Runtime logs
  - Resource usage
  - Deployment status

## Production Considerations

1. **Security:**
   - Use strong JWT secrets
   - Enable HTTPS
   - Configure proper CORS settings
   - Use environment variables for sensitive data

2. **Performance:**
   - Enable gzip compression
   - Use CDN for static assets
   - Monitor database performance
   - Implement caching strategies

3. **Backup:**
   - Regular database backups
   - Code repository backups
   - Environment variable backups

## Support

For Railway-specific issues:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

For application-specific issues:
- Check the application logs
- Review the codebase documentation
- Contact the development team
