import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import PropTypes from "prop-types"; // Import PropTypes for validation

export default function Students({ url, week }) {
  // Correctly receive url as a prop
  const [data, setData] = useState({ _teachers: [], _TAs: [], _students: [] });
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://gsbgs-backend.vercel.app/api/classes/${url}`
        );
        const newData = await response.json();
        setData(newData);
        const initialAttendance = {};
        [...newData._teachers, ...newData._TAs, ...newData._students].forEach(
          (person) => {
            initialAttendance[person._id] = "present"; // Ensure your data has _id for each person
          }
        );
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [url]);

  const updateStudent = (id, status) => {
    setData((currentData) => {
      // Map through _students to find the student by id and update their attendance
      const updatedStudents = currentData._students.map((student) => {
        if (student._id === id) {
          // Assuming there's a way to structure attendance, e.g., an array of records
          const updatedAttendance = {
            className: data?._name,
            date: `Week: ${week}`,
            status: status,
          };

          // Update or initialize the student's attendance array
          const newAttendanceRecords = student.attendanceRecords
            ? [...student.attendanceRecords, updatedAttendance]
            : [updatedAttendance];

          return { ...student, _attendance: newAttendanceRecords };
        }
        return student;
      });

      return { ...currentData, _students: updatedStudents };
    });
  };

  const updateTeacher = (id, status) => {
    setData((currentData) => {
      // Map through _students to find the student by id and update their attendance
      const updatedTeachers = currentData._teachers.map((teacher) => {
        if (teacher._id === id) {
          // Assuming there's a way to structure attendance, e.g., an array of records
          const updatedAttendance = {
            className: data?._name,
            date: `Week: ${week}`,
            status: status,
          };

          // Update or initialize the student's attendance array
          const newAttendanceRecords = teacher.attendanceRecords
            ? [...teacher.attendanceRecords, updatedAttendance]
            : [updatedAttendance];

          return { ...teacher, _attendance: newAttendanceRecords };
        }
        return teacher;
      });

      return { ...currentData, _students: updatedTeachers };
    });
  };

  const updateTA = (id, status) => {
    setData((currentData) => {
      // Map through _students to find the student by id and update their attendance
      const updatedTA = currentData._TAs.map((ta) => {
        if (ta._id === id) {
          // Assuming there's a way to structure attendance, e.g., an array of records
          const updatedAttendance = {
            className: data?._name,
            date: `Week: ${week}`,
            status: status,
          };

          // Update or initialize the student's attendance array
          const newAttendanceRecords = ta.attendanceRecords
            ? [...ta.attendanceRecords, updatedAttendance]
            : [updatedAttendance];

          return { ...ta, _attendance: newAttendanceRecords };
        }
        return ta;
      });

      return { ...currentData, _students: updatedTA };
    });
  };

  useEffect(() => {
    console.log(data._teachers);
  }, [data._teachers]); // This useEffect will run whenever data._students changes

  const handleAttendanceChangeStudent = (id, event) => {
    setAttendance({ ...attendance, [id]: event.target.value });
    updateStudent(id, event.target.value);
  };

  const handleAttendanceChangeTeacher = (id, event) => {
    setAttendance({ ...attendance, [id]: event.target.value });
    updateTeacher(id, event.target.value);
  };

  const handleAttendanceChangeTa = (id, event) => {
    setAttendance({ ...attendance, [id]: event.target.value });
    updateTA(id, event.target.value);
  };

  if (
    !data ||
    ((data._teachers?.length || 0) === 0 &&
      (data._TAs?.length || 0) === 0 &&
      (data._students?.length || 0) === 0)
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Teachers */}
      <Typography variant="h5" sx={{ my: 2 }}>
        TEACHERS
      </Typography>
      {data._teachers.map((teacher) => (
        <Box
          key={teacher._id}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: 2,
          }}
        >
          <Typography sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}>
            {teacher.firstName} {teacher.lastName}
          </Typography>
          <RadioGroup
            row
            name={`attendance-${teacher._id}`}
            value={attendance[teacher._id] || "present"}
            onChange={(e) => handleAttendanceChangeTeacher(teacher._id, e)}
          >
            {["Present", "Late", "Absent"].map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}

      {/* TAs */}
      <Typography variant="h5" sx={{ my: 2 }}>
        TAs
      </Typography>
      {data._TAs.map((ta) => (
        <Box
          key={ta._id}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: 2,
          }}
        >
          <Typography sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}>
            {ta._firstName} {ta._lastName}
          </Typography>
          <RadioGroup
            row
            name={`attendance-${ta._id}`}
            value={attendance[ta._id] || "present"}
            onChange={(e) => handleAttendanceChangeTa(ta._id, e)}
          >
            {["Present", "Late", "Absent"].map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}

      {/* Students */}
      <Typography variant="h5" sx={{ my: 2 }}>
        STUDENTS
      </Typography>
      {data._students.map((student) => (
        <Box
          key={student._id}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: 2,
          }}
        >
          <Typography sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }}>
            {student._firstName} {student._lastName}
          </Typography>
          <RadioGroup
            row
            name={`attendance-${student._id}`}
            value={attendance[student._id] || "present"}
            onChange={(e) => handleAttendanceChangeStudent(student._id, e)}
          >
            {["Present", "Late", "Absent"].map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}
    </Box>
  );
}

Students.propTypes = {
  url: PropTypes.string.isRequired, // Validate url is a string and required
  week: PropTypes.shape({
    // Assuming week is an object with specific properties
    start: PropTypes.string, // Example property inside week object
    end: PropTypes.string, // Example property inside week object
    // Add more properties as needed, based on the structure of your week object
  }), // week is an object, but not marked as required; adjust based on your use case
};
