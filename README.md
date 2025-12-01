# Blood Bank Management System

A comprehensive blood donation management system built with **Express.js** backend and **React.js** frontend, featuring separate portals for administrators and users.

## 🩸 Features Overview

### 👤 User Portal Features (Minimal)
- **User Registration & Authentication**
  - Simple signup (no email verification)
  - JWT-based login system
  - Basic profile management
  
- **Blood Donation**
  - Schedule donation appointments
  
- **Blood Request System**  
  - Submit blood requests
  - View own request status (pending/approved/rejected)

### 👨‍💼 Admin Portal Features (Comprehensive)
- **Dashboard & Analytics**
  - Blood inventory overview
  - Donation statistics
  - User overview
  - Recent activities
  
- **User Management**
  - View all registered users/donors
  - Manage user accounts and status
  - Donor verification and approval
  - User activity tracking
  
- **Blood Inventory Management**
  - Add/Update blood stock by type
  - Track blood stock levels
  - Manage blood expiry dates
  - Blood unit allocation
  
- **Appointment Management**
  - View all donation appointments
  - Approve/Reject appointments
  - Schedule and reschedule appointments
  - Mark appointments as completed
  - Record donation details
  
- **Blood Request Management** ⭐
  - **View all blood requests** from users
  - **Accept/Reject requests** with one click
  - **Match requests** with available blood inventory
  - **Track request status** and history
  - **Priority management** for urgent requests

## 🏗️ Project Structure

### Backend Structure
```
blood-donation-management/
├── controllers/
│   ├── auth.js                 # Authentication controllers
│   ├── user.js                 # User management controllers
│   └── admin.js                # All admin operations (inventory, appointments, requests, donations)
│
├── middlewares/
│   ├── auth.js                 # JWT authentication middleware
│   ├── adminAuth.js            # Admin authorization middleware
│   ├── validation.js           # Input validation middleware
│   ├── rateLimiting.js         # Rate limiting middleware
│   └── errorHandler.js         # Global error handling
│
├── models/
│   ├── User.js                 # User model (both regular users and admins)
│   ├── Appointment.js          # Donation appointment model
│   ├── BloodRequest.js         # Blood request model
│   └── BloodInventory.js       # Blood stock model (admin managed)
│
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── user.js                 # User management routes
│   ├── admin.js                # Admin routes
│   ├── donation.js             # Donation routes
│   ├── inventory.js            # Inventory routes
│   ├── appointment.js          # Appointment routes
│   ├── request.js              # Blood request routes
│   └── staticRouter.js         # Frontend route handling
│
├── services/
│   ├── bloodMatching.js        # Blood type matching logic
│   └── requestProcessor.js     # Process blood requests
│
├── utils/
│   ├── validators.js           # Input validation helpers
│   ├── constants.js            # Application constants
│   ├── helpers.js              # Utility functions
│   └── dateUtils.js            # Date manipulation utilities
│
├── config/
│   ├── database.js             # Database configuration
│   └── app.js                  # App configuration
│
├── public/                     # React build files
├── uploads/                    # File upload directory
├── logs/                       # Application logs
├── .env                        # Environment variables
├── .gitignore
├── package.json
├── README.md
└── index.js                    # Server entry point
```

### Frontend Structure (React)
```
client/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── user/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ScheduleAppointment.jsx
│   │   │   └── BloodRequest.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── UserManagement.jsx
│   │       ├── InventoryManagement.jsx
│   │       ├── AppointmentManagement.jsx
│   │       └── RequestManagement.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── BloodDrives.jsx
│   │   └── EmergencyRequest.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useToast.js
│   │   └── useLocalStorage.js
│   │
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── ToastContext.js
│   │   └── ThemeContext.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── adminService.js
│   │   └── toastService.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components/
│   │   └── pages/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── App.js
│   ├── index.js
│   └── App.css
│
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication APIs (Simple)
```http
POST   /api/auth/signup           # User registration (no email verification)
POST   /api/auth/login            # User login
POST   /api/auth/logout           # User logout
GET    /api/auth/profile          # Get user profile
PUT    /api/auth/profile          # Update user profile
GET    /api/auth/auth-check       # Check authentication status
```

### User Management APIs (Simple)
```http
GET    /api/user/dashboard        # User dashboard (appointments + requests)
GET    /api/user/requests         # Get user's blood requests
```

### Donation Management APIs
```http
GET    /api/donations             # Get all donations (admin)
POST   /api/donations             # Record new donation
GET    /api/donations/:id         # Get donation details
PUT    /api/donations/:id         # Update donation record
DELETE /api/donations/:id         # Delete donation record
GET    /api/donations/user/:userId # Get user donations
POST   /api/donations/schedule    # Schedule donation
```

### Appointment Management APIs
```http
GET    /api/appointments          # Get all appointments
POST   /api/appointments          # Create new appointment
GET    /api/appointments/:id      # Get appointment details
PUT    /api/appointments/:id      # Update appointment
DELETE /api/appointments/:id      # Cancel appointment
GET    /api/appointments/user     # Get user appointments
GET    /api/appointments/available # Get available time slots
POST   /api/appointments/confirm  # Confirm appointment
```

### Blood Inventory APIs
```http
GET    /api/inventory             # Get blood inventory
POST   /api/inventory             # Add blood unit
PUT    /api/inventory/:id         # Update blood unit
DELETE /api/inventory/:id         # Remove blood unit
GET    /api/inventory/search      # Search available blood
GET    /api/inventory/low-stock   # Get low stock alerts
POST   /api/inventory/test-result # Update test results
GET    /api/inventory/expiring    # Get expiring blood units
```

### Blood Request APIs (Simplified)
```http
POST   /api/requests              # User creates blood request (simple form)
GET    /api/requests/user         # User views their own requests
PUT    /api/requests/:id/cancel   # User cancels their request
```

### Admin Management APIs (Comprehensive)
```http
GET    /api/admin/dashboard            # Admin dashboard statistics
GET    /api/admin/users                # Get all users
PUT    /api/admin/users/:id            # Update user status
DELETE /api/admin/users/:id            # Delete user account
GET    /api/admin/requests             # Get all blood requests ⭐
PUT    /api/admin/requests/:id/accept  # Accept blood request ⭐
PUT    /api/admin/requests/:id/reject  # Reject blood request ⭐
GET    /api/admin/appointments         # Get all appointments
PUT    /api/admin/appointments/:id     # Approve/reject appointments
POST   /api/admin/inventory            # Add blood to inventory
PUT    /api/admin/inventory/:id        # Update blood inventory
```

### Report & Analytics APIs
```http
GET    /api/reports/donations     # Donation reports
GET    /api/reports/inventory     # Inventory reports
GET    /api/reports/users         # User analytics
POST   /api/reports/generate      # Generate custom report
GET    /api/reports/export        # Export reports
```

## 🔒 Authentication & Authorization

### JWT Token Structure
```javascript
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "user|admin",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access Control
- **Public Routes**: Home, About, Contact
- **User Routes**: Dashboard, Profile, Schedule Donation, Blood Request
- **Admin Routes**: User Management, Inventory, Reports, Analytics

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  dateOfBirth: Date,
  bloodType: String,
  gender: String,
  address: Object,
  role: String (user/admin),
  isVerified: Boolean,
  isDonor: Boolean,
  lastDonationDate: Date,
  medicalHistory: Array,
  emergencyContact: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Donation Model
```javascript
{
  _id: ObjectId,
  donorId: ObjectId,
  donationDate: Date,
  bloodType: String,
  quantity: Number,
  location: String,
  staffId: ObjectId,
  testResults: Object,
  status: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Blood Inventory Model
```javascript
{
  _id: ObjectId,
  donationId: ObjectId,
  bloodType: String,
  quantity: Number,
  collectionDate: Date,
  expiryDate: Date,
  status: String,
  testResults: Object,
  location: String,
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd blood-donation-management

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL, JWT secret, etc.

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start React development server
npm start
```

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/bloodbank

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Service
SMS_API_KEY=your-sms-api-key
SMS_API_SECRET=your-sms-api-secret

# Application
NODE_ENV=development
PORT=8001
CLIENT_URL=http://localhost:3000
```

## 📱 Frontend-Backend Integration

### API Service (React)
```javascript
// services/api.js
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
  }

  // Authentication
  async login(credentials) {
    return await this.post('/api/auth/login', credentials);
  }

  async signup(userData) {
    return await this.post('/api/auth/signup', userData);
  }

  // User Operations
  async getUserProfile() {
    return await this.get('/api/auth/profile');
  }

  async updateProfile(profileData) {
    return await this.put('/api/auth/profile', profileData);
  }

  // Donations
  async getDonations() {
    return await this.get('/api/donations');
  }

  async scheduleAppointment(appointmentData) {
    return await this.post('/api/appointments', appointmentData);
  }

  // Helper methods
  async get(endpoint) {
    return await this.request('GET', endpoint);
  }

  async post(endpoint, data) {
    return await this.request('POST', endpoint, data);
  }

  async put(endpoint, data) {
    return await this.request('PUT', endpoint, data);
  }

  async delete(endpoint) {
    return await this.request('DELETE', endpoint);
  }

  async request(method, endpoint, data = null) {
    const config = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    return await response.json();
  }
}

export default new ApiService();
```

## 🔧 Key Features Implementation

### Real-time Notifications
- WebSocket integration for live updates
- Push notifications for mobile devices
- Email and SMS alerts for critical requests

### Blood Matching Algorithm
- Automatic blood type compatibility checking
- Priority-based request handling
- Cross-matching verification

### Reporting System
- Automated report generation
- Data visualization with charts
- Export functionality (PDF, Excel)

### Security Features
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- Secure password hashing

## 📈 Future Enhancements

- **Mobile App**: React Native mobile application
- **AI Integration**: Predictive analytics for blood demand
- **IoT Integration**: Smart blood storage monitoring
- **Blockchain**: Secure blood tracking and transparency
- **Telemedicine**: Remote health consultations for donors
- **Multi-language Support**: Internationalization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: React.js, UI/UX Design
- **Backend Developer**: Node.js, Express.js, MongoDB
- **DevOps Engineer**: Deployment, CI/CD, Monitoring
- **Project Manager**: Coordination, Planning, Testing

---

*Made with ❤️ for saving lives through technology*