import React, { useContext, useState } from "react";
import { createUser } from "../../context/userContext/apiCalls"; // Import the createUser function
import { UserContext } from "../../context/userContext/UserContext";
import { useHistory } from "react-router-dom";
import "./newUser.css";

export default function NewUser() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
  });
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(user, dispatch); // Call the createUser function
      history.push("/users");
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm" onSubmit={handleSubmit}>
        <div className="newUserItem">
          <label>Username</label>
          <input
            type="text"
            placeholder="johns"
            name="username"
            value={user.username} // Add value attribute to ensure controlled input
            onChange={handleChange}
          />
        </div>

        <div className="newUserItem">
          <label>Email</label>
          <input
            type="email"
            placeholder="john@gmail.com"
            name="email"
            value={user.email} // Add value attribute to ensure controlled input
            onChange={handleChange}
          />
        </div>
        <div className="newUserItem">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="09___"
            name="phoneNumber"
            value={user.phoneNumber} // Add value attribute to ensure controlled input
            onChange={handleChange}
          />
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            name="password"
            value={user.password} // Add value attribute to ensure controlled input
            onChange={handleChange}
          />
        </div>
        <div className="newUserItem">
          <label>Role</label>

          <select
            className="dropDown"
            name="role"
            value={user.role} // Add value attribute to ensure controlled input
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Content Creator">Content Creator</option>
          </select>
        </div>

        <button type="submit" className="addProductButton">
          Create
        </button>
      </form>
    </div>
  );
}
