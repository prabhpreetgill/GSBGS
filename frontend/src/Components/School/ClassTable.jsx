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
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
} from "@mui/material";
import Text from '../Enroll/Text'
import TransitionsSnackbar from "../Enroll/Submit";
import { ClassesOffered } from "../../Scripts/school";

const columns = [{ id: "_name", label: "Name", minWidth: 170 }];

export default function ClassTable(url) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close
  const [name, setName] = React.useState("");
  const [className, setClassName] = React.useState("");

  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // Controls Snackbar Open/Close
  const [message, setMessage] = React.useState(""); // Stores the Snackbar Message
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const triggerSnackbar = () => {
    setSnackbarOpen(true);
  };

  useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/" + url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [refreshTrigger]);

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

  const filteredData = data?.filter((row) => {
    const name = row["_name"]?.toLowerCase() || "";
    return name.includes(searchQuery);
  });

  const handleRowClick = (classes) => {
    setName(classes);
    setClassName(classes._name)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const triggerRefresh = () => setRefreshTrigger(prev => !prev);


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

  async function deleteClass() {
    try {
      const response = await fetch(
        `https://gsbgs-backend.vercel.app/api/classesoffered/${name._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Student successfully deleted.");
        setMessage(`Deleted ${name._name}`);
        setOpen(false);
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

    const updateTa = new ClassesOffered(className);

    const triggerSnackbar = () => {
      setSnackbarOpen(true);
    };

    try {
      const response = await fetch(
        `https://gsbgs-backend.vercel.app/api/classesoffered/update/${name._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateTa),
        }
      );

      if (response.ok) {
        const result = await response.json();
        triggerRefresh();
        console.log("Student added:", result);
        // Handle success (e.g., show success message, clear form)
        setMessage(`Updated ${name._name}`);
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
            <TableRow key={1}>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
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
              .map((row, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={index}
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
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            fontSize: "3rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Class
        </DialogTitle>
        <DialogContent>
          {Text({
            label: "Class Name",
            onChange: (e) => setClassName(e.target.value),
            value: className,
          })}
          <Box sx={{ ...buttonStyle, justifyContent: "space-evenly" }}>
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
              onClick={deleteClass} // Set onClick to the function reference
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
        <DialogActions sx={{ display: "flex", justifyContent: "right" }}>
          <Button autoFocus onClick={handleClose}>
            Cancel
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

const buttonStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: { xs: "center", lg: "right" }, // Space items evenly
  padding: "10px", // Padding for each row
};

