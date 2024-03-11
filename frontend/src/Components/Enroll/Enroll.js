import "../../App.css";
import Sidebar from "../Sidebar/Sidebar";
import { Box } from "@mui/material";
import Form from "./Form";
import React from "react";

function Enroll() {
  const sidebarWidth = "150px"; // Replace with the actual width of your sidebar

  return (
    <div className="background">
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: {xs: '100vw', lg: `calc(100% - ${sidebarWidth})`}, // Dynamically calculate width
            marginLeft: {xs: '0' ,lg: sidebarWidth},
          }}
        >
          <Sidebar />
          <Box
            sx={{
              display: "flex",
              margin: "25px",
            }}
          >
            <Form />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Enroll;
