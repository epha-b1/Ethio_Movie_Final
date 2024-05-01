import { ArrowDropDown, Notifications, Search } from "@material-ui/icons";
import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../authContext/AuthContext";
import logo from "../../asset/image/logo.png";
import { useHistory } from "react-router-dom";
import { Toaster, toast } from "sonner";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, dispatch } = useContext(AuthContext); // Assuming you have user information in your AuthContext

  const history = useHistory();

  const handleLogout = () => {
    toast.success("Logout successful!"); // Display success toast

    dispatch({ type: "LOGOUT" });
    history.push("/login"); // Redirect to login page after logout
  };

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <img src={logo} alt="" />
          <Link to="/" className="link">
            <span>Homepage</span>
          </Link>
          <Link to="/series" className="link">
            <span className="navbarmainLinks">Series</span>
          </Link>
          <Link to="/movies" className="link">
            <span className="navbarmainLinks">Movies</span>
          </Link>

          <Search className="icon" />

          <div className="profile">
            <span className="profile_image icon">{user.username}</span>

            <div className="options">
              <Link to="/setting" className="link">
                <span>Account and Settings</span>
              </Link>
              <span onClick={handleLogout}>Logout</span>
              {/* Display the user's name */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
