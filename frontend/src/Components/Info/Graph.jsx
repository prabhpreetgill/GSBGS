import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

function HorizontalBarGraph({ attendance }) {
  const total = attendance.present + attendance.late + attendance.absent;
  const presentPercentage = (attendance.present / total) * 100;
  const latePercentage = (attendance.late / total) * 100;
  const absentPercentage = (attendance.absent / total) * 100;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          height: '20px',
          width: '100%',
          backgroundColor: '#ddd',
        }}
      >
        <Box sx={{ width: `${presentPercentage}%`, backgroundColor: '#76c8c8' }} />
        <Box sx={{ width: `${latePercentage}%`, backgroundColor: '#e4bcad' }} />
        <Box sx={{ width: `${absentPercentage}%`, backgroundColor: '#d7658b' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography>Present: {attendance.present}</Typography>
        <Typography>Late: {attendance.late}</Typography>
        <Typography>Absent: {attendance.absent}</Typography>
      </Box>
    </Box>
  );
}

export default HorizontalBarGraph;

// Prop validation
HorizontalBarGraph.propTypes = {
    attendance: PropTypes.any
  };
  