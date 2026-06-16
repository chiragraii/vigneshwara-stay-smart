# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│         (React + TanStack Router + Supabase UI)            │
│                   http://localhost:3000                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │ JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API SERVER                        │
│              (Node.js + Express + TypeScript)              │
│                   http://localhost:5000                     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    Middleware Layer                    │ │
│  │  • CORS              • Rate Limiting                  │ │
│  │  • Helmet Security   • Body Parser                    │ │
│  │  • JWT Auth         • Input Validation               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    Routes Layer                        │ │
│  │  /api/auth/signup    /api/auth/login                 │ │
│  │  /api/auth/profile   /api/auth/verify-email          │ │
│  │  /health                                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  Controllers Layer                     │ │
│  │  • signup()      • login()                            │ │
│  │  • getProfile()  • verifyEmail()                      │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    Models Layer                        │ │
│  │  • User.create()                                      │ │
│  │  • User.findByEmail()                                 │ │
│  │  • User.findById()                                    │ │
│  │  • User.verifyPassword()                              │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL Queries
                         │ pg (node-postgres)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                       │
│                    localhost:5432/hotel_db                  │
│                                                             │
│  ┌─────────────────┐     ┌──────────────────────────────┐ │
│  │  users table    │     │  refresh_tokens table        │ │
│  │  • id           │     │  • id                        │ │
│  │  • full_name    │     │  • user_id (FK)              │ │
│  │  • email        │     │  • token                     │ │
│  │  • phone        │     │  • expires_at                │ │
│  │  • password_hash│     │  • created_at                │ │
│  │  • email_verified│    │  • revoked                   │ │
│  │  • created_at   │     └──────────────────────────────┘ │
│  │  • updated_at   │                                      │ │
│  └─────────────────┘                                      │ │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. Signup Flow

```
User Submits Form
      ↓
Frontend sends POST to /api/auth/signup
      ↓
┌─────────────────────────┐
│  Backend Middleware     │
│  • Validate input       │
│  • Sanitize data        │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  Auth Controller        │
│  • Check if user exists │
│  • Hash password (bcrypt)│
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  User Model             │
│  • INSERT into database │
│  • Return user data     │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  JWT Utility            │
│  • Generate token       │
│  • Sign with secret     │
└────────┬────────────────┘
         ↓
Return { user, token } to Frontend
         ↓
Frontend stores token in localStorage
```

### 2. Login Flow

```
User Submits Credentials
      ↓
Frontend sends POST to /api/auth/login
      ↓
┌─────────────────────────┐
│  Backend Middleware     │
│  • Validate input       │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  Auth Controller        │
│  • Find user by email   │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  User Model             │
│  • SELECT from database │
│  • Verify password hash │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  bcrypt.compare()       │
│  • Compare passwords    │
└────────┬────────────────┘
         ↓
     Valid? ──No──> Return 401 Error
         │
        Yes
         ↓
┌─────────────────────────┐
│  JWT Utility            │
│  • Generate token       │
└────────┬────────────────┘
         ↓
Return { user, token } to Frontend
         ↓
Frontend stores token
```

### 3. Protected Route Flow

```
User Requests Profile
      ↓
Frontend sends GET to /api/auth/profile
WITH Authorization: Bearer <token>
      ↓
┌─────────────────────────┐
│  Auth Middleware        │
│  • Extract token        │
│  • Verify signature     │
│  • Check expiry         │
└────────┬────────────────┘
         ↓
     Valid? ──No──> Return 403 Error
         │
        Yes
         ↓
┌─────────────────────────┐
│  Attach user to request │
│  req.user = decoded     │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  Auth Controller        │
│  • Get user ID from req │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  User Model             │
│  • SELECT from database │
└────────┬────────────────┘
         ↓
Return user data to Frontend
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│ Layer 1: Network Security                  │
│ • CORS (Cross-Origin Resource Sharing)     │
│ • Helmet (Security Headers)                │
└─────────────┬───────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ Layer 2: Rate Limiting                     │
│ • Max 100 requests per 15 minutes          │
│ • Per IP address                           │
└─────────────┬───────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ Layer 3: Input Validation                  │
│ • express-validator                        │
│ • Email format, password strength          │
│ • Sanitization                             │
└─────────────┬───────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ Layer 4: Authentication                    │
│ • JWT token verification                   │
│ • Signature validation                     │
│ • Expiry check                             │
└─────────────┬───────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ Layer 5: Password Security                 │
│ • bcrypt hashing (12 rounds)               │
│ • Never store plain passwords              │
└─────────────┬───────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ Layer 6: Database Security                 │
│ • Parameterized queries                    │
│ • SQL injection prevention                 │
│ • Connection pooling                       │
└─────────────────────────────────────────────┘
```

## Technology Stack

### Backend
```
┌─────────────────────────────────────┐
│         Runtime & Language          │
│  • Node.js 18+                     │
│  • TypeScript 5.5+                 │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│          Web Framework              │
│  • Express.js 4.19+                │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│           Database                  │
│  • PostgreSQL 12+                  │
│  • node-postgres (pg)              │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│         Authentication              │
│  • jsonwebtoken                    │
│  • bcryptjs                        │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│           Security                  │
│  • helmet                          │
│  • cors                            │
│  • express-rate-limit              │
│  • express-validator               │
└─────────────────────────────────────┘
```

### Frontend
```
┌─────────────────────────────────────┐
│           Framework                 │
│  • React 19                        │
│  • TanStack Router                 │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│          UI Library                 │
│  • Radix UI Components             │
│  • Tailwind CSS                    │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│         State & Forms               │
│  • TanStack Query                  │
│  • React Hook Form                 │
│  • Zod (validation)                │
└─────────────────────────────────────┘
```

## File Structure Organization

```
backend/
│
├── 📁 src/
│   │
│   ├── server.ts ─────────────┐
│   │   (Entry point)          │
│   │                           │
│   ├── 📁 config/              │
│   │   ├── config.ts          │ ← Environment variables
│   │   └── database.ts        │ ← PostgreSQL connection
│   │                           │
│   ├── 📁 routes/              │
│   │   └── authRoutes.ts      │ ← Route definitions
│   │        ↓                  │
│   ├── 📁 middleware/          │
│   │   ├── auth.ts            │ ← JWT verification
│   │   └── validators.ts      │ ← Input validation
│   │        ↓                  │
│   ├── 📁 controllers/         │
│   │   └── authController.ts  │ ← Business logic
│   │        ↓                  │
│   ├── 📁 models/              │
│   │   └── User.ts            │ ← Database queries
│   │        ↓                  │
│   ├── 📁 database/            │
│   │   └── migrate.ts         │ ← Schema definitions
│   │                           │
│   └── 📁 utils/               │
│       └── jwt.ts             │ ← Helper functions
│                               │
├── 📁 node_modules/ ───────────┤
├── .env ───────────────────────┤ ← Configuration
├── package.json ───────────────┤ ← Dependencies
└── tsconfig.json ──────────────┘ ← TypeScript config
```

## Data Flow Diagram

```
┌──────────┐
│  CLIENT  │
└────┬─────┘
     │
     │ 1. HTTP Request (JSON)
     │
     ▼
┌─────────────────┐
│   MIDDLEWARE    │
│  • Validation   │
│  • Rate Limit   │
│  • CORS         │
└────┬────────────┘
     │
     │ 2. Validated Request
     │
     ▼
┌─────────────────┐
│  CONTROLLER     │
│  • Logic        │
│  • Orchestrate  │
└────┬────────────┘
     │
     │ 3. Database Query
     │
     ▼
┌─────────────────┐
│     MODEL       │
│  • SQL Queries  │
│  • Data Access  │
└────┬────────────┘
     │
     │ 4. SQL
     │
     ▼
┌─────────────────┐
│   POSTGRESQL    │
│  • Store Data   │
│  • Retrieve     │
└────┬────────────┘
     │
     │ 5. Data
     │
     ▼
┌─────────────────┐
│     MODEL       │
│  • Format Data  │
└────┬────────────┘
     │
     │ 6. Formatted Data
     │
     ▼
┌─────────────────┐
│  CONTROLLER     │
│  • Process      │
│  • JWT Sign     │
└────┬────────────┘
     │
     │ 7. Response
     │
     ▼
┌──────────┐
│  CLIENT  │
└──────────┘
```

## JWT Token Structure

```
Header
{
  "alg": "HS256",
  "typ": "JWT"
}
        ↓
Payload
{
  "userId": 1,
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
        ↓
Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
        ↓
Final Token
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBle...
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## Database Schema Relationships

```
┌─────────────────────────┐
│       users             │
│─────────────────────────│
│ • id (PK)              │
│ • full_name            │
│ • email (UNIQUE)       │◄─────┐
│ • phone                │      │
│ • password_hash        │      │
│ • email_verified       │      │
│ • created_at           │      │
│ • updated_at           │      │
└─────────────────────────┘      │
                                 │
                                 │ Foreign Key
                                 │
┌─────────────────────────┐      │
│   refresh_tokens        │      │
│─────────────────────────│      │
│ • id (PK)              │      │
│ • user_id (FK) ────────┼──────┘
│ • token (UNIQUE)       │
│ • expires_at           │
│ • created_at           │
│ • revoked              │
└─────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│             Production Stack                  │
│                                               │
│  ┌────────────┐      ┌─────────────────┐    │
│  │  Frontend  │──────│  Static Host    │    │
│  │  (React)   │      │  (Vercel/       │    │
│  └────────────┘      │   Netlify)      │    │
│                      └─────────────────┘    │
│                               │              │
│                               │ HTTPS        │
│                               ▼              │
│  ┌────────────┐      ┌─────────────────┐    │
│  │  Backend   │──────│  Node.js Host   │    │
│  │  (Express) │      │  (Railway/      │    │
│  └────────────┘      │   Heroku)       │    │
│                      └─────────────────┘    │
│                               │              │
│                               │ PostgreSQL   │
│                               ▼              │
│  ┌────────────┐      ┌─────────────────┐    │
│  │ PostgreSQL │──────│  Database Host  │    │
│  │            │      │  (AWS RDS/      │    │
│  └────────────┘      │   Supabase)     │    │
│                      └─────────────────┘    │
└──────────────────────────────────────────────┘
```

## Performance Considerations

### Connection Pooling
```
Multiple Requests
    ↓
┌───────────────┐
│ Connection    │
│ Pool Manager  │
│ (max: 20)     │
└───────┬───────┘
        │
   ┌────┴────┬────────┬────────┐
   ▼         ▼        ▼        ▼
[Conn 1] [Conn 2] [Conn 3] [Conn N]
   │         │        │        │
   └─────────┴────────┴────────┘
              ↓
      PostgreSQL Database
```

### Caching Strategy (Future Enhancement)
```
Request
    ↓
Check Redis Cache
    │
    ├─ Hit? → Return Cached Data
    │
    └─ Miss? → Query Database
                    ↓
              Cache Result
                    ↓
              Return Data
```

---

This architecture provides:
- ✅ Security through multiple layers
- ✅ Scalability through connection pooling
- ✅ Maintainability through clear separation
- ✅ Performance through efficient queries
- ✅ Reliability through error handling
