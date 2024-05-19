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

    // Send login request based on credential type
    const res = await axios.post("auth/login", {
      [isEmail ? "email" : "phoneNumber"]: credential,
      password,
    });

    // Retrieve user role name
    const roleRes = await axios.get(
      `/role/${res.data.role}`
    );
    const roleName = roleRes.data.role_name;

    // Dispatch login success action based on role
    if (roleName === "User") {
      dispatch(loginSuccess(res.data));
      toast.success("Login successful!");
    } else {
      dispatch(loginFailure());
      toast.error("You are not an User. Please log in with an User account.");
        }
  } catch (err) {
    dispatch(loginFailure());
    toast.error("Invalid email/phone number or password. Please try again.");
  }
};
