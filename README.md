# 🏨 Hotel Vigneshwara Lodge

Full-stack hotel booking application with React frontend and Node.js backend.

## 🎯 Features

### Frontend
- ✅ Modern React + TypeScript UI
- ✅ TanStack Router for navigation
- ✅ Radix UI component library
- ✅ Tailwind CSS for styling
- ✅ Authentication UI (signup/login)

### Backend
- ✅ Node.js + Express REST API
- ✅ PostgreSQL database
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation
- ✅ Rate limiting & security headers
- ✅ CORS configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm

### Setup Steps

1. **Clone and install frontend:**
```bash
npm install
```

2. **Setup backend:**
```bash
cd backend
npm install
```

3. **Configure database:**

Edit `backend/.env` with your PostgreSQL credentials:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/hotel_db
JWT_SECRET=your-secret-key
```

4. **Create database:**
```sql
CREATE DATABASE hotel_db;
```

5. **Run migrations:**
```bash
cd backend
npm run migrate
```

6. **Start backend:**
```bash
npm run dev
```
Backend runs on http://localhost:5000

7. **Start frontend (in new terminal):**
```bash
npm run dev
```
Frontend runs on http://localhost:3000

## 📁 Project Structure

```
vigneshwara-stay-smart/
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Business logic
│   │   ├── database/        # Migrations
│   │   ├── middleware/      # Auth & validation
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Helpers
│   ├── .env                 # Backend environment variables
│   ├── package.json
│   └── README.md           # Backend documentation
├── src/                     # React frontend
│   ├── components/          # UI components
│   ├── routes/              # Page routes
│   ├── integrations/        # External services
│   └── lib/                 # Utilities
├── package.json
├── SETUP.md                 # Detailed setup guide
└── README.md               # This file
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| POST | `/api/auth/verify-email` | Verify email | Yes |
| GET | `/health` | Health check | No |

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup instructions
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[backend/QUICK_START.md](./backend/QUICK_START.md)** - 5-minute setup guide

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/hotel_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🛠️ Development

### Frontend Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

### Backend Commands
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run migrate      # Run database migrations
```

## 🧪 Testing the Backend

### Using cURL (Windows PowerShell):

**Signup:**
```powershell
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{\"full_name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"+1234567890\",\"password\":\"Test123\"}'
```

**Login:**
```powershell
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"john@example.com\",\"password\":\"Test123\"}'
```

### Using Postman or Thunder Client:

Import these endpoints:
- POST `http://localhost:5000/api/auth/signup`
- POST `http://localhost:5000/api/auth/login`
- GET `http://localhost:5000/api/auth/profile` (Add header: `Authorization: Bearer YOUR_TOKEN`)

## 🔒 Security Features

- Bcrypt password hashing (12 rounds)
- JWT token authentication (7-day expiry)
- Rate limiting (100 req/15min)
- Helmet security headers
- CORS protection
- SQL injection prevention
- Input validation & sanitization

## 📊 Database Schema

### Users Table
```sql
id              SERIAL PRIMARY KEY
full_name       VARCHAR(120)
email           VARCHAR(255) UNIQUE
phone           VARCHAR(20)
password_hash   VARCHAR(255)
email_verified  BOOLEAN DEFAULT false
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🚀 Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static host

### Backend
1. Set environment to production: `NODE_ENV=production`
2. Generate secure JWT secret: `openssl rand -base64 32`
3. Configure PostgreSQL with SSL
4. Build: `npm run build`
5. Start: `npm start`
6. Deploy to Railway, Heroku, or any Node.js host

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

ISC

## 🆘 Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify `DATABASE_URL` in `backend/.env`
- Ensure database exists: `CREATE DATABASE hotel_db;`

### Frontend won't connect to backend
- Make sure backend is running on port 5000
- Check CORS settings in `backend/src/server.ts`
- Verify `FRONTEND_URL` in `backend/.env`

### Database errors
- Run migrations: `npm run migrate` in backend folder
- Check PostgreSQL logs
- Verify database credentials

## 📧 Support

For issues or questions, please open an issue in the repository.

---

Made with ❤️ for Hotel Vigneshwara Lodge
