import * as React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import "../../App.css";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    // Prepare the data to be sent in the POST request
    const loginData = {
      username, // assuming 'username' is the state variable holding the user input
      password, // assuming 'password' is the state variable holding the user input
    };

    console.log(loginData)
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
        console.log("Login successful:", data);
        // Handle successful login here (e.g., save token, redirect user, etc.)
      } else {
        // If the response status code is not OK, throw an error with the response status text
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
