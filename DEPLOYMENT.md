# Vercel Deployment Guide - Separate Frontend & Backend

This guide will help you deploy your React frontend and Node.js backend separately on Vercel.

## 📋 Prerequisites

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **deeevyashakthi-backend** (or your preferred name)
   - In which directory is your code located? **.**
   - Want to override settings? **N**

4. After deployment, you'll get a URL like: `https://deeevyashakthi-backend.vercel.app`

5. **IMPORTANT**: Add Environment Variables in Vercel Dashboard:
   - Go to: https://vercel.com/dashboard
   - Select your backend project
   - Go to Settings → Environment Variables
   - Add all variables from `.env.example`:
     - `DB_HOST`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_NAME`
     - `DB_PORT`
     - `NODE_ENV` = `production`
     - `FRONTEND_URL` = (you'll update this after deploying frontend)

6. Deploy to production:
   ```bash
   vercel --prod
   ```

7. **Copy the production URL** - you'll need it for the frontend!

### Step 2: Deploy Frontend

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Create `.env.production` file:
   ```bash
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```
   Replace `your-backend-url` with the actual backend URL from Step 1.

3. Deploy to Vercel:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **deeevyashakthi-frontend** (or your preferred name)
   - In which directory is your code located? **.**
   - Want to override settings? **N**

5. **Add Environment Variables** in Vercel Dashboard:
   - Go to: https://vercel.com/dashboard
   - Select your frontend project
   - Go to Settings → Environment Variables
   - Add:
     - `REACT_APP_API_URL` = `https://your-backend-url.vercel.app/api`

6. Deploy to production:
   ```bash
   vercel --prod
   ```

7. **Copy the production URL** of your frontend!

### Step 3: Update Backend CORS

1. Go back to Vercel Dashboard → Backend Project
2. Update the `FRONTEND_URL` environment variable with your frontend production URL
3. Redeploy the backend:
   ```bash
   cd ../server
   vercel --prod
   ```

## ✅ Verification

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Test login functionality
3. Check browser console for any CORS errors
4. Test all API endpoints

## 🔄 Future Deployments

### To update backend:
```bash
cd server
git add .
git commit -m "your message"
git push
# Vercel will auto-deploy if you enabled Git integration
# OR manually deploy:
vercel --prod
```

### To update frontend:
```bash
cd client
git add .
git commit -m "your message"
git push
# Vercel will auto-deploy if you enabled Git integration
# OR manually deploy:
vercel --prod
```

## 🔗 Enable Auto-Deployment (Optional)

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Git
4. Connect your GitHub/GitLab repository
5. Configure:
   - **Backend**: Root Directory = `server`
   - **Frontend**: Root Directory = `client`

Now every push to your repository will auto-deploy!

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check that CORS is properly configured in your backend

### API Not Working
- Verify all environment variables are set in Vercel Dashboard
- Check Vercel Function logs in Dashboard → Deployments → View Function Logs

### Build Failures
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## 📝 Important Notes

- **Database**: Make sure your database is accessible from Vercel's servers
- **Environment Variables**: Never commit `.env` files to Git
- **Serverless Functions**: Vercel backend runs as serverless functions (cold starts may occur)
- **Free Tier Limits**: Be aware of Vercel's free tier limits

## 🎉 Success!

Your app is now deployed separately:
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app`

This is the industry-standard approach for deploying full-stack applications!
