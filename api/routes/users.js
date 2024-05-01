const router = require("express").Router();
const User = require("../models/User");
const Role = require("../models/Role");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");
const nodemailer = require("nodemailer");
const axios = require("axios"); // Import Axios

// UPDATE user details
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

// DELETE user account
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

//GET ALL
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

// GET user statistics
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

// POST create a new user
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

module.exports = router;
