import React, { useContext, useState } from "react";
import { login } from "../../context/authContext/apiCalls";
import { AuthContext } from "../../context/authContext/AuthContext";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Logo from "../../asset/image/logo.png";
import "./login.css";

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
  marginTop: '15px',
  marginBottom: '15px',
    color: 'white',
};
const customInputStyle = {
  marginBottom: '8px',
    color: 'white',
};
export default function Auth() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and sign-in forms
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login({ email, password }, dispatch);
    } else {
      // Handle sign-in form submission
    }
  };

  return (
 <div className="login">
     <Container component="main" maxWidth="xs" className="container1">
      <CssBaseline />
      <div className={classes.paper}>
      
        <img src={Logo} alt="" />
        <Typography component="h1" variant="h5" style={customTypographyStyle }>
          {isLogin ? "Content-creator Sign in" : "Sign up"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
        <input
        style={customInputStyle}
            type="text"
            placeholder="Email or phone number"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
                  style={customInputStyle}

            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          
    
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="submit"
            disabled={isFetching}
            style={customColorStyle} // Apply the custom style here
            >
            "Sign In" 
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2"             style={customTypographyStyle }
>
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box >
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
