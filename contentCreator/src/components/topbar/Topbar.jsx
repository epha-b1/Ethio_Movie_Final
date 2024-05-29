import React, { useContext } from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import { toast } from "sonner";
import Logo from "../../asset/image/logo.png";
import axios from "axios"; // Import axios for making HTTP requests
import AccountIcon from "../../asset/image/Avator.png";

export default function Topbar() {
  const { dispatch, user } = useContext(AuthContext); // Assuming you have user information in your AuthContext
  const history = useHistory();

  const handleLogout = async () => {
    try {
      // Make a logout request to the server
      const response = await axios.post(
        "/auth/logout",
        {},
        {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        }
      );

      if (response.status === 200) {
        // Logout successful, dispatch logout action and redirect to login page
        dispatch({ type: "LOGOUT" });
        history.push("/login");
        toast.success("Logout successful!");
      } else {
        // Logout failed, show error message
        toast.error("Failed to logout. Please try again.");
      }
    } catch (error) {
      // Handle error
      console.error("Error during logout:", error);
      toast.error("An error occurred during logout.");
    }
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <img src={Logo} alt="" className="logo" />

          <span className="logo">ContentCreator</span>
        </div>
        <div className="topRight">
          {/* <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div> */}
          {/* <div className="topbarIconContainer">
            <Settings />
          </div> */}

          <div className="profile">
            <div className="accountContainer">
              <div className="username icon">
                <img src={AccountIcon} alt="" />
                {user.username}
              </div>
            </div>

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
