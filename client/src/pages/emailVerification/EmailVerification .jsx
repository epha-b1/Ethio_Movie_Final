import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import './EmailVerification.css'; // Import the CSS file

const EmailVerification = () => {
  const { token } = useParams();
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify-email/${token}`);
        setMessage(response.data.message);
        setSuccess(true);
        // Redirect to login page after a delay
        setTimeout(() => {
          history.push("/login");
        }, 3000); // Redirect after 3 seconds
      } catch (error) {
        setMessage(error.response.data.error || "Verification failed. Please try again.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, history]);

  return (
    <div className="email-verification-page">
      <div className="container">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className={`message-box ${success ? "success" : "error"}`}>
          <h4 className="message-title">{success ? "Success!" : "Error"}</h4>
          <p className="message-text">{message}</p>
          {success && <p className="redirect-text">Redirecting to login...</p>}
        </div>
      )}
    </div>
    </div>
  );
};

export default EmailVerification;
