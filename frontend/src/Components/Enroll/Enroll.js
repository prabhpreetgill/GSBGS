import React, { useState, useEffect } from "react";
import "../../App.css";
import Sidebar from "../Sidebar/Sidebar";
import { Box } from "@mui/material";
import Form from "./Form";
import "../../App.css";

function Enroll() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const sidebarWidth = "150px"; // Replace with the actual width of your sidebar

  useEffect(() => {
    // This timeout will make the Form visible after a delay
    const timer = setTimeout(() => {
      setIsFormVisible(true);
    }, 50); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className="background">
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100vw", lg: `calc(100% - ${sidebarWidth})` }, // Dynamically calculate width
          marginLeft: { xs: "0", lg: sidebarWidth },
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5
        }}
      >
        <Box
          sx={{
            display: "flex",
            margin: "25px",
            justifyContent: 'center',
            alignItems: 'center'
          }}
          className={isFormVisible ? "fade-in" : "hidden"}
        >
          <Form />
        </Box>
      </Box>
    </div>
  );
}

export default Enroll;
