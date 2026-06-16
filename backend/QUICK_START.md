# Quick Start - Backend Setup in 5 Minutes

## ⚡ Fast Setup

### 1. Install Dependencies (30 seconds)
```bash
cd backend
npm install
```

### 2. Configure Database (1 minute)

Edit `backend/.env` and replace with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hotel_db
```

### 3. Create Database (10 seconds)

Open PostgreSQL and run:
```sql
CREATE DATABASE hotel_db;
```

### 4. Run Migrations (10 seconds)
```bash
npm run migrate
```

### 5. Start Server (5 seconds)
```bash
npm run dev
```

## ✅ Verify It's Working

Visit: http://localhost:5000/health

You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "development"
}
```

## 🧪 Test Authentication

### Create Account:
```bash
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d "{\"full_name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+1234567890\",\"password\":\"Test123\"}"
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Test123\"}"
```

## 🎉 Done!

Your backend is now running at **http://localhost:5000**

Next: Connect your frontend to use these endpoints.
