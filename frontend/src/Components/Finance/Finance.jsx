import React from "react";
import "../../App.css"; // Global styles
import Sidebar from "../Sidebar/Sidebar"; // Sidebar component
import { Box } from "@mui/material"; // MUI component for layout0911
import Paid from "./Paid";

function Finance() {
  const sidebarWidth = "150px"; // Set the width of the sidebar

  return (
    <div className="background">
      {/* Background styling from App.css */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          width: { xs: "100vw", lg: `calc(100% - ${sidebarWidth})` }, // Width adjusted for sidebar
        }}
      >
        {/* Full viewport height container */}
        <Box>
          <Sidebar /> {/* Sidebar component */}
          <Paid/>
        </Box>
      </Box>
    </div>
  );
}

export default Finance;
