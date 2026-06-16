# Hotel Vigneshwara Lodge - Authentication Backend

A secure Node.js + Express + PostgreSQL authentication backend with JWT tokens.

## 🚀 Features

- ✅ User registration (signup) with validation
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Protected routes with JWT middleware
- ✅ PostgreSQL database with connection pooling
- ✅ Input validation and sanitization
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ TypeScript support
- ✅ Environment-based configuration

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Then edit `.env` and add your configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/hotel_db
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Run database migrations:**
```bash
npm run migrate
```

5. **Start the development server:**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Public Endpoints

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "email_verified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "email_verified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Protected Endpoints (Require JWT Token)

#### GET `/api/auth/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "email_verified": false,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### POST `/api/auth/verify-email`
Verify user email.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Health Check

#### GET `/health`
Check server status.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based auth (7-day expiry)
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers (XSS, clickjacking protection)
- **CORS**: Configured for frontend origin
- **Input Validation**: express-validator with sanitization
- **SQL Injection Prevention**: Parameterized queries with pg

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.ts           # Environment configuration
│   │   └── database.ts         # PostgreSQL connection
│   ├── controllers/
│   │   └── authController.ts   # Authentication logic
│   ├── database/
│   │   └── migrate.ts          # Database migrations
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication middleware
│   │   └── validators.ts       # Input validation rules
│   ├── models/
│   │   └── User.ts             # User model & database queries
│   ├── routes/
│   │   └── authRoutes.ts       # Auth endpoints
│   ├── utils/
│   │   └── jwt.ts              # JWT utilities
│   └── server.ts               # Express app & server setup
├── .env.example                # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing with cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "SecurePass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Generate a strong `JWT_SECRET` (use: `openssl rand -base64 32`)
3. Configure PostgreSQL with SSL
4. Build the project: `npm run build`
5. Start with: `npm start`

## 📝 Password Requirements

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC
