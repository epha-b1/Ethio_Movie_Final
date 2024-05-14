export const getSeriousStart = () => ({
  type: "GET_SERIOUS_START",
});

export const getSeriousSuccess = (movies) => ({
  type: "GET_SERIOUS_SUCCESS",
  payload: movies,
});

export const getSeriousFailure = () => ({
  type: "GET_SERIOUS_FAILURE",
});

export const createSeriousStart = () => ({
  type: "CREATE_SERIOUS_START",
});

export const createSeriousSuccess = (movie) => ({
  type: "CREATE_SERIOUS_SUCCESS",
  payload: movie,
});

export const createSeriousFailure = () => ({
  type: "CREATE_SERIOUS_FAILURE",
});

export const updateSeriousStart = () => ({
  type: "UPDATE_SERIOUS_START",
});

export const updateSeriousSuccess = (movie) => ({
  type: "UPDATE_SERIOUS_SUCCESS",
  payload: movie,
});

export const updateSeriousFailure = () => ({
  type: "UPDATE_SERIOUS_FAILURE",
});

export const deleteSeriousStart = () => ({
  type: "DELETE_SERIOUS_START",
});

export const deleteSeriousSuccess = (id) => ({
  type: "DELETE_SERIOUS_SUCCESS",
  payload: id,
});

export const deleteSeriousFailure = () => ({
  type: "DELETE_SERIOUS_FAILURE",
});
