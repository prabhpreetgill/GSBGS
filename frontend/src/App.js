import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import DateContainer from "./Components/Homepage/DateContainer";
import { Box } from "@mui/material";
import StudentContainer from "./Components/Homepage/StudentContainer";
import HomeLogo from "./Components/Homepage/Logo";

function App() {
  const [loadSequence, setLoadSequence] = useState({
    logoLoaded: false,
    dateContainerLoaded: false,
    studentContainerLoaded: false,
  });
  const sidebarWidth = "150px";

  useEffect(() => {
    setTimeout(() => {
      setLoadSequence((prev) => ({ ...prev, logoLoaded: true }));
      setTimeout(() => {
        setLoadSequence((prev) => ({ ...prev, dateContainerLoaded: true }));
        setTimeout(() => {
          setLoadSequence((prev) => ({ ...prev, studentContainerLoaded: true }));
        }, 200); // Additional delay for StudentContainer
      }, 200); // Delay after Logo for DateContainer
    }, 200); // Initial delay for Logo
  }, []);

  return (
    <div className="background">
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100vw", lg: `calc(100% - ${sidebarWidth})` },
            marginLeft: { xs: "none", lg: sidebarWidth },
          }}
        >
          <Sidebar />
          <Box
            sx={{
              height: { xs: "40vh", lg: "65vh" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: { xs: "50px", lg: "0" },
            }}
            className={loadSequence.logoLoaded ? "fade-in" : "hidden"}
          >
            <HomeLogo />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              height: { xs: "55vh", lg: "auto" },
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Box className={loadSequence.dateContainerLoaded ? "fade-in" : "hidden"}>
              <DateContainer />
            </Box>
            <Box className={loadSequence.studentContainerLoaded ? "fade-in" : "hidden"}>
              <StudentContainer />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}


export default App;
