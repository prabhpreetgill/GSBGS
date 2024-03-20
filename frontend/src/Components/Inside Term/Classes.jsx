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
import { Classes } from "../../Scripts/school";
import TransitionsSnackbar from "../Enroll/Submit";
import { useParams } from "react-router-dom";

export default function SimpleContainer() {
  const [termData, setTermData] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close
  const [open1, setOpen1] = React.useState(false); // Controls the Dialog (Modal) Open/Close
  const [selectedClass, setSelectedClass] = React.useState("");
  const [selectedClassName, setselectedClassName] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [classData, setClassData] = React.useState([]);

  const handleClickOpen = React.useCallback((id, name) => {
    setSelectedClass(id);
    setselectedClassName(name);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleStudentChange = (_, newStudents) => {
    setStudents(newStudents);
  };

  const triggerSnackbar = () => {
    setSnackbarOpen(true);
  };

  const setEmpty = () => {
    setStudents([]);
  };

  const handleSubmit = async () => {
    if (!selectedClass) {
      setMessage("No class selected or class ID is missing");
      triggerSnackbar();
      return;
    }

    const id = selectedClass._id; // Assuming selectedClass contains an _id field
    const updateClass = Classes.fromClasses(selectedClass);
    console.log(id);

    // Concatenate the existing students with the new ones
    const updatedStudents = [...updateClass._students, ...students];

    // Enroll the students
    updateClass.enrollStudents(updatedStudents);

    try {
      const updateResponse = await fetch(
        `https://gsbgs-backend.vercel.app/api/classes/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateClass),
        }
      );

      if (updateResponse.ok) {
        const updatedClass = await updateResponse.json();
        setMessage(
          `Class updated successfully. Class Name: ${updatedClass.name}`
        );
        console.log("Updated Class:", updatedClass);
      } else {
        const errorResult = await updateResponse.json();
        throw new Error(errorResult.message || "Failed to update class.");
      }
    } catch (error) {
      console.error("Error in operations:", error);
      setMessage(
        error.message || "An error occurred while updating the class."
      );
    } finally {
      triggerSnackbar();
      setEmpty(); // Reset Form Fields
      setOpen1(false); // Close Dialog after Submission
    }
  };

  const term = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch term data first since classes filtering depends on it
        const termResponse = await fetch(
          `https://gsbgs-backend.vercel.app/api/term/${term.termId}`
        );
        const termData = await termResponse.json();
        setTermData(termData?._classes);

        if (termData?._classes) {
          // Fetch all classes in parallel as term data is already available
          const classesResponse = await fetch(
            `https://gsbgs-backend.vercel.app/api/classes`
          );
          const classesData = await classesResponse.json();
          // Filter classes based on the term data
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
  }, [term.termId, termData]); // Depend on term.termId to refetch when it changes

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
            <Typography variant="h2" fontWeight={"bold"}>
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
                <Typography variant="h4">Friday</Typography>
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
                        "&:hover": {
                          // Styles to apply on hover
                          boxShadow: "rgba(0, 0, 0, 0.45) 0px 3px 3px",
                          transitionDuration: "0.2s",
                          background: "rgba(115,134,222,0.3)",
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
              <Box
                sx={{
                  width: { xs: "80vw", lg: "30%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h4">Saturday</Typography>
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
                        "&:hover": {
                          // Styles to apply on hover
                          boxShadow: "rgba(0, 0, 0, 0.45) 0px 3px 3px",
                          transitionDuration: "0.2s",
                          background: "rgba(148,215,202, 0.3)",
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
              <Box
                sx={{
                  width: { xs: "80vw", lg: "30%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h4">Sunday</Typography>
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
          {ClassView(selectedClass._id)}
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
