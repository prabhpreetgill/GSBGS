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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import StudentForm from "./StudentForm";


export default function StudentTable(url) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});

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
  }, []);

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

  const filteredData = data.filter((row) => {
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
    setDialogOpen(true);
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
                  key={row.id}
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogContent sx={{padding: '20px'}}>
        <StudentForm studentId={selectedStudent._id} />
      </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
