import React from "react";
import "../../App.css"; // Global styles
import Sidebar from "../Sidebar/Sidebar"; // Sidebar component
import { Box } from "@mui/material"; // MUI component for layout
import AddTerm from "./Add"; // Component to add a new term
import TermButton from "./TermButton"; // Button component related to term management

function Term() {
  const sidebarWidth = "150px"; // Set the width of the sidebar

  return (
    <div className="background">
      {" "}
      {/* Background styling from App.css */}
      <Box sx={{ height: "100vh" }}>
        {" "}
        {/* Full viewport height container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: {xs: '100vw' ,lg: `calc(100% - ${sidebarWidth})`}, // Width adjusted for sidebar
            marginLeft: {xs: '0' ,lg: sidebarWidth}, // Margin to accommodate sidebar
          }}
        >
          <Sidebar /> {/* Sidebar component */}
          <Box
            sx={{
              display: "flex",
              margin: "25px",
            }}
          >
            <AddTerm /> {/* Component for adding new terms */}
          </Box>
          <Box
            sx={{
              display: "flex",
              margin: "25px",
              flexDirection: "column",
            }}
          >
            <TermButton /> {/* Term management button */}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Term;
