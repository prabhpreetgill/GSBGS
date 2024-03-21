import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import PropTypes from "prop-types"; // Import PropTypes for validation

export default function Students({ url, week, onClose, message, snackbar }) {
  // Correctly receive url as a prop
  const [data, setData] = useState({ _teachers: [], _TAs: [], _students: [] });
  const [attendance, setAttendance] = useState({});
  const [teacher, setTeacher] = useState([]);
  const [ta, setTa] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentAttendence, setStudentAttendence] = useState([]);
  const [teacherAttendence, setTeacherAttendence] = useState([]);
  const [taAttendence, setTaAttendence] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://gsbgs-backend.vercel.app/api/classes/${url}`
        );
        const newData = await response.json();
        setData(newData);

        const teacherResponse = await fetch(
          `https://gsbgs-backend.vercel.app/api/teacher/${newData._teachers[0]}`
        );
        const teacherData = await teacherResponse.json();
        setTeacher(teacherData);

        const taResponse = await fetch(
          `https://gsbgs-backend.vercel.app/api/ta/${newData._TAs[0]}`
        );
        const taData = await taResponse.json();
        setTa(taData);

        const studentResponse = await fetch(
          `https://gsbgs-backend.vercel.app/api/students`
        );
        const studentData = await studentResponse.json();

        const studentIds = newData._students || [];

        // Filter the students whose IDs are included in `newData._students`
        const filteredStudents = studentData.filter((student) =>
          studentIds.includes(student._id)
        );

        // Update state with the filtered students
        setStudents(filteredStudents);

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
    const updatedAttendance = {
      className: data?._name,
      date: `Week: ${week}`,
      status: status,
      term: data._term,
    };

    setStudentAttendence((prevAttendance) => ({
      ...prevAttendance,
      [id]: updatedAttendance, // Assuming you want to keep the latest attendance status
    }));
  };

  const updateTeacher = (id, status) => {
    const updatedAttendance = {
      className: data?._name,
      date: `Week: ${week}`,
      status: status,
      term: data._term,
    };

    setTeacherAttendence(updatedAttendance);
  };

  const updateTA = (id, status) => {
    const updatedAttendance = {
      className: data?._name,
      date: `Week: ${week}`,
      status: status,
      term: data._term,
    };

    setTaAttendence(updatedAttendance);
  };

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

  const handleSubmit = async () => {
    try {
      // Define the week's identifier
      const weekIdentifier = `Week: ${week}`;

      // Helper function to update attendance for a given person (teacher, TA, or student)
      const updateAttendanceForPerson = async (
        personType,
        personId,
        attendanceRecord
      ) => {
        const response = await fetch(
          `https://gsbgs-backend.vercel.app/api/${personType}/${personId}`
        );
        const personData = await response.json();
        // Check if there's already an attendance record for this week
        let attendanceUpdated = false;
        const updatedAttendance = personData._attendance.map((record) => {
          if (record.date === weekIdentifier) {
            attendanceUpdated = true;
            return { ...record, ...attendanceRecord }; // Merge existing record with new attendance info
          }
          return record;
        });
        // If the week's record wasn't found, add a new one
        if (!attendanceUpdated) {
          updatedAttendance.push({ ...attendanceRecord, date: weekIdentifier });
        }

        await fetch(
          `https://gsbgs-backend.vercel.app/api/${personType}/update/${personId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _attendance: updatedAttendance }),
          }
        );
      };

      if (teacherAttendence != undefined) {
        // Update attendance for the teacher
        await updateAttendanceForPerson(
          "teacher",
          teacher._id,
          teacherAttendence
        );
      }

      if (taAttendence != undefined) {
        // Update attendance for the TA
        await updateAttendanceForPerson("ta", ta._id, taAttendence);
      }

      if (studentAttendence != undefined) {
        // Update attendance for each student
        for (const student of students) {
          await updateAttendanceForPerson(
            "students",
            student._id,
            studentAttendence[student._id]
          );
        }
        message("Saved Attendance");
        if (onClose) {
          onClose(); // This will call the handleClose function passed from ClassesContainer
        }
      }
    } catch (error) {
      console.error("Error in operations:", error);
      message("Could not save Attendance");
    } finally {
      setAttendance([]);
      setTaAttendence([]);
      setStudentAttendence([]);
      setTeacherAttendence([]);
      snackbar();
    }
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
          {teacher._firstName} {teacher._lastName}
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

      {/* TAs */}
      <Typography variant="h5" sx={{ my: 2 }}>
        TAs
      </Typography>
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

      {/* Students */}
      <Typography variant="h5" sx={{ my: 2 }}>
        STUDENTS
      </Typography>
      {students.map((student) => (
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
      <Button
        variant="contained"
        sx={{ padding: "10px 50px", marginBottom: "20px" }}
        onClick={handleSubmit} // Set onClick to the function reference
      >
        Save
      </Button>
    </Box>
  );
}

Students.propTypes = {
  url: PropTypes.string, // Other prop types
  week: PropTypes.number.isRequired,
  onClose: PropTypes.func, // Ensure this matches the casing and is marked as required if necessary
  message: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired,
};
