import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./resetPassword.scss"; // Style your reset password page here
import axios from "axios";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams(); // Retrieve token from URL
  const history = useHistory();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("/users/reset-password", {
        token,
        newPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
        setError("");
        // Redirect to login page after successful password reset
        setTimeout(() => {
          history.push("/login");
        }, 3000);
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
    <div className="reset-password">
      <h2>Reset Password</h2>
      {success && <p className="success">Password reset successfully!</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
