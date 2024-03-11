import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Text from "../Enroll/Text"; // Custom Text Input Component
import Dates from "./DatePicker"; // Custom Date Picker Component
import { Term } from "../../Scripts/school"; // Term Class/Constructor
import TransitionsSnackbar from "../Enroll/Submit"; // Snackbar Component for Notifications

function AddTerm() {
  // State Hooks
  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close
  const [termName, setTermName] = React.useState(""); // Stores the Term Name
  const [startDate, setStartDate] = React.useState(null); // Stores the Start Date
  const [endDate, setEndDate] = React.useState(null); // Stores the End Date
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // Controls Snackbar Open/Close
  const [message, setMessage] = React.useState(""); // Stores the Snackbar Message

  // Theme and Media Query for Responsive Dialog
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  // Function to Handle Form Submission
  const handleSubmit = async () => {
    const start = new Date(startDate.$y, startDate.$M, startDate.$D);
    const end = new Date(endDate.$y, endDate.$M, endDate.$D);
    const newTerm = new Term(termName, start, end); // Creating new Term object

    try {
      // API Call to Add Term
      const response = await fetch("https://gsbgs-backend.vercel.app/api/term/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTerm),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Term added:", result);
        setMessage(`Initialized Term ${termName}`);
        triggerSnackbar();
        setEmpty(); // Reset Form Fields
      } else {
        const errorResult = await response.json();
        console.error("Error adding term:", errorResult.message);
        setMessage("Could not initialize Term");
        triggerSnackbar();
      }
    } catch (error) {
      console.error("Network error:", error);
    }

    setOpen(false); // Close Dialog after Submission
  };

  // Function to Reset Form Fields
  const setEmpty = () => {
    setTermName("");
    setStartDate(null);
    setEndDate(null);
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
          Add Term
        </Button>

        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Add a New Term</DialogTitle>
          <DialogContent>
            {Text({
              label: "Term Name",
              onChange: (e) => setTermName(e.target.value),
              value: termName,
            })}
            <Dates
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} autoFocus>
              Submit
            </Button>
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

export default AddTerm;
