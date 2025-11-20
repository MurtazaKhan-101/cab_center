const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

class VehicleController {
  // Create a new vehicle (Admin)
  async createVehicle(req, res) {
    try {
      const {
        vehicle_type,
        registration_number,
        model,
        year,
        fare_per_km,
        capacity,
        assigned_driver_id,
      } = req.body;

      // Validation
      if (
        !vehicle_type ||
        !registration_number ||
        !model ||
        !year ||
        fare_per_km === undefined ||
        !capacity
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided",
        });
      }

      // Check if vehicle with same registration already exists
      const existingVehicle = await Vehicle.findOne({ registration_number });
      if (existingVehicle) {
        return res.status(400).json({
          success: false,
          message: "Vehicle with this registration number already exists",
        });
      }

      // If driver is assigned, validate it
      if (assigned_driver_id) {
        const driver = await Driver.findById(assigned_driver_id);
        if (!driver) {
          return res.status(404).json({
            success: false,
            message: "Assigned driver not found",
          });
        }

        // Check if driver is already assigned to another vehicle
        if (driver.assigned_vehicle_id) {
          return res.status(400).json({
            success: false,
            message: "This driver is already assigned to another vehicle",
          });
        }
      }

      // Create vehicle
      const vehicle = new Vehicle({
        vehicle_type,
        registration_number: registration_number.toUpperCase(),
        model,
        year,
        fare_per_km,
        capacity,
        assigned_driver_id: assigned_driver_id || null,
        availability_status: "available",
      });

      await vehicle.save();

      // Update driver with vehicle assignment
      if (assigned_driver_id) {
        await Driver.findByIdAndUpdate(assigned_driver_id, {
          assigned_vehicle_id: vehicle._id,
          assigned_vehicle_type: vehicle_type,
        });
      }

      res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        vehicle,
      });
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create vehicle",
        error: error.message,
      });
    }
  }

  // Get all vehicles (Admin)
  async getAllVehicles(req, res) {
    try {
      const { availability_status, vehicle_type } = req.query;
      const filter = {};

      if (availability_status) filter.availability_status = availability_status;
      if (vehicle_type) filter.vehicle_type = vehicle_type;

      const vehicles = await Vehicle.find(filter)
        .populate("assigned_driver_id", "name contact_number license_number")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: vehicles.length,
        vehicles,
      });
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch vehicles",
      });
    }
  }

  // Get single vehicle by ID (Admin)
  async getVehicleById(req, res) {
    try {
      const { id } = req.params;

      const vehicle = await Vehicle.findById(id).populate(
        "assigned_driver_id",
        "name contact_number license_number"
      );

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }

      res.status(200).json({
        success: true,
        vehicle,
      });
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch vehicle",
      });
    }
  }

  // Update vehicle (Admin)
  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }

      // If registration number is being updated, check uniqueness
      if (
        updates.registration_number &&
        updates.registration_number !== vehicle.registration_number
      ) {
        const existingVehicle = await Vehicle.findOne({
          registration_number: updates.registration_number.toUpperCase(),
          _id: { $ne: id },
        });
        if (existingVehicle) {
          return res.status(400).json({
            success: false,
            message:
              "Another vehicle with this registration number already exists",
          });
        }
        updates.registration_number = updates.registration_number.toUpperCase();
      }

      // Handle driver assignment changes
      if (updates.assigned_driver_id !== undefined) {
        // Remove vehicle from old driver
        if (vehicle.assigned_driver_id) {
          await Driver.findByIdAndUpdate(vehicle.assigned_driver_id, {
            assigned_vehicle_id: null,
            assigned_vehicle_type: null,
          });
        }

        // Assign to new driver
        if (updates.assigned_driver_id) {
          const driver = await Driver.findById(updates.assigned_driver_id);
          if (!driver) {
            return res.status(404).json({
              success: false,
              message: "Assigned driver not found",
            });
          }

          // Check if driver is already assigned
          if (
            driver.assigned_vehicle_id &&
            driver.assigned_vehicle_id.toString() !== id
          ) {
            return res.status(400).json({
              success: false,
              message: "This driver is already assigned to another vehicle",
            });
          }

          await Driver.findByIdAndUpdate(updates.assigned_driver_id, {
            assigned_vehicle_id: id,
            assigned_vehicle_type: updates.vehicle_type || vehicle.vehicle_type,
          });
        }
      }

      Object.assign(vehicle, updates);
      await vehicle.save();

      await vehicle.populate(
        "assigned_driver_id",
        "name contact_number license_number"
      );

      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        vehicle,
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update vehicle",
        error: error.message,
      });
    }
  }

  // Delete vehicle (Admin)
  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }

      // Remove vehicle assignment from driver
      if (vehicle.assigned_driver_id) {
        await Driver.findByIdAndUpdate(vehicle.assigned_driver_id, {
          assigned_vehicle_id: null,
          assigned_vehicle_type: null,
        });
      }

      await Vehicle.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete vehicle",
      });
    }
  }

  // Get available vehicles for booking (Admin)
  async getAvailableVehicles(req, res) {
    try {
      const { vehicle_type, min_capacity } = req.query;

      const filter = {
        availability_status: "available",
      };

      if (vehicle_type) {
        filter.vehicle_type = vehicle_type;
      }

      if (min_capacity) {
        filter.capacity = { $gte: parseInt(min_capacity) };
      }

      const vehicles = await Vehicle.find(filter).populate(
        "assigned_driver_id",
        "name contact_number license_number availability_status"
      );

      // Filter vehicles whose drivers are also available
      const availableVehicles = vehicles.filter(
        (vehicle) =>
          vehicle.assigned_driver_id &&
          vehicle.assigned_driver_id.availability_status === "available"
      );

      res.status(200).json({
        success: true,
        count: availableVehicles.length,
        vehicles: availableVehicles,
      });
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch available vehicles",
      });
    }
  }

  // Get vehicle types with fare info (User & Admin)
  async getVehicleTypes(req, res) {
    try {
      const vehicleTypes = await Vehicle.aggregate([
        {
          $group: {
            _id: "$vehicle_type",
            fare_per_km: { $first: "$fare_per_km" },
            capacity: { $first: "$capacity" },
            available_count: {
              $sum: {
                $cond: [{ $eq: ["$availability_status", "available"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            vehicle_type: "$_id",
            fare_per_km: 1,
            capacity: 1,
            available_count: 1,
          },
        },
        {
          $sort: { fare_per_km: 1 },
        },
      ]);

      res.status(200).json({
        success: true,
        vehicleTypes,
      });
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch vehicle types",
      });
    }
  }
}

const vehicleController = new VehicleController();

module.exports = {
  createVehicle: vehicleController.createVehicle.bind(vehicleController),
  getAllVehicles: vehicleController.getAllVehicles.bind(vehicleController),
  getVehicleById: vehicleController.getVehicleById.bind(vehicleController),
  updateVehicle: vehicleController.updateVehicle.bind(vehicleController),
  deleteVehicle: vehicleController.deleteVehicle.bind(vehicleController),
  getAvailableVehicles:
    vehicleController.getAvailableVehicles.bind(vehicleController),
  getVehicleTypes: vehicleController.getVehicleTypes.bind(vehicleController),
};
