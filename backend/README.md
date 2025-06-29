# Financial Analytics Dashboard - Backend API

A production-ready backend API for a Financial Analytics Dashboard built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **Authentication**: JWT-based authentication with secure token management
- **Dashboard Analytics**: Real-time financial statistics and chart data
- **Transaction Management**: Full CRUD operations with advanced filtering, sorting, and pagination
- **Data Export**: CSV and JSON export functionality
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: MongoDB with Mongoose ODM
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcryptjs, express-rate-limit
- **Validation**: express-validator
- **Export**: json2csv, csv-writer

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── db.ts        # Database connection
│   │   └── env.ts       # Environment variables
│   ├── controllers/     # Route handlers
│   │   ├── authController.ts
│   │   ├── dashboardController.ts
│   │   └── transactionController.ts
│   ├── middleware/      # Custom middleware
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── models/          # Mongoose models
│   │   ├── User.ts
│   │   └── Transaction.ts
│   ├── routes/          # Route definitions
│   │   ├── authRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   └── transactionRoutes.ts
│   ├── services/        # Business logic
│   │   ├── authService.ts
│   │   ├── csvService.ts
│   │   ├── dashboardService.ts
│   │   └── transactionService.ts
│   ├── types/           # TypeScript interfaces
│   │   ├── Transaction.ts
│   │   └── User.ts
│   ├── utils/           # Utility functions
│   │   └── generateToken.ts
│   ├── scripts/         # Database scripts
│   │   └── seedData.ts
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and setup the project**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/financial_analytics
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=2h
   FRONTEND_URL=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login with email and password.

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

### Dashboard Endpoints

#### GET `/api/dashboard/summary`
Get dashboard statistics (requires authentication).

**Response**:
```json
{
  "success": true,
  "data": {
    "totalBalance": 125420.50,
    "monthlyIncome": 8500.00,
    "monthlyExpenses": 3200.00,
    "transactionCount": 247,
    "monthlyGrowth": 5.2,
    "categoryBreakdown": [...],
    "recentTransactions": [...]
  }
}
```

#### GET `/api/dashboard/chart-data`
Get chart data for dashboard (requires authentication).

### Transaction Endpoints

#### GET `/api/transactions`
Get paginated transactions with filtering and sorting (requires authentication).

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: 'date')
- `sortOrder`: Sort direction ('asc' or 'desc', default: 'desc')
- `search`: Search term
- `category`: Filter by category
- `type`: Filter by type ('income' or 'expense')
- `status`: Filter by status ('pending', 'completed', 'failed')
- `dateFrom`: Start date filter
- `dateTo`: End date filter
- `minAmount`: Minimum amount filter
- `maxAmount`: Maximum amount filter

#### POST `/api/transactions`
Create a new transaction (requires authentication).

**Request Body**:
```json
{
  "date": "2024-01-15",
  "description": "Grocery Shopping",
  "category": "Food & Dining",
  "amount": -150.50,
  "type": "expense",
  "status": "completed",
  "account": "Checking Account",
  "notes": "Weekly groceries"
}
```

#### PUT `/api/transactions/:id`
Update a transaction (requires authentication).

#### DELETE `/api/transactions/:id`
Delete a transaction (requires authentication).

#### POST `/api/transactions/export`
Export transactions to CSV or JSON (requires authentication).

**Request Body**:
```json
{
  "format": "csv",
  "selectedIds": ["id1", "id2"],
  "fields": ["date", "description", "amount"],
  "category": "Food & Dining",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-01-31"
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for frontend integration
- **Helmet**: Security headers
- **Input Validation**: express-validator for request validation
- **Error Handling**: Comprehensive error handling middleware

## 🗄️ Database Schema

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  firstName: string (required)
  lastName: string (required)
  role: 'admin' | 'user' (default: 'user')
  isActive: boolean (default: true)
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}
```

### Transaction Model
```typescript
{
  userId: string (required, indexed)
  date: Date (required, indexed)
  description: string (required)
  category: string (required, indexed)
  amount: number (required, non-zero)
  type: 'income' | 'expense' (required, indexed)
  status: 'pending' | 'completed' | 'failed' (default: 'completed')
  account: string (required)
  tags: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}
```

## 🧪 Demo Data

The seed script creates:
- 3 demo users (including admin@example.com)
- 150-300 sample transactions per user
- Realistic financial data across 12 months

**Demo Login Credentials**:
- Email: `admin@example.com`
- Password: `password123`

## 📝 Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server
- `npm run seed`: Seed database with demo data
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues

## 🚀 Production Deployment

1. **Environment Variables**: Update all environment variables for production
2. **Database**: Use MongoDB Atlas or similar cloud database
3. **Security**: 
   - Change JWT_SECRET to a strong, random value
   - Enable MongoDB authentication
   - Use HTTPS in production
4. **Monitoring**: Add logging and monitoring solutions
5. **Process Management**: Use PM2 or similar for process management

## 🤝 Frontend Integration

This backend is designed to work seamlessly with the React + TypeScript frontend. The API responses match the expected data structures in the frontend application.

**CORS Configuration**: The backend is configured to accept requests from `http://localhost:3000` by default. Update `FRONTEND_URL` in your environment variables for production.

## 📄 License

MIT License - see LICENSE file for details.