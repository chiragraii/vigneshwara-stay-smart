# Hotel Vigneshwara Lodge - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 12 or higher ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

## 🗄️ PostgreSQL Setup

### 1. Create Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE hotel_db;
```

### 2. Get Your Connection String

Your DATABASE_URL format:
```
postgresql://username:password@host:port/database_name
```

**Example:**
```
postgresql://postgres:mypassword@localhost:5432/hotel_db
```

**For local PostgreSQL:**
- **username**: Usually `postgres`
- **password**: The password you set during PostgreSQL installation
- **host**: `localhost`
- **port**: `5432` (default)
- **database**: `hotel_db`

## 🚀 Backend Setup

### Step 1: Navigate to Backend Folder
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Edit the `backend/.env` file and add your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/hotel_db
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**⚠️ Important:** Replace `yourpassword` with your actual PostgreSQL password!

### Step 4: Run Database Migrations

This will create all necessary tables:

```bash
npm run migrate
```

You should see:
```
✓ Users table created
✓ Email index created
✓ Refresh tokens table created
✓ Update trigger function created
✓ Users update trigger created
✅ Migration completed successfully!
```

### Step 5: Start the Backend Server

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║   🏨 Hotel Vigneshwara Lodge Backend      ║
║   🚀 Server running on port 5000          ║
║   🌍 Environment: development             ║
║   📊 Health: http://localhost:5000/health ║
╚════════════════════════════════════════════╝
```

### Step 6: Test the Backend

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🧪 Testing Authentication

### Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"full_name\": \"John Doe\", \"email\": \"john@example.com\", \"phone\": \"+1234567890\", \"password\": \"SecurePass123\"}"
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"john@example.com\", \"password\": \"SecurePass123\"}"
```

Save the `token` from the response!

### Test Protected Route (Get Profile)

Replace `YOUR_TOKEN` with the token you received:

```bash
curl -X GET http://localhost:5000/api/auth/profile ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Problem: "DATABASE_URL is required"
**Solution:** Make sure `backend/.env` file exists and contains valid `DATABASE_URL`

### Problem: "ECONNREFUSED" or "connect ECONNREFUSED"
**Solution:** 
1. Make sure PostgreSQL is running
2. Verify the connection string in `.env`
3. Check PostgreSQL port (default: 5432)

### Problem: "password authentication failed"
**Solution:** Check your PostgreSQL password in `DATABASE_URL`

### Problem: "database does not exist"
**Solution:** Create the database first: `CREATE DATABASE hotel_db;`

### Problem: Port 5000 already in use
**Solution:** Change `PORT` in `backend/.env` to a different port (e.g., 5001)

## 📁 Project Structure

```
vigneshwara-stay-smart/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Business logic
│   │   ├── database/          # Migrations
│   │   ├── middleware/        # Auth & validation
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Helper functions
│   │   └── server.ts          # Main server file
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── README.md
├── src/                       # React frontend
├── .env                       # Root environment variables
└── SETUP.md                   # This file
```

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They contain sensitive information
2. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
3. **Use strong passwords** - Minimum 6 characters with uppercase, lowercase, and numbers
4. **Enable SSL for production** - Always use HTTPS in production

## 🎯 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| POST | `/api/auth/verify-email` | Verify email | Yes |
| GET | `/health` | Health check | No |

## 📞 Next Steps

1. ✅ Backend is now running on `http://localhost:5000`
2. 🔄 Update your frontend to connect to this backend
3. 🧪 Test all authentication flows
4. 🚀 Deploy to production when ready

## 💡 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run migrations
npm run migrate

# Install new dependency
npm install package-name
```

## 📖 Documentation

For detailed API documentation, see `backend/README.md`

## 🆘 Need Help?

- Check PostgreSQL logs: Usually in `C:\Program Files\PostgreSQL\{version}\data\log`
- Check backend logs in your terminal
- Verify all environment variables are set correctly
- Make sure all services are running (PostgreSQL, backend)
