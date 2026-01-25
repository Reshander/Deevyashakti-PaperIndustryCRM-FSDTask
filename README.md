# Deevyashakti - Paper Industry CRM

A full-stack CRM application for the paper industry with separate frontend and backend deployments.

## 🏗️ Project Structure

```
deeevyashakthi/
├── client/              # React Frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json     # Frontend deployment config
│
├── server/              # Node.js Backend
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── index.js
│   ├── package.json
│   └── vercel.json     # Backend deployment config
│
└── DEPLOYMENT.md        # Detailed deployment guide
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deeevyashakthi
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm start
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   cp .env.example .env.local
   # Edit .env.local if needed
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🌐 Deployment

This project is configured for **separate deployment** of frontend and backend on Vercel.

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

### Quick Deploy

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy backend: `cd server && vercel --prod`
3. Deploy frontend: `cd client && vercel --prod`
4. Update environment variables in Vercel Dashboard

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router
- Axios
- React Toastify
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM

## 📝 Features

- Customer Management
- Purchase Orders (PO)
- Sales Orders (SO)
- Invoice Management
- Payment Tracking
- Query Management
- OTP-based Authentication

## 🔐 Environment Variables

### Backend (.env)
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env.local)
- `REACT_APP_API_URL` - Backend API URL

## 📄 License

ISC
 
