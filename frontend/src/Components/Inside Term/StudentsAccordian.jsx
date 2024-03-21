import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List"; // Import the List component
import ListItem from "@mui/material/ListItem"; // Ensure ListItem is imported
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TransitionsSnackbar from "../Enroll/Submit";

export default function AccordionExpandIcon({ url, newstudent}) {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [change, setChange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the given URL
        const response = await fetch(
          `https://gsbgs-backend.vercel.app/api/${url}`
        );
        const data = await response.json();
        setAllData(data);

        const classStudentIds = data._students;

        // Fetch all students
        const studentsResponse = await fetch(
          `https://gsbgs-backend.vercel.app/api/students`
        );
        const studentsData = await studentsResponse.json();

        // Filter students whose IDs are included in the class's student IDs list
        const filteredStudents = studentsData.filter((student) =>
          classStudentIds.includes(student._id)
        );

        // Sort the filtered students by first name
        const sortedData = filteredStudents.sort((a, b) =>
          a._firstName.localeCompare(b._firstName)
        );

        // Update your state with the sorted data
        setData(sortedData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [url, change, newstudent]); // Only re-run the effect if url changes

  const updateClass = async () => {
    if (!selectedStudent) {
      setMessage("No student selected");
      triggerSnackbar();
      return;
    }

    // Assuming `selectedStudent` contains the student's ID and `allData` contains the full class data including the `_students` array
    const updatedStudentsList = allData._students.filter(
      (studentId) => studentId !== selectedStudent._id
    );

    try {
      const updateResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/classes/update/${allData._id}`, // Make sure this is the correct endpoint for updating a class
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _students: updatedStudentsList }), // Send the updated list of student IDs
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData.message || "Failed to update class with removed student"
        );
      }

      // If successful, update the UI accordingly
      setMessage(`Student removed successfully`);
      triggerSnackbar();
      setChange(!change);
      handleClose(); // Assuming this closes a modal or dialog
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        error.message || "An error occurred while removing the student."
      );
      triggerSnackbar();
    }
  };

  const handleClickOpen = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const triggerSnackbar = () => {
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Accordion
        sx={{
          width: { xs: "60vw", lg: "25vw" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "#d8e5e1",
        }}
      >
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: "#EBFCFA",
          }}
        >
          <Typography textAlign={"center"} variant="h4" fontWeight={"bold"}>
            Students
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ width: "100%" }}>
            {/* Use the List component */}
            {data?.map((student, index) => (
              <React.Fragment key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {/* Use Fragment to group items */}
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      textAlign={"center"}
                      sx={{
                        fontSize: { xs: "1rem" },
                        color: "black",
                        width: { xs: "57vw", lg: "22vw" },
                      }}
                      onClick={() => handleClickOpen(student)}
                    >
                      {`${student._firstName} ${student._middleName} ${student._lastName}`}
                    </Button>
                  </ListItem>
                  {index < data.length - 1 && (
                    <Divider
                      sx={{
                        border: "1px solid black",
                        width: { xs: "80%", lg: "22vw" },
                      }}
                    />
                  )}
                </Box>
                {/* Don't add a divider after the last item */}
              </React.Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Remove Student"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Do you want to remove ${selectedStudent?._firstName} ${selectedStudent?._middleName} ${selectedStudent?._lastName} from the class?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              updateClass();
              handleClose();
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      <TransitionsSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        alert={message}
      />
    </div>
  );
}

AccordionExpandIcon.propTypes = {
  url: PropTypes.string.isRequired,
  newstudent: PropTypes.bool
}
