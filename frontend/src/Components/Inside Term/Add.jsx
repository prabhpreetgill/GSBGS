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
import { Teacher } from "../../Scripts/personel";

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
    const newClass = new Classes(className._name, day, Term._termID, [], [], []);

    const classTeacher = Teacher.fromTeacher(teacher);
    const teacherInfo = classTeacher.teacherInfo();
    classTeacher.assignClasses(newClass);


    newClass.assignTeacher(teacherInfo);
    newClass.assignTA(ta);

    const id = teacher._id.toString();
    
    try {
      const response = await fetch("https://gsbgs-backend.vercel.app/api/classes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClass),
      });

      // Ensure the class is added before updating the teacher
      if (response.ok) {
        // const classData = await response.json();

        // Fetch teacher ID and Update Teacher
        // Note: Ensure that teacher._id is available and correct
        if (teacher && id) {
          const updateResponse = await fetch(
            `https://gsbgs-backend.vercel.app/api/teacher/update/${id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(classTeacher),
            }
          );

          if (updateResponse.ok) {
            const updatedTeacher = await updateResponse.json();
            setMessage(`Added Class ${className._name}`);
            console.log("Updated Teacher:", updatedTeacher);
          } else {
            throw new Error("Failed to update teacher");
          }
        } else {
          throw new Error("Teacher ID is not available");
        }

        triggerSnackbar();
        setEmpty(); // Reset Form Fields
      } else {
        throw new Error("Failed to add new class");
      }
    } catch (error) {
      console.error("Error in operations:", error);
      setMessage(error.message);
      triggerSnackbar();
    }

    setOpen(false); // Close Dialog after Submission
  };

  const handleTeacherChange = (_, newTeacher) => {
    setTeacher(newTeacher);
  };

  const handleTaChange = (_, newTa) => {
    setTa(newTa);
  };

  const handleClassChange = (_, newClass) => {
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
