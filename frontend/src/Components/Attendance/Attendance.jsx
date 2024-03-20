import React, { useState, useEffect } from "react";
import "../../App.css";
import Sidebar from "../Sidebar/Sidebar";
import { Box, Pagination, Typography } from "@mui/material";
import ClassesContainer from "./Classses";

function Attendance() {
  const sidebarWidth = "150px";
  const [currentTerms, setCurrentTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeksInfo, setWeeksInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch terms on component mount
  useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/term")
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();
        const current = data.filter((term) => new Date(term._end) >= today);
        setCurrentTerms(current);
        setLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  function calculateWeeksBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneWeek = 1000 * 60 * 60 * 24 * 7; // milliseconds in one week
    const weeks = [];
    const options = { month: "long", day: "numeric" }; // Formatting options

    for (let i = 0; start.getTime() + oneWeek * i <= end.getTime(); i++) {
      const weekStart = new Date(start.getTime() + oneWeek * i);
      let weekEnd = new Date(weekStart.getTime() + oneWeek);

      if (weekEnd > end) weekEnd = end;

      weeks.push({
        weekNumber: i + 1,
        startDate: weekStart.toLocaleDateString("en-US", options),
        endDate: weekEnd.toLocaleDateString("en-US", options),
        rawStartDate: weekStart, // Keep the raw Date for calculations
        rawEndDate: weekEnd, // Keep the raw Date for calculations
      });
    }

    return weeks;
  }

  // Adjust this effect to calculate the current week number as the initial page
  useEffect(() => {
    if (!loading && currentTerms.length > 0) {
      const weeks = calculateWeeksBetween(
        currentTerms[0]._start,
        currentTerms[0]._end
      );
      setWeeksInfo(weeks);

      const today = new Date();
      const currentWeekIndex = weeks.findIndex(
        (week) => week.rawStartDate <= today && today <= week.rawEndDate // Use raw Date objects for comparison
      );
      setCurrentPage(currentWeekIndex + 1); // Set the current page based on the index found
    }
  }, [loading, currentTerms]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="background">
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: {xs: '100%', lg: `calc(99% - ${sidebarWidth})`},
            marginLeft: {xs: 0, lg: sidebarWidth},
          }}
        >
          <Sidebar />
          {loading ? (
            <Box>Loading...</Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "25px",
              }}
            >
              <Box sx={{ margin: "10px" }}>
                <Typography textAlign={"center"} sx={{ fontSize: "4rem" }}>
                  Week {currentPage}
                </Typography>
                <Typography textAlign={"center"} sx={{ fontSize: "2rem" }}>
                  {weeksInfo[currentPage - 1]?.startDate} to{" "}
                  {weeksInfo[currentPage - 1]?.endDate}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column", // Use column for vertical centering of internal items if needed
                  alignItems: "center", // Center items horizontally in the container
                  justifyContent: "center", // Center items vertically if flexDirection is column
                  padding: 2
                }}
              >
                <ClassesContainer week={currentPage} />
              </Box>
              <Pagination
                count={weeksInfo.length}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Attendance;
