import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
const styles = {
  textStyle: {
    marginTop: "10px",
    "& .MuiInputBase-input-MuiOutlinedInput-input": {
      backgroundColor: "white !important",
    },
    " input::-ms-reveal": {
      display: "none",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white !important",
      "& fieldset": {
        borderColor: "#4B4B4B",
      },
      "&:hover fieldset": {
        borderColor: "#4B4B4B",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #4B4B4B",
        boxShadow: "0 0 7px rgba(75, 75, 75, 0.11)",
      },
    },
    "& .Mui-error": {
      "& fieldset": {
        borderColor: "#FF4842",
      },
      "&:hover fieldset": {
        borderColor: "#FF4842",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#FF4842",
      },
    },
  },
  picker: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px !important",
      "& fieldset": {
        border: "1px solid #4B4B4B",
      },
      "&:hover fieldset": {
        border: "1px solid #4B4B4B",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #4B4B4B",
        boxShadow: "0 0 7px rgba(0, 0, 0, 0.11)",
      },
      "& .MuiSvgIcon-root": {
        color: "#000000",
      },
    },
    "& .Mui-error": {
      "& fieldset": {
        borderColor: "#FF4842",
      },
      "&:hover fieldset": {
        borderColor: "#FF4842",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#FF4842",
      },
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(28, 28, 28, 0.1)",
    // p:3,
  },
  filter: {
    fontWeight: 700,
    fontSize: "20px",
    color: "#4B4B4B",
  },
  clear: {
    fontWeight: 600,
    fontSize: "16px",
    color: "#0042FF",
    "&:hover": {
      cursor: "pointer",
    },
  },
  status: {
    fontWeight: 600,
    fontSize: "15px",
    color: "#000000",
  },
  active: {
    fontWeight: 500,
    fontSize: "15px",
    color: "#475569",
  },
  from: {
    fontWeight: 400,
    fontSize: "15px",
    color: "#000000",
  },
  buttonBox: {
    height: "95px",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#EAEAEA",
  },
  cancel: {
    width: "170px",
    backgroundColor: "#FFFFFF !important",
    color: "#0042FF",
    border: "1px solid #0042FF",
    fontWeight: 600,
    fontSize: "16px",
    textTransform: "capitalize",
    boxShadow: "none",
  },
  apply: {
    width: "238px",
    backgroundColor: "#0042FF !important",
    color: "#FFFFFF",
    border: "1px solid #0042FF",
    fontWeight: 600,
    fontSize: "16px",
    textTransform: "capitalize",
    boxShadow: "none",
  },
};
function DrawerComponent({
  open,
  close,
  filterHeaders,
  users,
  questions,
  offerQuestions,
  handleFilter,
  shopOwners,
  match,
  notification,
  reportedUser,
}) {
  const [checkbox, setCheckbox] = useState({
    option1: false,
    option2: false,
  });
  const [checkboxTwo, setCheckboxTwo] = useState({
    value1: false,
    value2: false,
  });
  const [date, setDate] = useState({ startDate: null, endDate: null });
  const [coin, setCoin] = useState({ fromCoin: "", toCoin: "" });
  const [coinError, setCoinError] = useState("");
  const [checkedIndex, setCheckedIndex] = useState();

  const handleCheckboxChange = (index) => {
    setCheckedIndex(index);
  };
  const handleChange = (event, string) => {
    if (string === "option1") {
      setCheckbox({ ...checkbox, option1: event.target.checked });
    } else if (string === "option2") {
      setCheckbox({ ...checkbox, option2: event.target.checked });
    } else if (string === "value1") {
      setCheckboxTwo({ ...checkboxTwo, value1: event.target.checked });
    } else if (string === "value2") {
      setCheckboxTwo({ ...checkboxTwo, value2: event.target.checked });
    }
  };
  const handleDateChange = (value, string) => {
    if (string === "startDate") {
      setDate({ ...date, startDate: value });
    } else {
      setDate({ ...date, endDate: value });
    }
  };
  const handleCoinChange = (event, string) => {
    if (string === "from") {
      setCoin({ ...coin, fromCoin: event.target.value });
      if (
        event.target.value !== "" &&
        (isNaN(event.target.value) ||
          parseFloat(event.target.value) > parseFloat(coin.toCoin))
      ) {
        setCoinError({ ...coinError, from: "From coin must be lesser." });
      } else {
        setCoinError({ ...coinError, from: "" });
      }
    } else {
      setCoin({ ...coin, toCoin: event.target.value });
      if (
        event.target.value !== "" &&
        (isNaN(event.target.value) ||
          parseFloat(coin.fromCoin) > parseFloat(event.target.value))
      ) {
        setCoinError({ ...coinError, to: "To coin must be greater." });
      } else {
        setCoinError({ ...coinError, to: "" });
      }
    }
  };
  const handleApplyButtonClick = () => {
    const params = {
      ...(!shopOwners && {
        ...(!notification  && {
          checkbox1:
            checkbox.option1 && checkbox.option2
              ? "all"
              : checkbox.option1
              ? users || reportedUser
                ? "active"
                : offerQuestions || questions
                ? "created"
                : match
                ? "completed"
                : "match"
              : checkbox.option2
              ? users || reportedUser
                ? "inactive"
                : offerQuestions || questions
                ? "completed"
                : match
                ? "created"
                : "general"
              : "",
        }),
        date_from: date.startDate
          ? dayjs(date.startDate, "DD-MM-YYYY").format("DD/MMM/YYYY")
          : "",
        date_to: date.endDate
          ? dayjs(date.endDate, "DD-MM-YYYY").format("DD/MMM/YYYY")
          : "",
      }),
      ...((users || reportedUser) && {
        coin_from: coin.fromCoin ? coin.fromCoin : "",
        coin_to: coin.toCoin ? coin.toCoin : "",
      }),
      ...(( reportedUser) && {
        checkbox2:
          checkboxTwo.value1 && checkboxTwo.value2
            ? "all"
            : checkboxTwo.value1
            ? questions
              ? "created"
              : "False"
            : checkboxTwo.value2
            ? questions
              ? "completed"
              : "True"
            : "",
      }),
      ...(shopOwners && {
        status:
          checkedIndex === 0
            ? "Approved"
            : checkedIndex === 1
            ? "Unapproved"
            : "Pending",
      }),
    };
    handleFilter(params);
    close();
  };
  const handleClear = () => {
    handleFilter();
    setCheckedIndex();
    setCheckbox({ option1: false, option2: false });
    setCheckboxTwo({ value1: false, value2: false });
    setDate({ startDate: null, endDate: null });
    setCoin({ fromCoin: "", toCoin: "" });
    close();
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        hideBackdrop={false}
        onClose={close}
        sx={{
          width: 520,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 460,
            boxSizing: "border-box",
            height: "100%",
          },
        }}
      >
        <Box sx={{ ...styles.header, p: 3 }}>
          <Typography sx={styles.filter}>Filter</Typography>
          <Typography sx={styles.clear} onClick={handleClear}>
            Clear
          </Typography>
        </Box>
        <Box sx={{ p: "15px 24px" }}>
          {!notification && (
            <>
              <Typography
                sx={{
                  ...styles.status,
                  mt: questions ? "10px" : "0px",
                }}
              >
                {filterHeaders[0]?.status?.heading1 || "Status"}
              </Typography>
              {!shopOwners ? (
                <>
                  <Box sx={{ ...styles.header, mt: "10px" }}>
                    <Typography sx={styles.active}>
                      {filterHeaders[0]?.status?.name}
                    </Typography>
                    <Checkbox
                      checked={checkbox.option1}
                      onChange={(e) => handleChange(e, "option1")}
                      sx={{
                        color: "#0042FF",
                        borderRadius: "3px",
                        "&.Mui-checked": {
                          color: "#0042FF",
                        },
                      }}
                    />
                  </Box>
                  <Box sx={styles.header}>
                    <Typography sx={styles.active}>
                      {filterHeaders[0]?.status?.name2}
                    </Typography>
                    <Checkbox
                      checked={checkbox.option2}
                      onChange={(e) => handleChange(e, "option2")}
                      sx={{
                        color: "#0042FF",
                        borderRadius: "3px",
                        "&.Mui-checked": {
                          color: "#0042FF",
                        },
                      }}
                    />
                  </Box>
                </>
              ) : (
                <>
                  {filterHeaders.map((header, index) => (
                    <Box key={index} sx={styles.header}>
                      <Typography sx={styles.active}>{header}</Typography>
                      <Checkbox
                        checked={checkedIndex === index}
                        onChange={() => handleCheckboxChange(index)}
                        sx={{
                          color: "#0042FF",
                          borderRadius: "3px",
                          "&.Mui-checked": {
                            color: "#0042FF",
                          },
                        }}
                      />
                    </Box>
                  ))}
                </>
              )}
            </>
          )}
          {reportedUser && (
            <>
              <Typography sx={{ ...styles.status, mt: "15px" }}>
                {filterHeaders[0]?.status?.heading2}
              </Typography>
              <Box sx={{ ...styles.header, mt: "10px" }}>
                <Typography sx={styles.active}>
                  {filterHeaders[0]?.status?.name4}
                </Typography>
                <Checkbox
                  checked={checkboxTwo.value1}
                  onChange={(e) => handleChange(e, "value1")}
                  sx={{
                    color: "#0042FF",
                    borderRadius: "3px",
                    "&.Mui-checked": {
                      color: "#0042FF",
                    },
                  }}
                />
              </Box>
              <Box sx={styles.header}>
                <Typography sx={styles.active}>
                  {filterHeaders[0]?.status?.name5}
                </Typography>
                <Checkbox
                  checked={checkboxTwo.value2}
                  onChange={(e) => handleChange(e, "value2")}
                  sx={{
                    color: "#0042FF",
                    borderRadius: "3px",
                    "&.Mui-checked": {
                      color: "#0042FF",
                    },
                  }}
                />
              </Box>
            </>
          )}
          {!shopOwners && !reportedUser && (
            <>
              <Typography sx={{ ...styles.status, mt: "15px" }}>
                {filterHeaders[0]?.status?.name3}
              </Typography>

              <Grid container columnSpacing={2} sx={{ mt: 2 }}>
                <Grid item sm={6} md={6} lg={6}>
                  <InputLabel sx={{ ...styles.from, mb: "10px" }}>
                    From
                  </InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={date.startDate}
                      format="DD/MM/YYYY"
                      onChange={(newValue) =>
                        handleDateChange(newValue, "startDate")
                      }
                      sx={styles.picker}
                      slotProps={{
                        textField: {
                          // onKeyDown: (event) => {
                          //   event.preventDefault();
                          // },
                          //   onClick: () => {
                          //     setIsStartDateOpen(true);
                          //   },
                          //   error: false,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item sm={6} md={6} lg={6}>
                  <InputLabel sx={{ ...styles.from, mb: "10px" }}>
                    To
                  </InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      minDate={dayjs(date.startDate)}
                      value={date.endDate}
                      format="DD/MM/YYYY"
                      onChange={(newValue) =>
                        handleDateChange(newValue, "endDate")
                      }
                      sx={styles.picker}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </>
          )}
          {(users || reportedUser) && (
            <>
              <Typography sx={{ ...styles.status, mt: "20px" }}>
                Coins
              </Typography>
              <Grid container columnSpacing={2} sx={{ mt: 2 }}>
                <Grid item sm={6} md={6} lg={6}>
                  <InputLabel sx={styles.from}>From</InputLabel>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={coin.fromCoin}
                    sx={styles.textStyle}
                    placeholder="Enter coins"
                    inputProps={{ maxLength: 10 }}
                    onChange={(e) => handleCoinChange(e, "from")}
                    error={coinError.from}
                    helperText={coinError.from}
                  />
                </Grid>
                <Grid item sm={6} md={6} lg={6}>
                  <InputLabel sx={styles.from}>To</InputLabel>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={coin.toCoin}
                    sx={styles.textStyle}
                    placeholder="Enter coins"
                    inputProps={{ maxLength: 10 }}
                    onChange={(e) => handleCoinChange(e, "to")}
                    error={coinError.to}
                    helperText={coinError.to}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Box>
        <Box sx={styles.buttonBox}>
          <Button variant="contained" onClick={close} sx={styles.cancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyButtonClick}
            sx={styles.apply}
          >
            Apply
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
