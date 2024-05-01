const router = require("express").Router();
const User = require("../models/User");
const Role = require("../models/Role"); // Import Role model
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
      phoneNumber,
      role: selectedRole._id, // Assign the selected role to the new user
    });

    // Save the new user to the database
    const user = await newUser.save();

    // Return the user object with a status code of 201 (Created)
    res.status(201).json(user);
  } catch (err) {
    // Return any errors with a status code of 500 (Internal Server Error)
    res.status(500).json({ error: err.message });
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
      { id: user._id, role: user.role },
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
