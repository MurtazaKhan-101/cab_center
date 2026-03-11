const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const alternativeTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const testEmailConnection = async (transporter) => {
  try {
    await transporter.verify();
    console.log("Email server is ready to send messages");
    return true;
  } catch (error) {
    console.log("Email configuration error:", error);
    return false;
  }
};

const sendOTP = async (email, otp, type = "verification") => {
  try {
    const transporter = createTransporter();

    const isPasswordReset = type === "password-reset";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: isPasswordReset
        ? "Your OTP for Cab Centre Password Reset"
        : "Your OTP for Cab Centre Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;"> ${
              isPasswordReset ? "Reset your password" : "Welcome to Cab Centre"
            }</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ${
                isPasswordReset
                  ? "To reset your password, please use the following One-Time Password (OTP):"
                  : "Thank you for registering with Cab Centre. To complete your email verification, please use the following One-Time Password (OTP):"
              }
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; background-color: #e7f3ff; padding: 15px 30px; border-radius: 8px; letter-spacing: 5px;">
                ${otp}
              </span>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              This OTP will expire in 5 minutes. Please do not share this code with anyone.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              ${
                isPasswordReset
                  ? "If you didn't request password reset, please ignore this email."
                  : "If you didn't request this verification, please ignore this email."
              }
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Cab Centre. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

const sendBookingApprovalEmail = async (booking) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: booking.email,
      subject: "Booking Approved - Cab Center",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">Booking Approved!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Dear ${booking.user_name},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Your booking has been approved! Here are your ride details:
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Booking ID:</strong> ${
                booking._id
              }</p>
              <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date(
                booking.date
              ).toLocaleDateString()}</p>
              <p style="margin: 10px 0;"><strong>Time:</strong> ${
                booking.time
              }</p>
              <p style="margin: 10px 0;"><strong>Pickup:</strong> ${
                booking.pickup
              }</p>
              <p style="margin: 10px 0;"><strong>Drop:</strong> ${
                booking.drop
              }</p>
              <p style="margin: 10px 0;"><strong>Vehicle:</strong> ${
                booking.vehicle_id.model
              } (${booking.vehicle_id.registration_number})</p>
              <p style="margin: 10px 0;"><strong>Driver:</strong> ${
                booking.driver_id.name
              }</p>
              <p style="margin: 10px 0;"><strong>Driver Contact:</strong> ${
                booking.driver_id.contact_number
              }</p>
              <p style="margin: 10px 0;"><strong>Total Fare:</strong> SAR${
                booking.total_fare
              }</p>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              Your driver will arrive at the pickup location at the scheduled time. Please be ready!
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Cab Center. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending booking approval email:", error);
    return { success: false, error: error.message };
  }
};

const sendBookingRejectionEmail = async (booking) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: booking.email,
      subject: "Booking Rejected - Cab Center",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #dc3545; text-align: center; margin-bottom: 20px;">Booking Rejected</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Dear ${booking.user_name},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              We regret to inform you that your booking request has been rejected.
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Booking ID:</strong> ${
                booking._id
              }</p>
              <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date(
                booking.date
              ).toLocaleDateString()}</p>
              <p style="margin: 10px 0;"><strong>Time:</strong> ${
                booking.time
              }</p>
              <p style="margin: 10px 0;"><strong>Pickup:</strong> ${
                booking.pickup
              }</p>
              <p style="margin: 10px 0;"><strong>Drop:</strong> ${
                booking.drop
              }</p>
              <p style="margin: 10px 0; color: #dc3545;"><strong>Reason:</strong> ${
                booking.rejection_reason
              }</p>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              You can try booking again with different details or contact our support team for assistance.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Cab Center. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending booking rejection email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTransporter,
  alternativeTransporter,
  testEmailConnection,
  sendOTP,
  sendBookingApprovalEmail,
  sendBookingRejectionEmail,
};
