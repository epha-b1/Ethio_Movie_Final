import MovieReducer from "./SeriousReducer";
import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  movies: [],
  isFetching: false,
  error: false,
};

export const SeriousContext = createContext(INITIAL_STATE);

export const SeriousContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MovieReducer, INITIAL_STATE);

  return (
    <SeriousContext.Provider
      value={{
        series: state.series,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </SeriousContext.Provider>
  );
};
