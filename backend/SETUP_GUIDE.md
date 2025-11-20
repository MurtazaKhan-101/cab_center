# Cab Center Backend - Complete Setup Guide

## 🎯 Project Overview
Complete booking management system for a cab center with drivers, vehicles, and booking management.

## ✅ What's Been Implemented

### 📊 Database Models
1. **User** - Authentication and user management
2. **Booking** - Customer booking requests with all details
3. **Driver** - Driver information and assignment
4. **Vehicle** - Vehicle fleet management
5. **Settings** - Rush hours and fare configuration

### 🎮 Controllers
1. **Auth Controller** - User registration, login, OTP verification, password reset
2. **Google Auth Controller** - OAuth integration
3. **Booking Controller** - Complete booking lifecycle management
4. **Driver Controller** - Full CRUD for drivers
5. **Vehicle Controller** - Full CRUD for vehicles
6. **Settings Controller** - System settings and rush hours

### 🛣️ Routes
All routes are configured and protected with authentication/authorization:
- `/auth/*` - Authentication endpoints
- `/api/bookings/*` - Booking management
- `/api/drivers/*` - Driver management (Admin only)
- `/api/vehicles/*` - Vehicle management (Admin only)
- `/api/settings/*` - Settings management

### 🌟 Key Features

#### For Users:
- ✅ Create bookings with all necessary information
- ✅ View their own bookings
- ✅ Cancel pending bookings
- ✅ Automatic fare calculation based on distance and rush hours
- ✅ Email notifications for booking approval/rejection

#### For Admins:
- ✅ View all bookings with filters (status, date, vehicle type)
- ✅ Approve bookings by assigning driver-vehicle pairs
- ✅ Reject bookings with reason
- ✅ Complete bookings
- ✅ Download PDF receipts for approved bookings
- ✅ Full CRUD operations for drivers
- ✅ Full CRUD operations for vehicles
- ✅ Manage rush hours and fare settings
- ✅ Track driver attendance
- ✅ View available drivers and vehicles

#### Automated Features:
- ✅ Fare calculation with rush hour multipliers
- ✅ Automatic status updates for drivers and vehicles
- ✅ Email notifications for approvals/rejections
- ✅ PDF receipt generation
- ✅ Driver-vehicle assignment management

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Already configured in `.env`:
- MongoDB connection
- Email configuration
- JWT secret
- Google OAuth credentials
- Port and client URL

### 3. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:3003`

### 4. Create Admin User
1. Register a new user via `/auth/register`
2. Verify the email via `/auth/verify-otp`
3. Manually update the user's role in MongoDB to "admin"
4. Now the user has admin privileges

## 📚 API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md`

## 🗂️ Project Structure

```
backend/
├── config/
│   ├── dbconnect.js          # MongoDB connection
│   └── email.js              # Email service (OTP, booking emails)
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── googleAuthController.js # Google OAuth
│   ├── bookingController.js  # Booking management
│   ├── driverController.js   # Driver CRUD
│   ├── vehicleController.js  # Vehicle CRUD
│   └── settingsController.js # Settings management
├── middleware/
│   └── auth.js               # JWT authentication & authorization
├── models/
│   ├── User.js               # User schema
│   ├── Booking.js            # Booking schema
│   ├── Driver.js             # Driver schema
│   ├── Vehicle.js            # Vehicle schema
│   └── Settings.js           # Settings schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── googleAuthRoutes.js   # Google OAuth endpoints
│   ├── bookingRoutes.js      # Booking endpoints
│   ├── driverRoutes.js       # Driver endpoints
│   ├── vehicleRoutes.js      # Vehicle endpoints
│   └── settingsRoutes.js     # Settings endpoints
├── .env                      # Environment variables
├── server.js                 # Main server file
├── package.json              # Dependencies
└── API_DOCUMENTATION.md      # Complete API docs
```

## 🔐 Security Features
- JWT-based authentication
- Role-based authorization (user/admin)
- Password hashing with bcrypt
- HTTP-only cookies for refresh tokens
- Token rotation
- Email verification

## 📧 Email Features
- OTP verification emails
- Password reset emails
- Booking approval emails
- Booking rejection emails

## 📄 PDF Receipt
- Generated for approved bookings
- Contains complete booking details
- Driver and vehicle information
- Fare breakdown

## 💰 Fare Calculation System
```javascript
Total Fare = Base Fare + (Distance × Fare Per KM × Rush Hour Multiplier)
```

- Base fare: Configurable (default: 50 PKR)
- Fare per KM: Set per vehicle type
- Rush hour multiplier: Configurable time slots with custom multipliers

## 🎯 Typical Workflow

### User Journey:
1. User registers and verifies email
2. User creates a booking
3. Booking is pending, waiting for admin
4. User receives email when approved/rejected
5. User can view booking status

### Admin Journey:
1. Admin logs in
2. Views pending bookings
3. Checks available vehicles and drivers
4. Approves booking by assigning driver-vehicle pair
5. System sends approval email to user
6. Admin can download receipt PDF
7. After ride, admin marks booking as complete
8. Vehicle and driver become available again

## 🛠️ Management Features

### Driver Management:
- Add/edit/delete drivers
- Assign vehicles to drivers
- Track total rides
- Update monthly attendance
- Set monthly salary
- Manage availability status

### Vehicle Management:
- Add/edit/delete vehicles
- Set fare per kilometer
- Assign drivers to vehicles
- Track availability status
- Set capacity
- Manage maintenance status

### Settings Management:
- Configure base fare
- Add/edit/delete rush hours
- Set rush hour multipliers
- Configure currency

## 📊 Dashboard Data Available

### Bookings:
- Filter by status, date, vehicle type
- Total bookings count
- Status-wise breakdown

### Drivers:
- Available drivers count
- Total rides per driver
- Monthly attendance tracking

### Vehicles:
- Available vehicles by type
- Vehicle utilization

## 🔄 Status Management

### Booking Status Flow:
```
pending → approved → completed
    ↓
  rejected
    ↓
  cancelled
```

### Vehicle Status:
- available
- in-use (during ride)
- maintenance

### Driver Status:
- available
- on-ride (during booking)
- off-duty

## 📱 Testing the API

Use Postman or Thunder Client:

1. Register and login to get token
2. Test user endpoints (create booking, view bookings)
3. Set user role to admin in database
4. Test admin endpoints (approve/reject bookings, manage drivers/vehicles)
5. Test PDF download
6. Test rush hour fare calculation

## 🎨 Next Steps for Frontend

1. User dashboard for creating bookings
2. Admin dashboard for managing:
   - Pending bookings
   - Drivers and vehicles
   - Settings and rush hours
3. Booking history views
4. Driver and vehicle availability calendar
5. Analytics and reports

## 📝 Notes

- All required dependencies are installed
- Server is ready to run
- MongoDB is connected
- Email service is configured
- JWT authentication is working
- All CRUD operations are implemented
- PDF generation is working
- Rush hour calculation is implemented

## ✨ You're All Set!

Your backend is complete and ready to use. All the requirements from your context file have been implemented:

✅ Booking management with all fields
✅ Driver CRUD with all fields
✅ Vehicle CRUD with all fields
✅ Admin can approve/reject bookings
✅ PDF receipt generation
✅ Email notifications
✅ Rush hour fare calculation
✅ Driver-vehicle assignment
✅ Availability tracking

Start the server and begin testing! 🚀
