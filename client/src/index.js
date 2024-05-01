import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./authContext/AuthContext";
import { UserContextProvider } from "./userContext/UserContext";
import { Toaster } from "sonner";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <App />
        <Toaster richColors />
      </UserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
