const router = require("express").Router();
const User = require("../models/User");
const Role = require("../models/Role"); // Import Role model
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Import nodemailer

// User Registration Endpoint
router.post("/register", async (req, res) => {
  try {
    // Extract username, email, password, phone number, and role from request body
    const { username, email, password, phoneNumber, role } = req.body;

    // Encrypt the password using AES encryption with the SECRET_KEY
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString();

    let selectedRole;

    // Find the role by name if provided
    if (role) {
      selectedRole = await Role.findOne({ role_name: role });
    }

    // If role is not provided or not found, default to "User" role
    if (!selectedRole) {
      selectedRole = await Role.findOne({ role_name: "User" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Generate verification token
    const verificationToken = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1d", // Token expires in 1 day
    });

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
      phoneNumber,
      role: selectedRole._id,
      verificationToken,
      isVerified: false, // Add a field to track email verification status
    });

    // Save the new user to the database
    const user = await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res
      .status(201)
      .json({ user, message: "User registered. Verification email sent." });
  } catch (err) {
    // Return any errors with a status code of 500 (Internal Server Error)
    res.status(500).json({ error: err.message });
  }
});

// Function to send verification email
async function sendVerificationEmail(email, token) {
  try {
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Specify the email service you are using (e.g., Gmail)
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email username
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Email Verification",
      html: `
            <p>Please click the following link to verify your email:</p>
            <a href="http://localhost:3002/verify-email/${token}">Verify Email</a>
          `,
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}

// Email Verification Endpoint
router.get("/verify-email/:token", async (req, res) => {
  try {
    // Extract token from URL params
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find user by email
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      // Handle case where user is not found
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's account status to indicate email is verified
    user.isVerified = true;
    await user.save();

    // Respond with success message
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    // Handle token verification errors
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    await sendVerificationEmail(user.email, user.verificationToken);

    res.json({ message: "Verification email resent" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// User Login Endpoint
router.post("/login", async (req, res) => {
  try {
    // Find user by email or phoneNumber in the database
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
    });

    // If user doesn't exist, return 401 (Unauthorized)
    if (!user) {
      return res.status(401).json("Wrong email, phoneNumber, or password!");
    }

    // Decrypt the stored password and compare it with the provided password
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(401).json("Wrong email, phoneNumber, or password!");
    }

    // Generate JWT access token with user ID and role
    const accessToken = jwt.sign(
      { id: user._id, role: user.role ,phone:user.phoneNumber,userName:user.username,email:user.email },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    // Exclude password field from user object and return with access token
    const { password, ...userInfo } = user._doc;
    res.status(200).json({ ...userInfo, accessToken });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json("Internal Server Error");
  }
});




module.exports = router;
