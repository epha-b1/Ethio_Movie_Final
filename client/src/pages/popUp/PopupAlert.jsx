import React from "react";
import "./PopupAlert.css";
import { Link, useHistory } from "react-router-dom";

function PopupAlert({ isOpen, onMaybeLater, onSubscribe }) {
  const history = useHistory();

  const handleClose = () => {
    onMaybeLater();
  };

  const handleSubscribe = () => {
    onSubscribe();
    history.push("/payment");
  };

  return (
    <>
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-alert">
            <h2>Subscribe to EthioMovies!</h2>
            <p>
              Purchase one of our affordable packages and watch unlimited movies
              and series.
            </p>
            <button className="subscribe-button" onClick={handleSubscribe}>
              SUBSCRIBE
            </button>
            <p className="maybe-later-message" onClick={handleClose}>
              Maybe later
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default PopupAlert;
