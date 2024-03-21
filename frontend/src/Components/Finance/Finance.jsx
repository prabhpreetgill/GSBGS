import React, { useState, useEffect } from "react";
import {
  Box,
  Pagination,
  Typography,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import Unpaid from "./Unpaid";
import Paid from "./Paid";
import PropTypes from "prop-types";
import "../../App.css";

export default function Finance() {
  const [currentTerms, setCurrentTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthsInfo, setMonthsInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sidebarWidth = "150px";

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

  useEffect(() => {
    if (!loading && currentTerms.length > 0) {
      const months = calculateMonthsBetween(
        currentTerms[0]._start,
        currentTerms[0]._end
      );
      setMonthsInfo(months);

      const today = new Date();
      const currentMonthIndex = months.findIndex(
        (month) => month.rawStartDate <= today && today <= month.rawEndDate
      );
      setCurrentPage(currentMonthIndex + 1);
    }
  }, [loading, currentTerms]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="background">
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", lg: `calc(99% - ${sidebarWidth})` },
            marginLeft: { xs: 0, lg: sidebarWidth },
          }}
        >
          <Sidebar />
          {loading ? (
            <Box></Box>
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
              <Typography
                textAlign={"center"}
                sx={{
                  fontSize: {
                    xs: "3rem",
                    md: "4rem",
                    animationDelay: "0.2s",
                    opacity: 0,
                  },
                }}
                className="fade-in"
              >
                {monthsInfo[currentPage - 1]?.startDate}
              </Typography>
              {isMobile ? (
                <>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ marginBottom: "20px", opacity: 0, animationDelay: '0.3s'}}
                    className="fade-in"
                  >
                    <Tab label="Unpaid" />
                    <Tab label="Paid" />
                  </Tabs>
                  {tabValue === 0 && (
                    <Box
                      sx={{ animationDelay: "0.3s", opacity: 0 }}
                      className="fade-in"
                    >
                      <Unpaid
                        month={monthsInfo[currentPage - 1]?.formatted}
                        term={currentTerms[0]?._id}
                      />
                    </Box>
                  )}
                  {tabValue === 1 && (
                    <Box
                      sx={{ animationDelay: "0.4s", opacity: 0 }}
                      className="fade-in"
                    >
                      <Paid
                        month={monthsInfo[currentPage - 1]?.formatted}
                        term={currentTerms[0]?._id}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    margin: 3,
                    width: "80vw",
                  }}
                >
                  <Box
                    sx={{ animationDelay: "0.3s", opacity: 0 }}
                    className="fade-in"
                  >
                    <Unpaid
                      month={monthsInfo[currentPage - 1]?.formatted}
                      term={currentTerms[0]?._id}
                    />
                  </Box>
                  <Box
                    sx={{ animationDelay: "0.4s", opacity: 0 }}
                    className="fade-in"
                  >
                    <Paid
                      month={monthsInfo[currentPage - 1]?.formatted}
                      term={currentTerms[0]?._id}
                    />
                  </Box>
                </Box>
              )}
              <Pagination
                count={monthsInfo.length}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
                sx={{ marginTop: 3 }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

Finance.propTypes = {
  month: PropTypes.string,
  term: PropTypes.string,
};

function calculateMonthsBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];
  const options = { year: "numeric", month: "long" }; // Formatting options

  let currentMonth = new Date(start.getFullYear(), start.getMonth(), 1); // Start from the first day of the start month

  while (currentMonth <= end) {
    let monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ); // Last day of the current month
    if (monthEnd > end) monthEnd = new Date(end);

    months.push({
      monthName: currentMonth.toLocaleDateString("en-US", { month: "long" }),
      year: currentMonth.getFullYear(),
      formatted: currentMonth.toLocaleDateString("en-US", options),
      startDate: currentMonth.toLocaleDateString("en-US", options),
      endDate: monthEnd.toLocaleDateString("en-US", options),
      rawStartDate: new Date(currentMonth), // Keep the raw Date for calculations
      rawEndDate: monthEnd, // Keep the raw Date for calculations
    });

    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    ); // Move to the first day of the next month
  }

  return months;
}
