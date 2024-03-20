import { Box } from "@mui/material";
import Logo from "../../public/logo.jpeg"; // Ensure this path is correct
import React from "react";

function HomeLogo() {
  return (
    <Box
      sx={{
        boxSizing: "border-box", // Ensures padding and border are included in the width
        width: "100%", // Use 100% to ensure it respects the container's width
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: '20px',
      }}
    >
      <Box
        component="img"
        sx={{
          maxWidth: { xs: '90%', lg: "70%" }, // Adjusted for responsive design
          height: "auto", // Ensures the aspect ratio is maintained
        }}
        src={Logo}
        alt="Logo"
      />
    </Box>
  );
}

export default HomeLogo;
