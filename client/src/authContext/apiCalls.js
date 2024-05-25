import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";
import { toast } from "sonner";

export const login = async (user, dispatch) => {
  const { credential, password } = user;

  if (!credential.trim() || !password) {
    toast.error("Please enter both email/phone number and password.");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be greater than 6 characters.");
    return;
  }

  dispatch(loginStart());

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential);

    const res = await axios.post("auth/login", {
      [isEmail ? "email" : "phoneNumber"]: credential,
      password,
    });
  
    // Check if login was successful
    if (res.status === 200) {
      const roleRes = await axios.get(`/role/${res.data.role}`);
      const roleName = roleRes.data.role_name;
  
      if (roleName === "User") {
        dispatch(loginSuccess(res.data));
        toast.success("Login successful!");
      } else {
        dispatch(loginFailure());
        toast.error("You are not a User. Please log in with a User account.");
      }
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
  }
  
};
