import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import StudentsAccordian from "./StudentsAccordian";

export default function ClassView(url, change) {
  const [data, setData] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const [taName, setTaName] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (url) {
        setIsLoading(true); // Start loading
        try {
          const classResponse = await fetch(
            `https://gsbgs-backend.vercel.app/api/classes/${url}`
          );
          const classData = await classResponse.json();
          setData(classData);

          if (classData._teachers && classData._teachers.length > 0) {
            const teacherResponse = await fetch(
              `https://gsbgs-backend.vercel.app/api/teacher/${classData._teachers[0]}`
            );
            const teacherData = await teacherResponse.json();
            setTeacherName(
              `${teacherData._firstName} ${teacherData._middleName} ${teacherData._lastName}`
            );
          }

          if (classData._TAs && classData._TAs.length > 0) {
            const taResponse = await fetch(
              `https://gsbgs-backend.vercel.app/api/ta/${classData._TAs[0]}`
            );
            const taData = await taResponse.json();
            setTaName(
              `${taData._firstName} ${taData._middleName} ${taData._lastName}`
            );
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false); // End loading
        }
      }
    };

    fetchClassDetails();
  }, [url, change]); // Include `change` in dependencies if it affects the data fetching

  if (isLoading) {
    return (
      <Box sx={{ padding: 2 }}>
      </Box>
    );
  }

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
          <StudentsAccordian url={`classes/${url}`} change={change} />
        </Box>
      </Box>
    </Box>
  );
}
