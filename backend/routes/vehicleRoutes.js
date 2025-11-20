const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Public/User routes
router.get("/types", vehicleController.getVehicleTypes);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("admin"),
  vehicleController.createVehicle
);
router.get(
  "/",
  authenticate,
  authorize("admin"),
  vehicleController.getAllVehicles
);
router.get(
  "/available",
  authenticate,
  authorize("admin"),
  vehicleController.getAvailableVehicles
);
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  vehicleController.getVehicleById
);
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  vehicleController.updateVehicle
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  vehicleController.deleteVehicle
);

module.exports = router;
