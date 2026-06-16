# ✅ Installation Checklist

Follow this checklist to ensure everything is set up correctly.

## 📋 Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 12+ installed and running
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional)

## 🗄️ Database Setup

- [ ] PostgreSQL service is running
- [ ] Database `hotel_db` created
  ```sql
  CREATE DATABASE hotel_db;
  ```
- [ ] You have your database credentials ready
  - Username (usually `postgres`)
  - Password
  - Host (`localhost`)
  - Port (`5432`)

## 🔧 Backend Configuration

- [ ] Navigate to backend folder: `cd backend`
- [ ] Dependencies installed: `npm install`
- [ ] `.env` file created (copy from `.env.example`)
- [ ] `DATABASE_URL` configured in `.env`
  ```
  DATABASE_URL=postgresql://username:password@localhost:5432/hotel_db
  ```
- [ ] `JWT_SECRET` set in `.env`
- [ ] Database migrations run: `npm run migrate`
- [ ] Backend starts successfully: `npm run dev`
- [ ] Health check works: http://localhost:5000/health

## ✅ Verification Tests

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```
**Expected:** `{"status": "ok", ...}`

### Test 2: Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"full_name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+1234567890\",\"password\":\"Test123\"}"
```
**Expected:** User created with token

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123\"}"
```
**Expected:** User logged in with token

### Test 4: Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** User profile data

## 🎨 Frontend Setup (Optional)

- [ ] Return to root folder: `cd ..`
- [ ] Frontend dependencies installed: `npm install`
- [ ] Frontend starts: `npm run dev`
- [ ] Frontend accessible: http://localhost:3000

## 🚨 Troubleshooting Checks

If something isn't working:

### Backend Won't Start
- [ ] Check if PostgreSQL is running
  - **Windows:** Services → PostgreSQL
  - **Mac:** `brew services list`
  - **Linux:** `sudo systemctl status postgresql`
- [ ] Verify `backend/.env` exists
- [ ] Check for port conflicts (port 5000)
- [ ] Review backend console for errors

### Database Connection Failed
- [ ] PostgreSQL service running
- [ ] Database `hotel_db` exists
- [ ] Username and password correct
- [ ] Port 5432 accessible
- [ ] Connection string format correct

### Migration Failed
- [ ] Database exists
- [ ] User has permissions
- [ ] No existing tables conflict
- [ ] PostgreSQL version compatible (12+)

## 🎉 Success Criteria

You're ready to go when:

1. ✅ Backend starts without errors
2. ✅ Health endpoint returns OK
3. ✅ Can create a user account
4. ✅ Can login with credentials
5. ✅ Can access protected routes with token

## 📊 Database Verification

Check if tables were created:

```sql
-- Connect to database
\c hotel_db

-- List tables
\dt

-- You should see:
-- users
-- refresh_tokens
```

Verify users table structure:
```sql
\d users
```

## 🔐 Security Checklist

For production deployment:

- [ ] Changed `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Enabled PostgreSQL SSL
- [ ] Updated `FRONTEND_URL` to production domain
- [ ] Removed `.env` from version control
- [ ] Strong database password used
- [ ] Rate limiting configured appropriately

## 📝 Configuration Files Summary

### `backend/.env`
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/hotel_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🛠️ Quick Commands Reference

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run migrate         # Run database migrations
npm run dev             # Start development server
npm run build           # Build for production
npm start               # Start production server

# Frontend
npm install             # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
```

## 📚 Documentation Files

- [ ] `README.md` - Main project overview
- [ ] `SETUP.md` - Detailed setup instructions
- [ ] `backend/README.md` - Backend API documentation
- [ ] `backend/QUICK_START.md` - 5-minute setup
- [ ] `INSTALLATION_CHECKLIST.md` - This file
- [ ] `backend/api-collection.json` - Postman collection

## 🆘 Still Having Issues?

1. Review error messages carefully
2. Check all environment variables
3. Verify PostgreSQL connection manually
4. Check firewall settings (port 5000)
5. Review server logs
6. Try restarting PostgreSQL service
7. Delete `node_modules` and reinstall: `npm install`

## ✨ Next Steps

Once everything is working:

1. Test all API endpoints
2. Import Postman collection (`backend/api-collection.json`)
3. Connect frontend to backend
4. Customize for your needs
5. Add additional features
6. Deploy to production

---

## 📧 Support

If you've checked everything and still have issues:

1. Check the troubleshooting section in `SETUP.md`
2. Review PostgreSQL logs
3. Check backend console output
4. Verify all configuration files
5. Open an issue with error details

**Congratulations! 🎉 Your authentication backend is ready!**
