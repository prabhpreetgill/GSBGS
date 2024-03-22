import * as React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import "../../App.css";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  let navigate = useNavigate();

  const signIn = useSignIn();
  signIn;

  const handleLogin = async (event) => {
    event.preventDefault();

    // Prepare the data to be sent in the POST request
    const loginData = {
      username, // assuming 'username' is the state variable holding the user input
      password, // assuming 'password' is the state variable holding the user input
    };

    try {
      // Make the POST request to the login API
      const response = await fetch(
        "https://gsbgs-backend.vercel.app/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData), // send the loginData object as a JSON string
        }
      );

      // Check if the login was successful
      if (response.ok) {
        const data = await response.json();
        // Assuming signIn is synchronous or does not return a Promise
        signIn({
          auth: {
            token: data.token,
            type: "Bearer",
            expiresIn: 3600,
            authState: { user: username },
          },
        });
        // Now directly navigate to home page
        navigate("/");
        console.log("Login successful:", data);
        // No need to call handleNavigation here since navigate is being called directly
      } else {
        // Handle login failure
        throw new Error(
          `Login failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      // Handle errors that occur during the fetch or due to a non-OK response
      console.error(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          bgcolor: "rgba(255, 255, 252, 1)",
          borderRadius: "25px",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          display: "flex",
          flexDirection: "column",
          width: { xs: "70vw", md: "20vw" },
          padding: 4,
          gap: 2, // Adds space between children
        }}
      >
        <Typography variant="h4" textAlign="center" mb={2}>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Sign In
        </Button>
      </Box>
    </Box>
  );
}
