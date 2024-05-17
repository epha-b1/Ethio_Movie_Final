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
