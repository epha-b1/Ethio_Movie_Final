import React, { useState, useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { updateUser } from "../../context/userContext/apiCalls";
import "./user.css";
import { UserContext } from "../../context/userContext/UserContext";

export default function User() {
  const location = useLocation();
  const user = location.user;
  const history = useHistory();

  // Get dispatch function from UserContext
  const { dispatch } = useContext(UserContext);

  // State to store updated user data
  const [updatedUser, setUpdatedUser] = useState({
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber, // Initialize with the user's phone number
  });

  // Handle input change for updating user data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

  // Handle user update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, updatedUser, dispatch); // Pass dispatch as the third argument
      history.push("/users"); // Redirect to the users page after successful update
    } catch (err) {
      // Handle update error
      console.error("Error updating user:", err);
    }
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img src={user.profilePic} alt="" className="userShowImg" />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.username}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">{user._id}</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">{user.email}</span>
            </div>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">{user.phoneNumber}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder={user.username}
                  value={updatedUser.username}
                  className="userUpdateInput"
                  onChange={handleInputChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  placeholder={user.email}
                  value={updatedUser.email}
                  className="userUpdateInput"
                  onChange={handleInputChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder={user.phoneNumber}
                  value={updatedUser.phoneNumber}
                  className="userUpdateInput"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img className="userUpdateImg" src={user.profilePic} alt="" />
                {/* You can implement file upload logic here */}
              </div>
              <button className="userUpdateButton" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
