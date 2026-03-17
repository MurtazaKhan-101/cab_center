const express = require("express");
const bookingController = require("../controllers/bookingController");
const { authenticate, authorize, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/calculate-fare", bookingController.calculateFare);

// Guest-friendly: attaches user if token present, but allows guest bookings
router.post("/", optionalAuth, bookingController.createBooking);

// User routes - require authentication
router.get("/my-bookings", authenticate, bookingController.getUserBookings);
router.patch("/:id/cancel", authenticate, bookingController.cancelBooking);

// Admin routes - require authentication and admin role
router.get(
  "/",
  authenticate,
  authorize("admin"),
  bookingController.getAllBookings
);

// Booking detail — uses optional auth so guests can view their confirmation
router.get("/:id", optionalAuth, bookingController.getBookingById);

router.patch(
  "/:id/approve",
  authenticate,
  authorize("admin"),
  bookingController.approveBooking
);
router.patch(
  "/:id/reject",
  authenticate,
  authorize("admin"),
  bookingController.rejectBooking
);
router.patch(
  "/:id/complete",
  authenticate,
  authorize("admin"),
  bookingController.completeBooking
);
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  bookingController.updateBooking
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  bookingController.deleteBooking
);
// Receipt download — accessible to anyone with the booking ID
router.get("/:id/receipt", optionalAuth, bookingController.downloadReceipt);

module.exports = router;
