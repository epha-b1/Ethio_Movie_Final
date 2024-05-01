import React, { useState, useEffect } from "react";
import "./app.scss";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Watch from "./pages/watch/Watch";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword.jsx";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext/AuthContext";
import Payment from "./pages/payment/Payment.jsx";
import Setting from "./pages/Setting/Setting.jsx";
import PopupAlert from "./pages/popUp/PopupAlert.jsx";
import axios from "axios";

const App = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);


  const userId = JSON.parse(localStorage.getItem("user"))?._id;
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

 if (userId) {
   fetchUser();
 }  }, [userId]);
  console.log(!currentUser?.subscription);


  const [alertOpen, setAlertOpen] = useState(!currentUser?.subscription); // Initialize alertOpen based on isSubscribed state

  useEffect(() => {
    const alertTimeout = setTimeout(() => {
      setAlertOpen(!currentUser?.subscription);
    }, 60000);

    return () => {
      clearTimeout(alertTimeout);
    };
  }, [currentUser]); 
  

  const handleMaybeLater = () => {
    setAlertOpen(false);
  };

  const handleSubscribe = () => {
    setAlertOpen(false);
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Redirect to="/register" />}
        </Route>
        <Route path="/register">
          {!user ? <Register /> : <Redirect to="/" />}
        </Route>
        <Route path="/login">{!user ? <Login /> : <Redirect to="/" />}</Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        {user && (
          <>
            {!currentUser?.subscription && alertOpen && (
              <PopupAlert
                isOpen={alertOpen}
                onMaybeLater={handleMaybeLater}
                onSubscribe={handleSubscribe}
              />
            )}
            <Route path="/movies">
              <Home type="movie" />
            </Route>
            <Route path="/series">
              <Home type="series" />
            </Route>
            {currentUser?.subscription && (
              <Route path="/watch">
                <Watch />
              </Route>
            )}
            <Route path="/payment">
              <Payment />
            </Route>
            <Route path="/setting">
              <Setting />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default App;
