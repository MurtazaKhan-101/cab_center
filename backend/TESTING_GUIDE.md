# Quick Test Guide - Cab Center API

## 🧪 Step-by-Step Testing Guide

### Step 1: Register and Login

#### 1.1 Register a User

```http
POST http://localhost:3003/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### 1.2 Verify OTP (check your email)

```http
POST http://localhost:3003/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "1234"
}
```

**Save the token from response!**

#### 1.3 Make User Admin (Manual - MongoDB)

```javascript
// In MongoDB, update user:
db.users.updateOne({ email: "john@example.com" }, { $set: { role: "admin" } });
```

---

### Step 2: Setup Vehicles (Admin)

#### 2.1 Create Multiple Vehicles

```http
POST http://localhost:3003/api/vehicles
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "vehicle_type": "sedan",
  "registration_number": "ABC-123",
  "model": "Toyota Corolla 2023",
  "year": 2023,
  "fare_per_km": 50,
  "capacity": 4
}
```

```http
POST http://localhost:3003/api/vehicles
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "vehicle_type": "suv",
  "registration_number": "XYZ-456",
  "model": "Honda CR-V 2024",
  "year": 2024,
  "fare_per_km": 80,
  "capacity": 7
}
```

```http
POST http://localhost:3003/api/vehicles
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "vehicle_type": "luxury",
  "registration_number": "LUX-789",
  "model": "Mercedes E-Class 2024",
  "year": 2024,
  "fare_per_km": 150,
  "capacity": 4
}
```

---

### Step 3: Setup Drivers (Admin)

#### 3.1 Create Multiple Drivers

```http
POST http://localhost:3003/api/drivers
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Ahmed Khan",
  "contact_number": "03001234567",
  "license_number": "KHI-12345",
  "monthly_salary": 50000
}
```

```http
POST http://localhost:3003/api/drivers
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Ali Raza",
  "contact_number": "03009876543",
  "license_number": "KHI-67890",
  "monthly_salary": 55000
}
```

**Save the driver and vehicle IDs from responses!**

---

### Step 4: Assign Drivers to Vehicles (Admin)

#### 4.1 Update Vehicle with Driver

```http
PATCH http://localhost:3003/api/vehicles/VEHICLE_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "assigned_driver_id": "DRIVER_ID"
}
```

---

### Step 5: Setup Rush Hours (Admin)

#### 5.1 Add Morning Rush Hour

```http
POST http://localhost:3003/api/settings/rush-hours
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Morning Peak",
  "start_time": "08:00",
  "end_time": "10:00",
  "multiplier": 1.5
}
```

#### 5.2 Add Evening Rush Hour

```http
POST http://localhost:3003/api/settings/rush-hours
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Evening Peak",
  "start_time": "17:00",
  "end_time": "20:00",
  "multiplier": 1.8
}
```

#### 5.3 Update Base Fare

```http
PATCH http://localhost:3003/api/settings/base-fare
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "base_fare": 50
}
```

---

### Step 6: Create Bookings (User)

#### 6.1 Create Normal Booking

```http
POST http://localhost:3003/api/bookings
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "user_name": "John Doe",
  "contact_number": "03001234567",
  "email": "john@example.com",
  "no_of_passengers": 2,
  "special_requirements": "",
  "pickup": "Karachi Airport",
  "drop": "Clifton Beach",
  "distance_km": 15,
  "vehicle_type": "sedan",
  "date": "2025-11-25",
  "time": "14:30"
}
```

#### 6.2 Create Rush Hour Booking

```http
POST http://localhost:3003/api/bookings
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "user_name": "John Doe",
  "contact_number": "03001234567",
  "email": "john@example.com",
  "no_of_passengers": 4,
  "special_requirements": "Need child seat",
  "pickup": "Gulshan-e-Iqbal",
  "drop": "DHA Phase 8",
  "distance_km": 20,
  "vehicle_type": "suv",
  "date": "2025-11-25",
  "time": "18:30"
}
```

**Note the higher fare due to rush hour multiplier!**

---

### Step 7: Manage Bookings (Admin)

#### 7.1 Get All Pending Bookings

```http
GET http://localhost:3003/api/bookings?status=pending
Authorization: Bearer YOUR_TOKEN
```

#### 7.2 Get Available Vehicles

```http
GET http://localhost:3003/api/vehicles/available?vehicle_type=sedan
Authorization: Bearer YOUR_TOKEN
```

#### 7.3 Get Available Drivers

```http
GET http://localhost:3003/api/drivers/available?vehicle_type=sedan
Authorization: Bearer YOUR_TOKEN
```

#### 7.4 Approve Booking

```http
PATCH http://localhost:3003/api/bookings/BOOKING_ID/approve
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "vehicle_id": "VEHICLE_ID",
  "driver_id": "DRIVER_ID"
}
```

**User will receive approval email!**

#### 7.5 Reject Booking

```http
PATCH http://localhost:3003/api/bookings/BOOKING_ID/reject
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "rejection_reason": "No vehicles available for this time slot"
}
```

**User will receive rejection email!**

---

### Step 8: Download Receipt (Admin)

#### 8.1 Download PDF Receipt

```http
GET http://localhost:3003/api/bookings/BOOKING_ID/receipt
Authorization: Bearer YOUR_TOKEN
```

**PDF file will download!**

---

### Step 9: Complete Booking (Admin)

#### 9.1 Mark as Completed

```http
PATCH http://localhost:3003/api/bookings/BOOKING_ID/complete
Authorization: Bearer YOUR_TOKEN
```

**Driver and vehicle become available again!**

---

### Step 10: View Bookings (User)

#### 10.1 Get My Bookings

```http
GET http://localhost:3003/api/bookings/my-bookings
Authorization: Bearer YOUR_TOKEN
```

---

## 🔍 Test Scenarios

### Scenario 1: Normal Booking Flow

1. User creates booking (distance: 10km, time: 14:00, vehicle: sedan, fare_per_km: 50)
2. Expected Fare: 50 (base) + (10 × 50) = 550 PKR
3. Admin approves with available driver-vehicle
4. User receives email
5. Admin downloads receipt
6. Admin completes booking
7. Driver and vehicle available again

### Scenario 2: Rush Hour Booking

1. User creates booking (distance: 20km, time: 18:30, vehicle: suv, fare_per_km: 80)
2. Falls in evening rush hour (17:00-20:00, multiplier: 1.8)
3. Expected Fare: 50 (base) + (20 × 80 × 1.8) = 2930 PKR
4. Admin approves
5. User receives email with fare details

### Scenario 3: Booking Rejection

1. User creates booking
2. Admin rejects with reason
3. User receives rejection email
4. No changes to driver/vehicle availability

### Scenario 4: User Cancellation

1. User creates booking
2. User cancels before admin approval
3. Booking status: cancelled
4. No email sent

---

## 📊 Testing Filters and Queries

### Filter Bookings

```http
# By status
GET http://localhost:3003/api/bookings?status=approved

# By date
GET http://localhost:3003/api/bookings?date=2025-11-25

# By vehicle type
GET http://localhost:3003/api/bookings?vehicle_type=sedan

# Combined
GET http://localhost:3003/api/bookings?status=pending&date=2025-11-25&vehicle_type=suv
```

### Filter Drivers

```http
# By availability
GET http://localhost:3003/api/drivers?availability_status=available

# By vehicle type
GET http://localhost:3003/api/drivers?assigned_vehicle_type=sedan
```

### Filter Vehicles

```http
# By availability
GET http://localhost:3003/api/vehicles?availability_status=available

# By type
GET http://localhost:3003/api/vehicles?vehicle_type=luxury

# Available with minimum capacity
GET http://localhost:3003/api/vehicles/available?min_capacity=6
```

---

## 🎯 Expected Results

### Fare Calculations:

| Distance | Vehicle Type | Fare/KM | Rush Hour | Multiplier | Total Fare |
| -------- | ------------ | ------- | --------- | ---------- | ---------- |
| 10 km    | Sedan        | 50      | No        | 1.0        | 550 PKR    |
| 10 km    | Sedan        | 50      | Yes       | 1.5        | 800 PKR    |
| 20 km    | SUV          | 80      | No        | 1.0        | 1650 PKR   |
| 20 km    | SUV          | 80      | Yes       | 1.8        | 2930 PKR   |
| 15 km    | Luxury       | 150     | No        | 1.0        | 2300 PKR   |
| 15 km    | Luxury       | 150     | Yes       | 1.5        | 3425 PKR   |

---

## 🐛 Common Issues

### 1. "Access denied. No valid token provided"

- Make sure to include Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`

### 2. "Insufficient permissions"

- User role must be "admin" for admin endpoints
- Update in MongoDB: `role: "admin"`

### 3. "Vehicle is not available"

- Check vehicle availability_status
- Should be "available", not "in-use" or "maintenance"

### 4. "Driver is not available"

- Check driver availability_status
- Should be "available", not "on-ride" or "off-duty"

### 5. "Failed to send OTP email"

- Check .env EMAIL_FROM and EMAIL_PASS
- Make sure Gmail app password is correct

---

## ✅ Checklist Before Testing

- [ ] MongoDB is connected
- [ ] Server is running on port 3003
- [ ] Email configuration is correct
- [ ] At least one admin user exists
- [ ] At least 2 vehicles created
- [ ] At least 2 drivers created
- [ ] Drivers assigned to vehicles
- [ ] Rush hours configured
- [ ] Base fare set

---

## 🎉 Happy Testing!

Test each endpoint and verify:

- ✅ Bookings are created correctly
- ✅ Fare is calculated with rush hours
- ✅ Emails are sent on approve/reject
- ✅ PDF receipts download properly
- ✅ Driver and vehicle availability updates
- ✅ Filters work correctly
- ✅ CRUD operations work for all entities

All features from your requirements are implemented and ready to test! 🚀
