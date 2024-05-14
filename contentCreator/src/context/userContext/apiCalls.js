import axios from "axios";
import { Toaster, toast } from "sonner";

import {
  createUserFailure,
  createUserStart,
  createUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "./UserActions";

export const getUsers = async (dispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await axios.get("/users", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailure());
  }
};

// create
export const createUser = async (user, dispatch) => {
  dispatch(createUserStart());
  try {
    const res = await axios.post("/auth/register", user, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(createUserSuccess(res.data));
    toast.success("User successfuly added!"); // Display success toast
  } catch (err) {
    dispatch(createUserFailure());
    toast.error("User added error"); // Display success toast
  }
};

//delete
export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  try {
    await axios.delete("/users/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(deleteUserSuccess(id));
    toast.success("User successfuly deleted!"); // Display success toast
  } catch (err) {
    dispatch(deleteUserFailure());
    toast.error("User delete eror!"); // Display success toast
  }
};

export const updateUser = async (userId, updatedUser, dispatch) => {
  dispatch(updateUserStart());
  try {
    const res = await axios.put(`/users/${userId}`, updatedUser, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(updateUserSuccess(res.data));
    toast.success("User updated successfully!"); // Display success toast
  } catch (err) {
    dispatch(updateUserFailure());
    toast.error("Failed to update user. Please try again."); // Display error toast
    console.error("Error updating user:", err);
  }
};
