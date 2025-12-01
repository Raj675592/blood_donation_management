# Blood Donation Management System - Features & Routing Documentation

## 📋 Table of Contents
- [System Overview](#system-overview)
- [Frontend Features](#frontend-features)
- [Backend API Routes](#backend-api-routes)
- [Authentication & Authorization](#authentication--authorization)
- [Database Models](#database-models)
- [Technology Stack](#technology-stack)

## 🩸 System Overview

The Blood Donation Management System is a comprehensive web application that facilitates blood donation activities, managing donors, recipients, appointments, and blood inventory through separate user and admin interfaces.

## 🎨 Frontend Features

### 🏠 Public Pages
- **Home Page** (`/`)
  - Hero section with donation statistics
  - Call-to-action buttons
  - Information about blood donation process
  
- **About Page** (`/about`)
  - Mission and vision
  - How blood donation works
  - Contact information

### 🔐 Authentication Pages
- **Login Page** (`/login`)
  - User/Admin login with JWT tokens
  - Role-based redirection
  - Form validation
  
- **Signup Page** (`/signup`)
  - User registration
  - Blood type selection
  - Email validation

### 👤 User Dashboard (`/dashboard`)
#### Features:
- **Dashboard Overview**
  - Personal donation statistics
  - Recent blood requests status
  - Upcoming appointments
  - Last login information
  
- **Blood Request** (`/blood-request`)
  - Emergency blood request form
  - Patient information input
  - Urgency level selection
  - Hospital details
  - Real-time form validation
  
- **Schedule Appointment** (`/schedule-appointment`)
  - Donation appointment booking
  - Date and time selection
  - Location preferences
  - Personal notes
  
#### UI Components:
- Responsive glassmorphism design
- Mobile-friendly interfaces
- Toast notifications
- Loading states
- Form validations

### 🛡️ Admin Dashboard (`/admin`)
#### Features:
- **Admin Overview**
  - System-wide statistics
  - User management metrics
  - Blood request analytics
  - Inventory alerts
  
- **User Management**
  - View all registered users
  - Promote/demote user roles
  - Search and filter users
  - Delete user accounts
  - User detail modals
  
- **Blood Request Management**
  - View all blood requests
  - Accept/reject requests
  - Filter by status and urgency
  - Patient information display
  
- **Appointment Management**
  - View all scheduled appointments
  - Complete/cancel appointments
  - Reschedule appointments
  - Delete appointment records
  
- **Inventory Management**
  - Blood stock overview
  - Add/update blood units
  - Low stock alerts
  - Expiry tracking

#### UI Components:
- Blood-themed color scheme
- Responsive data tables
- Mobile hamburger menu
- Status badges
- Action buttons
- Modal dialogs

### 📱 Responsive Design
- **Mobile First Approach**
- **Breakpoints:**
  - 320px: Extra small mobile
  - 480px: Mobile
  - 768px: Tablet
  - 1024px: Desktop
- **Features:**
  - Horizontal scrolling tables
  - Collapsible navigation
  - Touch-friendly buttons
  - Optimized typography

## 🔧 Backend API Routes

### 🔐 Authentication Routes (`/api/auth`)
```javascript
POST   /api/auth/signup           // User registration
POST   /api/auth/login            // User/Admin login
GET    /api/auth/verify-token     // Token validation
```

### 👤 User Routes (`/api/users`)
```javascript
GET    /api/users/dashboard       // Get user dashboard data
POST   /api/users/blood-request   // Create blood request
POST   /api/users/schedule-appointment // Schedule appointment
GET    /api/users/profile         // Get user profile
PUT    /api/users/profile         // Update user profile
```

### 🛡️ Admin Routes (`/api/admin`)
```javascript
GET    /api/admin/dashboard       // Get admin dashboard
GET    /api/admin/users           // Get all users
GET    /api/admin/users/:id       // Get specific user
POST   /api/admin/promote/:id     // Promote user to admin
POST   /api/admin/demote/:id      // Demote admin to user
DELETE /api/admin/users/:id       // Delete user account
```

### 🩸 Blood Request Routes (`/api/blood-requests`)
```javascript
GET    /api/blood-requests        // Get all blood requests (Admin)
POST   /api/blood-requests/:id/accept  // Accept blood request
POST   /api/blood-requests/:id/reject  // Reject blood request
```

### 📅 Appointment Routes (`/api/appointments`)
```javascript
GET    /api/appointments          // Get all appointments (Admin)
PUT    /api/appointments/:id/cancel    // Cancel appointment
PUT    /api/appointments/:id/complete  // Mark as completed
PUT    /api/appointments/:id/reschedule // Reschedule appointment
DELETE /api/appointments/:id      // Delete appointment
```

### 🏥 Inventory Routes (`/api/inventory`)
```javascript
GET    /api/inventory             // Get blood inventory
POST   /api/inventory             // Add blood unit
PUT    /api/inventory/:id         // Update blood unit
DELETE /api/inventory/:id         // Remove blood unit
GET    /api/inventory/low-stock   // Get low stock alerts
```

## 🔒 Authentication & Authorization

### JWT Token System
- **Access Tokens**: Short-lived tokens for API access
- **Refresh Tokens**: Long-lived tokens for token renewal
- **Role-based Access**: User vs Admin permissions

### Middleware Protection
- **checkAuth**: Validates JWT tokens
- **adminOnly**: Restricts access to admin routes
- **userOnly**: Restricts access to user routes

### Protected Routes
- All `/api/admin/*` routes require admin role
- All `/api/users/*` routes require user authentication
- Public routes: auth, home, about pages

## 💾 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  bloodType: String,
  phone: String,
  role: Enum ['user', 'admin'],
  createdAt: Date,
  updatedAt: Date
}
```

### Blood Request Model
```javascript
{
  userId: ObjectId (ref: User),
  patientName: String (required),
  bloodType: String (required),
  unitsNeeded: Number (required),
  hospitalName: String (required),
  urgencyLevel: String (required),
  contactNumber: String (required),
  status: Enum ['pending', 'accepted', 'rejected'],
  additionalNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String (required),
  DOB: Date (required),
  appointmentDate: Date (required),
  timeSlot: String (required),
  location: String (required),
  status: Enum ['scheduled', 'completed', 'cancelled'],
  notes: String,
  bloodType: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Blood Inventory Model
```javascript
{
  bloodType: String (required),
  unitsAvailable: Number (required),
  expiryDate: Date,
  location: String,
  donorId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Technology Stack

### Frontend
- **React.js**: UI framework
- **React Router**: Client-side routing
- **Context API**: State management
- **CSS3**: Custom styling with responsive design
- **Fetch API**: HTTP requests

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **CORS**: Cross-origin requests

### Development Tools
- **nodemon**: Auto-restart server
- **dotenv**: Environment variables
- **morgan**: HTTP request logging

## 🔄 Application Flow

### User Journey
1. **Registration** → User creates account
2. **Login** → JWT token issued
3. **Dashboard** → View personal statistics
4. **Actions** → Request blood or schedule appointment
5. **Tracking** → Monitor request/appointment status

### Admin Journey
1. **Admin Login** → Access admin dashboard
2. **Management** → Handle users, requests, appointments
3. **Inventory** → Manage blood stock
4. **Analytics** → Monitor system statistics

## 🎯 Key Features Summary

### User Features ✅
- Account registration and management
- Blood request submission
- Appointment scheduling
- Personal dashboard with statistics
- Mobile-responsive interface

### Admin Features ✅
- Complete user management
- Blood request approval system
- Appointment management
- Blood inventory tracking
- System analytics and reporting
- Mobile-responsive admin interface

### Security Features ✅
- JWT-based authentication
- Role-based authorization
- Password hashing
- Input validation
- Protected API routes

### UI/UX Features ✅
- Responsive design for all devices
- Toast notifications
- Loading states
- Form validations
- Mobile hamburger menu
- Blood-themed design elements