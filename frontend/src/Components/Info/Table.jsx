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
  DialogContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
// import TransitionsSnackbar from "../Enroll/Submit";
import PropTypes from "prop-types";
import ClassAccodiran from "./ClassAccordian";
import HorizontalBarGraph from "./Graph";

export default function TableMaker({ url}) {
  // Ensure url is received as a prop
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [termData, setTermData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Corrected syntax for setting initial state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setselectedPerson] = useState({});
  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close
  const [taughtClasses, setTaughtClasses] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState({
    present: 0,
    late: 0,
    absent: 0,
  });
  const [attendance, setAttendance] = useState({
    present: 0,
    late: 0,
    absent: 0,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const columns = [
    { id: "_firstName", label: "First Name", minWidth: isMobile ? 90 : 170 },
    { id: "_middleName", label: "Middle Name", minWidth: isMobile ? 50 : 100 },
    { id: "_lastName", label: "Last Name", minWidth: isMobile ? 90 : 170 },
  ];

  useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/term")
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();
        const current = data.filter((term) => new Date(term._end) >= today);
        setTermData(current);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://gsbgs-backend.vercel.app/api/${url}`
        );
        const result = await response.json();
        setData(result);

        const classReponse = await fetch(
          `https://gsbgs-backend.vercel.app/api/classes`
        );
        const classData = await classReponse.json();
        setClasses(classData);
        // Assuming initial filtering isn't required or is handled elsewhere
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, [url]);

  useEffect(() => {
    if (selectedPerson !== undefined && selectedPerson._classes != undefined) {
      console.log(selectedPerson)
      const taught = classes.filter((cls) =>
        selectedPerson?._classes.includes(cls._id)
      );
      console.log(selectedPerson)

      setTaughtClasses(taught);

      let currentAttendanceCounts = {
        present: 0,
        late: 0,
        absent: 0,
      };

      selectedPerson._attendance?.forEach((status) => {
        if (status.term == termData[0]?._id) {
          if (status.status === "Present") {
            currentAttendanceCounts.present += 1;
          } else if (status.status === "Late") {
            currentAttendanceCounts.late += 1;
          } else if (status.status === "Absent") {
            currentAttendanceCounts.absent += 1;
          }
        }
      });

      setCurrentAttendance(currentAttendanceCounts);

      let attendanceCounts = {
        present: 0,
        late: 0,
        absent: 0,
      };

      selectedPerson._attendance?.forEach((status) => {
        if (status.status === "Present") {
          attendanceCounts.present += 1;
        } else if (status.status === "Late") {
          attendanceCounts.late += 1;
        } else if (status.status === "Absent") {
          attendanceCounts.absent += 1;
        }
      });

      setAttendance(attendanceCounts);
    }
  }, [selectedPerson]); // Assuming classes and setTaughtClasses are stable, could omit setTaughtClasses

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
        <DialogContent>
          <Box sx={rowStyle}>
            <Typography
              sx={{
                fontSize: { xs: "2rem", lg: "2rem" },
                textAlign: "center",
              }}
            >
              {`${selectedPerson._firstName} ${selectedPerson._middleName} ${selectedPerson._lastName}`}
            </Typography>
            <Box
              sx={{
                marginTop: "20px",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              <ClassAccodiran array={taughtClasses} />
            </Box>
            <Box
              sx={{
                marginTop: "20px",
                fontSize: "1.5rem",
                textAlign: "center",
                width: "100%",
              }}
            >
              Current Term Attendance
              <HorizontalBarGraph attendance={currentAttendance} />
            </Box>
            <Box
              sx={{
                marginTop: "20px",
                fontSize: "1.5rem",
                textAlign: "center",
                width: '100%'
              }}
            >
              Total Attendance
              <HorizontalBarGraph attendance={attendance} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Paper>
  );
}

// Common style for rows
const rowStyle = {
  display: "flex",
  flexDirection: { xs: "column" },
  justifyContent: "center", // Space items evenly
  alignItems: "center",
  width: "90%", // Full width
  padding: "10px", // Padding for each row
  margin: 1,
};

// Prop validation
TableMaker.propTypes = {
  url: PropTypes.string.isRequired,
};
