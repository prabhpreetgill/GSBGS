import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import ClassView from "./ClassView";
import MultiText from "./MultiText";
import TransitionsSnackbar from "../Enroll/Submit";
import { useParams } from "react-router-dom";
import "../../App.css";

export default function SimpleContainer() {
  const [termData, setTermData] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [selectedClassName, setselectedClassName] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [classData, setClassData] = React.useState([]);
  const [change, setChange] = React.useState(false);

  const term = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const termResponse = await fetch(
          `https://gsbgs-backend.vercel.app/api/term/${term.termId}`
        );
        const termData = await termResponse.json();
        setTermData(termData?._classes);

        if (termData?._classes) {
          const classesResponse = await fetch(
            `https://gsbgs-backend.vercel.app/api/classes`
          );
          const classesData = await classesResponse.json();
          const filteredClasses = classesData.filter((cls) =>
            termData._classes.includes(cls._id)
          );
          setClassData(filteredClasses);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [term.termId]);

  const handleClickOpen = (id, name) => {
    setSelectedClass(id);
    setselectedClassName(name);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleClickOpen1 = () => setOpen1(true);

  const handleClose1 = () => setOpen1(false);

  const handleStudentChange = (_, newStudents) => setStudents(newStudents);

  const triggerSnackbar = () => setSnackbarOpen(true);

  const setEmpty = () => setStudents([]);

  const handleSubmit = async () => {
    if (!selectedClass || !students.length) {
      setMessage(
        "No class selected, class ID is missing, or no students selected."
      );
      triggerSnackbar();
      return;
    }

    const studentIdsToAdd = Array.isArray(students)
      ? students.map((student) => student._id)
      : [students._id];

    if (!Array.isArray(termData._students)) {
      termData._students = [];
    }

    // Combine existing student IDs with new ones, using Set to remove duplicates
    const updatedStudents = [...termData._students, ...studentIdsToAdd];
    setTermData({ ...termData, _students: updatedStudents });

    try {
      const classResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/classes/${selectedClass._id}`
      );
      const classData = await classResponse.json();
      const updatedStudents = [
        ...new Set([...classData._students, ...studentIdsToAdd]),
      ]; // Update the class with new student IDs
      await fetch(
        `https://gsbgs-backend.vercel.app/api/classes/update/${selectedClass._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _students: updatedStudents }),
        }
      );

      // Optionally, update the term if necessary
      // This step might require fetching the term data first to check if the class ID is already included
      // Assuming we have the term ID and it's stored in `termId`
      const termResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/term/${term.termId}`
      );
      const termData = await termResponse.json();

      if (!termData._classes.includes(selectedClass._id)) {
        const updatedStudents = [
          ...new Set([...termData._students, ...studentIdsToAdd]),
        ];

        await fetch(
          `https://gsbgs-backend.vercel.app/api/term/update/${term.termId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedStudents),
          }
        );
      }

      setMessage(`Added new students to ${selectedClass._name}.`);
      setChange(!change);
    } catch (error) {
      console.error("Error in operations:", error);
      setMessage(
        error.message || "An error occurred while updating the class or term."
      );
    } finally {
      triggerSnackbar();
      setEmpty(); // Reset Form Fields
      setOpen1(false); // Close Dialog after Submission
    }
  };

  const categorizedData = React.useMemo(() => {
    const friday = [];
    const saturday = [];
    const sunday = [];
    classData.forEach((element) => {
      if (element._day === "Friday") friday.push(element);
      else if (element._day === "Saturday") saturday.push(element);
      else if (element._day === "Sunday") sunday.push(element);
    });
    return { friday, saturday, sunday };
  }, [classData]);

  return (
    <Box>
      <Box />
      <Container>
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 252, 1)",
            height: "80vh",
            borderRadius: "25px",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            display: "flex",
            width: "75vw",
            backgroundPositionY: { xs: "60px", xl: "0" },
          }}
        >
          <Box
            sx={{
              marginLeft: "5%",
              display: "flex",
              flexDirection: { xs: "column", md: "column" },
              marginTop: "5%",
            }}
          >
            <Typography
              variant="h2"
              fontWeight={"bold"}
              sx={{ animationDelay: "0.1s", opacity: 0 }}
              className="fade-in"
            >
              Classes
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                width: "80vw",
                marginTop: "3%",
              }}
            >
              <Box
                sx={{
                  width: { xs: "80vw", lg: "30%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ animationDelay: "0.2s", opacity: 0 }}
                  className="fade-in"
                >
                  Friday
                </Typography>
                <Box
                  sx={{ overflow: "auto", height: { xs: "auto", lg: "50vh" } }}
                >
                  {categorizedData.friday.map((element, index) => (
                    <Button
                      key={index}
                      sx={{
                        width: "80%",
                        height: "4vh",
                        border: "2px solid black",
                        m: 1,
                        borderRadius: "10px",
                        background: "rgba(115,134,222,0.5)",
                        animationDelay: `${0.1 * index + 0.4}s`, // Correctly calculate and apply delay
                        opacity: 0,
                        "&:hover": {
                          // Styles to apply on hover
                          boxShadow: "rgba(0, 0, 0, 0.45) 0px 3px 3px",
                          transitionDuration: "0.2s",
                          background: "rgba(115,134,222,0.3)",
                          // You can add more styles here
                        },
                      }}
                      className="fade-in"
                      onClick={() => handleClickOpen(element, element._name)} // Corrected
                    >
                      <Typography
                        variant="h6"
                        color={"black"}
                        fontWeight={"bold"}
                      >
                        {element._name}
                      </Typography>
                    </Button>
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: "80vw", lg: "30%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ opacity: 0, animationDelay: "0.3s" }}
                  className="fade-in"
                >
                  Saturday
                </Typography>
                <Box
                  sx={{ overflow: "auto", height: { xs: "auto", lg: "50vh" } }}
                >
                  {categorizedData.saturday.map((element, index) => (
                    <Button
                      key={index}
                      sx={{
                        width: "80%",
                        height: "4vh",
                        border: "2px solid black",
                        m: 1,
                        borderRadius: "10px",
                        background: "rgba(148,215,202, 0.5)",
                        animationDelay: `${0.1 * index + 0.5}s`, // Correctly calculate and apply delay
                        opacity: 0,
                        "&:hover": {
                          boxShadow: "rgba(0, 0, 0, 0.45) 0px 3px 3px",
                          transitionDuration: "0.2s",
                          background: "rgba(148,215,202, 0.3)",
                        },
                      }}
                      onClick={() => handleClickOpen(element, element._name)}
                      className="fade-in"
                    >
                      <Typography
                        variant="h6"
                        color={"black"}
                        fontWeight={"bold"}
                      >
                        {element._name}
                      </Typography>
                    </Button>
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: "80vw", lg: "30%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ opacity: 0, animationDelay: "0.4s" }}
                  className="fade-in"
                >
                  Sunday
                </Typography>
                <Box
                  sx={{ overflow: "auto", height: { xs: "auto", lg: "50vh" } }}
                >
                  {categorizedData.sunday.map((element, index) => (
                    <Button
                      key={index}
                      sx={{
                        width: "80%",
                        height: "4vh",
                        border: "2px solid black",
                        m: 1,
                        borderRadius: "10px",
                        background: "rgba(237, 182, 134, 0.5)",
                        animationDelay: `${0.1 * index + 0.6}s`, // Correctly calculate and apply delay
                        opacity: 0,
                        "&:hover": {
                          // Styles to apply on hover
                          boxShadow: "rgba(0, 0, 0, 0.45) 0px 3px 3px",
                          transitionDuration: "0.2s",
                          background: "rgba(237, 182, 134, 0.3)",
                          // You can add more styles here
                        },
                      }}
                      onClick={() => handleClickOpen(element, element._name)} // Corrected
                    >
                      <Typography
                        variant="h6"
                        color={"black"}
                        fontWeight={"bold"}
                      >
                        {element._name}
                      </Typography>
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      <Dialog
        // fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            width: { xs: "80vw", lg: "50%" },
            height: "80%",
            borderRadius: "15px",
            background: "#F5FFFE",
          },
        }}
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            fontSize: { xs: "2rem", lg: "3rem" },
            textAlign: "center",
            fontWeight: "bold",
            marginTop: "5%",
          }}
        >
          {selectedClassName}
        </DialogTitle>
        <DialogContent>
          {ClassView(selectedClass._id, change)}
          <Dialog
            // fullScreen={fullScreen}
            open={open1}
            onClose={handleClose1}
            aria-labelledby="responsive-dialog-title"
            sx={{
              "& .MuiDialog-paper": {
                width: { xs: "80%", lg: "40%" },
                height: "60%",
                maxHeight: "100%",
                maxWidth: "100%",
                borderRadius: "50px",
              },
            }}
          >
            <DialogTitle
              id="responsive-dialog-title"
              sx={{
                fontSize: { xs: "2rem", lg: "3rem" },
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Add Students to {selectedClassName}
            </DialogTitle>
            <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
              <MultiText
                url="students"
                label="Students"
                value={students}
                onChange={handleStudentChange}
              />
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                margin: 2,
              }}
            >
              <Button autoFocus onClick={handleClose1}>
                Close
              </Button>
              <Button autoFocus onClick={handleSubmit}>
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", margin: 2 }}
        >
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
          <Button autoFocus onClick={handleClickOpen1}>
            Add Students
          </Button>
        </DialogActions>
      </Dialog>
      <TransitionsSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        alert={message}
      />
    </Box>
  );
}
