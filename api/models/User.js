const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    phoneNumber: { type: String, required: false, unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    userId: { type: String, required: false, unique: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    verificationCode: { type: String },
    activeSessions: [
      { 
        sessionId: { type: String },
        token: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

// Method to check if the user is subscribed
userSchema.methods.isSubscribed = async function () {
  if (!this.subscription) {
    return false;
  }

  const Subscription = mongoose.model("Subscription");
  const subscription = await Subscription.findById(this.subscription);

  return !!subscription && subscription.isActive();
};

module.exports = mongoose.model("User", userSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: "john_doe"
 *         email:
 *           type: string
 *           description: The email address of the user
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: "hashed_password"
 *         profilePic:
 *           type: string
 *           description: The profile picture URL of the user
 *           example: "https://example.com/profile_pic.jpg"
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user
 *           example: "+1234567890"
 *         role:
 *           type: string
 *           description: The role of the user
 *           example: "60d8f05d1e81ab12c8da1bfe"
 *         subscription:
 *           type: string
 *           description: The subscription ID of the user
 *           example: "60d8f05d1e81ab12c8da1bfe"
 *         isVerified:
 *           type: boolean
 *           description: Indicates whether the user's email is verified
 *           example: true
 *         verificationToken:
 *           type: string
 *           description: The verification token for verifying the user's email
 *           example: "verification_token"
 *         userId:
 *           type: string
 *           description: The unique ID of the user
 *           example: "60d8f05d1e81ab12c8da1bfe"
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *           example: "Doe"
 *         verificationCode:
 *           type: string
 *           description: The verification code for verifying the user's phone number
 *           example: "verification_code"
 *         activeSessions:
 *           type: array
 *           description: Array of active sessions for the user
 *           items:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: The ID of the session
 *                 example: "session_id"
 *               token:
 *                 type: string
 *                 description: The session token
 *                 example: "session_token"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The creation date of the session
 *                 example: "2024-05-27T10:00:00.000Z"
 *       required:
 *         - username
 *         - email
 *         - password
 *         - role
 *       example:
 *         username: john_doe
 *         email: john.doe@example.com
 *         password: hashed_password
 *         role: 60d8f05d1e81ab12c8da1bfe
 */