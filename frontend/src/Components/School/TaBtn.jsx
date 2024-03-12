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
  Box,
} from "@mui/material";
import Table from "./TaTable";
import Text from "../Enroll/Text";
import { TA } from "../../Scripts/personel";
import TransitionsSnackbar from "../Enroll/Submit";
import PropTypes from "prop-types";

function TaBtn({ label }) {
  // Correct way to handle click event
  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close
  const [open1, setOpen1] = React.useState(false); // Controls the Dialog (Modal) Open/Close

  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

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
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
  };

  const handleSubmit = async () => {
    const newTA = new TA(firstName, middleName, lastName, email, phoneNumber);
    console.log(newTA);

    const triggerSnackbar = () => {
      setSnackbarOpen(true);
    };

    try {
      const response = await fetch(
        "https://gsbgs-backend.vercel.app/api/ta/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTA),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Student added:", result);
        // Handle success (e.g., show success message, clear form)
        setMessage(`Added ${firstName} as a GSB TA`);
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
          width: {xs: "80vw", lg: "20vw"},
          height: {xs: "13vh",lg: "20vh"},
          display: "flex",
          justifyContent: "space-around",
          borderRadius: "30px",
          background:
            "url(https://t3.ftcdn.net/jpg/02/40/43/62/360_F_240436221_fk8FMUk2YBNsijVIq1LsTJxxZ0gtYkY3.jpg)",
          backgroundSize: "cover",
          border: "none",
          margin: {xs: 2, lg: 10},
          transitionDuration: "0.2s",
          "&:hover": {
            boxShadow: "rgba(0, 0, 0, 0.45) 0px 5px 15px",
            transitionDuration: "0.2s",
            border: "none",
          },
        }}
        onClick={handleClickOpen}
      >
        <Typography color="black" fontWeight="bold" sx={{fontSize: {xs: '2.5rem', lg: "3rem"}}} >
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
          Teacher Assistants
        </DialogTitle>
        <DialogContent>
          {Table("ta")}
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
              Add New TA
            </DialogTitle>
            <DialogContent>
              <Box sx={rowStyle}>
                {Text({
                  label: "First Name",
                  onChange: (e) => setFirstName(e.target.value),
                  value: firstName,
                })}
                {Text({
                  label: "Middle Name",
                  onChange: (e) => setMiddleName(e.target.value),
                  value: middleName,
                })}
                {Text({
                  label: "Last Name",
                  onChange: (e) => setLastName(e.target.value),
                  value: lastName,
                })}
              </Box>
              <Box sx={rowStyle}>
                {Text({
                  label: "Email",
                  onChange: (e) => setEmail(e.target.value),
                  value: email,
                })}
                {Text({
                  label: "Phone Number",
                  onChange: (e) => setPhoneNumber(e.target.value),
                  value: phoneNumber,
                })}
              </Box>
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
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
          <Button autoFocus onClick={handleClickOpen1}>
            Add TA
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
TaBtn.propTypes = {
  label: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default TaBtn;

// Common style for rows
const rowStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between", // Space items evenly
  width: "90%", // Full width
  padding: "10px", // Padding for each row
  margin: 1,
};
