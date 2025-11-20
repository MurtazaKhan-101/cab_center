const express = require("express");
const bookingController = require("../controllers/bookingController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// User routes - require authentication
router.post("/", authenticate, bookingController.createBooking);
router.get("/my-bookings", authenticate, bookingController.getUserBookings);
router.patch("/:id/cancel", authenticate, bookingController.cancelBooking);

// Admin routes - require authentication and admin role
router.get(
  "/",
  authenticate,
  authorize("admin"),
  bookingController.getAllBookings
);
router.get("/:id", authenticate, bookingController.getBookingById);
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
router.get(
  "/:id/receipt",
  authenticate,
  authorize("admin"),
  bookingController.downloadReceipt
);

module.exports = router;
