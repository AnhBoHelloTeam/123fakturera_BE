# Render Deployment Setup Guide

## 🚀 Backend Deployment Steps

### 1. Create Database First
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Name: `123fakturera-db`
4. Plan: Free
5. Database Name: `123fakturera_db`
6. User: `123fakturera_user`
7. Click "Create Database"

### 2. Create Web Service
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `https://github.com/AnhBoHelloTeam/123fakturera_BE`
4. Name: `123fakturera-backend`
5. Environment: Node
6. Plan: Free
7. Build Command: `npm install`
8. Start Command: `npm start`

### 3. Environment Variables
Set these environment variables in Render:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<from database connection string>
JWT_SECRET=<generate random string>
SALT_ROUNDS=10
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BASE_URL=https://123fakturera-backend.onrender.com
```

### 4. Database Connection String
1. Go to your database in Render
2. Copy the "External Database URL"
3. Use this as DATABASE_URL in environment variables

### 5. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Check logs for any errors

## 🔧 Troubleshooting

### Database Connection Error
If you see "Tenant or user not found":
1. Make sure database is created first
2. Check DATABASE_URL is set correctly
3. Verify database name and user match

### Environment Variables
Make sure all required environment variables are set:
- DATABASE_URL (most important)
- JWT_SECRET
- PORT
- NODE_ENV

## 📊 After Deployment

### 1. Test Database Connection
Visit: `https://123fakturera-backend.onrender.com/api/terms?language=en`

### 2. Run Seeders (if needed)
You may need to manually run seeders to populate data:
```bash
npm run seed
```

### 3. Test Login
Use test credentials:
- Email: john@storford.no
- Password: password123

## 🎯 Expected URLs

- Backend: https://123fakturera-backend.onrender.com
- Frontend: https://123fakturera-frontend.onrender.com

## 📝 Notes

- Free tier has limitations (sleep after inactivity)
- Database connection may take time to establish
- First deployment may take 5-10 minutes
