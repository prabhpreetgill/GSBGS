import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography, Container } from "@mui/material";

export default function SimpleContainer() {
  const [data, setData] = useState([]);
  const [num, setNum] = useState(0);
  const [targetNum, setTargetNum] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/term")
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();
        const current = data.filter((term) => new Date(term._end) >= today);
        setData(current);
        setIsDataLoaded(true);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (isDataLoaded && data[0] != undefined) {
      // Assuming 'data' is an array
      setTargetNum(data[0]._students?.length);
    }
  }, [isDataLoaded, data]); // Depend on isDataLoaded and data

  useEffect(() => {
    let interval;
    if (isDataLoaded && num < targetNum) {
      interval = setInterval(() => {
        setNum((prevNum) => prevNum + 1);
      }, 2000 / targetNum);
    } else if (num === targetNum) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Clear interval on cleanup
  }, [num, targetNum, isDataLoaded]); // Depend on num, targetNum, and isDataLoaded

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 252, 1)",
            height: { xs: "20vh", lg: "30vh" },
            borderRadius: "25px",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            display: "flex",
            alignItems: "center",
            backgroundImage: `url(https://www.creativefabrica.com/wp-content/uploads/2023/02/18/Abstract-pastel-color-background-design-Graphics-61598166-1.jpg)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: { xs: "80vw", lg: "40vw" },
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              fontWeight={"bold"}
              sx={{ fontSize: { xs: "1.7rem", lg: "3rem" } }}
            >
              Number of Students:
            </Typography>
            <Typography
              variant="h1"
              textAlign={"center"}
              sx={{ fontSize: { xs: "4rem", lg: "5rem" } }}
            >
              {num}
            </Typography>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
