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
    maxActiveSessions: { type: Number, default: 5 }, // Maximum 5 active sessions per user
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
