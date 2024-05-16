import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./resetPassword.scss"; // Style your reset password page here
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Logo from "../../asset/image/logo.png";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const customColorStyle = {
  marginTop: '8px', // Adjust padding top as needed
  marginBottom: '8px', // Adjust padding top as needed
  backgroundColor: ' #e9b14c ', // Background color
  color: 'white', // Text color
};

const customTypographyStyle = {
  marginBottom: '15px',
  color: 'white',
};
export default function ResetPassword() {
  const classes = useStyles();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams(); // Retrieve token from URL
  const history = useHistory();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("/users/reset-password", {
        token,
        newPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
        setError("");
        // Redirect to login page after successful password reset
        setTimeout(() => {
          history.push("/login");
        }, 3000);
      } else {
        setError("Failed to reset password.");
        setSuccess(false);
      }
    } catch (err) {
      setError("An error occurred while resetting password.");
      setSuccess(false);
    }
  };

  return (
    <div className="login">
        <Container component="main" maxWidth="xs" className="container1">
         <CssBaseline />
         <div className={classes.paper}>
         
           <img src={Logo} alt="" />
           <Typography component="h1" variant="h5" style={customTypographyStyle }>
           <h2>Reset Password</h2>
      {success && <p className="success">Password reset successfully!</p>}
      {error && <p className="error">{error}</p>}
           </Typography>
           <form className={classes.form} onSubmit={handleResetPassword} noValidate>
           <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
             
             <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
             
             
       
             <Button
               type="submit"
               fullWidth
               variant="contained"
               className="submit"
               style={customColorStyle} // Apply the custom style here
               >
               Reset Password
             </Button>
             <Grid container>
               <Grid item xs>
                 <Link href="" variant="body2" onClick={() => history.push("/login")} style={customTypographyStyle }>
                 Back to Login
                 </Link>
               </Grid>
             </Grid>
           </form>
         </div>
         <Box mt={8}>
           <Typography variant="body2" color="textSecondary" align="center" style={customTypographyStyle }>
             {"Copyright © "}
             <Link color="inherit" href="#" >
               Ethio Movies
             </Link>{" "}
             {new Date().getFullYear()}
             {"."}
           </Typography>
         </Box>
       </Container>
    </div>
     );
}
