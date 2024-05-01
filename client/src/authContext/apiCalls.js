import axios from "axios"; // Import axios for making HTTP requests
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";
import { toast } from "sonner";

export const login = async (user, dispatch) => {
  const { credential, password } = user; // Rename 'email' to 'credential' to accept either email or phone number
  // Check if credential or password is empty
  if (!credential.trim() || !password) {
    toast.error("Please enter both email/phone number and password.");
    return;
  }
  // Check if the password is greater than 6 characters
  if (password.length < 6) {
    toast.error("Password must be greater than 6 characters.");
    return;
  }

  dispatch(loginStart());
  try {
    // Determine if the credential is an email or phone number
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential); // Check if the credential matches email format
    const res = await axios.post("auth/login", {
      [isEmail ? "email" : "phoneNumber"]: credential,
      password,
    });
    dispatch(loginSuccess(res.data));
    toast.success("Login successful!"); // Display success toast
  } catch (err) {
    dispatch(loginFailure());
    toast.error("Invalid email/phone number or password. Please try again."); // Display error toast
  }
};
