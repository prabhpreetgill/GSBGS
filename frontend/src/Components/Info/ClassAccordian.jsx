import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List"; // Import the List component
import ListItem from "@mui/material/ListItem"; // Ensure ListItem is imported
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

export default function ClassAccodiran({ array }) {

  return (
    <div>
      <Accordion
        sx={{
          width: { xs: "60vw", lg: "25vw" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "#d8e5e1",
        }}
      >
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: "#EBFCFA",
          }}
        >
          <Typography textAlign={"center"} variant="h4" fontWeight={"bold"}>
            Classes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ width: "100%" }}>
            {/* Use the List component */}
            {array?.map((classes, index) => (
              <React.Fragment key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {/* Use Fragment to group items */}
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: {xs: '0.8rem', lg: '2rem'}
                    }}
                  >
                      {`${classes._name}: ${classes._termYear} `}
                  </ListItem>
                  {index < array.length - 1 && (
                    <Divider
                      sx={{
                        border: "1px solid black",
                        width: { xs: "80%", lg: "22vw" },
                      }}
                    />
                  )}
                </Box>
                {/* Don't add a divider after the last item */}
              </React.Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

ClassAccodiran.propTypes = {
  array: PropTypes.array
}
