const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    email: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    phone_number: { type: Number, required: false },
    tx_ref: { type: String, required: true },
    subscription_date: { type: Date, default: Date.now }, // Added subscription date field
    expire_date: { type: Date }, // Added expiration date field
  },
  { collection: "Subscription" }
);

// Middleware to set expiration date one year from subscription date
subscriptionSchema.pre("save", function (next) {
  // Check if the document is new (being created)
  if (this.isNew) {
    // Set expiration date one year from subscription date
    this.expire_date = new Date(this.subscription_date);
    this.expire_date.setFullYear(this.expire_date.getFullYear() + 1);
  }
  next();
});

// Method to check if the subscription is active
subscriptionSchema.methods.isActive = function () {
  // Implement your logic to check if subscription is active
  // For example, check if current date is before expiration date

  return Date.now() < this.expire_date; // Replace with your logic
};

module.exports = mongoose.model("Subscription", subscriptionSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           description: The subscription amount
 *           example: 10.99
 *         currency:
 *           type: string
 *           description: The currency of the subscription
 *           example: "USD"
 *         email:
 *           type: string
 *           description: The email associated with the subscription
 *           example: "example@example.com"
 *         first_name:
 *           type: string
 *           description: The first name associated with the subscription
 *           example: "John"
 *         last_name:
 *           type: string
 *           description: The last name associated with the subscription
 *           example: "Doe"
 *         phone_number:
 *           type: number
 *           description: The phone number associated with the subscription
 *           example: 1234567890
 *         tx_ref:
 *           type: string
 *           description: The transaction reference of the subscription
 *           example: "txn_123456789"
 *         subscription_date:
 *           type: string
 *           format: date-time
 *           description: The date when the subscription was created
 *           example: "2024-05-27T10:00:00.000Z"
 *         expire_date:
 *           type: string
 *           format: date-time
 *           description: The date when the subscription expires
 *           example: "2025-05-27T10:00:00.000Z"
 */