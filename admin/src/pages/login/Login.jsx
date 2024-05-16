import React, { useContext, useState } from "react";
import { login } from "../../context/authContext/apiCalls";
import { AuthContext } from "../../context/authContext/AuthContext";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
  backgroundColor: ' #e9b14c ', // Background color
  color: 'black', // Text color
};
const customInputStyle = {
  borderRadius: '5px',
  backgroundColor: 'white',
  color: 'white',
};
const customTypographyStyle = {
  // borderRadius: '5px',
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
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <img src={Logo} alt="" />
        <Typography component="h1" variant="h5" style={customTypographyStyle }>
          {isLogin ? "Admin Sign in" : "Sign up"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            style={customInputStyle }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            style={customInputStyle }

            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" style={customTypographyStyle }/>}
              label="Remember me"
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="submit"
            disabled={isFetching}
            style={customColorStyle} // Apply the custom style here
            >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2"             style={customTypographyStyle }
>
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center" style={customTypographyStyle }>
          {"Copyright © "}
          <Link color="inherit" href="https://mui.com/" >
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
