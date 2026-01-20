# FitClub - Integrated Fitness Management System

A full-stack fitness management application with MongoDB database, RESTful API, and interactive frontend interface.

## Project Overview

FitClub is a comprehensive fitness management system that allows users to browse gym programs and log their workouts. The application features a modern dark-themed UI with full CRUD (Create, Read, Update, Delete) operations for both fitness programs and workout entries.

### Primary Object: Workout
Tracks user workout sessions with details like exercise type, sets, reps, and weight.

### Secondary Object: Program
Manages gym fitness programs with information about duration, price, trainer, and intensity.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **ODM** | Mongoose |

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── models/
│   │   ├── Workout.js         # Workout schema with validation
│   │   └── Program.js         # Program schema with validation
│   ├── routes/
│   │   ├── workouts.js        # Workout CRUD endpoints
│   │   └── programs.js        # Program CRUD endpoints
│   ├── server.js              # Express server entry point
│   ├── seed.js                # Database seeding script
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables (MongoDB URI)
│
├── frontend/
│   ├── pages/
│   │   ├── fitclub_program_page.html    # Dynamic program listing
│   │   ├── fitclub_community_page.html  # Workout logger interface
│   │   ├── fitclub_admin_page.html      # Admin CRUD panel
│   │   └── ...                          # Other static pages
│   ├── styles/
│   │   ├── fitclub_admin_page.css       # Admin page styles
│   │   └── ...                          # Other stylesheets
│   └── index.html             # Landing page
│
└── README.md
```

## Schema Design Rationale

### Why These Objects?

**Workout (Primary Object)** - The core feature of any fitness application is tracking user workouts. This object captures everything a gym member needs to log their exercise sessions and monitor progress over time.

**Program (Secondary Object)** - Gyms offer structured fitness programs. This object represents the services a gym provides, allowing members to browse and administrators to manage offerings.

### Design Decisions

#### Workout Schema Design
| Field | Why It's Needed |
|-------|-----------------|
| `name` | Identifies the workout session (e.g., "Morning Leg Day", "Back & Biceps") |
| `exercise` | Specific exercise performed - essential for tracking what was done |
| `sets` & `reps` | Standard fitness metrics - every strength workout is measured this way |
| `weight` | Tracks progression - users want to see strength improvements over time |
| `duration` | Important for cardio/HIIT workouts where time matters more than reps |
| `category` | Enables filtering and organizing workouts by type |
| `notes` | Personal observations help users remember how they felt, form tips, etc. |
| `userName` | Identifies who logged the workout (future: user authentication) |
| `timestamps` | Track when workouts were created/modified for history and analytics |

#### Program Schema Design
| Field | Why It's Needed |
|-------|-----------------|
| `name` | Program title displayed to users |
| `description` | Explains what the program offers - helps users decide |
| `category` | Groups programs (strength, cardio, flexibility, group) for filtering |
| `duration` | Session length - users need to plan their time |
| `price` | Monthly cost - essential business information |
| `intensity` | Helps users find programs matching their fitness level |
| `maxParticipants` | Capacity planning - some classes have limits |
| `trainer` | Shows who leads the program - builds trust |
| `features` | Highlights key benefits (array allows multiple selling points) |
| `icon` | Visual representation in the UI |
| `timestamps` | Track when programs were added/updated |

### Validation Strategy

- **Required fields**: Core data that must exist (name, exercise, category, etc.)
- **Min/Max values**: Realistic boundaries (sets: 1-20, reps: 1-100, weight: 0-500kg)
- **Enum constraints**: Predefined categories prevent invalid data
- **String limits**: Prevent database bloat (100-500 character limits)
- **Defaults**: Sensible fallbacks (userName: "Anonymous", weight: 0)

## Database Schema

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
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

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
| `trainer` | String | Yes | - |
| `features` | Array | No | Array of strings |
| `icon` | String | No | Default: "ri-heart-pulse-fill" |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

## API Endpoints

### Workouts API (`/api/workouts`)

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/api/workouts` | Retrieve all workouts | 200, 500 |
| `GET` | `/api/workouts/:id` | Retrieve workout by ID | 200, 404, 500 |
| `POST` | `/api/workouts` | Create new workout | 201, 400, 500 |
| `PUT` | `/api/workouts/:id` | Update workout by ID | 200, 400, 404, 500 |
| `DELETE` | `/api/workouts/:id` | Delete workout by ID | 200, 404, 500 |

### Programs API (`/api/programs`)

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/api/programs` | Retrieve all programs | 200, 500 |
| `GET` | `/api/programs/:id` | Retrieve program by ID | 200, 404, 500 |
| `POST` | `/api/programs` | Create new program | 201, 400, 500 |
| `PUT` | `/api/programs/:id` | Update program by ID | 200, 400, 404, 500 |
| `DELETE` | `/api/programs/:id` | Delete program by ID | 200, 404, 500 |

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "WEB Technologies 2"
```

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with your MongoDB connection string
# Example .env content:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fitclub
# PORT=5000
```

### 3. Seed the Database (Optional)
```bash
npm run seed
```
This will populate the database with 8 sample programs and 5 sample workouts.

### 4. Start the Server
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```
Server will run on `http://localhost:5000`

### 5. Open Frontend
Open `frontend/index.html` in your browser, or use a local server like Live Server extension in VS Code.

## Frontend Pages

| Page | Description | Database Interaction |
|------|-------------|---------------------|
| **Program Page** | Displays all fitness programs | GET (Read) |
| **Community Page** | Workout logger with form and history | POST (Create), GET (Read) |
| **Admin Page** | Full CRUD management panel | All CRUD operations |

## API Usage Examples

### Create a Workout (POST)
```json
POST /api/workouts
Content-Type: application/json

{
  "name": "Morning Leg Day",
  "exercise": "Squats",
  "sets": 4,
  "reps": 12,
  "weight": 80,
  "duration": 45,
  "category": "Strength Training",
  "notes": "Felt strong today",
  "userName": "John Doe"
}
```

### Response (201 Created)
```json
{
  "_id": "6579abc123def456789",
  "name": "Morning Leg Day",
  "exercise": "Squats",
  "sets": 4,
  "reps": 12,
  "weight": 80,
  "duration": 45,
  "category": "Strength Training",
  "notes": "Felt strong today",
  "userName": "John Doe",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Validation Error Response (400 Bad Request)
```json
{
  "message": "Validation error",
  "errors": [
    "Workout name is required",
    "Number of sets is required"
  ]
}
```

## Error Handling

The API implements comprehensive error handling:

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Validation errors, missing required fields |
| `404` | Not Found | Invalid ID or resource doesn't exist |
| `500` | Server Error | Database or server issues |

## Features

- **Responsive Design**: Mobile-friendly dark theme UI
- **Real-time Updates**: Instant UI refresh after CRUD operations
- **Form Validation**: Client-side and server-side validation
- **Loading States**: Visual feedback during API calls
- **Error Notifications**: Toast notifications for success/error messages
- **Confirmation Dialogs**: Delete confirmation modal to prevent accidents

## Author

Nurlybek Nurzhan | SE-2432