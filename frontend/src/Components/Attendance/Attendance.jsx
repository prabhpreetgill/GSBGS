import React from "react";
import "../../App.css"; // Global styles
import Sidebar from "../Sidebar/Sidebar"; // Sidebar component
import { Box } from "@mui/material"; // MUI component for layout

function Attendance() {
  const sidebarWidth = "150px"; // Set the width of the sidebar

  const [currentTerms, setCurrentTerms] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  let weeks = 0;

  // Fetch terms on component mount
  React.useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/term")
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();

        // Filter current and previous terms based on end date
        const current = data.filter((term) => new Date(term._end) >= today);
        setCurrentTerms(current);
        setLoading(false);
        console.log(current)
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  function calculateWeeksBetween(startDate, endDate) {
    // Convert input strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid date(s)";
    }
  
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const differenceInDays = Math.abs((end - start) / oneDay);
    return Math.ceil(differenceInDays / 7);
  }

  if(!loading){
    weeks = calculateWeeksBetween(currentTerms[0]._start, currentTerms[0]._end);
    console.log(weeks)
  }

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
            width: `calc(100% - ${sidebarWidth})`, // Width adjusted for sidebar
            marginLeft: sidebarWidth, // Margin to accommodate sidebar
          }}
        >
          <Sidebar /> {/* Sidebar component */}
          <Box
            sx={{
              display: "flex",
              margin: "25px",
            }}
          >
          </Box>
          {weeks}
          <Box
            sx={{
              display: "flex",
              margin: "25px",
              flexDirection: "column",
            }}
          >
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Attendance;
