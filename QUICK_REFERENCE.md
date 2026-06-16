# ⚡ Quick Reference Guide

## 🎯 Start Here

New to this project? Follow this order:

1. **READ FIRST:** `GET_STARTED.md` (5-minute overview)
2. **SETUP:** `INSTALLATION_CHECKLIST.md` (step-by-step)
3. **REFERENCE:** `backend/README.md` (API docs)
4. **HELP:** `SETUP.md` (detailed guide)

## 📚 Documentation Map

```
📁 Project Root
│
├── 🚀 GET_STARTED.md              ⭐ START HERE
│   └─ Quick 5-minute guide to get running
│
├── ✅ INSTALLATION_CHECKLIST.md   ⭐ SETUP GUIDE  
│   └─ Step-by-step verification checklist
│
├── 📖 SETUP.md
│   └─ Detailed setup instructions with troubleshooting
│
├── 📊 BACKEND_SUMMARY.md
│   └─ Complete overview of what was created
│
├── 📝 README.md
│   └─ Project overview and introduction
│
└── 📁 backend/
    ├── 📖 README.md              ⭐ API REFERENCE
    │   └─ Complete API documentation
    │
    ├── ⚡ QUICK_START.md
    │   └─ 5-minute backend setup
    │
    ├── 🧪 test-api.js
    │   └─ Automated API tests
    │
    └── 📮 api-collection.json
        └─ Postman/Thunder Client import
```

## 🚀 Common Commands

### Backend Commands
```bash
cd backend

# First time setup
npm install              # Install dependencies
npm run migrate         # Create database tables

# Development
npm run dev             # Start with hot reload

# Testing
node test-api.js        # Run automated tests
curl http://localhost:5000/health  # Quick health check

# Production
npm run build           # Compile TypeScript
npm start               # Start production server
```

### Database Commands
```sql
-- Create database
CREATE DATABASE hotel_db;

-- Connect to database
\c hotel_db

-- List tables
\dt

-- View users table structure
\d users

-- View all users
SELECT * FROM users;
```

## 📡 API Quick Reference

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```
GET /health
```
No auth required. Returns server status.

#### 2. Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123"
}
```
Creates account, returns token.

#### 3. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
Returns token on success.

#### 4. Get Profile
```
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```
Returns user data (requires auth).

#### 5. Verify Email
```
POST /api/auth/verify-email
Authorization: Bearer YOUR_JWT_TOKEN
```
Marks email as verified (requires auth).

## 🔑 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Validation Error Response
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🔧 Configuration Quick Reference

### Environment Variables (`backend/.env`)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/hotel_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Password Requirements
- ✅ Minimum 6 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 lowercase letter  
- ✅ At least 1 number

### Token Usage
```javascript
// Save token after login/signup
const token = responseData.data.token;
localStorage.setItem('token', token);

// Use token in requests
const token = localStorage.getItem('token');
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🧪 Testing Cheat Sheet

### Using cURL (Windows Command Prompt)
```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d "{\"full_name\":\"Test\",\"email\":\"test@ex.com\",\"phone\":\"+123\",\"password\":\"Test123\"}"

# Login  
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@ex.com\",\"password\":\"Test123\"}"

# Profile (replace TOKEN)
curl http://localhost:5000/api/auth/profile -H "Authorization: Bearer TOKEN"
```

### Using Node.js Test Script
```bash
cd backend
node test-api.js
```

### Using Postman
1. Import `backend/api-collection.json`
2. Test endpoints
3. Save responses

## 🚨 Troubleshooting Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Backend won't start | Check if PostgreSQL is running |
| "DATABASE_URL required" | Create `backend/.env` file |
| "ECONNREFUSED" | Verify PostgreSQL is running on port 5432 |
| "Port 5000 in use" | Change `PORT` in `.env` to 5001 |
| "Invalid token" | Login again, token may have expired |
| Migration fails | Create database: `CREATE DATABASE hotel_db;` |
| Can't connect to DB | Check username/password in `DATABASE_URL` |

## 📂 File Structure Quick View

```
backend/src/
├── server.ts                 # Express app entry point
├── config/
│   ├── config.ts            # Environment configuration
│   └── database.ts          # PostgreSQL pool
├── controllers/
│   └── authController.ts    # Signup, login, profile logic
├── models/
│   └── User.ts              # Database queries
├── routes/
│   └── authRoutes.ts        # Route definitions
├── middleware/
│   ├── auth.ts              # JWT verification
│   └── validators.ts        # Input validation
├── database/
│   └── migrate.ts           # Database migrations
└── utils/
    └── jwt.ts               # JWT helper functions
```

## 🎯 Common Tasks

### Add a New Endpoint
1. Add route in `routes/authRoutes.ts`
2. Add controller in `controllers/authController.ts`
3. Test the endpoint

### Add Database Table
1. Add SQL in `database/migrate.ts`
2. Run `npm run migrate`

### Update User Model
1. Edit `models/User.ts`
2. Add methods as needed

### Change Token Expiry
1. Edit `JWT_EXPIRES_IN` in `.env`
2. Restart server

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to random string
- [ ] Set `NODE_ENV=production`
- [ ] Enable PostgreSQL SSL
- [ ] Use strong database password
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Remove `.env` from version control
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable logging

## 💡 Pro Tips

1. **Save tokens:** Store JWT tokens in localStorage or cookies
2. **Test often:** Use `node test-api.js` after changes
3. **Check logs:** Backend console shows useful debug info
4. **Use GUI tools:** pgAdmin for database, Postman for API
5. **Read errors:** Error messages guide you to solutions
6. **Keep it secure:** Never commit `.env` files

## 📞 Quick Help

- **API not working?** → Check `backend/README.md`
- **Setup problems?** → Check `INSTALLATION_CHECKLIST.md`
- **Database issues?** → Check `SETUP.md` troubleshooting
- **General questions?** → Check `GET_STARTED.md`

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- JWT: https://jwt.io/introduction
- Node.js: https://nodejs.org/docs/

## ⚡ Speed Run (For Experienced Devs)

```bash
# 1. Setup
cd backend
npm install
cp .env.example .env
# Edit .env with DATABASE_URL

# 2. Database
createdb hotel_db
npm run migrate

# 3. Run
npm run dev

# 4. Test
node test-api.js
```

Done! 🎉

---

**Need detailed help?** Read the full guides:
- `GET_STARTED.md` - Quick introduction
- `SETUP.md` - Complete setup guide
- `INSTALLATION_CHECKLIST.md` - Step-by-step verification
- `backend/README.md` - Full API documentation
