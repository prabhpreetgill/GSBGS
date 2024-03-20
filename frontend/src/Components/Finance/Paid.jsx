import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";


export default function Paid() {
  
  
  
  return (
    <Box>
      <CssBaseline />
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
          <Box sx={containerStyle}>
          </Box>
      </Container>
    </Box>
  );
}

// Common style for rows
// const rowStyle = {
//   display: "flex",
//   flexDirection: {xs: 'column', lg: "row"},
//   justifyContent: "space-between", // Space items evenly
//   width: "90%", // Full width
//   padding: {xs: '0', lg: "10px"}, // Padding for each row
//   alignItems: 'center'
// };

// const buttonStyle = {
//   display: "flex",
//   flexDirection: "row",
//   justifyContent: {xs: 'center' , lg: "right"}, // Space items evenly
//   width: "80%", // Full width
//   padding: "10px", // Padding for each row
// };

const containerStyle = {
  bgcolor: "rgba(255, 255, 252, 0.95)",
  height: "auto",
  borderRadius: "25px",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  width: {xs: '80vw',lg:"50vw"},
  padding: "20px", // Added padding
};

// const titleStyle = {
//   marginBottom: "20px",
//   fontWeight: "bold",
// };

// const dividerStyle = {
//   width: "90%",
//   marginY: "20px",
//   border: "1px solid black",
// };
