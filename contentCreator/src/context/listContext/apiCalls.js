import axios from "axios";
import {
  createListFailure,
  createListStart,
  createListSuccess,
  deleteListFailure,
  deleteListStart,
  deleteListSuccess,
  getListsFailure,
  getListsStart,
  getListsSuccess,
  updateListStart,
  updateListSuccess,updateListFailure
} from "./ListActions";
import { toast } from "sonner";

export const getLists = async (dispatch) => {
  dispatch(getListsStart());
  try {
    const res = await axios.get("/lists", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(getListsSuccess(res.data));
  } catch (err) {
    dispatch(getListsFailure());
  }
};

//create
export const createList = async (list, dispatch) => {
  dispatch(createListStart());
  try {
    const res = await axios.post("/lists", list, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(createListSuccess(res.data));
    toast.success("Movie List Created successfuly!"); 
  } catch (err) {
    dispatch(createListFailure());
    toast.error("Fail to Create Movie List. Please try again."); 
  }
};

//delete
export const deleteList = async (id, dispatch) => {
  dispatch(deleteListStart());
  try {
    await axios.delete("/lists/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(deleteListSuccess(id));
    toast.success("Delete Movie List successful!"); 
  } catch (err) {
    dispatch(deleteListFailure());
    toast.error("Fail To Delete Moive Lists. Please try again."); 
  }
};

//update
export const updateList = async (id, updatedList, dispatch) => {
  dispatch(updateListStart());
  try {
    const res = await axios.put(`/lists/${id}`, updatedList, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(updateListSuccess(res.data));
    toast.success("Movie List updated successfully!"); 
  } catch (err) {
    dispatch(updateListFailure());
    toast.error("Failed to update Movie List. Please try again."); 
  }
};