/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

const router = require("express").Router();
const User = require("../models/User");
const Role = require("../models/Role");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken library
const nodemailer = require("nodemailer");
const axios = require("axios"); // Import Axios
const Token = require("../models/Token"); // Import the Token model
const bcrypt = require('bcrypt');

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     description: Update the details of a user by their ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
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
 *               phoneNumber:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verify, async (req, res) => {
  try {
    // Fetch user role using Axios
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the user is authorized to update the account
    if (req.user.id !== req.params.id && roleName !== "Admin") {
      return res.status(403).json("You can update only your account!");
    }

    // If password is provided, encrypt it
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    // Update user details in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user account
 *     description: Delete a user account by their ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User has been deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User has been deleted...
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verify, async (req, res) => {
  try {
    // Fetch user role using Axios
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the user is authorized to delete the account
    if (req.user.id !== req.params.id && roleName !== "Admin") {
      return res.status(403).json("You can delete only your account!");
    }

    // Delete user account from the database
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /api/users/find/{id}:
 *   get:
 *     summary: Find user by ID
 *     description: Retrieve user details by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 isSubscribed:
 *                   type: boolean
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/find/:id", async (req, res) => {
  try {
    // Find user by ID and exclude the password field from the response
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is subscribed
    const isSubscribed = await user.isSubscribed();

    res.status(200).json({ user, isSubscribed });
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all user details.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: new
 *         schema:
 *           type: boolean
 *         description: Whether to return only the latest users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get("/", verify, async (req, res) => {
  try {
    // Fetch user role using Axios
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the user is an admin
    if (roleName !== "Admin") {
      return res.status(403).json("You are not allowed to see all users!");
    }

    // Get users from the database, optionally sorting and limiting results
    const query = req.query.new;
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics
 *     description: Retrieve user statistics, such as the number of users created each month.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: number
 *                   total:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/stats", async (req, res) => {
  try {
    // Get user creation month-wise statistics
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account.
 *     tags: [Users]
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
 *               phoneNumber:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  try {
    // Encrypt password before saving it to the database
    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();

    // Create a new user instance
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
      password: encryptedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Request a password reset for a user account.
 *     tags: [Users]
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
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate unique token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h", // Set expiry time as needed
    });

    // Store token in user document
    const newToken = new Token({
      userId: user._id,
      token: token
    });
    await newToken.save();

    // Send password reset email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Specify the email service you are using (e.g., Gmail)
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email username
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Password Reset",
      html: `<html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            color: #333;
          }
          .email-header {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          .btn {
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
            
          }
          a {
            color: white;
            text-decoration: none;
          }
          .logo {
            max-width: 50px; /* Adjust the size as needed */
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <img src="https://firebasestorage.googleapis.com/v0/b/ethiomovie-1d2a0.appspot.com/o/tvSeries%2F1716036726563logo.png?alt=media&token=3128021b-371f-47e0-9226-e788f30f81f8" alt="Logo" class="logo">
            <h2>Password Reset Request</h2>

          </div>
          <div class="email-body">
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p><a href="http://localhost:3002/reset-password/${token}" class="btn">Reset Password</a></p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="email-footer">
            <p>Thank you for using our service.</p>
            <p>Copyright © Ethio Movies 2024.</p>

          </div>
        </div>
      </body>
      </html>`,
    }, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(`Email sent: ${info.response}`);
        // console.log(`Password reset token: ${token}`); // Log the token for testing
      }
    });
    

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset the password for a user account.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User or token not found
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const storedToken = await Token.findOne({ userId: decoded.id, token: token });
    if (!storedToken) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's password
    // const hashedPassword = CryptoJS.AES.encrypt(
    //   newPassword,
    //   process.env.SECRET_KEY
    // ).toString();

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    // Delete the token after successful password reset
    await Token.findByIdAndDelete(storedToken._id);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Specify the email service you are using (e.g., Gmail)
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email username
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Password Reset Successful",
      text: "Your password has been successfully reset.",
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update password endpoint
router.put('/update-password/:id', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
