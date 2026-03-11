const express = require("express");
const driverController = require("../controllers/driverController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// All driver routes require admin authentication
router.post(
  "/",
  authenticate,
  authorize("admin"),
  driverController.createDriver
);
router.get(
  "/",
  authenticate,
  authorize("admin"),
  driverController.getAllDrivers
);
router.get(
  "/available",
  authenticate,
  authorize("admin"),
  driverController.getAvailableDrivers
);
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  driverController.getDriverById
);
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  driverController.updateDriver
);
router.patch(
  "/:id/attendance",
  authenticate,
  authorize("admin"),
  driverController.updateAttendance
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  driverController.deleteDriver
);

module.exports = router;
