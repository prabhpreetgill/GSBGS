import * as React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import '../../App.css';


export default function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');


  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Username:', username, 'Password:', password);
    // Add login logic here
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          bgcolor: 'rgba(255, 255, 252, 1)',
          borderRadius: '25px',
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '70vw', md: '20vw' },
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
