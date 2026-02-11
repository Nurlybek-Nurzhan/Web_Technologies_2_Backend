# FitClub - Full-Stack Fitness Management System (Final Project)

A production-ready full-stack fitness management application featuring MVC architecture, JWT authentication, Role-Based Access Control (RBAC), full CRUD operations for three related MongoDB collections, and a responsive frontend with integrated comments/reviews.

## Author
**Nurzhan Nurlybek**

---

## Live Demo

- **Live URL:** *https://web-technologies-2-backend.onrender.com/*

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@fitclub.com | admin123 |
| **User** | user@fitclub.com | user123 |

---

## Project Overview

FitClub is a comprehensive fitness management system where:
- **Public users** can browse programs, view workouts, and read reviews
- **Registered users** can log in and leave reviews/comments on programs
- **Admins** can perform full CRUD operations on programs, workouts, and manage all content

### Three Related Objects (Relational Integrity)

| Model | Relationship | Description |
|-------|-------------|-------------|
| **User** | -- | Stores email, hashed password, role (admin/user) |
| **Program** | `createdBy` -> User | Fitness programs with trainer, price, category |
| **Workout** | `createdBy` -> User | Workout logs with exercise, sets, reps, weight |
| **Comment** | `user` -> User, `program` -> Program | Reviews/ratings on programs |

```
User ──┬── createdBy ──> Program
       ├── createdBy ──> Workout
       └── user ──────> Comment ──── program ──> Program
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **ODM** | Mongoose |
| **Auth** | bcryptjs (password hashing), jsonwebtoken (JWT) |
| **DevTools** | Nodemon |
| **Deployment** | Render (Backend + Frontend served together) |

---

## Project Structure (MVC Pattern)

```
WEB Technologies 2/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User schema (email, password, role)
│   │   ├── Workout.js               # Workout schema (+ createdBy ref)
│   │   ├── Program.js               # Program schema (+ createdBy ref)
│   │   └── Comment.js               # Comment schema (user + program refs)
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Profile
│   │   ├── workoutController.js     # Workout CRUD
│   │   ├── programController.js     # Program CRUD
│   │   └── commentController.js     # Comment CRUD
│   ├── middleware/
│   │   ├── auth.js                  # JWT verify + Admin role check
│   │   └── errorHandler.js          # Error logging middleware
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints
│   │   ├── workouts.js              # Workout endpoints
│   │   ├── programs.js              # Program endpoints
│   │   └── comments.js              # Comment endpoints
│   ├── server.js                    # Express entry point + static files
│   ├── seed.js                      # Database seeding (relational data)
│   ├── package.json                 # Dependencies & scripts
│   └── .env.example                 # Environment variables template
│
├── frontend/
│   ├── pages/
│   │   ├── fitclub_login_page.html      # Login/Register (JWT auth flow)
│   │   ├── fitclub_admin_page.html      # Admin CRUD panel (protected)
│   │   ├── fitclub_community_page.html  # Workout logger + community
│   │   ├── fitclub_program_page.html    # Programs + reviews/comments
│   │   ├── fitclub_home_page.html       # Home page
│   │   ├── fitclub_service_page.html    # Services page
│   │   └── fitclub_about_page.html      # About page
│   ├── styles/                          # CSS files for each page
│   ├── images/                          # Logo, headers, photos
│   ├── index.html                       # Landing page
│   ├── index.js                         # Navigation & interactions
│   └── index.css                        # Landing page styles
│
├── .gitignore                           # Git ignore rules
├── postman_collection.json              # Postman API test collection
└── README.md                            # This file
```

---

## Authentication & Role-Based Access Control (RBAC)

### Security Implementation

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: 7-day expiry, sent via `Authorization: Bearer <token>`
3. **Middleware Chain**: `protect` (verify JWT) -> `admin` (check role) -> Controller
4. **Frontend Guards**: Admin page checks token + role before showing content

### Access Control Matrix

| Action | Public | User Role | Admin Role |
|--------|--------|-----------|------------|
| GET Programs/Workouts | Yes | Yes | Yes |
| GET Comments | Yes | Yes | Yes |
| POST Comment (Review) | No | Yes | Yes |
| POST/PUT/DELETE Programs | No | No | Yes |
| POST/PUT/DELETE Workouts | No | No | Yes |
| DELETE Comment (own or any) | No | Own only | Any |
| Register/Login | Yes | Yes | Yes |
| View Profile | No | Yes | Yes |

---

## API Documentation

### Base URL

- **Local:** `http://localhost:5000/api`
- **Production:** `<my-render-url>/api`

### Auth Endpoints (`/api/auth`)

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| POST | `/api/auth/register` | Register new user | Public | `{ email, password }` |
| POST | `/api/auth/login` | Login & get JWT | Public | `{ email, password }` |
| GET | `/api/auth/profile` | Get user profile | Private | -- |

### Program Endpoints (`/api/programs`)

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| GET | `/api/programs` | Get all programs | Public | -- |
| GET | `/api/programs/:id` | Get program by ID | Public | -- |
| POST | `/api/programs` | Create program | Admin | `{ name, description, category, duration, price, intensity, maxParticipants, trainer }` |
| PUT | `/api/programs/:id` | Update program | Admin | `{ ...fields to update }` |
| DELETE | `/api/programs/:id` | Delete program | Admin | -- |

### Workout Endpoints (`/api/workouts`)

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| GET | `/api/workouts` | Get all workouts | Public | -- |
| GET | `/api/workouts/:id` | Get workout by ID | Public | -- |
| POST | `/api/workouts` | Create workout | Admin | `{ name, exercise, sets, reps, category, ... }` |
| PUT | `/api/workouts/:id` | Update workout | Admin | `{ ...fields to update }` |
| DELETE | `/api/workouts/:id` | Delete workout | Admin | -- |

### Comment Endpoints (`/api/comments`)

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| GET | `/api/comments/program/:programId` | Get comments for a program | Public | -- |
| POST | `/api/comments` | Create a comment | Private | `{ text, rating, programId }` |
| PUT | `/api/comments/:id` | Update a comment | Private (author/admin) | `{ text, rating }` |
| DELETE | `/api/comments/:id` | Delete a comment | Private (author/admin) | -- |

---

## Database Schemas

### User Schema

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | String | Yes | Unique, valid email format |
| password | String | Yes | Min 6 chars, bcrypt hashed |
| role | String | No | Enum: user, admin (default: user) |

### Program Schema

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | String | Yes | Max 100 chars |
| description | String | Yes | Max 500 chars |
| category | String | Yes | Enum: strength, cardio, flexibility, group |
| duration | Number | Yes | 15-180 minutes |
| price | Number | Yes | Min 0 |
| intensity | String | Yes | Enum: Low, Moderate, High, Very High |
| maxParticipants | Number | Yes | 1-100 |
| trainer | String | Yes | Trainer name |
| features | [String] | No | Array of feature strings |
| icon | String | No | Default: ri-heart-pulse-fill |
| createdBy | ObjectId | No | Ref: User |

### Workout Schema

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | String | Yes | Max 100 chars |
| exercise | String | Yes | Max 100 chars |
| sets | Number | Yes | 1-20 |
| reps | Number | Yes | 1-100 |
| weight | Number | No | 0-500 kg |
| duration | Number | No | 0-300 min |
| category | String | Yes | Enum: Strength Training, Cardio, Flexibility, HIIT, Sports, Other |
| notes | String | No | Max 500 chars |
| userName | String | No | Default: Anonymous |
| createdBy | ObjectId | No | Ref: User |

### Comment Schema

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| text | String | Yes | Max 500 chars |
| rating | Number | No | 1-5 (default: 5) |
| user | ObjectId | Yes | Ref: User |
| program | ObjectId | Yes | Ref: Program |

---

## Installation & Setup (Local)

### Prerequisites
- Node.js (v14 or higher)
- npm
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "WEB Technologies 2"
```

### 2. Install Backend Dependencies
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
This creates:
- 2 users (admin + regular user)
- 8 sample programs (linked to admin)
- 5 sample workouts (linked to admin)
- 5 sample comments (linked to users and programs)

### 5. Start the Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Access the Application
Open `http://localhost:5000` in your browser. The frontend is served directly from the Express server.

---

## Deployment on Render

### Steps to Deploy

1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables in Render dashboard:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `JWT_EXPIRE` = 7d
   - `NODE_ENV` = production
6. Deploy and access your live URL

### Architecture for Deployment

The Express server serves both the API and the frontend static files:
- API routes: `/api/*`
- Frontend: Served from the `frontend/` directory as static files
- Single deployment service on Render

---

## Error Handling

| Status | Description | When Used |
|--------|-------------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors, missing fields |
| 401 | Unauthorized | No token or invalid token |
| 403 | Forbidden | Insufficient role permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database or server issues |

---

## Frontend Features

- **Login/Register Page**: JWT authentication with demo account buttons
- **Admin Panel**: Full CRUD for programs and workouts (admin-only access)
- **Program Page**: Browse programs with category filters, detailed modal with reviews
- **Community Page**: Workout logger with admin form, recent workouts list, leaderboard
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Modern dark UI with gradient accents
- **Toast Notifications**: Success/error feedback for all actions
- **State Management**: localStorage for JWT token and user data

---

## Postman Collection

A complete Postman collection is included at `postman_collection.json`. Import it into Postman to test all API endpoints.

The collection includes:
- Auth: Register, Login, Profile
- Programs: GET all, GET by ID, POST, PUT, DELETE
- Workouts: GET all, GET by ID, POST, PUT, DELETE
- Comments: GET by program, POST, PUT, DELETE

---

## Features Summary

- Full-Stack MVC Architecture
- JWT Authentication (Register, Login, Token verification)
- bcrypt Password Hashing (10 salt rounds)
- Role-Based Access Control (admin vs user)
- Full CRUD for Programs, Workouts, and Comments
- MongoDB Relational Integrity (ObjectId refs between User, Program, Workout, Comment)
- Responsive dark-themed frontend
- Admin panel with protected access
- Program reviews/comments system
- Express serves both API and frontend (single deployment)
- Database seeding with relational sample data
- Error handling middleware
- Toast notification system
