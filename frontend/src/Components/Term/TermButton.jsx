import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../App.css";

function CurrentTerm() {
  // State for storing terms
  const [currentTerms, setCurrentTerms] = React.useState([]);
  const [prevTerms, setPrevTerms] = React.useState([]);
  const [previous, setPrevious] = React.useState("");

  // Fetch terms on component mount
  React.useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/term")
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();

        // Filter current and previous terms based on end date
        const current = data.filter((term) => new Date(term._end) >= today);
        const previous = data.filter((term) => new Date(term._end) < today);

        setCurrentTerms(current);
        setPrevTerms(previous);

        // Set label for previous terms section
        setPrevious(previous.length > 0 ? "Previous Terms" : "");
      })
      .catch((error) => console.error("Error:", error));
  }, [currentTerms]);

  let navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (where) => () => {
    navigate(where);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "85vw",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Render Current Term if available */}
      {currentTerms.length > 0 ? (
        <Box>
          <Box
            sx={{
              height: { xs: "40vh", lg: "60vh" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                marginBottom: "20px",
                textAlign: "center",
                opacity: 0,
                animationDelay: "0.1s",
              }}
              className="hidden fade-in"
            >
              Current Term
            </Typography>
            <Button
              variant="outlined"
              sx={{
                padding: "10px 50px",
                marginBottom: "20px",
                width: { xs: "80vw", lg: "60vw" },
                height: { xs: "15vh", lg: "20vh" },
                display: "flex",
                justifyContent: "space-around",
                borderRadius: "30px",
                opacity: 0,
                animationDelay: "0.3s",
                background:
                  "linear-gradient(83deg, rgba(148,215,202,1) 0%, rgba(115,134,222,1) 100%)",
                border: "none",
                transitionDuration: "0.2s",
                "&:hover": {
                  // Styles to apply on hover
                  boxShadow: "rgba(0, 0, 0, 0.45) 0px 15px 15px",
                  transitionDuration: "0.2s",
                  border: "5px solid black",
                  // You can add more styles here
                },
              }}
              className="fade-in"
              key={currentTerms[0]._id}
              onClick={handleNavigation(currentTerms[0]._id)}
            >
              <Box>
                <Typography
                  color="#e7e7e7"
                  fontWeight="bold"
                  sx={{
                    textShadow: "0px 4px 7px rgba(89, 89, 89, 1)",
                    fontSize: { xs: "1.8rem", lg: "3rem" },
                  }}
                >
                  {currentTerms[0]._name}
                </Typography>
                <Typography
                  fontWeight="bold"
                  color="black"
                  sx={{ fontSize: { xs: "1.8rem", lg: "3rem" } }}
                >
                  {`${new Date(
                    currentTerms[0]._start
                  ).getFullYear()} - ${new Date(
                    currentTerms[0]._end
                  ).getFullYear()}`}
                </Typography>
              </Box>
            </Button>
          </Box>

          {/* Render Previous Terms if available */}
          {prevTerms.length > 0 && (
            <Box
              sx={{
                marginTop: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  marginBottom: "20px",
                  textAlign: "center",
                  opacity: 0,
                  animationDelay: "0.5s",
                }}
                className="fade-in"
              >
                {previous}
              </Typography>
              {prevTerms.map((term, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  sx={{
                    padding: "10px 50px",
                    marginBottom: "20px",
                    width: { xs: "80vw", lg: "60vw" },
                    height: { xs: "15vh", lg: "20vh" },
                    display: "flex",
                    justifyContent: "space-around",
                    borderRadius: "30px",
                    background:
                      "linear-gradient(270deg, rgba(200,200,200,1) 0%, rgba(238,238,238,1) 100%);",
                    border: "none",
                    transitionDuration: "0.2s",
                    opacity: 0,
                    animationDelay: "0.6s",
                    "&:hover": {
                      // Styles to apply on hover
                      boxShadow: "rgba(0, 0, 0, 0.45) 0px 15px 15px",
                      transitionDuration: "0.2s",
                      border: "5px solid black",
                      // You can add more styles here
                    },
                  }}
                  className="fade-in"
                  onClick={handleNavigation(prevTerms[index]._id)}
                >
                  <Box>
                    <Typography
                      variant="h2"
                      color="white"
                      fontWeight="bold"
                      sx={{
                        textShadow: "0px 4px 7px rgba(89, 89, 89, 1)",
                        fontSize: { xs: "1.8rem", lg: "3rem" },
                      }}
                    >
                      {term._name}
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      color="black"
                      sx={{ fontSize: { xs: "1.8rem", lg: "3rem" } }}
                    >
                      {`${new Date(term._start).getFullYear()} - ${new Date(
                        term._end
                      ).getFullYear()}`}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        // Message when no current terms are available
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ marginBottom: "20px" }}
        ></Typography>
      )}
    </Box>
  );
}

export default CurrentTerm;
