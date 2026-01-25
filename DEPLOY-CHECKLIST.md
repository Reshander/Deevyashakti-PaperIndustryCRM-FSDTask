# 🚀 Quick Deployment Checklist

## Before You Deploy

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Ensure your database is accessible from the internet
- [ ] Have your database credentials ready

## Deploy Backend (Do This First!)

**IMPORTANT:** Navigate INTO the server directory first!

```bash
cd server
vercel --prod
```

When prompted:
- "Set up and deploy?" → **Y**
- "Which scope?" → Select your account
- "Link to existing project?" → **N** (first time)
- "What's your project's name?" → **deeevyashakthi-backend**
- "In which directory is your code located?" → **.** (current directory)
- "Want to modify settings?" → **N**

**After deployment:**
1. Copy the backend URL (e.g., `https://your-backend.vercel.app`)
2. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
3. Add these variables:
   - `DB_HOST` = your database host
   - `DB_USER` = your database user
   - `DB_PASSWORD` = your database password
   - `DB_NAME` = your database name
   - `DB_PORT` = 3306
   - `NODE_ENV` = production
   - `FRONTEND_URL` = (leave blank for now, update after frontend deployment)

## Deploy Frontend (Do This Second!)

**IMPORTANT:** Navigate INTO the client directory first!

```bash
cd client
vercel --prod
```

When prompted:
- "Set up and deploy?" → **Y**
- "Which scope?" → Select your account
- "Link to existing project?" → **N** (first time)
- "What's your project's name?" → **deeevyashakthi-frontend**
- "In which directory is your code located?" → **.** (current directory)
- "Want to modify settings?" → **N**

**After deployment:**
1. Copy the frontend URL (e.g., `https://your-frontend.vercel.app`)
2. Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables
3. Add:
   - `REACT_APP_API_URL` = `https://your-backend.vercel.app/api`

## Update Backend CORS (Final Step!)

1. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
2. Update `FRONTEND_URL` = `https://your-frontend.vercel.app`
3. Redeploy backend:
   ```bash
   cd server
   vercel --prod
   ```

## ✅ Test Your Deployment

Visit your frontend URL and test:
- [ ] Login with OTP
- [ ] Create a Purchase Order
- [ ] Create a Sales Order
- [ ] Generate an Invoice
- [ ] Submit a Query

## 🎉 Done!

Your app is now live with separate frontend and backend deployments!

**Frontend:** https://your-frontend.vercel.app
**Backend:** https://your-backend.vercel.app

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
