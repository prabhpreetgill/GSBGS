import React, { useState, useEffect } from "react";
import "../../App.css"; // Global styles
import Sidebar from "../Sidebar/Sidebar"; // Sidebar component
import { Box, Typography } from "@mui/material"; // MUI component for layout
import Btn from "./Btn";
import TeacherBtn from "./TeacherBtn";
import TaBtn from "./TaBtn";

function Info() {
  const sidebarWidth = "150px"; // Set the width of the sidebar
  const [showTitle, setShowTitle] = useState(false);
  const [showStudentBtn, setShowStudentBtn] = useState(false);
  const [showTeacherBtn, setShowTeacherBtn] = useState(false);
  const [showTaBtn, setShowTaBtn] = useState(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 100); // Show title after 100ms
    const studentBtnTimer = setTimeout(() => setShowStudentBtn(true), 200); // Show student button after 350ms
    const teacherBtnTimer = setTimeout(() => setShowTeacherBtn(true), 400); // Show teacher button after 850ms
    const taBtnTimer = setTimeout(() => setShowTaBtn(true), 500); // Show TA button after 1100ms

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(studentBtnTimer);
      clearTimeout(teacherBtnTimer);
      clearTimeout(taBtnTimer);
    };
  }, []);

  return (
    <div className="background">
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100vw", lg: `calc(100% - ${sidebarWidth})` },
            marginLeft: { xs: "0", lg: sidebarWidth },
          }}
        >
          <Sidebar />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "30vh",
              alignItems: "center",
            }}
            className={showTitle ? "fade-in" : "hidden"}
          >
            <Typography
              fontWeight={"bold"}
              sx={{
                fontSize: { xs: "4rem", lg: "5rem" },
              }}
            >
              Report
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              justifyContent: "center",
              height: "60vh",
              alignItems: "center",
            }}
          >
            <Box className={showStudentBtn ? "fade-in" : "hidden"}>
              <Btn label="Students" delay={250} />
            </Box>
            <Box className={showTeacherBtn ? "fade-in" : "hidden"}>
              <TeacherBtn label="Teachers" />
            </Box>
            <Box className={showTaBtn ? "fade-in" : "hidden"}>
              <TaBtn label="TA" />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Info;
