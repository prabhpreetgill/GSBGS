import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography } from "@mui/material";
import Container from "@mui/material/Container";

export default function SimpleContainer() {
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Splitting the formatted date
  const [weekday, month, day, year] = formattedDate.replace(",", "").split(" ");

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 252, 1)",
              height: {xs: '20vh' ,lg: "30vh"},
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              display: "flex",
              flexDirection: "column", // Added for vertical alignment
              justifyContent: "center",
              backgroundImage: `url(https://img.freepik.com/premium-vector/pastel-color-background-abstract-design_336924-5235.jpg?w=2000)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: {xs: "80vw", lg: "40vw"},
              borderRadius: '25px'
            }}
          >
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{fontSize: {xs: '3rem', lg: '5rem'}}}>{weekday}</Typography>
                <Typography sx={{fontSize: {xs: '2rem', lg: '4rem'}}}>
                  {`${month} ${day} ${year}`}
                </Typography>
            </Box>
          </Box>
      </Container>
    </React.Fragment>
  );
}
