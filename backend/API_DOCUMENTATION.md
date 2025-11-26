# Cab Center Backend API Documentation

## Base URL

```
http://localhost:3003
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Booking Endpoints

### User Endpoints

#### Create Booking

```http
POST /api/bookings
Headers: Authorization: Bearer <token>
Body: {
  "user_name": "John Doe",
  "contact_number": "03001234567",
  "email": "john@example.com",
  "no_of_passengers": 3,
  "special_requirements": "Need child seat",
  "pickup": "Karachi Airport",
  "drop": "Clifton Beach",
  "distance_km": 15,
  "vehicle_type": "sedan",
  "date": "2025-11-25",
  "time": "14:30"
}
```

#### Get My Bookings

```http
GET /api/bookings/my-bookings
Headers: Authorization: Bearer <token>
```

#### Cancel Booking

```http
PATCH /api/bookings/:id/cancel
Headers: Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Bookings

```http
GET /api/bookings
Headers: Authorization: Bearer <admin_token>
Query Params: ?status=pending&date=2025-11-25&vehicle_type=sedan
```

#### Get Booking by ID

```http
GET /api/bookings/:id
Headers: Authorization: Bearer <token>
```

#### Approve Booking

```http
PATCH /api/bookings/:id/approve
Headers: Authorization: Bearer <admin_token>
Body: {
  "vehicle_id": "vehicle_mongodb_id",
  "driver_id": "driver_mongodb_id"
}
```

#### Reject Booking

```http
PATCH /api/bookings/:id/reject
Headers: Authorization: Bearer <admin_token>
Body: {
  "rejection_reason": "No vehicles available at this time"
}
```

#### Complete Booking

```http
PATCH /api/bookings/:id/complete
Headers: Authorization: Bearer <admin_token>
```

#### Update Booking

```http
PATCH /api/bookings/:id
Headers: Authorization: Bearer <admin_token>
Body: {
  "distance_km": 20,
  "time": "15:00"
}
```

#### Delete Booking

```http
DELETE /api/bookings/:id
Headers: Authorization: Bearer <admin_token>
```

#### Download Receipt PDF

```http
GET /api/bookings/:id/receipt
Headers: Authorization: Bearer <admin_token>
Response: PDF file download
```

---

## 🚗 Vehicle Endpoints

### Public Endpoints

#### Get Vehicle Types

```http
GET /api/vehicles/types
Response: {
  "success": true,
  "vehicleTypes": [
    {
      "vehicle_type": "sedan",
      "fare_per_km": 50,
      "capacity": 4,
      "available_count": 5
    }
  ]
}
```

### Admin Endpoints

#### Create Vehicle

```http
POST /api/vehicles
Headers: Authorization: Bearer <admin_token>
Body: {
  "vehicle_type": "sedan",
  "registration_number": "ABC-123",
  "model": "Toyota Corolla 2023",
  "year": 2023,
  "fare_per_km": 50,
  "capacity": 4,
  "assigned_driver_id": "driver_id_optional"
}
```

#### Get All Vehicles

```http
GET /api/vehicles
Headers: Authorization: Bearer <admin_token>
Query Params: ?availability_status=available&vehicle_type=sedan
```

#### Get Available Vehicles

```http
GET /api/vehicles/available
Headers: Authorization: Bearer <admin_token>
Query Params: ?vehicle_type=sedan&min_capacity=4
```

#### Get Vehicle by ID

```http
GET /api/vehicles/:id
Headers: Authorization: Bearer <admin_token>
```

#### Update Vehicle

```http
PATCH /api/vehicles/:id
Headers: Authorization: Bearer <admin_token>
Body: {
  "availability_status": "maintenance",
  "fare_per_km": 55
}
```

#### Delete Vehicle

```http
DELETE /api/vehicles/:id
Headers: Authorization: Bearer <admin_token>
```

---

## 👨‍✈️ Driver Endpoints

All driver endpoints require admin authentication.

#### Create Driver

```http
POST /api/drivers
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "Ahmed Khan",
  "contact_number": "03001234567",
  "license_number": "KHI-12345",
  "monthly_salary": 50000,
  "assigned_vehicle_type": "sedan",
  "assigned_vehicle_id": "vehicle_id_optional"
}
```

#### Get All Drivers

```http
GET /api/drivers
Headers: Authorization: Bearer <admin_token>
Query Params: ?availability_status=available&assigned_vehicle_type=sedan
```

#### Get Available Drivers

```http
GET /api/drivers/available
Headers: Authorization: Bearer <admin_token>
Query Params: ?vehicle_type=sedan
```

#### Get Driver by ID

```http
GET /api/drivers/:id
Headers: Authorization: Bearer <admin_token>
```

#### Update Driver

```http
PATCH /api/drivers/:id
Headers: Authorization: Bearer <admin_token>
Body: {
  "monthly_salary": 55000,
  "availability_status": "available"
}
```

#### Update Driver Attendance

```http
PATCH /api/drivers/:id/attendance
Headers: Authorization: Bearer <admin_token>
Body: {
  "monthly_presents": 25
}
```

#### Delete Driver

```http
DELETE /api/drivers/:id
Headers: Authorization: Bearer <admin_token>
```

---

## ⚙️ Settings Endpoints

### Public Endpoints

#### Get Settings

```http
GET /api/settings
Response: {
  "success": true,
  "settings": {
    "rush_hours": [...],
    "base_fare": 50,
    "currency": "SAR"
  }
}
```

#### Get Rush Hours

```http
GET /api/settings/rush-hours
```

### Admin Endpoints

#### Update Base Fare

```http
PATCH /api/settings/base-fare
Headers: Authorization: Bearer <admin_token>
Body: {
  "base_fare": 60
}
```

#### Add Rush Hour

```http
POST /api/settings/rush-hours
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "Morning Peak",
  "start_time": "08:00",
  "end_time": "10:00",
  "multiplier": 1.5
}
```

#### Update Rush Hour

```http
PATCH /api/settings/rush-hours/:id
Headers: Authorization: Bearer <admin_token>
Body: {
  "multiplier": 1.8
}
```

#### Delete Rush Hour

```http
DELETE /api/settings/rush-hours/:id
Headers: Authorization: Bearer <admin_token>
```

#### Update Currency

```http
PATCH /api/settings/currency
Headers: Authorization: Bearer <admin_token>
Body: {
  "currency": "SAR"
}
```

---

## 🔐 Authentication Endpoints (Existing)

### Register

```http
POST /auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

### Verify OTP

```http
POST /auth/verify-otp
Body: {
  "email": "john@example.com",
  "otp": "1234"
}
```

### Google OAuth

```http
GET /auth/google
```

---

## 📝 Data Models

### Vehicle Types

- `sedan` - 4 passengers
- `suv` - 6-7 passengers
- `luxury` - 4 passengers (premium)
- `van` - 8-12 passengers
- `mini` - 2-3 passengers

### Booking Status

- `pending` - Awaiting admin approval
- `approved` - Assigned vehicle and driver
- `rejected` - Rejected by admin
- `completed` - Ride completed
- `cancelled` - Cancelled by user

### Vehicle Availability Status

- `available` - Ready for booking
- `in-use` - Currently on a ride
- `maintenance` - Under maintenance

### Driver Availability Status

- `available` - Ready for rides
- `on-ride` - Currently driving
- `off-duty` - Not available

---

## 💡 Important Notes

1. **Fare Calculation**: Automatically calculates based on:

   - Base fare (configurable)
   - Distance × vehicle's fare_per_km
   - Rush hour multiplier (if booking time falls in rush hours)

2. **Booking Approval**:

   - Only available vehicles and drivers can be assigned
   - Vehicle and driver status automatically updated on approval
   - Approval email sent to user automatically

3. **Booking Rejection**:

   - Rejection email sent to user automatically
   - Must provide rejection reason

4. **Receipt PDF**:

   - Only available for approved bookings
   - Contains all booking, vehicle, and driver details
   - Downloads as PDF file

5. **Driver-Vehicle Assignment**:

   - One driver per vehicle
   - One vehicle per driver
   - Automatically updates both entities when assigned

6. **Admin Role**:
   - Set user role to "admin" in database manually for first admin
   - Admin endpoints protected by role-based middleware

---

## 🚀 Getting Started

1. Start the server:

```bash
cd backend
npm run dev
```

2. Server runs on: `http://localhost:3003`

3. Test health check:

```bash
curl http://localhost:3003
```

4. Create admin user (set role to "admin" in database after registration)

5. Start managing bookings, drivers, and vehicles!
