# FitClub - Integrated Fitness Management System (Assignment 4)

A full-stack fitness management application featuring MVC architecture, JWT authentication, Role-Based Access Control (RBAC), and full CRUD operations for two related objects.

## Author

Nurlybek Nurzhan | SE-2432

---

## Project Overview

FitClub is a comprehensive fitness management system that allows users to browse gym programs and log their workouts. Assignment 4 builds upon Assignment 3 by introducing:

- **MVC Architecture** - Clean separation into Models, Routes, Controllers, and Middleware
- **User Authentication** - Registration and Login with JWT tokens
- **Password Hashing** - bcrypt for secure password storage
- **Role-Based Access Control (RBAC)** - Admin vs User roles restricting POST/PUT/DELETE

### Two Related Objects

**Primary Object: Workout** - Tracks user workout sessions with details like exercise type, sets, reps, weight, and category.

**Secondary Object: Program** - Manages gym fitness programs with information about duration, price, trainer, intensity, and features.

**Relationship:** Both objects exist within the FitClub fitness domain. Programs represent what the gym offers; Workouts represent what members actually do. Admins manage both through a protected admin panel.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla + jQuery) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **ODM** | Mongoose |
| **Auth** | bcryptjs (password hashing), jsonwebtoken (JWT) |
| **DevTools** | Nodemon |

---

## Project Structure (MVC Pattern)

```
backend/
├── config/
│   ├── db.js                    # MongoDB connection configuration
│   └── constants.js             # Database name constant
├── models/
│   ├── User.js                  # User schema (email, password, role)
│   ├── Workout.js               # Workout schema with validation
│   └── Program.js               # Program schema with validation
├── controllers/
│   ├── authController.js        # Auth logic (register, login, profile)
│   ├── workoutController.js     # Workout CRUD logic
│   └── programController.js     # Program CRUD logic
├── middleware/
│   ├── auth.js                  # JWT verification + Admin role check
│   └── errorHandler.js          # Error logging middleware
├── routes/
│   ├── auth.js                  # Auth endpoints (register, login, profile)
│   ├── workouts.js              # Workout endpoints with middleware
│   └── programs.js              # Program endpoints with middleware
├── server.js                    # Express server entry point
├── seed.js                      # Database seeding (users + data)
├── package.json                 # Dependencies
└── .env                         # Environment variables

frontend/
├── pages/
│   ├── fitclub_login_page.html      # Login/Register page
│   ├── fitclub_admin_page.html      # Admin CRUD panel (protected)
│   ├── fitclub_community_page.html  # Workout logger (admin-only form)
│   ├── fitclub_program_page.html    # Programs listing (public)
│   ├── fitclub_home_page.html       # Home page
│   ├── fitclub_service_page.html    # Services page
│   └── fitclub_about_page.html      # About page
├── styles/
│   ├── main.css                     # Global styles
│   ├── fitclub_login_page.css       # Login page styles
│   ├── fitclub_admin_page.css       # Admin page styles
│   ├── fitclub_community_page.css   # Community page styles
│   └── ...                          # Other page styles
├── images/
│   └── ...                          # Logo, headers, etc.
├── index.html                       # Landing page
├── index.js                         # Navigation & interaction
└── index.css                        # Landing page styles
```

---

## Authentication & Role-Based Access Control

### User Model

| Field | Type | Details |
|-------|------|---------|
| `email` | String | Required, unique, validated format |
| `password` | String | Required, min 6 chars, bcrypt hashed |
| `role` | String | "user" or "admin" (default: "user") |

### How Roles Work

| Action | Public (No Auth) | User Role | Admin Role |
|--------|-----------------|-----------|------------|
| **GET** Programs | Yes | Yes | Yes |
| **GET** Workouts | Yes | Yes | Yes |
| **POST** Programs/Workouts | No (401) | No (403) | Yes |
| **PUT** Programs/Workouts | No (401) | No (403) | Yes |
| **DELETE** Programs/Workouts | No (401) | No (403) | Yes |
| Register/Login | Yes | Yes | Yes |
| View Profile | No (401) | Yes | Yes |

### Security Implementation

1. **Password Hashing**: bcrypt with salt rounds (10) - passwords are never stored as plain text
2. **JWT Tokens**: Generated on login/register, expire after 7 days, sent via `Authorization: Bearer <token>` header
3. **Middleware Chain**: `protect` (verifies JWT) -> `admin` (checks role === "admin") -> Controller
4. **Frontend Guards**: Admin page checks token + role before showing content; redirects to login if unauthorized

### Demo Accounts (Seeded)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@fitclub.com | admin123 |
| **User** | user@fitclub.com | user123 |

---

## Database Schemas

### Workout Schema

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | String | Yes | Max 100 characters |
| `exercise` | String | Yes | Max 100 characters |
| `sets` | Number | Yes | Min: 1, Max: 20 |
| `reps` | Number | Yes | Min: 1, Max: 100 |
| `weight` | Number | No | Min: 0, Max: 500 kg |
| `duration` | Number | No | Min: 0, Max: 300 min |
| `category` | String | Yes | Enum: Strength Training, Cardio, Flexibility, HIIT, Sports, Other |
| `notes` | String | No | Max 500 characters |
| `userName` | String | No | Default: "Anonymous" |
| `timestamps` | Date | Auto | createdAt, updatedAt |

### Program Schema

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | String | Yes | Max 100 characters |
| `description` | String | Yes | Max 500 characters |
| `category` | String | Yes | Enum: strength, cardio, flexibility, group |
| `duration` | Number | Yes | Min: 15, Max: 180 minutes |
| `price` | Number | Yes | Min: 0 |
| `intensity` | String | Yes | Enum: Low, Moderate, High, Very High |
| `maxParticipants` | Number | Yes | Min: 1, Max: 100 |
| `trainer` | String | Yes | Trainer name |
| `features` | Array | No | Array of strings |
| `icon` | String | No | Default: "ri-heart-pulse-fill" |
| `timestamps` | Date | Auto | createdAt, updatedAt |

---

## API Endpoints

### Auth API (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login & get JWT token | Public |
| `GET` | `/api/auth/profile` | Get current user profile | Private |

### Workouts API (`/api/workouts`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/workouts` | Get all workouts | Public |
| `GET` | `/api/workouts/:id` | Get workout by ID | Public |
| `POST` | `/api/workouts` | Create new workout | Admin only |
| `PUT` | `/api/workouts/:id` | Update workout | Admin only |
| `DELETE` | `/api/workouts/:id` | Delete workout | Admin only |

### Programs API (`/api/programs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/programs` | Get all programs | Public |
| `GET` | `/api/programs/:id` | Get program by ID | Public |
| `POST` | `/api/programs` | Create new program | Admin only |
| `PUT` | `/api/programs/:id` | Update program | Admin only |
| `DELETE` | `/api/programs/:id` | Delete program | Admin only |

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "WEB Technologies 2"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend/` folder:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=YourApp
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 4. Seed the Database
```bash
npm run seed
```
This will create:
- 2 users (admin + regular user)
- 8 sample programs
- 5 sample workouts

### 5. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```
Server runs on `http://localhost:5000`

### 6. Open Frontend
Open `frontend/index.html` in your browser or use VS Code Live Server extension.

---

## Error Handling

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Validation errors, missing fields |
| `401` | Unauthorized | No token or invalid token |
| `403` | Forbidden | User role lacks permission (RBAC) |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Database or server issues |

---

## Architectural Decisions

### Why MVC?
- **Separation of Concerns**: Models handle data, Controllers handle logic, Routes handle endpoint definitions
- **Testability**: Each layer can be tested independently
- **Scalability**: New features can be added without modifying existing code
- **Industry Standard**: Follows Express.js best practices

### Why JWT over Sessions?
- **Stateless**: No server-side session storage needed
- **Scalable**: Works across multiple servers
- **Frontend-friendly**: Easy to store in localStorage and send with fetch headers

### Why bcrypt for Password Hashing?
- **Industry standard** for password security
- **Salt rounds** prevent rainbow table attacks
- **Timing-safe comparison** prevents timing attacks

### Why Separate Middleware?
- `protect` middleware verifies the JWT token and attaches `req.user`
- `admin` middleware checks if `req.user.role === 'admin'`
- This chain allows flexible route protection (some routes need auth only, some need admin)

---

## Features Summary

- MVC Architecture (Models, Views, Controllers)
- JWT Authentication (Register, Login, Token verification)
- bcrypt Password Hashing (salt rounds: 10)
- Role-Based Access Control (admin vs user)
- Full CRUD for Programs and Workouts
- Protected POST/PUT/DELETE routes (admin only)
- Public GET routes (open to everyone)
- Admin panel with access control
- Login/Register page with demo accounts
- Error handling middleware with logging
- Responsive dark-themed UI
- Toast notifications for feedback
- Database seeding with sample data + users
