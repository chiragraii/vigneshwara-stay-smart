# 🚀 Get Started - Hotel Vigneshwara Lodge Backend

## 📦 What You Got

A complete **Node.js authentication backend** with:
- ✅ User signup & login
- ✅ JWT authentication
- ✅ PostgreSQL database
- ✅ Password hashing (bcrypt)
- ✅ Security features (rate limiting, CORS, Helmet)
- ✅ Input validation
- ✅ TypeScript support

## ⚡ Quick Start (5 Minutes)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Edit `backend/.env` and add your PostgreSQL connection:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hotel_db
```

### 3. Create Database
Open PostgreSQL and run:
```sql
CREATE DATABASE hotel_db;
```

### 4. Run Migrations
```bash
npm run migrate
```

### 5. Start Server
```bash
npm run dev
```

**Server runs at: http://localhost:5000**

### 6. Test It
Visit: http://localhost:5000/health

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

## 🎯 API Endpoints

### Signup (Create Account)
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response includes:**
- User data
- JWT token (save this!)

### Get Profile (Protected)
```bash
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📁 Project Files

```
backend/
├── src/
│   ├── server.ts              ⭐ Main server file
│   ├── config/
│   │   ├── config.ts          ⚙️ Configuration
│   │   └── database.ts        🗄️ Database connection
│   ├── controllers/
│   │   └── authController.ts  🎮 Auth logic
│   ├── models/
│   │   └── User.ts           👤 User model
│   ├── routes/
│   │   └── authRoutes.ts     🛣️ API routes
│   ├── middleware/
│   │   ├── auth.ts           🔐 JWT middleware
│   │   └── validators.ts     ✅ Input validation
│   ├── database/
│   │   └── migrate.ts        🔄 Database migrations
│   └── utils/
│       └── jwt.ts            🎫 JWT utilities
├── .env                      🔧 Your configuration
├── package.json              📦 Dependencies
└── README.md                 📖 Documentation
```

## 🧪 Testing

### Using cURL (Command Line)
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d "{\"full_name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+1234567890\",\"password\":\"Test123\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Test123\"}"
```

### Using Postman
Import the file: `backend/api-collection.json`

### Using VS Code Extension
Install "Thunder Client" or "REST Client"

## 📖 Documentation

| File | Purpose |
|------|---------|
| `GET_STARTED.md` | You are here - Quick start guide |
| `SETUP.md` | Detailed setup instructions |
| `INSTALLATION_CHECKLIST.md` | Step-by-step checklist |
| `backend/README.md` | Complete API documentation |
| `backend/QUICK_START.md` | 5-minute setup |

## 🔑 Environment Variables

Your `backend/.env` should contain:

```env
# PostgreSQL connection
DATABASE_URL=postgresql://username:password@localhost:5432/hotel_db

# JWT secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Token expiry
JWT_EXPIRES_IN=7d

# Server port
PORT=5000

# Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🛠️ Common Commands

```bash
# Start development server (with hot reload)
npm run dev

# Run database migrations
npm run migrate

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Security Features

✅ **Password Security**
- Bcrypt hashing with 12 salt rounds
- Minimum 6 characters
- Must include uppercase, lowercase, and number

✅ **Token Security**
- JWT with 7-day expiry
- Bearer token authentication
- Secure secret key

✅ **API Security**
- Rate limiting (100 req/15min)
- CORS protection
- Helmet security headers
- SQL injection prevention
- Input validation & sanitization

## 📊 Database Schema

The migrations create this table:

```sql
users (
  id              SERIAL PRIMARY KEY,
  full_name       VARCHAR(120),
  email           VARCHAR(255) UNIQUE,
  phone           VARCHAR(20),
  password_hash   VARCHAR(255),
  email_verified  BOOLEAN DEFAULT false,
  created_at      TIMESTAMP,
  updated_at      TIMESTAMP
)
```

## 🚨 Troubleshooting

### "DATABASE_URL is required"
→ Create `backend/.env` file and add your PostgreSQL connection string

### "connect ECONNREFUSED"
→ Make sure PostgreSQL is running
→ Check your connection string

### "Port 5000 already in use"
→ Change `PORT` in `.env` to a different port (e.g., 5001)

### "password authentication failed"
→ Check your PostgreSQL password in `DATABASE_URL`

### "database does not exist"
→ Create it: `CREATE DATABASE hotel_db;`

## ✅ Success Checklist

- [x] Backend created ✅
- [ ] Dependencies installed
- [ ] Database configured
- [ ] Migrations run
- [ ] Server starts successfully
- [ ] Health check returns OK
- [ ] Can create user account
- [ ] Can login with credentials

## 🎯 Next Steps

1. ✅ Backend is working
2. 🔄 Test all endpoints
3. 🎨 Connect your frontend
4. 🚀 Deploy to production

## 💡 Pro Tips

1. **Save tokens:** After login, save the JWT token to use in protected routes
2. **Use Postman:** Import `api-collection.json` for easy testing
3. **Check logs:** Backend console shows helpful debug information
4. **Read errors:** Error messages guide you to the solution
5. **Database GUI:** Use pgAdmin or DBeaver to view your database

## 🎓 Understanding the Flow

1. **User signs up** → Password is hashed → Saved to database → Returns JWT token
2. **User logs in** → Password verified → Returns JWT token
3. **Access protected route** → Send JWT in header → Server verifies → Returns data

## 🔗 Useful Links

- PostgreSQL: https://www.postgresql.org/
- Express.js: https://expressjs.com/
- JWT: https://jwt.io/
- bcrypt: https://www.npmjs.com/package/bcryptjs

## 📞 Need Help?

1. Check `INSTALLATION_CHECKLIST.md` for step-by-step verification
2. Read `SETUP.md` for detailed instructions
3. Review error messages in the console
4. Check PostgreSQL logs
5. Verify all environment variables

---

## 🎉 You're All Set!

Your authentication backend is ready to use. Start building amazing features!

**Backend URL:** http://localhost:5000

**Test it now:** http://localhost:5000/health
