const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, // Reference to Role schema
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }, // Reference to Subscription schema
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

  return !!subscription && subscription.isActive(); // Returns true if subscription is found and active, false otherwise
};

module.exports = mongoose.model("User", userSchema);
