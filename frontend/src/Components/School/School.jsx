import React from "react";
import "../../App.css"; // Global styles
import Sidebar from "../Sidebar/Sidebar"; // Sidebar component
import { Box, Typography } from "@mui/material"; // MUI component for layout0911
import Btn from "./Btn";
import ClassBtn from "./ClassBtn";
import TeacherBtn from "./TeacherBtn";
import TaBtn from "./TaBtn";

function Term() {
  const sidebarWidth = "150px"; // Set the width of the sidebar

  return (
    <div className="background">
      {/* Background styling from App.css */}
      <Box sx={{ height: "100vh" }}>
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
              justifyContent: "center",
              height: "30vh",
              alignItems: "center",
            }}
          >
              <Typography
                fontWeight={"bold"}
                sx={{
                  fontSize: {xs: '4rem', lg: "5rem"},
                }}
              >
                GSB School
              </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: {xs:'column', lg: "row"},
              justifyContent: "center",
              height: "60vh",
              alignItems: 'center'
            }}
          >
            <Box>
              <Btn label="Students" delay={250} />
              <ClassBtn
                label="Classes"
              />
            </Box>
            <Box
       >
              <TeacherBtn
                label="Teachers"
              />
              <TaBtn
                label="TA"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Term;
