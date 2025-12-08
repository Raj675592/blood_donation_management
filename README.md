# 🩸 Blood Donation Management System

A modern, full-stack blood donation management platform built with **React.js** and **Node.js/Express.js**. Features a beautiful, responsive UI with separate portals for users and administrators to streamline blood donation processes.

## 🌟 Live Demo
🔗 **GitHub Repository**: https://blood-donation-frontend-cnw5ksfaf-raj675592s-projects.vercel.app/

## 🚀 Tech Stack

### Frontend
- **React.js** - Modern UI library
- **React Router** - Client-side routing
- **Custom CSS** - Responsive design with glassmorphism effects
- **Context API** - State management
- **Toast Notifications** - User feedback system

### Backend  
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication system
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service for password reset
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Git** - Version control
- **npm** - Package management
- **Environment Variables** - Configuration management

## ✨ Features Overview

### 👤 User Portal Features (Minimal)
- **User Registration & Authentication**
  - Simple signup (no email verification)
  - JWT-based login system
  - Basic profile management
  - **Forgot Password** - Email-based password reset with secure token
  
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

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Raj675592/blood_donation_management.git
cd blood_donation_management
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Set up environment variables**
```bash
# Create .env file in root directory
echo "MONGODB_URI=mongodb://localhost:27017/bloodbank" > .env
echo "JWT_SECRET=your_jwt_secret_here" >> .env
echo "PORT=8001" >> .env
```

5. **Run the application**

**Development Mode:**
```bash
# Terminal 1 - Backend (Port 8001)
npm start

# Terminal 2 - Frontend (Port 3000)
cd client
npm start
```

**Production Mode:**
```bash
# Build frontend
cd client
npm run build

# Serve production build
npm install -g serve
serve -s build -l 3000
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001

## 🏗️ Project Structure

### Backend Structure
```
blood-donation-management/
├── controllers/
│   ├── auth.js                 # Authentication (login/signup)
│   ├── user.js                 # User operations
│   └── admin.js                # Admin operations (inventory, appointments, requests)
│
├── middlewares/
│   └── auth.js                 # JWT authentication middleware
│
├── models/
│   ├── user.js                 # User model (includes role: user/admin)
│   ├── Appointment.js          # Donation appointment model
│   ├── BloodRequest.js         # Blood request model
│   └── BloodInventory.js       # Blood stock management model
│
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── user.js                 # User routes
│   ├── admin.js                # Admin routes
│   ├── appointments.js         # Appointment management
│   ├── bloodRequests.js        # Blood request handling
│   ├── inventory.js            # Blood inventory routes
│   └── staticRouter.js         # Static file serving
│
├── service/
│   └── auth.js                 # Authentication services
│
├── connect.js                  # MongoDB connection
├── index.js                    # Main server file
└── package.json                # Backend dependencies
```

### Frontend Structure
```
client/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── admin/              # Admin components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AppointmentManagement.jsx
│   │   │   ├── InventoryManagement.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── auth/               # Authentication components
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── user/               # User components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BloodRequest.jsx
│   │   │   └── ScheduleAppointment.jsx
│   │   └── common/             # Shared components
│   │       └── Toast.jsx
│   ├── css/                    # Styling files
│   ├── pages/                  # Page components
│   ├── contexts/               # React contexts
│   ├── services/               # API services
│   └── App.js                  # Main app component
└── package.json                # Frontend dependencies
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with glassmorphism effects
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark Theme**: Elegant dark color scheme with red accents
- **Interactive Elements**: Smooth animations and hover effects
- **Toast Notifications**: Real-time feedback for user actions
- **Form Validation**: Client-side and server-side validation
- **Loading States**: Visual feedback during async operations

## 📱 Screenshots & Demo

### User Dashboard
- Clean, modern interface showing donation history
- Quick access to schedule appointments and request blood
- Personal statistics and impact tracking

### Admin Dashboard  
- Comprehensive overview of blood inventory
- Real-time statistics and charts
- Quick access to all management functions

### Responsive Design
- Mobile-optimized layouts
- Touch-friendly interface elements
- Consistent experience across devices

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Role-Based Access**: Separate permissions for users and admins
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive validation on all inputs
- **Environment Variables**: Sensitive data stored securely
## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/requestPasswordReset` - Request password reset (sends email)
- `POST /api/auth/resetPassword` - Reset password with token

### User Operations
- `GET /api/user/profile` - Get user profile
- `POST /api/user/blood-request` - Submit blood request
- `POST /api/user/appointment` - Schedule appointment

### Admin Operations
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/inventory` - Blood inventory management
- `GET /api/admin/appointments` - Appointment management
- `GET /api/admin/requests` - Blood request management

## 🔐 Forgot Password Feature
### Environment Variables
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/bloodbank
JWT_SECRET=your_super_secret_jwt_key_here
PORT=8001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
### How It Works
1. User enters email on forgot password page
2. System generates secure JWT token (expires in 1 hour)
3. Email sent with reset link to user's inbox
4. User clicks link and enters new password
5. Password updated and all old tokens invalidated

### Email Configuration
Required environment variables in `.env`:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**Note**: Use Gmail App Password (not regular password). Generate at: https://myaccount.google.com/apppasswordsnt
- `GET /api/admin/requests` - Blood request management

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/bloodbank
JWT_SECRET=your_super_secret_jwt_key_here
PORT=8001
NODE_ENV=development
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

## 📊 Database Schema

The application uses MongoDB with the following collections:

- **users**: User accounts (includes role: 'user' or 'admin')
- **appointments**: Blood donation appointments  
- **bloodrequests**: Blood requests from users
- **bloodinventories**: Blood stock management

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Future Enhancements

- [ ] **Mobile App**: React Native mobile application
- [ ] **SMS Notifications**: Twilio integration for appointment reminders
- [ ] **Email Verification**: Complete email verification system
- [ ] **Payment Gateway**: Online donation and fee processing
- [ ] **Real-time Chat**: Support chat system
- [ ] **Advanced Analytics**: Charts and reporting dashboard
- [ ] **Multi-language**: Internationalization support
- [ ] **Blood Drive Events**: Event management system
- [ ] **Geolocation**: Location-based blood bank finder

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Developer**: Raj675592  
**GitHub**: [https://github.com/Raj675592](https://github.com/Raj675592)  
**Repository**: [https://github.com/Raj675592/blood_donation_management](https://github.com/Raj675592/blood_donation_management)

## 🙏 Acknowledgments

- Thanks to all blood donors who save lives every day 🩸
- Built with modern web technologies for better user experience
- Designed to make blood donation process more efficient and accessible
- Special thanks to the open-source community

---

⭐ **If you found this project helpful, please give it a star!** ⭐

*Made with ❤️ for saving lives*
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



---

*Made with ❤️ for saving lives through technology*
