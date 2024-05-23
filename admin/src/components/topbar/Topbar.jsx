import React, { useContext } from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import { toast } from "sonner";
import Logo from "../../asset/image/logo.png";

export default function Topbar() {
  const { dispatch, user } = useContext(AuthContext); // Assuming you have user information in your AuthContext
  const history = useHistory();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful!"); // Display success toast
    history.push("/login"); // Redirect to login page after logout
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
        <img src={Logo} alt="" className="logo" />

          <span className="logo">Admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          {/* <div className="topbarIconContainer">
            <Settings />
          </div> */}

          <div className="profile">
            <div className="username icon">{user.username}</div>

            {/* <Settings className="icon" /> */}
            <div className="options">
              <Link to="/setting" className="link">
                <span>Settings</span>
              </Link>
              <span onClick={handleLogout}>Logout</span>
            </div>
            {/* Display the user's name */}
          </div>
        </div>
      </div>
    </div>
  );
}
