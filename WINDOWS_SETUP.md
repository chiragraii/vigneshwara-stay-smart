# 🪟 Windows Setup Guide

Complete setup guide specifically for Windows users.

## 📋 Prerequisites for Windows

### 1. Install Node.js
- Download from: https://nodejs.org/
- Choose LTS version (recommended)
- Run installer
- Check installation:
  ```cmd
  node --version
  npm --version
  ```

### 2. Install PostgreSQL
- Download from: https://www.postgresql.org/download/windows/
- Run installer
- **Remember the password you set!**
- Default port: 5432
- Includes pgAdmin (GUI tool)

### 3. Verify PostgreSQL is Running
- Open **Services** (Win + R → `services.msc`)
- Look for "postgresql-x64-XX"
- Status should be "Running"
- If not, right-click → Start

## 🚀 Setup Steps (Windows)

### Step 1: Open Command Prompt or PowerShell
```cmd
Win + R → type "cmd" → Enter
```

Or use Windows Terminal (recommended)

### Step 2: Navigate to Backend Folder
```cmd
cd D:\VIGNESH\vigneshwara-stay-smart\backend
```

### Step 3: Install Dependencies
```cmd
npm install
```

This will take a few minutes. Wait for it to complete.

### Step 4: Configure Environment Variables

Open `backend\.env` in Notepad:
```cmd
notepad .env
```

Add your configuration:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hotel_db
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Replace `YOUR_PASSWORD` with your PostgreSQL password!**

Save and close Notepad.

### Step 5: Create Database

#### Option A: Using pgAdmin (GUI)
1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to your server (enter password)
3. Right-click "Databases" → Create → Database
4. Name: `hotel_db`
5. Click Save

#### Option B: Using Command Line
1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin folder:
   ```cmd
   cd "C:\Program Files\PostgreSQL\15\bin"
   ```
   (Adjust version number if different)

3. Connect to PostgreSQL:
   ```cmd
   psql -U postgres
   ```
   (Enter your password when prompted)

4. Create database:
   ```sql
   CREATE DATABASE hotel_db;
   ```

5. Exit:
   ```sql
   \q
   ```

### Step 6: Run Migrations

Back in the backend folder:
```cmd
cd D:\VIGNESH\vigneshwara-stay-smart\backend
npm run migrate
```

You should see:
```
✓ Users table created
✓ Email index created
✓ Refresh tokens table created
✅ Migration completed successfully!
```

### Step 7: Start Backend Server

```cmd
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║   🏨 Hotel Vigneshwara Lodge Backend      ║
║   🚀 Server running on port 5000          ║
╚════════════════════════════════════════════╝
```

**Don't close this window!** Keep it running.

### Step 8: Test the Backend

Open a NEW Command Prompt window and test:

```cmd
curl http://localhost:5000/health
```

If curl doesn't work, open your browser and visit:
```
http://localhost:5000/health
```

You should see:
```json
{"status":"ok","timestamp":"..."}
```

## 🎉 Success! Backend is Running

## 🧪 Testing on Windows

### Option 1: Using Browser
Visit these URLs in your browser:
- http://localhost:5000/health

### Option 2: Using PowerShell
```powershell
# Test signup
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"full_name":"Test User","email":"test@example.com","phone":"+1234567890","password":"Test123"}'
```

### Option 3: Using Node.js Test Script
```cmd
cd D:\VIGNESH\vigneshwara-stay-smart\backend
node test-api.js
```

### Option 4: Using Postman
1. Download Postman: https://www.postman.com/downloads/
2. Import `backend\api-collection.json`
3. Test endpoints

### Option 5: Using Thunder Client (VS Code)
1. Install Thunder Client extension in VS Code
2. Import `backend\api-collection.json`
3. Test endpoints

## 🔧 Windows-Specific Troubleshooting

### Problem: "npm is not recognized"
**Solution:**
1. Close and reopen Command Prompt
2. Or add Node.js to PATH:
   - Control Panel → System → Advanced → Environment Variables
   - Add `C:\Program Files\nodejs\` to PATH

### Problem: "psql is not recognized"
**Solution:**
Add PostgreSQL bin to PATH:
1. Find PostgreSQL installation (usually `C:\Program Files\PostgreSQL\15\bin`)
2. Add to PATH in Environment Variables
3. Restart Command Prompt

### Problem: PostgreSQL service not running
**Solution:**
1. Press Win + R
2. Type `services.msc`
3. Find "postgresql-x64-XX"
4. Right-click → Start

### Problem: Port 5000 already in use
**Solution:**
1. Find what's using port 5000:
   ```cmd
   netstat -ano | findstr :5000
   ```
2. Kill the process:
   ```cmd
   taskkill /PID <process_id> /F
   ```
   Or change PORT in `.env` to 5001

### Problem: "Access denied" when running commands
**Solution:**
Run Command Prompt as Administrator:
- Right-click Command Prompt
- Select "Run as administrator"

### Problem: Firewall blocking connections
**Solution:**
1. Windows Defender Firewall
2. Allow Node.js and PostgreSQL
3. Or temporarily disable for testing

### Problem: Can't edit .env file
**Solution:**
Make sure file is not read-only:
1. Right-click `.env`
2. Properties
3. Uncheck "Read-only"

## 📂 Important Windows Paths

### PostgreSQL Installation
```
C:\Program Files\PostgreSQL\15\
```

### PostgreSQL Data
```
C:\Program Files\PostgreSQL\15\data\
```

### PostgreSQL Logs
```
C:\Program Files\PostgreSQL\15\data\log\
```

### Project Backend
```
D:\VIGNESH\vigneshwara-stay-smart\backend\
```

## 🚀 Quick Start Script for Windows

Double-click `backend\start.bat` to:
1. Check if dependencies are installed
2. Check if .env exists
3. Start the backend server

## 🛠️ Useful Windows Tools

### pgAdmin
- GUI for PostgreSQL
- Installed with PostgreSQL
- Start Menu → pgAdmin

### Windows Terminal
- Modern terminal app
- Get from Microsoft Store
- Better than Command Prompt

### VS Code
- Best code editor
- Download: https://code.visualstudio.com/
- Extensions to install:
  - Thunder Client (API testing)
  - PostgreSQL Explorer
  - ESLint
  - Prettier

## 📊 Checking Logs

### Backend Logs
Look at your Command Prompt where backend is running

### PostgreSQL Logs
```cmd
notepad "C:\Program Files\PostgreSQL\15\data\log\postgresql-YYYY-MM-DD.log"
```

## 🔐 Windows Firewall Rules

If you need to allow connections:

1. Windows Defender Firewall
2. Advanced Settings
3. Inbound Rules → New Rule
4. Port → TCP → 5000
5. Allow the connection
6. Name: "Hotel Backend API"

## 💾 Backup (Windows)

### Backup Database
```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
pg_dump -U postgres hotel_db > D:\backup.sql
```

### Restore Database
```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
psql -U postgres hotel_db < D:\backup.sql
```

## ⚡ Windows Performance Tips

1. **Use SSD:** Install PostgreSQL on SSD for better performance
2. **Increase PostgreSQL memory:** Edit `postgresql.conf`
3. **Disable Windows Search:** For backend folder
4. **Use Windows Terminal:** Instead of Command Prompt
5. **Keep PostgreSQL updated:** Latest version has improvements

## 📝 Windows Environment Variables

Set permanently:
```cmd
setx DATABASE_URL "postgresql://postgres:pass@localhost:5432/hotel_db"
```

Or use System Properties → Environment Variables (recommended)

## 🎯 Next Steps

1. ✅ Backend running on http://localhost:5000
2. 🧪 Test with Postman or browser
3. 🎨 Connect frontend
4. 🚀 Build your application

## 📞 Windows-Specific Help

### Check Node.js Version
```cmd
node --version
```
Should be 18 or higher

### Check npm Version
```cmd
npm --version
```

### Check PostgreSQL Version
```cmd
"C:\Program Files\PostgreSQL\15\bin\psql" --version
```

### Check if Port is Available
```cmd
netstat -ano | findstr :5000
```

### View Running Services
```cmd
services.msc
```

## 🔄 Restarting Everything

If something goes wrong:

1. **Stop backend:** Ctrl + C in Command Prompt
2. **Restart PostgreSQL:**
   - Services → postgresql-x64-XX → Restart
3. **Start backend again:**
   ```cmd
   cd D:\VIGNESH\vigneshwara-stay-smart\backend
   npm run dev
   ```

## 📚 Additional Resources

- Node.js on Windows: https://nodejs.org/en/download/
- PostgreSQL on Windows: https://www.postgresql.org/download/windows/
- Windows Terminal: https://aka.ms/terminal
- VS Code: https://code.visualstudio.com/

## ✅ Windows Setup Checklist

- [ ] Node.js installed and working
- [ ] PostgreSQL installed and running
- [ ] pgAdmin accessible
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Database `hotel_db` created
- [ ] Migrations run successfully
- [ ] Backend starts without errors
- [ ] Health endpoint responds
- [ ] Can create test user
- [ ] Firewall allows connections (if needed)

## 🎉 Done!

Your Windows environment is set up and ready!

**Backend running at:** http://localhost:5000

**Test it:** Open browser → http://localhost:5000/health

---

**For more help:**
- General setup: `SETUP.md`
- Quick start: `GET_STARTED.md`
- API docs: `backend/README.md`
