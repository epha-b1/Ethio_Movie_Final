const express = require("express");
const router = express.Router();
const request = require("request");
const Subscription = require("../models/Subscription"); // Import Subscription model
const User = require("../models/User"); // Import User model
const dotenv = require("dotenv");
const verify = require("../verifyToken");

const CHAPA_AUTH_KEY = process.env.CHAPA_AUTH_KEY; //Put Your Chapa Secret Key

router.post("/", verify, async (req, res) => {
  const {
    amount,
    currency,
    email,
    first_name,
    last_name,
    phone_number,
    tx_ref,
  } = req.body;

  // Add subscription_date as the current date
  const subscription_date = new Date();

  // Calculate expire_date as one year from subscription_date
  const expire_date = new Date(subscription_date);
  expire_date.setFullYear(expire_date.getFullYear() + 1);

  var options = {
    method: "POST",
    url: "https://api.chapa.co/v1/transaction/initialize",
    headers: {
      Authorization: `Bearer ${CHAPA_AUTH_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount,
      currency: currency,
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      tx_ref: tx_ref,
      return_url: "http://localhost:3002",
      "customization[title]": "Payment",
    }),
  };

  request(options, async function (error, response) {
    if (error) {
      res.json({ error: error });
      return;
    }

    try {
      // Store Payment Details in MongoDB
      const model = {
        amount: amount,
        currency: currency,
        email: email,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        tx_ref: tx_ref,
        subscription_date: subscription_date,
        expire_date: expire_date,
      };
      const savedSubscription = await Subscription.create(model);

      // Find the authenticated user
      const user = await User.findById(req.user.id);

      // Associate the subscription with the user
      user.subscription = savedSubscription._id;
      await user.save();

      // Check if the user is subscribed
      const isSubscribed = await user.isSubscribed();

      res.json({
        success: response,
        dbsuccess: savedSubscription,
        isSubscribed,
      });
    } catch (err) {
      res.json({ error: err });
    }
  });
});

router.get("/total-birr", verify, async (req, res) => {
  try {
    // Find all subscriptions
    const subscriptions = await Subscription.find();

    // Calculate total revenue
    let totalRevenue = 0;
    subscriptions.forEach((subscription) => {
      totalRevenue += subscription.amount;
    });

    res.json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: API endpoints for managing subscriptions
 */

/**
 * @swagger
 * /api/subscription:
 *   post:
 *     summary: Initialize a subscription payment
 *     description: Creates a new subscription and initializes a payment via the Chapa API.
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount for the subscription
 *                 example: 100
 *               currency:
 *                 type: string
 *                 description: The currency for the payment
 *                 example: ETB
 *               email:
 *                 type: string
 *                 description: The email of the subscriber
 *                 example: example@example.com
 *               first_name:
 *                 type: string
 *                 description: The first name of the subscriber
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: The last name of the subscriber
 *                 example: Doe
 *               phone_number:
 *                 type: string
 *                 description: The phone number of the subscriber
 *                 example: 123456789
 *               tx_ref:
 *                 type: string
 *                 description: The transaction reference
 *                 example: tx123456789
 *     responses:
 *       200:
 *         description: Subscription initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: object
 *                   description: Response from Chapa API
 *                 dbsuccess:
 *                   type: object
 *                   description: Subscription saved in the database
 *                 isSubscribed:
 *                   type: boolean
 *                   description: Whether the user is subscribed
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/subscription/total-birr:
 *   get:
 *     summary: Get total revenue from subscriptions
 *     description: Retrieves the total revenue from all subscriptions.
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Total revenue retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   description: Total revenue from subscriptions
 *                   example: 1000
 *       500:
 *         description: Internal server error
 */ 