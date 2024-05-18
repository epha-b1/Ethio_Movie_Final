import axios from "axios";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "sonner";
import "./register.scss";

import logo from "../../asset/image/logo.png";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const phoneNumberRef = useRef();

  const handleLoginClick = () => {
    history.push("/login");
  };

  const handleStart = () => {
    const inputEmail = emailRef.current.value;
    if (!inputEmail) {
      toast.error("Please enter an email address.");
      return;
    }
    setEmail(inputEmail);
  };

 const handleFinish = async (e) => {
   e.preventDefault();
   const inputPassword = passwordRef.current.value;
   const inputUsername = usernameRef.current.value;
   const inputPhoneNumber = phoneNumberRef.current.value; // Read the phone number input

   // Validate email
   if (!email) {
     toast.error("Please enter an email address.");
     return;
   }

   // Validate username
   if (!inputUsername) {
     toast.error("Please enter a username.");
     return;
   }

   // Validate password
   if (inputPassword.length < 6) {
     toast.error("Password must be at least 6 characters long.");
     return;
   }

   // Validate phone number
   if (!inputPhoneNumber) {
     toast.error("Please enter a phone number.");
     return;
   }

   // Set input values after validation
   setPassword(inputPassword);
   setUsername(inputUsername);
   setphoneNumber(inputPhoneNumber); // Set the phone number state

   // All validations passed, proceed with registration
   try {
     await axios.post("auth/register", {
       email,
       username,
       password,
       phoneNumber: inputPhoneNumber,
     }); // Include phone number in the registration request
     toast.success("Registration and Verification email sent successfully. You can now Verify.");
     history.push("/login");
   } catch (err) {
     // Handle registration error
     console.error("Registration error:", err);
     toast.error("Registration failed. Please try again.");
   }
 };

  return (
    <div className="register">
      <div className="top">
        <div className="wrapper">
          <img className="logo" src={logo} alt="" />
        </div>
      </div>

      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        {!email ? (
          <div className="input">
            <input type="email" placeholder="Email address" ref={emailRef} />
            <button className="registerButton" onClick={handleStart}>
              <span>Get Started</span>
            </button>
          </div>
        ) : (
          <form className="input">
            <input type="text" placeholder="Username" ref={usernameRef} />
            <input type="text" placeholder="phoneNumber" ref={phoneNumberRef} />
            <input type="password" placeholder="Password" ref={passwordRef} />
            <button className="registerButton" onClick={handleFinish}>
              Start
            </button>
          </form>
        )}
        <div className="bottom">
          <span>
            Have an account?
            <b onClick={handleLoginClick} style={{ cursor: "pointer" }}>
              Sign in.
            </b>
          </span>
        </div>
      </div>
    </div>
  );
}
