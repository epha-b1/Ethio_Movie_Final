import axios from "axios";
import { toast } from "sonner";

import {
  createMovieFailure,
  createMovieStart,
  createMovieSuccess,
  deleteMovieFailure,
  deleteMovieStart,
  deleteMovieSuccess,
  getMoviesFailure,
  getMoviesStart,
  getMoviesSuccess,
  updateMovieFailure,
  updateMovieStart,
  updateMovieSuccess,
} from "./MovieActions";

export const getMovies = async (dispatch) => {
  dispatch(getMoviesStart());
  try {
    const res = await axios.get("/movies", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(getMoviesSuccess(res.data));
  } catch (err) {
    dispatch(getMoviesFailure());
  }
};

//create
export const createMovie = async (movie, dispatch) => {
  dispatch(createMovieStart());
  try {
    const res = await axios.post("/movies", movie, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(createMovieSuccess(res.data));
    toast.success("Movie Added successfuly!"); // Display success toast
  } catch (err) {
    dispatch(createMovieFailure());
    toast.error("Fail to Add Movie. Please try again."); // Display error toast
  }
};

//delete
export const deleteMovie = async (id, dispatch) => {
  dispatch(deleteMovieStart());
  try {
    await axios.delete("/movies/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(deleteMovieSuccess(id));
    toast.success("Delete Movie successful!"); // Display success toast
  } catch (err) {
    dispatch(deleteMovieFailure());
    toast.error("Fail To delete Movie. Please try again."); // Display error toast
  }
};

//update
export const updateMovie = async (id, updatedMovie, dispatch) => {
  dispatch(updateMovieStart());
  try {
    const res = await axios.put(`/movies/${id}`, updatedMovie, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(updateMovieSuccess(res.data));
    toast.success("Movie updated successfully!"); // Display success toast
  } catch (err) {
    dispatch(updateMovieFailure());
    toast.error("Failed to update movie. Please try again."); // Display error toast
  }
};
