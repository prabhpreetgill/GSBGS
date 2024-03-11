import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import DateContainer from "./Components/Homepage/DateContainer";
import { Box } from "@mui/material";
import StudentContainer from "./Components/Homepage/StudentContainer";
import HomeLogo from "./Components/Homepage/Logo";
import React from "react";

function App() {
  const sidebarWidth = "150px"; // Replace with the actual width of your sidebar

  return (
    <div className="background">
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100vw", lg: `calc(100% - ${sidebarWidth})` }, // Dynamically calculate width
            marginLeft: { xs: "none", lg: sidebarWidth },
          }}
        >
          <Sidebar />
          <Box
            sx={{
              height: { xs: "40vh", lg: "auto" },
              display: "flex",
              justifyContent: "end",
              paddingTop: {xs: '50px', lg:'0'}
            }}
          >
            <HomeLogo />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              height: { xs: "55vh", lg: "auto" },
              alignItems: "center",
              justifyContent: 'space-evenly'
            }}
          >
            <Box>
              <DateContainer />
            </Box>
            <Box>
              <StudentContainer />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
