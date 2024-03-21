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
  Box,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PropTypes from "prop-types";

export default function PaidTable({ month, term }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [change, setChange] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const columns = [
    { id: "_firstName", label: "First Name", minWidth: isMobile ? 90 : 170 },
    { id: "_middleName", label: "Middle Name", minWidth: isMobile ? 50 : 100 },
    { id: "_lastName", label: "Last Name", minWidth: isMobile ? 90 : 170 },
  ];

  useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/students")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [change]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleChequeNumberChange = (event) => {
    setChequeNumber(event.target.value);
  };

  const handleClose = () => {
    // Process the note and payment information here
    setDialogOpen(false);
    setNote("");
    setPaymentMethod("");
    setChequeNumber("");
  };

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

  const paidStudents = data?.filter((student) => {
    // Only consider students with an "Annual" payment plan
    if (student?.paymentPlan === "Annual") return true;

    // Safely check if payment for the term and month exists
    const termPayments = student._payments?.[term] || {}; // Ensure you are using term._id for correct access
    return !!termPayments[month];
  });

  const filteredData = paidStudents?.filter((row) => {
    const firstName = row["_firstName"]?.toLowerCase() || "";
    const middleName = row["_middleName"]?.toLowerCase() || "";
    const lastName = row["_lastName"]?.toLowerCase() || "";
    return (
      firstName.includes(searchQuery) ||
      middleName.includes(searchQuery) ||
      lastName.includes(searchQuery)
    );
  });

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setPaymentMethod(student?._payments[term][month]._method);
    setNote(student?._payments[term][month]._note);
    setChequeNumber(student?._payments[term][month]._chequenumber);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const newPayment = {
      _method: paymentMethod,
      _chequeNumber: chequeNumber,
      _note: note,
    };

    try {
      const response = await fetch(
        `https://gsbgs-backend.vercel.app/api/students/${selectedStudent._id}`
      );
      if (!response.ok) throw new Error("Failed to fetch student data");
      const studentData = await response.json();

      // Ensure _payments is initialized as an object if it doesn't exist
      if (!studentData._payments) {
        studentData._payments = {};
      }

      // Initialize an object for the term within _payments if it doesn't exist
      if (!studentData._payments[term]) {
        studentData._payments[term] = {};
      }

      // Directly set or update the payment for the specific month within the term
      studentData._payments[term][month] = newPayment;

      const updateResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/students/update/${selectedStudent._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _payments: studentData._payments }),
        }
      );

      if (!updateResponse.ok)
        throw new Error("Failed to update student payments");

      setDialogOpen(false);
      setNote("");
      setPaymentMethod("");
      setChequeNumber("");
      setChange(!change);

      console.log("Payment updated successfully");
    } catch (error) {
      console.error("Error updating payment:", error);
    }
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
        
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        width: "99%",
        overflowY: "scroll",
        overflowX: "hidden",
        bgcolor: "rgba(255, 255, 252, 0.95)",
        height: 'auto'
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
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogContent sx={{ padding: "20px" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              id="payment-method"
              value={paymentMethod}
              label="Payment Method"
              onChange={handlePaymentMethodChange}
              fullWidth
            >
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Cheque">Cheque</MenuItem>
              <MenuItem value="Etransfer">Etransfer</MenuItem>
            </Select>
          </FormControl>
          {paymentMethod === "Cheque" && (
            <TextField
              margin="dense"
              id="cheque-number"
              label="Cheque Number"
              type="text"
              fullWidth
              variant="outlined"
              value={chequeNumber}
              onChange={handleChequeNumberChange}
            />
          )}
          <TextField
            autoFocus
            margin="dense"
            id="note"
            label="Notes"
            type="text"
            fullWidth
            variant="outlined"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

PaidTable.propTypes = {
  month: PropTypes.string,
  term: PropTypes.string,
};
