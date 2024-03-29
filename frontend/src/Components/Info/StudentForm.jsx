import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography, Divider } from "@mui/material";
import Container from "@mui/material/Container";
import Text from "../Enroll/Text";
import Dropdown from "../Enroll/Dropdown";
import Button from "@mui/material/Button";
import { Student } from "../../Scripts/personel";
import TransitionsSnackbar from "../Enroll/Submit";
import PropTypes from "prop-types";

export default function StudentForm({ studentId }) {
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

  React.useEffect(() => {
    if (studentId) {
      const fetchStudentData = async () => {
        try {
          const response = await fetch(
            `https://gsbgs-backend.vercel.app/api/students/${studentId}`
          );
          if (!response.ok) throw new Error("Student data fetch failed");
          const data = await response.json();
          setFirstName(data._firstName);
          setMiddleName(data._middleName);
          setLastName(data._lastName);
          setEmail(data._email);
          setPhoneNumber(data._phoneNumber);
          setpFname(data._pFname);
          setpMname(data._pMname);
          setpLname(data._pLname);
          setpEmail(data._pEmail);
          setpPhone(data._pPhone);
          setPaid(data.paymentPlan);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchStudentData();
    }
  }, [studentId]);
  const triggerSnackbar = () => {
    setSnackbarOpen(true);
  };

  async function deleteStudent() {
    try {
      const response = await fetch(
        `https://gsbgs-backend.vercel.app/api/students/${studentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Student successfully deleted.");
        setMessage(`Deleted ${firstName}`);
        triggerSnackbar();
        // You can update the UI here, for example, by removing the student from the displayed list
      } else {
        console.error("Failed to delete student.");
        // Handle failure, possibly by showing an error message to the user
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    }
  }

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
      paid
    );

    console.log(studentId)

    try {
      const response = await fetch(
        `https://gsbgs-backend.vercel.app/api/students/update/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStudent),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Student Updated:", result);
        // Handle success (e.g., show success message, clear form)
        setMessage(`Updated ${firstName}`);
        triggerSnackbar();
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

  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
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
          <Box sx={rowStyle}>
            <Dropdown value={paid} onChange={(e) => setPaid(e.target.value)} />
          </Box>
          <Box sx={{ ...buttonStyle, justifyContent: "space-between" }}>
            <Button
              variant="contained"
              sx={{
                padding: "10px 50px",
                marginBottom: "20px",
                background: "#FF6F84",
                ":hover": {
                  background: "#F73c3f",
                },
              }}
              onClick={deleteStudent} // Set onClick to the function reference
            >
              Delete
            </Button>
            <Button
              variant="contained"
              sx={{
                padding: "10px 50px",
                marginBottom: "20px",
                background: "#6F9CFF",
              }}
              onClick={handleSubmit} // Set onClick to the function reference
            >
              Update
            </Button>
          </Box>
        </Box>
      </Container>
      <TransitionsSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        alert={message}
      />
    </React.Fragment>
  );
}

// Common style for rows
const rowStyle = {
  display: "flex",
  flexDirection: { xs: "column", lg: "row" },
  justifyContent: "space-between", // Space items evenly
  width: "100%", // Full width
  padding: { xs: "0", lg: "10px" }, // Padding for each row
  alignItems: "center",
};

const buttonStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: { xs: "center", lg: "right" }, // Space items evenly
  width: "80%", // Full width
  padding: "10px", // Padding for each row
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

StudentForm.propTypes = {
  studentId: PropTypes.string,
};
