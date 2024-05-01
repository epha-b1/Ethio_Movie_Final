const MovieReducer = (state, action) => {
  switch (action.type) {
    case "GET_SERIOUS_START":
      return {
        movies: [],
        isFetching: true,
        error: false,
      };
    case "GET_SERIOUS_SUCCESS":
      return {
        movies: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_SERIOUS_FAILURE":
      return {
        movies: [],
        isFetching: false,
        error: true,
      };
    case "CREATE_SERIOUS_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "CREATE_SERIOUS_SUCCESS":
      return {
        movies: [...state.movies, action.payload],
        isFetching: false,
        error: false,
      };
    case "CREATE_SERIOUS_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case "UPLOAD_SERIOUS_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPLOAD_SERIOUS_SUCCESS":
      return {
        movies: state.movies.map(
          (movie) => movie._id === action.payload._id && action.payload
        ),
        isFetching: false,
        error: false,
      };
    case "UPLOAD_SERIOUS_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case "DELETE_SERIOUS_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_SERIOUS_SUCCESS":
      return {
        movies: state.movies.filter((movie) => movie._id !== action.payload),
        isFetching: false,
        error: false,
      };
    case "DELETE_MOVIE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return { ...state };
  }
};

export default MovieReducer;
