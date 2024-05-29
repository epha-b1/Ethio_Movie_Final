const mongoose = require("mongoose");
const router = require("express").Router();
const User = require("../models/User");
const Role = require("../models/Role"); // Import Role model
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Import nodemailer
const bcrypt = require('bcrypt');

function getRandomTenDigitNumber() {
  let number = '';
  for (let i = 0; i < 10; i++) {
      number += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
  }
  return number;
}

// User Registration Endpoint
router.post("/register", async (req, res) => {
  try {
    // Extract username, email, password, phone number, and role from request body
    const { username, email, password, phoneNumber, role } = req.body;

    // Encrypt the password using AES encryption with the SECRET_KEY
    // const encryptedPassword = CryptoJS.AES.encrypt(
    //   password,
    //   process.env.SECRET_KEY
    // ).toString();
    const encryptedPassword = await bcrypt.hash(password, 10);
    // const hashedPassword = await bcrypt.hash(password, 10);

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
    var userId = getRandomTenDigitNumber();
    const newUser = new User({
      userId,
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
// Login endpoint
router.post("/login", async (req, res) => {
  try {
    // Check if the user has reached the maximum session limit
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
    });

    if (user && user.activeSessions.length >= 3) {
      return res.status(403).json({ message: "Maximum session limit reached" });
    }

    // If user doesn't exist, return 401 (Unauthorized)
    if (!user) {
      return res.status(401).json({ message: "Wrong email, phoneNumber, or password!" });
    }

    // Decrypt the stored password and compare it with the provided password
    // const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    // const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    // if (originalPassword !== req.body.password) {
    //   return res.status(401).json({ message: "Wrong email, phoneNumber, or password!" });
    // }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT access token with user ID and role
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        phone: user.phoneNumber,
        userName: user.username,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    // Add the new session token to the user's activeSessions array
    const sessionId = new mongoose.Types.ObjectId().toString();
    user.activeSessions.push({ sessionId: sessionId, token: accessToken });
    await user.save();

    // Exclude password field from user object and return with access token
    const { password, ...userInfo } = user._doc;
    res.status(200).json({ ...userInfo, accessToken });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/logout", async (req, res) => {
  try {
    // Check if the authorization token exists in the request headers
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const cleanedToken = token.replace(/^bearer\s/i, ""); // Remove "bearer " prefix
    const user = await User.findOne({
      activeSessions: { $elemMatch: { token: cleanedToken } },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the active session with the provided token from user's activeSessions array
    user.activeSessions = user.activeSessions.filter(
      (session) => session.token !== cleanedToken
    );

    // Save the updated user document
    await user.save();

    // Verify that the session has been removed
    const isSessionRemoved = user.activeSessions.every(
      (session) => session.token !== cleanedToken
    );

    if (!isSessionRemoved) {
      // If the session is still found in the activeSessions array, return an error
      return res.status(500).json({ error: "Failed to remove session" });
    }

    // Return success message if the session is successfully removed
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    // Handle errors
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided information.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request, email already registered
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user's email
 *     description: Verifies the user's email using the provided verification token.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token received in email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     description: Resends the email verification link to the user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email resent
 *       400:
 *         description: User not found or already verified
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates the user and returns an access token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Wrong email, phoneNumber, or password
 *       403:
 *         description: Maximum session limit reached
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user by invalidating the access token.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Authorization token missing
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

module.exports = router;