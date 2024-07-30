import React from "react";
import { Box, Typography,Button } from "@mui/material";

export default function PaginationHeader({ page, size, totalCount, dataLength,handleNext,handlePrev }) {
  return (
    <Box>
      <Typography
        sx={{ fontSize: "14px", fontWeight: 400, color: "#373737" }}
      >{`${page * size + 1}-${page * size + dataLength} of ${totalCount}`}</Typography>
       <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <Typography sx={{
          marginTop:"10px",
          color:"#344054",
          fontSize:"14px"
        }}>Page 1 of 10</Typography>
        <Box
          sx={{
            gap: "10px",
            display: "flex",
          }}
        >
          <Button
          onClick={handlePrev}
            sx={{
              color: "#344054",
              border: "1px solid #D0D5DD!important",
              padding: "10px 16px",
              borderRadius: "10px!important",
              textTransform: "none",
              height: "42px",
            }}
            variant="outlined"
          >
            {" "}
            Previous
          </Button>
          <Button
          onClick={handleNext}
            sx={{
              color: "#344054",
              border: "1px solid #D0D5DD!important",
              padding: "10px 16px",
              borderRadius: "10px!important",
              textTransform: "none",
              height: "42px",
            }}
            variant="outlined"
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
