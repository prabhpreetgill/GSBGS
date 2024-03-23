import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography, Divider } from "@mui/material";
import Text from "./Text";
import Dropdown from "./Dropdown";
import Button from "@mui/material/Button";
import { Student } from "../../Scripts/personel";
import TransitionsSnackbar from "./Submit";

export default function SimpleContainer() {
  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [pFname, setpFname] = React.useState("");
  const [pMname, setpMname] = React.useState("");
  const [pLname, setpLname] = React.useState("");
  const [pEmail, setpEmail] = React.useState("");
  const [pPhone, setpPhone] = React.useState("");
  const [paid, setPaid] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState(false);

  const handleSubmit = async () => {
    const newStudent = new Student(
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      pFname,
      pMname,
      pLname,
      pEmail,
      pPhone,
      paid,
      []
    );
    console.log(newStudent);

    const triggerSnackbar = () => {
      setSnackbarOpen(true);
    };

    try {
      const response = await fetch("https://gsbgs-backend.vercel.app/api/students/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Student added:", result);
        // Handle success (e.g., show success message, clear form)
        setMessage(`Enrolled ${firstName} into GSB`);
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

    // Show snackbar (success message)
    // Assuming you have a method in TransitionsSnackbar to trigger the snackbar
  };

  function setEmpty() {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setpFname("");
    setpMname("");
    setpLname("");
    setpEmail("");
    setpPhone("");
    setPaid(false);
  }

  return (
    <Box>
      <CssBaseline />
          <Box sx={containerStyle}>
              <Typography variant="h4" sx={titleStyle}>
                Personal
              </Typography>
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
            <Divider sx={dividerStyle} />
              <Typography variant="h4" sx={titleStyle}>
                Parent
              </Typography>
            <Box sx={rowStyle}>
                {Text({
                  label: "First Name",
                  onChange: (e) => setpFname(e.target.value),
                  value: pFname,
                })}
                {Text({
                  label: "Middle Name",
                  onChange: (e) => setpMname(e.target.value),
                  value: pMname,
                })}
                {Text({
                  label: "Last Name",
                  onChange: (e) => setpLname(e.target.value),
                  value: pLname,
                })}
            </Box>
            <Box sx={rowStyle}>
                {Text({
                  label: "Email",
                  onChange: (e) => setpEmail(e.target.value),
                  value: pEmail,
                })}
                {Text({
                  label: "Phone Number",
                  onChange: (e) => setpPhone(e.target.value),
                  value: pPhone,
                })}
            </Box>
            <Divider sx={dividerStyle} />
              <Typography variant="h4" sx={titleStyle}>
                Payment Plan
              </Typography>
            <Box sx={{...rowStyle, justifyContent: 'center'}}>
                <Dropdown
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                />
            </Box>
            <Box sx={buttonStyle}>
                <Button
                  variant="contained"
                  sx={{ padding: "10px 50px", marginBottom: "20px" }}
                  onClick={handleSubmit} // Set onClick to the function reference
                >
                  Submit
                </Button>
            </Box>
          </Box>
      <TransitionsSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        alert={message}
      />
    </Box>
  );
}

// Common style for rows
const rowStyle = {
  display: "flex",
  flexDirection: {xs: 'column', lg: "row"},
  justifyContent: "space-between", // Space items evenly
  width: "90%", // Full width
  padding: {xs: '0', lg: "10px"}, // Padding for each row
  alignItems: 'center'
};

const buttonStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: {xs: 'center' , lg: "right"}, // Space items evenly
  width: "80%", // Full width
  padding: "10px", // Padding for each row
};

const containerStyle = {
  bgcolor: "rgba(255, 255, 252, 0.95)",
  height: "auto",
  borderRadius: "25px",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  width: {xs: '80vw',lg:"50vw"},
  padding: "20px", // Added padding
};

const titleStyle = {
  marginBottom: "20px",
  fontWeight: "bold",
};

const dividerStyle = {
  width: "90%",
  marginY: "20px",
  border: "1px solid black",
};
