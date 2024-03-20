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
    // Create or fetch the class as needed; assuming newClass is ready for this example
    const newClass = new Classes(className._name, day, [], [], []);

    // Update class teacher info as you've done; assuming classTeacher is ready
    const classTeacher = Teacher.fromTeacher(teacher);
    console.log(classTeacher)
    const teacherInfo = classTeacher.teacherInfo();
    classTeacher.assignClasses(className._name);

    newClass.assignTeacher(teacherInfo);
    newClass.assignTA(ta);

    try {
      // Firstly, attempt to add or update the class itself
      // Assuming this operation returns the newly created or updated class with its ID
      const classResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/classes/add`,
        {
          method: "POST", // Use POST for creating, PUT for updating
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClass),
        }
      );

      if (classResponse.ok) {
        const classData = await classResponse.json();
        // Once the class is successfully added or updated, fetch the current term
        const termResponse = await fetch(
          `https://gsbgs-backend.vercel.app/api/term/${Term._termID}`
        );
        if (termResponse.ok) {
          const termData = await termResponse.json();
          // Add the new class's ID to the term's classes array
          const updatedClasses = [...termData.classes, classData._id];
          // Update the term with the new classes array
          const termUpdateResponse = await fetch(
            `https://gsbgs-backend.vercel.app/api/term/update/${Term._termID}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...termData, classes: updatedClasses }),
            }
          );

          if (termUpdateResponse.ok) {
            setMessage(
              `Added Class ${className._name} to Term ${Term._termID}`
            );
          } else {
            throw new Error("Failed to update term with new class.");
          }
        } else {
          throw new Error("Failed to fetch term data.");
        }
      } else {
        throw new Error("Failed to add new class.");
      }
    } catch (error) {
      console.error("Error in operations:", error);
      setMessage(error.message || "An unexpected error occurred.");
    } finally {
      triggerSnackbar();
      setEmpty(); // Reset Form Fields
      setOpen(false); // Close Dialog after Submission
    }
  };

  const handleTeacherChange = (event, newValue) => {
    // Assuming newValue is the selected teacher object or identifier
    setTeacher(newValue);
  };

  const handleTaChange = (event, newValue) => {
    // Assuming newValue is the selected TA object or identifier
    setTa(newValue);
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
