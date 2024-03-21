import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Box,
  Button,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { Teacher } from "../../Scripts/personel";
import TransitionsSnackbar from "../Enroll/Submit";
import Text from "../Enroll/Text";
import PropTypes from "prop-types";

export default function TableMaker({ url }) {
  // Ensure url is received as a prop
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Corrected syntax for setting initial state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setselectedPerson] = useState({});
  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close

  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // Controls Snackbar Open/Close
  const [message, setMessage] = React.useState(""); // Stores the Snackbar Message

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const columns = [
    { id: "_firstName", label: "First Name", minWidth: isMobile ? 90 : 170 },
    { id: "_middleName", label: "Middle Name", minWidth: isMobile ? 50 : 100 },
    { id: "_lastName", label: "Last Name", minWidth: isMobile ? 90 : 170 },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://gsbgs-backend.vercel.app/api/${url}`
        );
        const result = await response.json();
        setData(result);
        // Assuming initial filtering isn't required or is handled elsewhere
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, [url, refreshTrigger]);

  // Function to handle search filtering
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item._firstName.toLowerCase().includes(lowercasedQuery) ||
        item._middleName.toLowerCase().includes(lowercasedQuery) ||
        item._lastName.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredData(filtered);
  }, [data, searchQuery]);

  const triggerSnackbar = () => {
    setSnackbarOpen(true);
  };

  async function deleteTeacher() {
    try {
      const response = await fetch(
        `https://gsbgs-backend.vercel.app/api/teacher/${selectedPerson._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Teacher successfully deleted.");
        setMessage(`Deleted ${firstName}`);
        setOpen(false);
        triggerSnackbar();
        // You can update the UI here, for example, by removing the teacher from the displayed list
      } else {
        console.error("Failed to delete Teacher.");
        // Handle failure, possibly by showing an error message to the user
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleRowClick = (student) => {
    setselectedPerson(student);
    setFirstName(student._firstName);
    setMiddleName(student._middleName);
    setLastName(student._lastName);
    setEmail(student._email);
    setPhoneNumber(student._phoneNumber);
    setOpen(true);
  };

  // Empty data check
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h2" textAlign={"center"}>
          No data available
        </Typography>
      </Box>
    );
  }

  const handleClose = () => {
    setOpen(false);
  };

  const updateTeacher = new Teacher(
    firstName,
    middleName,
    lastName,
    email,
    phoneNumber
  );

  const triggerRefresh = () => setRefreshTrigger((prev) => !prev);

  const handleSubmit = async () => {
    const triggerSnackbar = () => {
      setSnackbarOpen(true);
    };

    try {
      const response = await fetch(
        `https://gsbgs-backend.vercel.app/api/teacher/update/${selectedPerson._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateTeacher),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("teacher added:", result);
        // Handle success (e.g., show success message, clear form)
        setMessage(`Updated ${firstName}`);
        triggerSnackbar();
      } else {
        // Handle errors (e.g., show error message)
        const errorResult = await response.json();
        console.error("Error adding teacher:", errorResult.message);
        setMessage("Could not enroll teacher");
        triggerSnackbar();
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle network errors
    }
    triggerRefresh();
    setOpen(false);
  };

  return (
    <Paper
      sx={{
        width: "99%",
        overflow: "hidden",
        height: "95%",
      }}
    >
      <TextField
        label="Search"
        variant="outlined"
        sx={{ m: 2, width: { xs: "90%", lg: "95%" } }}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead
            sx={{ background: "grey", borderBottom: "2px solid black" }}
          >
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row._id}
                  onClick={() => handleRowClick(row)}
                  style={{ cursor: "pointer" }} // Optional: change cursor on hover
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={open}
        onClose={handleClose}
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
        <DialogTitle sx={{ textAlign: "center", fontSize: "3rem" }}>
          Teacher
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
              onClick={deleteTeacher} // Set onClick to the function reference
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
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSubmit}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <TransitionsSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        alert={message}
      />
    </Paper>
  );
}

// Common style for rows
const rowStyle = {
  display: "flex",
  flexDirection: { xs: "column", lg: "row" },
  justifyContent: "space-between", // Space items evenly
  width: "90%", // Full width
  padding: "10px", // Padding for each row
  margin: 1,
};

const buttonStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: { xs: "center", lg: "right" }, // Space items evenly
  padding: "10px", // Padding for each row
};

// Prop validation
TableMaker.propTypes = {
  url: PropTypes.string.isRequired,
};
