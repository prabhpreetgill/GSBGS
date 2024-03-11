import { Box } from "@mui/material";
import Logo from "../../public/logo.jpeg";
import React from "react";

function HomeLogo() {
  return (
    <Box
      sx={{
        boxSizing: "border-box", // Ensures padding and border are included in the width
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: '20px'
      }}
    >
      <Box
        component="img"
        sx={{ sr: { Logo }, width: {xs: '90vw', lg: "70vw"} }}
        src={Logo}
        alt="Logo"
      ></Box>
    </Box>
  );
}

export default HomeLogo;
