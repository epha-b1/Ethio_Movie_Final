import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./setting.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../authContext/AuthContext";
import { toast } from "sonner";
import { updateUser } from "../../userContext/apiCalls";
import ConfirmDialog from "../../components/confirmDialoge/ConfirmDialog "; // Import the ConfirmDialog component

const CryptoJS = require("crypto-js");

const MySetting = () => {
  const { dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPhoneNumber, setnewPhoneNumber] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State to manage the visibility of the confirmation dialog
  const userId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/find/${userId}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });

        setCurrentUser(res.data.user);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const history = useHistory();

  const handleDelete = async () => {
    setIsConfirmDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/users/${userId}`, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      dispatch({ type: "LOGOUT" });
      toast.success("Delete successfuly!");
      history.push("/login");
    } catch (error) {
      toast.error("Delete unsuccessfuly!");
      console.error("Error logout user:", error);
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false); // Close the confirmation dialog
  };
  


// Client-side code
const handleUpdatePassword = async (e) => {
  e.preventDefault();

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
          toast.error("New password and confirm password do not match.");

    return;
  }

  try {
    const response = await axios.put(
      `/users/update-password/${userId}`,
      {
        oldPassword,
        newPassword
      },
      {
        headers: {
          token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      }
    );
      toast.success("Password updated successfully!");

    // Reset password fields
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // Handle response as needed
    console.log(response.data);
  } catch (error) {
    // Handle error
          toast.error("Failed to update password. Please try again.");

    console.error('Error updating password:', error);
  }
};


  const handleUpdateUsername = async () => {
    try {
      const updatedUser = { id: userId, username: newUsername };
      await updateUser(updatedUser, dispatch);
      toast.success("Username updated successfully!");
      setNewUsername("");
    } catch (error) {
      toast.error("Failed to update username. Please try again.");
      console.error("Error updating username:", error);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const updatedUser = { id: userId, email: newEmail };
      await updateUser(updatedUser, dispatch);
      toast.success("Email updated successfully!");
      setNewEmail("");
    } catch (error) {
      toast.error("Failed to update email. Please try again.");
      console.error("Error updating email:", error);
    }
  };
  const handleUpdatePhone = async () => {
    try {
      const updatedUser = { id: userId, phoneNumber: newPhoneNumber };
      await updateUser(updatedUser, dispatch);
      toast.success("Phone Number updated successfully!");
      setNewEmail("");
    } catch (error) {
      toast.error("Failed to update Phone Number. Please try again.");
      console.error("Error updating Phone number:", error);
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="setting">
          <div className="account-info">
            <span className="title">Account Information</span>

            <hr />
            <div className="subscription">
              <span>Subscription</span>
              {currentUser.subscription ? (
                <span className="subscribe-btn">Subscribed</span>
              ) : (
                <Link to="/payment">
                  <button>Subscribe</button>
                </Link>
              )}
                
            </div>
            <hr className="divider" />

            <div className="subscription">
                  <span>isVerfied-User</span>
                  {currentUser.isVerified ? (
                    <span className="verified-true">Verifed</span>
                  ) : (
                    <span className="verified-false">Not verfied</span>
                  )}
                </div>

            <hr className="divider" />
            <div className="username">
              <span>Username</span>
              <input
                type="text"
                placeholder="Username"
                value={newUsername || currentUser.username}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button onClick={handleUpdateUsername}>Update</button>
            </div>
            <hr className="divider" />

            <div className="personal-info">
              <span>Email</span>
              <input
                type="text"
                placeholder="Email"
                value={newEmail || currentUser.email}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button onClick={handleUpdateEmail}>Update</button>
            </div>
            <hr className="divider" />

            <div className="personal-info">
              <span>Phone Number</span>
              <input
                type="text"
                placeholder="Email"
                value={newPhoneNumber || currentUser.phoneNumber}
                onChange={(e) => setnewPhoneNumber(e.target.value)}
              />
              <button onClick={handleUpdatePhone}>Update</button>
            </div>
            <hr className="divider" />

            <div className="change-password">
              <span>Change password</span>

              <div className="password-fields">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button onClick={handleUpdatePassword}>Update</button>
            </div>
            <hr className="divider" />

            <div className="account-actions">
              <Link to="/">
                <button className="back-btn">Back</button>
              </Link>
              <button className="delete-btn" onClick={handleDelete}>
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        handleClose={handleCloseConfirmDialog}
        handleConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default MySetting;
