import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import Students from "./StudentView";
import PropTypes from "prop-types"; // Import PropTypes for validation
import TransitionsSnackbar from "../Enroll/Submit";

export default function ClassesContainer({ week }) {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close
  const [selectedClass, setSelectedClass] = React.useState("");
  const [selectedClassName, setselectedClassName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleClickOpen = React.useCallback((id, name) => {
    setSelectedClass(id);
    setselectedClassName(name);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gsbgs-backend.vercel.app/api/classes"
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch only once

  const categorizedData = React.useMemo(() => {
    const friday = [];
    const saturday = [];
    const sunday = [];
    data.forEach((element) => {
      if (element._day === "Friday") friday.push(element);
      else if (element._day === "Saturday") saturday.push(element);
      else if (element._day === "Sunday") sunday.push(element);
    });
    return { friday, saturday, sunday };
  }, [data]);

  const triggerSnackbar = () => {
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <Container>
      <Box
          sx={{
            bgcolor: "rgba(255, 255, 252, 1)",
            borderRadius: "25px",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            display: "flex",
            width: {xs: "80vw", md:"60vw"},
            minHeight: {xs: '60vh'},
            padding: 2
          }}
        >
          <Box
            sx={{
              marginLeft: "5%",
              display: "flex",
              flexDirection: { xs: "column", md: "column" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: '60vw',
                flexDirection: { xs: "column", lg: "row" },
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
        <Students url={selectedClass._id} week={week} onClose={handleClose} message={setMessage} snackbar={triggerSnackbar}/>
        </DialogContent>
      </Dialog>
      <TransitionsSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        alert={message}
      />
    </Box>
  );
}

ClassesContainer.propTypes = {
  week: PropTypes.number.isRequired,
};
