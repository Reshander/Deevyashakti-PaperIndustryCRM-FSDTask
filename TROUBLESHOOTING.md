# 🔧 Vercel Deployment Troubleshooting

## ❌ Error: "react-scripts: command not found"

**Problem:** You tried to deploy from the root directory instead of the client directory.

**Solution:**
```bash
# Make sure you're IN the client directory
cd client
vercel --prod
```

**Key Point:** Always deploy from INSIDE the specific directory (client or server), not from the root!

---

## ❌ Error: "Build failed" or "Module not found"

**Problem:** Dependencies not installed or missing.

**Solution:**
1. Make sure `package.json` has all dependencies
2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Try deploying again

---

## ❌ Error: CORS issues after deployment

**Problem:** Backend doesn't allow requests from frontend.

**Solution:**
1. Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
2. Add/Update: `FRONTEND_URL` = `https://your-frontend-url.vercel.app`
3. Redeploy backend:
   ```bash
   cd server
   vercel --prod
   ```

---

## ❌ Error: API calls returning 404

**Problem:** Frontend is calling wrong API URL.

**Solution:**
1. Check Vercel Dashboard → Frontend Project → Settings → Environment Variables
2. Ensure `REACT_APP_API_URL` = `https://your-backend-url.vercel.app/api`
3. Redeploy frontend:
   ```bash
   cd client
   vercel --prod
   ```

---

## ❌ Error: Database connection failed

**Problem:** Database not accessible from Vercel or wrong credentials.

**Solution:**
1. Ensure your database allows external connections
2. Check Vercel Dashboard → Backend Project → Settings → Environment Variables
3. Verify all database variables are correct:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`
4. Redeploy backend

---

## ❌ Error: "Project already exists"

**Problem:** You're trying to create a project that already exists.

**Solution:**
```bash
# Link to existing project instead
vercel link

# Then deploy
vercel --prod
```

---

## ✅ Correct Deployment Process

### Backend:
```bash
# 1. Navigate to server directory
cd server

# 2. Deploy
vercel --prod

# 3. When prompted, answer:
# - "In which directory is your code located?" → . (dot)
```

### Frontend:
```bash
# 1. Navigate to client directory (from root)
cd client

# 2. Deploy
vercel --prod

# 3. When prompted, answer:
# - "In which directory is your code located?" → . (dot)
```

---

## 🔍 How to Check Logs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on the latest deployment
4. Click "View Function Logs" (for backend) or "Build Logs" (for frontend)

---

## 📝 Environment Variables Checklist

### Backend Environment Variables:
- [ ] `DB_HOST`
- [ ] `DB_USER`
- [ ] `DB_PASSWORD`
- [ ] `DB_NAME`
- [ ] `DB_PORT`
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = `https://your-frontend.vercel.app`

### Frontend Environment Variables:
- [ ] `REACT_APP_API_URL` = `https://your-backend.vercel.app/api`

---

## 🆘 Still Having Issues?

1. **Check Build Logs** - Look for specific error messages
2. **Verify Environment Variables** - Make sure all are set correctly
3. **Test Locally First** - Ensure app works on localhost
4. **Check Database Access** - Ensure database accepts external connections
5. **Review CORS Settings** - Ensure frontend URL is whitelisted in backend

---

## 💡 Pro Tips

- Always deploy backend BEFORE frontend
- Always set environment variables BEFORE testing
- Use `vercel logs` command to see real-time logs
- Test each deployment thoroughly before moving to the next step
- Keep your local `.env` files for reference (but never commit them!)

---

## 🎯 Quick Reset

If everything is broken and you want to start fresh:

```bash
# Remove Vercel projects from dashboard
# Then redeploy from scratch:

cd server
vercel --prod

cd ../client
vercel --prod
```

Remember to set all environment variables again!
