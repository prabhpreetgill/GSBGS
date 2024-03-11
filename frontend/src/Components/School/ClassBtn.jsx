import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import ClassTable from "./ClassTable";
import Text from "../Enroll/Text";
import { ClassesOffered } from "../../Scripts/school";
import PropTypes from "prop-types";
import TransitionsSnackbar from "../Enroll/Submit";

function ClassBtn({ label }) {
  // Correct way to handle click event
  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close
  const [open1, setOpen1] = React.useState(false); // Controls the Dialog (Modal) Open/Close

  const [className, setclassName] = React.useState(""); // Stores the Term Name

  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // Controls Snackbar Open/Close
  const [message, setMessage] = React.useState(""); // Stores the Snackbar Message

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  // Function to Close the Dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  // Theme and Media Query for Responsive Dialog
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const setEmpty = () => {
    setclassName("");
  };

  const handleSubmit = async () => {
    const newClass = new ClassesOffered(className);
    console.log(newClass);

    const triggerSnackbar = () => {
      setSnackbarOpen(true);
    };

    try {
      const response = await fetch(
        "https://gsbgs-backend.vercel.app/api/classesoffered/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClass),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Class added:", result);
        // Handle success (e.g., show success message, clear form)
        setMessage(`Added ${className} into GSB`);
        triggerSnackbar();

        setEmpty();
      } else {
        // Handle errors (e.g., show error message)
        const errorResult = await response.json();
        console.error("Error adding student:", errorResult.message);
        setMessage("Could not enroll Student");
        triggerSnackbar();
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle network errors
    }
    setOpen1(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        sx={{
          padding: "10px 50px",
          width: { xs: "80vw", lg: "20vw" },
          height: { xs: "13vh", lg: "20vh" },
          display: "flex",
          justifyContent: "space-around",
          borderRadius: "30px",
          background:
            "url(https://images.template.net/115296/free-pastel-desktop-background-lu07g.jpeg)",
          backgroundSize: "cover",
          border: "none",
          margin: { xs: 2, lg: 10 },
          transitionDuration: "0.2s",
          "&:hover": {
            boxShadow: "rgba(0, 0, 0, 0.45) 0px 5px 15px",
            transitionDuration: "0.2s",
            border: "none",
          },
        }}
        onClick={handleClickOpen}
      >
        <Typography
          color="black"
          fontWeight="bold"
          sx={{ fontSize: { xs: "2.5rem", lg: "3rem" } }}
        >
          {label}
        </Typography>
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            width: {xs: '90vw', lg: "50%"},
            height: "80%",
            maxHeight: "100vh",
            maxWidth: "100vw",
          },
        }}
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ fontSize: "3rem", textAlign: "center", fontWeight: "bold" }}
        >
          Classes Offered
        </DialogTitle>
        <DialogContent>{ClassTable("classesoffered")}</DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
          <Button autoFocus onClick={handleClickOpen1}>
            Add Class
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={open1}
        onClose={handleClose1}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            width: "auto",
            height: "auto",
            maxHeight: "100vh",
            maxWidth: "100vw",
          },
        }}
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            fontSize: "3rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Add New Class
        </DialogTitle>
        <DialogContent>
          {Text({
            label: "Class Name",
            onChange: (e) => setclassName(e.target.value),
            value: className,
          })}
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button autoFocus onClick={handleClose1}>
            Cancel
          </Button>
          <Button autoFocus onClick={handleSubmit}>
            Submit
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

// PropTypes validation
ClassBtn.propTypes = {
  label: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default ClassBtn;
