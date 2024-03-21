import React from "react";
import "../../App.css"; // Global styles
import Sidebar from "../Sidebar/Sidebar"; // Sidebar component
import { Box } from "@mui/material"; // MUI component for layout0911
import Class from "./Classes";
import AddClass from "./Add";

function Term() {
  const sidebarWidth = "150px"; // Set the width of the sidebar

  return (
    <div className="background">
      {/* Background styling from App.css */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          width: { xs: "100vw", sm: `calc(100% + ${sidebarWidth})`, xl: `calc(100% - ${sidebarWidth})` }, // Width adjusted for sidebar
        }}
      >
        {/* Full viewport height container */}
        <Box>
          <Sidebar /> {/* Sidebar component */}
          <Box
            sx={{
              display: "flex",
              margin: "25px",
              flexDirection: "column",
            }}
          >
            <AddClass />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Class />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Term;
