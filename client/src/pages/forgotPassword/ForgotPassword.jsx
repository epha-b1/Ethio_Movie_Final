import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./forgotPassword.scss"; // Style your forgot password page here
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/forgot-password", {
        email: email,
      });

      if (response.status === 200) {
        setSuccess(true);
        setError("");
      } else {
        setError("Failed to reset password.");
        setSuccess(false);
      }
    } catch (err) {
      setError("An error occurred while resetting password.");
      setSuccess(false);
    }
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      {success && <p className="success">Reset email sent successfully!</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      <span onClick={() => history.push("/login")} className="back-to-login">
        Back to Login
      </span>
    </div>
  );
}
