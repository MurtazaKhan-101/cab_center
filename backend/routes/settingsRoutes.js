const express = require("express");
const settingsController = require("../controllers/settingsController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Public/User routes
router.get("/", settingsController.getSettings);
router.get("/rush-hours", settingsController.getRushHours);

// Admin routes
router.patch(
  "/base-fare",
  authenticate,
  authorize("admin"),
  settingsController.updateBaseFare
);
router.post(
  "/rush-hours",
  authenticate,
  authorize("admin"),
  settingsController.addRushHour
);
router.patch(
  "/rush-hours/:id",
  authenticate,
  authorize("admin"),
  settingsController.updateRushHour
);
router.delete(
  "/rush-hours/:id",
  authenticate,
  authorize("admin"),
  settingsController.deleteRushHour
);
router.patch(
  "/currency",
  authenticate,
  authorize("admin"),
  settingsController.updateCurrency
);

module.exports = router;
