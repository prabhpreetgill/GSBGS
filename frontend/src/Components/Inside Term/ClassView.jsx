import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import StudentsAccordian from "./StudentsAccordian";

export default function ClassView(url) {
  const [data, setData] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const [taName, setTaName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(url != undefined){
        const response = await fetch(
          `https://gsbgs-backend.vercel.app/api/classes/${url}`
        );
        const data = await response.json();
        setData(data);
        setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();

    if (!loading) {
      setTeacherName(
        `${data?._teachers[0].firstName} ${data?._teachers[0].middleName} ${data?._teachers[0].lastName}`
      );
      setTaName(
        `${data?._TAs[0]._firstName} ${data?._TAs[0]._middleName} ${data?._TAs[0]._lastName}`
      );
    }
  }, [url]); // Only re-run the effect if url changes

  // Empty data check
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h2" textAlign={"center"}>
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            fontWeight={"bold"}
            sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}
          >
            Teacher
          </Typography>
          <Typography sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}>
            {teacherName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            fontWeight={"bold"}
            sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}
          >
            TA
          </Typography>
          <Typography sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}>
            {taName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            fontWeight={"bold"}
            sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}
          >
            Day
          </Typography>
          <Typography sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}>
            {data._day}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            marginTop: "15px",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <StudentsAccordian url={`classes/${url}`} />
        </Box>
      </Box>
    </Box>
  );
}
