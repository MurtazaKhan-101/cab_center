const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const Settings = require("../models/Settings");
const User = require("../models/User");
const {
  sendBookingApprovalEmail,
  sendBookingRejectionEmail,
} = require("../config/email");
const PDFDocument = require("pdfkit");
const moment = require("moment");

class BookingController {
  // Helper function to calculate fare
  async calculateFare(
    vehicleType,
    distanceKm,
    bookingTime,
    bookingDate,
    pickupLocation
  ) {
    try {
      // Get vehicle fare per km
      const vehicle = await Vehicle.findOne({ vehicle_type: vehicleType });
      if (!vehicle) {
        throw new Error("Vehicle type not found");
      }

      // Get settings for rush hours and base fare
      let settings = await Settings.findOne();
      if (!settings) {
        // Create default settings if none exist
        settings = new Settings({
          rush_hours: [],
          base_fare: 50,
        });
        await settings.save();
      }

      let farePerKm = vehicle.fare_per_km;
      let rushHourMultiplier = 1;

      // Check if booking falls in any rush hour (time, day, and location must all match)
      if (
        bookingTime &&
        bookingDate &&
        pickupLocation &&
        settings.rush_hours.length > 0
      ) {
        const bookingHour = bookingTime.split(":")[0];
        const bookingMinute = bookingTime.split(":")[1] || "00";
        const bookingTimeValue =
          parseInt(bookingHour) * 60 + parseInt(bookingMinute);

        // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
        const bookingDayOfWeek = new Date(bookingDate).getDay();
        const dayNames = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const bookingDayName = dayNames[bookingDayOfWeek];

        for (const rushHour of settings.rush_hours) {
          // Check time range
          const startParts = rushHour.start_time.split(":");
          const endParts = rushHour.end_time.split(":");
          const startTimeValue =
            parseInt(startParts[0]) * 60 + parseInt(startParts[1] || "0");
          const endTimeValue =
            parseInt(endParts[0]) * 60 + parseInt(endParts[1] || "0");

          const isTimeMatch =
            bookingTimeValue >= startTimeValue &&
            bookingTimeValue <= endTimeValue;

          // Check if booking day matches any of the rush hour days
          const isDayMatch =
            rushHour.days_of_week && rushHour.days_of_week.length > 0
              ? rushHour.days_of_week
                  .map((day) => day.toLowerCase())
                  .includes(bookingDayName)
              : true; // If no specific days set, apply to all days

          // Check if pickup location matches any of the rush hour locations
          const isLocationMatch =
            rushHour.locations && rushHour.locations.length > 0
              ? rushHour.locations.some(
                  (location) =>
                    pickupLocation
                      .toLowerCase()
                      .includes(location.toLowerCase()) ||
                    location
                      .toLowerCase()
                      .includes(pickupLocation.toLowerCase())
                )
              : true; // If no specific locations set, apply to all locations

          // Apply multiplier only if ALL conditions are met
          if (isTimeMatch && isDayMatch && isLocationMatch) {
            rushHourMultiplier = rushHour.multiplier;
            console.log(
              `Rush hour applied: ${rushHour.name}, Multiplier: ${rushHour.multiplier}x`
            );
            console.log(
              `Time match: ${isTimeMatch}, Day match: ${isDayMatch}, Location match: ${isLocationMatch}`
            );
            break; // Use the first matching rush hour
          }
        }
      }

      // Calculate fare with rush hour logic applied only to 5km radius
      let totalFare;
      if (rushHourMultiplier > 1) {
        // Rush hour applies only to first 5km within the location
        const rushHourRadius = 5; // 5km radius
        const rushHourDistance = Math.min(distanceKm, rushHourRadius);
        const normalDistance = Math.max(0, distanceKm - rushHourRadius);

        // Calculate fare for rush hour portion (first 5km or less)
        const rushHourFare = farePerKm * rushHourDistance * rushHourMultiplier;

        // Calculate fare for normal portion (remaining distance)
        const normalFare = farePerKm * normalDistance;

        totalFare = settings.base_fare + rushHourFare + normalFare;

        console.log(
          `Fare breakdown - Rush hour distance: ${rushHourDistance}km at ${rushHourMultiplier}x, Normal distance: ${normalDistance}km at 1x`
        );
      } else {
        // No rush hour, apply normal rates to entire distance
        totalFare = settings.base_fare + farePerKm * distanceKm;
      }

      return Math.round(totalFare);
    } catch (error) {
      console.error("Error calculating fare:", error);
      throw error;
    }
  }

  // Calculate fare endpoint (Public)
  async calculateFareEndpoint(req, res) {
    try {
      const {
        vehicle_type,
        distance_km,
        pickup_location,
        booking_date,
        booking_time,
      } = req.body;

      // Validation
      if (!vehicle_type || !distance_km) {
        return res.status(400).json({
          success: false,
          message: "Vehicle type and distance are required",
        });
      }

      // Calculate fare
      const fare = await this.calculateFare(
        vehicle_type,
        distance_km,
        booking_time || "12:00",
        booking_date || new Date().toISOString().split("T")[0],
        pickup_location || ""
      );

      res.status(200).json({
        success: true,
        fare: fare,
        currency: "SAR",
        breakdown: {
          distance_km: distance_km,
          vehicle_type: vehicle_type,
          base_fare: fare,
        },
      });
    } catch (error) {
      console.error("Error calculating fare:", error);
      res.status(500).json({
        success: false,
        message: "Failed to calculate fare",
        error: error.message,
      });
    }
  }

  // Create a new booking (User)
  async createBooking(req, res) {
    try {
      const {
        user_name,
        contact_number,
        email,
        no_of_passengers,
        special_requirements,
        pickup,
        drop,
        distance_km,
        vehicle_type,
        date,
        time,
        payment_method,
      } = req.body;

      // Validation
      if (
        !user_name ||
        !contact_number ||
        !email ||
        !no_of_passengers ||
        !pickup ||
        !drop ||
        !vehicle_type ||
        !date ||
        !time ||
        !payment_method
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided",
        });
      }

      // Get user ID from authenticated user
      const user_id = req.user._id;

      // Calculate fare
      const total_fare = await this.calculateFare(
        vehicle_type,
        distance_km || 0,
        time,
        date,
        pickup
      );

      // Create booking
      const booking = new Booking({
        user_id,
        user_name,
        contact_number,
        email,
        no_of_passengers,
        special_requirements: special_requirements || "",
        pickup,
        drop,
        distance_km: distance_km || 0,
        vehicle_type,
        date: new Date(date),
        time,
        payment_method,
        total_fare,
        status: "pending",
      });

      await booking.save();

      res.status(201).json({
        success: true,
        message: "Booking created successfully. Awaiting admin approval.",
        booking,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create booking",
        error: error.message,
      });
    }
  }

  // Get all bookings (Admin)
  async getAllBookings(req, res) {
    try {
      const { status, date, vehicle_type } = req.query;
      const filter = {};

      if (status) filter.status = status;
      if (date) {
        const searchDate = new Date(date);
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.date = { $gte: searchDate, $lt: nextDay };
      }
      if (vehicle_type) filter.vehicle_type = vehicle_type;

      const bookings = await Booking.find(filter)
        .populate("user_id", "firstName lastName email")
        .populate("vehicle_id", "registration_number model vehicle_type")
        .populate("driver_id", "name contact_number license_number")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bookings",
      });
    }
  }

  // Get user's bookings (User)
  async getUserBookings(req, res) {
    try {
      const userId = req.user._id;

      const bookings = await Booking.find({ user_id: userId })
        .populate("vehicle_id", "registration_number model vehicle_type")
        .populate("driver_id", "name contact_number")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bookings",
      });
    }
  }

  // Get single booking by ID
  async getBookingById(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findById(id)
        .populate("user_id", "firstName lastName email")
        .populate(
          "vehicle_id",
          "registration_number model vehicle_type fare_per_km"
        )
        .populate("driver_id", "name contact_number license_number");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch booking",
      });
    }
  }

  // Approve booking (Admin)
  async approveBooking(req, res) {
    try {
      const { id } = req.params;
      const { vehicle_id, driver_id } = req.body;

      if (!vehicle_id || !driver_id) {
        return res.status(400).json({
          success: false,
          message: "Vehicle and driver must be assigned",
        });
      }

      // Check if booking exists
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      if (booking.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Booking is already ${booking.status}`,
        });
      }

      // Check if vehicle exists and is available
      const vehicle = await Vehicle.findById(vehicle_id);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }

      if (vehicle.availability_status !== "available") {
        return res.status(400).json({
          success: false,
          message: "Vehicle is not available",
        });
      }

      // Check if driver exists and is available
      const driver = await Driver.findById(driver_id);
      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }

      if (driver.availability_status !== "available") {
        return res.status(400).json({
          success: false,
          message: "Driver is not available",
        });
      }

      // Update booking
      booking.vehicle_id = vehicle_id;
      booking.driver_id = driver_id;
      booking.status = "approved";
      await booking.save();

      // Update vehicle status
      vehicle.availability_status = "in-use";
      await vehicle.save();

      // Update driver status
      driver.availability_status = "on-ride";
      driver.total_rides += 1;
      await driver.save();

      // Populate booking for email
      await booking.populate("vehicle_id driver_id");

      // Send approval email
      try {
        await sendBookingApprovalEmail(booking);
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
      }

      res.status(200).json({
        success: true,
        message: "Booking approved successfully",
        booking,
      });
    } catch (error) {
      console.error("Error approving booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to approve booking",
        error: error.message,
      });
    }
  }

  // Reject booking (Admin)
  async rejectBooking(req, res) {
    try {
      const { id } = req.params;
      const { rejection_reason } = req.body;

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      if (booking.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Booking is already ${booking.status}`,
        });
      }

      booking.status = "rejected";
      booking.rejection_reason = rejection_reason || "No reason provided";
      await booking.save();

      // Send rejection email
      try {
        await sendBookingRejectionEmail(booking);
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
      }

      res.status(200).json({
        success: true,
        message: "Booking rejected successfully",
        booking,
      });
    } catch (error) {
      console.error("Error rejecting booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reject booking",
      });
    }
  }

  // Complete booking (Admin)
  async completeBooking(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findById(id)
        .populate("vehicle_id")
        .populate("driver_id");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      if (booking.status !== "approved") {
        return res.status(400).json({
          success: false,
          message: "Only approved bookings can be completed",
        });
      }

      booking.status = "completed";
      await booking.save();

      // Free up vehicle and driver
      if (booking.vehicle_id) {
        await Vehicle.findByIdAndUpdate(booking.vehicle_id._id, {
          availability_status: "available",
        });
      }

      if (booking.driver_id) {
        await Driver.findByIdAndUpdate(booking.driver_id._id, {
          availability_status: "available",
        });
      }

      res.status(200).json({
        success: true,
        message: "Booking completed successfully",
        booking,
      });
    } catch (error) {
      console.error("Error completing booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to complete booking",
      });
    }
  }

  // Cancel booking (User)
  async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Check if user owns this booking
      if (booking.user_id.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to cancel this booking",
        });
      }

      if (booking.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Only pending bookings can be cancelled",
        });
      }

      booking.status = "cancelled";
      await booking.save();

      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        booking,
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel booking",
      });
    }
  }

  // Download booking receipt PDF (Admin)
  async downloadReceipt(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findById(id)
        .populate("user_id", "firstName lastName email")
        .populate("vehicle_id", "registration_number model vehicle_type")
        .populate("driver_id", "name contact_number license_number");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      if (booking.status !== "approved") {
        return res.status(400).json({
          success: false,
          message: "Only approved bookings can have receipts generated",
        });
      }

      // Create PDF
      const doc = new PDFDocument({ margin: 50 });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=booking-receipt-${booking._id}.pdf`
      );

      // Pipe PDF to response
      doc.pipe(res);

      // Add content to PDF
      doc.fontSize(20).text("CAB CENTER", { align: "center" });
      doc.fontSize(16).text("Booking Receipt", { align: "center" });
      doc.moveDown();

      // Booking Details
      doc.fontSize(12).text(`Booking ID: ${booking._id}`, { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(11);
      doc.text(`Date: ${moment(booking.date).format("DD MMM YYYY")}`);
      doc.text(`Time: ${booking.time}`);
      doc.text(`Status: ${booking.status.toUpperCase()}`);
      doc.moveDown();

      // Passenger Details
      doc.fontSize(12).text("Passenger Information:", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11);
      doc.text(`Name: ${booking.user_name}`);
      doc.text(`Contact: ${booking.contact_number}`);
      doc.text(`Email: ${booking.email}`);
      doc.text(`Number of Passengers: ${booking.no_of_passengers}`);
      if (booking.special_requirements) {
        doc.text(`Special Requirements: ${booking.special_requirements}`);
      }
      doc.moveDown();

      // Trip Details
      doc.fontSize(12).text("Trip Details:", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11);
      doc.text(`Pickup Location: ${booking.pickup}`);
      doc.text(`Drop Location: ${booking.drop}`);
      doc.text(`Distance: ${booking.distance_km} km`);
      doc.moveDown();

      // Vehicle Details
      if (booking.vehicle_id) {
        doc.fontSize(12).text("Vehicle Information:", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11);
        doc.text(`Type: ${booking.vehicle_id.vehicle_type.toUpperCase()}`);
        doc.text(`Model: ${booking.vehicle_id.model}`);
        doc.text(`Registration: ${booking.vehicle_id.registration_number}`);
        doc.moveDown();
      }

      // Driver Details
      if (booking.driver_id) {
        doc.fontSize(12).text("Driver Information:", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11);
        doc.text(`Name: ${booking.driver_id.name}`);
        doc.text(`Contact: ${booking.driver_id.contact_number}`);
        doc.text(`License: ${booking.driver_id.license_number}`);
        doc.moveDown();
      }

      // Fare Details
      doc.fontSize(12).text("Fare Information:", { underline: true });
      doc.moveDown(0.5);
      doc
        .fontSize(14)
        .text(`Total Fare: SAR${booking.total_fare}`, { bold: true });
      doc.moveDown();

      // Footer
      doc.fontSize(10).text("Thank you for choosing Cab Center!", {
        align: "center",
        italics: true,
      });
      doc.text("For any queries, please contact our support team.", {
        align: "center",
      });

      // Finalize PDF
      doc.end();
    } catch (error) {
      console.error("Error generating receipt:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate receipt",
        error: error.message,
      });
    }
  }

  // Update booking (Admin - for editing pending bookings)
  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Recalculate fare if distance or time changes
      if (updates.distance_km || updates.time) {
        const distanceKm = updates.distance_km || booking.distance_km;
        const time = updates.time || booking.time;
        updates.total_fare = await this.calculateFare(
          booking.vehicle_type,
          distanceKm,
          time
        );
      }

      Object.assign(booking, updates);
      await booking.save();

      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        booking,
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update booking",
      });
    }
  }

  // Delete booking (Admin)
  async deleteBooking(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByIdAndDelete(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete booking",
      });
    }
  }
}

const bookingController = new BookingController();

module.exports = {
  calculateFare:
    bookingController.calculateFareEndpoint.bind(bookingController),
  createBooking: bookingController.createBooking.bind(bookingController),
  getAllBookings: bookingController.getAllBookings.bind(bookingController),
  getUserBookings: bookingController.getUserBookings.bind(bookingController),
  getBookingById: bookingController.getBookingById.bind(bookingController),
  approveBooking: bookingController.approveBooking.bind(bookingController),
  rejectBooking: bookingController.rejectBooking.bind(bookingController),
  completeBooking: bookingController.completeBooking.bind(bookingController),
  cancelBooking: bookingController.cancelBooking.bind(bookingController),
  downloadReceipt: bookingController.downloadReceipt.bind(bookingController),
  updateBooking: bookingController.updateBooking.bind(bookingController),
  deleteBooking: bookingController.deleteBooking.bind(bookingController),
};
