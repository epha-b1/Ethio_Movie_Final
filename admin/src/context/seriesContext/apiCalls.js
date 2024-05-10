import axios from "axios";
import { toast } from "sonner";
import {
  createSeriousFailure,
  createSeriousStart,
  createSeriousSuccess,
  deleteSeriousFailure,
  deleteSeriousStart,
  deleteSeriousSuccess,
  getSeriousFailure,
  getSeriousStart,
  getSeriousSuccess,
  updateSeriousFailure,
  updateSeriousStart,
  updateSeriousSuccess,
} from "./SeriousActions";

export const getSerious = async (dispatch) => {
  dispatch(getSeriousStart());
  try {
    const res = await axios.get("/serious", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(getSeriousSuccess(res.data));
  } catch (err) {
    dispatch(getSeriousFailure());
  }
};

//create
export const createSerious = async (movie, dispatch) => {
  dispatch(createSeriousStart());
  try {
    const res = await axios.post("/movies", movie, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(createSeriousSuccess(res.data));
    toast.success("Movie Added successfuly!"); // Display success toast
  } catch (err) {
    dispatch(createSeriousFailure());
    toast.error("Fail to Add Movie. Please try again."); // Display error toast
  }
};

//delete
export const deleteSerious = async (id, dispatch) => {
  dispatch(deleteSeriousStart());
  try {
    await axios.delete("/movies/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(deleteSeriousSuccess(id));
    toast.success("Delete Movie successful!"); // Display success toast
  } catch (err) {
    dispatch(deleteSeriousFailure());
    toast.error("Fail To delete Movie. Please try again."); // Display error toast
  }
};

//update
export const updateSerious = async (id, updatedMovie, dispatch) => {
  dispatch(updateSeriousStart());
  try {
    const res = await axios.put(`/movies/${id}`, updatedMovie, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(updateSeriousSuccess(res.data));
    toast.success("Movie updated successfully!"); // Display success toast
  } catch (err) {
    dispatch(updateSeriousFailure());
    toast.error("Failed to update movie. Please try again."); // Display error toast
  }
};
