// AddClass.js
import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import TransitionsSnackbar from "../Enroll/Submit";
import Text from "./Text"; // Ensure this path is correct
import DayPicker from "./DayPicker";
import ClassText from "./ClassText";
import { Classes } from "../../Scripts/school";
import { useParams } from "react-router-dom";

function AddClass() {
  // State Hooks
  const [open, setOpen] = React.useState(false);
  const [className, setClassName] = React.useState("");
  const [day, setDay] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [teacher, setTeacher] = React.useState(null);
  const [ta, setTa] = React.useState(null);

  // Function to Open the Dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to Close the Dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to Trigger Snackbar
  const triggerSnackbar = () => {
    setSnackbarOpen(true);
  };

  const setEmpty = () => {
    setClassName("");
    setTeacher(null);
    setTa(null);
    setDay("");
  };

  const Term = useParams();

  

  // Function to Handle Form Submission
  const handleSubmit = async () => {
    const newClass = new Classes(className._name, day, [], [], []);
    newClass.assignTeacher(teacher._id);
    newClass.assignTA(ta._id);

    try {
      // Add the new class
      const classResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/classes/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClass),
        }
      );
      if (!classResponse.ok) throw new Error("Failed to add new class.");

      const classData = await classResponse.json();

      // Fetch and update the current term with the new class's ID
      const termResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/term/${Term.termId}`
      );
      if (!termResponse.ok) throw new Error("Failed to fetch term data.");

      const termData = await termResponse.json();
      const updatedClassesForTerm = [...termData._classes, classData._id];

      const termUpdateResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/term/update/${Term.termId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _classes: updatedClassesForTerm }),
        }
      );
      if (!termUpdateResponse.ok)
        throw new Error("Failed to update term with new class.");

      // Fetch the teacher, update their _classes array, and update the teacher in the database
      const teacherResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/teacher/${teacher._id}`
      );
      if (!teacherResponse.ok) throw new Error("Failed to fetch teacher data.");

      const teacherData = await teacherResponse.json();
      const updatedClassesForTeacher = [...teacherData._classes, classData._id];

      const teacherUpdateResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/teacher/update/${teacher._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _classes: updatedClassesForTeacher }),
        }
      );
      if (!teacherUpdateResponse.ok)
        throw new Error("Failed to update teacher with new class.");

      setMessage(
        `Added Class ${className._name} to Term ${termData._name} and updated Teacher ${teacher._id}`
      );
    } catch (error) {
      console.error("Error in operations:", error);
      setMessage(error.message || "An unexpected error occurred.");
    } finally {
      triggerSnackbar();
      setEmpty();
      setOpen(false);
    }
  };

  const handleTeacherChange = (event, newValue) => {
    // Assuming newValue is the selected teacher object or identifier
    setTeacher(newValue);
  };

  const handleTaChange = (event, newValue) => {
    // Assuming newValue is the selected TA object or identifier
    setTa(newValue);
    console.log(teacher);
  };

  const handleClassChange = (event, newClass) => {
    setClassName(newClass);
  };

  const handleDayChange = (event) => {
    setDay(event.target.value);
    console.log(day);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "85vw",
        justifyContent: "right",
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        sx={{
          padding: "10px 50px",
          marginBottom: "20px",
          background: "rgba(115,134,222,1)",
          fontWeight: "",
          "&:hover": {
            // Styles to apply on hover
            background: "rgba(148,215,202, 1)",
            color: "black",
            fontWeight: "bold",
            // You can add more styles here
          },
        }}
        onClick={handleClickOpen}
      >
        Add Class
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Class</DialogTitle>
        <DialogContent>
          <ClassText
            url="classesoffered"
            label="Class Name"
            value={className}
            onChange={handleClassChange}
          />
          <Text
            url="teacher"
            label="Teacher"
            value={teacher}
            onChange={handleTeacherChange}
          />
          <Text url="ta" label="TA" value={ta} onChange={handleTaChange} />
          <DayPicker onChange={handleDayChange} value={day} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <TransitionsSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        alert={message}
      />
    </Box>
  );
}

export default AddClass;
