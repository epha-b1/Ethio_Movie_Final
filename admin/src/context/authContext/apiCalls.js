import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";
import { Toaster, toast } from "sonner";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("auth/login", user);
    // Fetch the role name based on the role ID
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${res.data.role}`
    );
    const roleName = roleRes.data.role_name;

    if (roleName === "Admin") {
      dispatch(loginSuccess(res.data));
      toast.success("Login successful!");
    } else {
      dispatch(loginFailure());
      toast.error("You are not an admin. Please log in with an admin account.");
    }
  } catch (err) {
    dispatch(loginFailure());
    toast.error("Invalid email or password. Please try again.");
    console.error("Error fetching role:", err);
  }
};
