// CheckboxGroup.js
import React from 'react';
import { Box, FormControlLabel, Checkbox, Typography } from '@mui/material';

const CheckboxGroup = ({ matchChecked, setMatchChecked, generalChecked, setGeneralChecked }) => {
    const labelStyle = {
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        color: '#101828',
      };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={matchChecked}
            onChange={(e) => setMatchChecked(e.target.checked)}
            sx={{
              color: "#0042FF",
              borderRadius: "3px",
              '&.Mui-checked': {
                color: "#0042FF",
              },
            }}
          />
        }
        label={<Typography sx={labelStyle}>Match</Typography>}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={generalChecked}
            onChange={(e) => setGeneralChecked(e.target.checked)}
            sx={{
              color: "#0042FF",
              borderRadius: "3px",
              '&.Mui-checked': {
                color: "#0042FF",
              },
            }}
          />
        }
        label={<Typography sx={labelStyle}>General</Typography>}
      />
    </Box>
  );
};

export default CheckboxGroup;
