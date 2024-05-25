import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";
import {  toast } from "sonner";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("auth/login", user);
    // Fetch the role name based on the role ID
    const roleRes = await axios.get(
      `/role/${res.data.role}`
    );
    const roleName = roleRes.data.role_name;

    if (roleName === "Content_Creator") {
      dispatch(loginSuccess(res.data));
      toast.success("Login successful!");
    } else {
      dispatch(loginFailure());
      toast.error("You are not an admin. Please log in with an admin account.");
    }
  } catch (err) {
    const errorMessage = err.response.data.message;
  
    if (errorMessage === "Maximum session limit reached") {
      toast.error("Maximum session limit reached. Please try again later.");
    } else if (errorMessage === "Wrong email, phoneNumber, or password!") {
      toast.error("Invalid email/phone number or password. Please try again.");
    } else {
      toast.error("An error occurred. Please try again later.");
    }
    dispatch(loginFailure());
    console.error("Error fetching role:", err);
  }
};
