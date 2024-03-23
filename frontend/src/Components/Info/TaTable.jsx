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
import { TA } from "../../Scripts/personel";
import TransitionsSnackbar from "../Enroll/Submit";
import PropTypes from "prop-types";

export default function TaTable({ url }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
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
    fetch("https://gsbgs-backend.vercel.app/api/" + url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [url, refreshTrigger]);

  console.log(data)

  const triggerRefresh = () => setRefreshTrigger((prev) => !prev);

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

  const filteredData = data?.filter(
    (row) => {
      const firstName = row["_firstName"]?.toLowerCase() || "";
      const middleName = row["_middleName"]?.toLowerCase() || "";
      const lastName = row["_lastName"]?.toLowerCase() || "";
      return (
        firstName.includes(searchQuery) ||
        middleName.includes(searchQuery) ||
        lastName.includes(searchQuery)
      );
    },
    [refreshTrigger]
  );

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

  const updateTa = new TA(firstName, middleName, lastName, email, phoneNumber);

  const handleSubmit = async () => {
    const triggerSnackbar = () => {
      setSnackbarOpen(true);
    };

    try {
      const response = await fetch(
        `https://gsbgs-backend.vercel.app/api/ta/update/${selectedPerson._id}`,
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
        console.log("Student added:", result);
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
          TA
        </DialogTitle>
        <DialogContent>
          <Box sx={rowStyle}>
            <Typography sx={{fontSize: {xs: '1.5rem', lg: '2rem'}}}>
              {`${selectedPerson._firstName} ${selectedPerson._middleName} ${selectedPerson._lastName}`}
            </Typography>
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

// Prop validation
TaTable.propTypes = {
  url: PropTypes.string.isRequired,
};
