import { useContext, useState } from "react";
import { login } from "../../authContext/apiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import "./login.scss";
import { useHistory } from "react-router-dom";

import logo from "../../asset/image/logo.png";

export default function Login() {
  const [credential, setCredential] = useState(""); // Changed state name to 'credential' to store either email or phone number
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Check if credential or password is empty
    // Call the login function with credential and password
    login({ credential, password }, dispatch);
  };

  const history = useHistory();

  const handleSignUpClick = () => {
    history.push("/register");
  };
  const handleForgotPasswordClick = () => {
    history.push("/forgot-password");
  };
  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <img className="logo" src={logo} alt="" />
        </div>
      </div>
      <div className="container">
        <form>
          <h1>Sign In</h1>
          <input
            type="text"
            placeholder="Email or phone number"
            onChange={(e) => setCredential(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="loginButton" onClick={handleLogin}>
            Sign In
          </button>
          <span>
            New to Netflix?{" "}
            <b onClick={handleSignUpClick} style={{ cursor: "pointer" }}>
              Sign up now.
            </b>
          </span>
          <span>
            <b
              onClick={handleForgotPasswordClick}
              style={{ cursor: "pointer" }}
            >
              Forget Password?
            </b>
          </span>
          <small>
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot. <b>Learn more</b>.
          </small>
        </form>
      </div>
    </div>
  );
}
