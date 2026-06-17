# 🌟 RateHub - Full Stack Store Rating Platform

RateHub is a modern, responsive web application that allows users to discover local stores, submit ratings, and provides store owners and system administrators with powerful dashboards for managing data and monitoring performance.

Built with a strong focus on security, scalability, data integrity, and user experience.

---

## 🚀 Tech Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- Prisma ORM v7
- PostgreSQL (Supabase)
- JSON Web Tokens (JWT)
- bcrypt
- Zod

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Password hashing using bcrypt
- Role-Based Access Control (RBAC)
- Protected API routes

### 👥 User Roles

#### SYSTEM_ADMIN
- Manage all users
- Manage all stores
- View platform statistics
- Access admin dashboard

#### STORE_OWNER
- Manage assigned store
- View ratings and reviews
- Monitor average store rating
- Access owner dashboard

#### NORMAL_USER
- Browse stores
- Search and filter stores
- Submit ratings
- Update existing ratings

---

## ⭐ Store Rating System

- Rate stores from 1 to 5 stars
- Update ratings anytime
- Prevent duplicate ratings
- Real-time average rating calculation
- Optimized using Prisma Upsert operations

---

## 📊 Dashboard Features

### Admin Dashboard
- Total users count
- Total stores count
- Total ratings count
- Platform analytics

### Store Owner Dashboard
- Store information
- Average rating
- Total ratings received
- Rating insights

### User Dashboard
- Personal profile
- Rating history
- Store discovery

---

## 🔍 Search & Filtering

- Search stores by name
- Search users
- Filter results dynamically
- Fast backend querying

---

## 🛡️ Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Request Validation (Zod)
- Protected Routes
- Input Sanitization
- Role-Based Authorization
- Secure Database Access

---

## 📂 Project Structure

```text
RateHub/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   └── hooks/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛠️ Local Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/RateHub.git
cd RateHub
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory:

```env
DATABASE_URL="your_supabase_pooled_url"
DIRECT_URL="your_supabase_direct_url"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="7d"
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Seed the database:

```bash
node prisma/seed.js
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

---

## 🔐 Seeded Test Accounts

| Role | Email | Password |
|--------|--------|----------|
| Admin | admin@ratehub.com | Admin@123! |
| Store Owner | owner@store.com | Admin@123! |
| User | user@normal.com | Admin@123! |

---

## 🗄️ Database

The application uses PostgreSQL hosted on Supabase and managed through Prisma ORM.

### Main Entities

- User
- Store
- Rating

### Relationships

- One User can create multiple Ratings
- One Store can receive multiple Ratings
- One Store Owner manages one Store

---

## ⚙️ API Highlights

### Authentication
- Register User
- Login User
- JWT Verification

### Users
- Get Profile
- Update Profile
- List Users (Admin)

### Stores
- Create Store
- Update Store
- Delete Store
- Get Store Details
- Search Stores

### Ratings
- Create Rating
- Update Rating
- Get Store Ratings
- Calculate Average Ratings

---

## 📈 Future Improvements

- Review comments alongside ratings
- Email verification
- Password reset functionality
- Store image uploads
- Advanced analytics dashboard
- Notification system
- Pagination and caching
- Docker deployment support

---

## ❤️ Acknowledgements

- React.js
- Express.js
- Prisma ORM
- PostgreSQL
- Supabase
- Tailwind CSS
- Zod
- JWT

---

Developed with clean architecture, modern development practices, and a focus on delivering a secure and scalable full-stack application.