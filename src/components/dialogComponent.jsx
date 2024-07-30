import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import PredefinedQuestion from "../pages/predefinedQuestion";
import { suspendConfirmMsg } from "../utilities/constants";
import dynamic from "next/dynamic";
const MessageEditor = dynamic(() => import("../components/MessageEditor"), {
  ssr: false,
});

const styles = {
  header: {
    p: "0px 0px 15px",
    fontWeight: 700,
    fontSize: "20px",
    color: "#32343A",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerflex: {
    p: "0px 0px 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  deleteHeader: {
    fontWeight: 700,
    fontSize: "20px",
    gap: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  search: {
    // "& input::placeholder": {
    //   color: "#667085",
    //   opacity: "1",
    //   fontWeight: "400",
    // },
    "& .MuiOutlinedInput-root": {
      paddingRight: "0px",
    },
    "& .MuiInputBase-input": {
      borderWidth: `1px !important`,
      position: "relative",
      fontSize: "14px",
      fontWeight: 400,
      padding: "6px 10px 6px 0px",

      color: "#1C1C1C",
    },
    "& fieldset": {
      borderWidth: `1px !important`,
      padding: "0px !important",
      borderColor: "#D0D5DD !important",
      borderRadius: "8px !important",
    },
  },
  typography: {
    fontWeight: 400,
    fontSize: "16px",
    color: "#000000",
  },
  textfield: {
    "& input::placeholder": {
      color: "#808080",
      opacity: "1",
      fontWeight: "400",
      fontSize: "15px",
    },
    "& .MuiInputBase-input": {
      borderWidth: `1px !important`,
      position: "relative",
      fontSize: 16,
    },
    "& fieldset": {
      borderWidth: `1px !important`,
      padding: "0px !important",
      borderColor: "#4B4B4B",
      borderRadius: "8px!important",
    },
  },
  optiontextfield: {
    "& input::placeholder": {
      color: "#808080",
      opacity: "1",
      fontWeight: "400",
      fontSize: "15px",
    },
    "& .MuiInputBase-input": {
      borderWidth: `1px !important`,
      position: "relative",
      fontSize: 16,
      p: "5px 5px",
    },
    "& fieldset": {
      borderWidth: `1px !important`,
      padding: "5px 5px !important",
      borderColor: "#4B4B4B",
      borderRadius: "8px!important",
    },
  },
  label: {
    mt: "10px",
    mb: "10px",
    fontSize: "15px",
    fontWeight: 400,
    color: "#000000",
  },
  offer: {
    color: "#000000",
    fontWeight: 400,
    fontSize: "15px",
    display: "flex",
    // alignItems: "center",
    mt: 2,
  },
  tab: {
    "& .MuiTab-root": {
      border: "2px solid rgba(0,0,0,0.25)",
      borderBottom: "none",
      height: "37px",
      display: "flex",
      mr: "10px",
      backgroundColor: "#FFFFFF",
      borderTopRightRadius: "10px",
      borderTopLeftRadius: "10px",
      textTransform: "capitalize",
      fontSize: "14px",
      fontWeight: 500,
      color: "#7A7A7A",
    },
    "& .Mui-selected": {
      color: "#FFFFFF !important",
      backgroundColor: "#0042FF",
      border: "none",
      fontSize: "14px",
      fontWeight: 500,
    },
    "& .MuiTabs-indicator": {
      display: "none",
    },
  },
};
const emptyOptions = [
  { key: 1, value: "Yes" },
  { key: 2, value: "No" },
];

function DialogComponent({
  open,
  delQues,
  handleClose,
  header,
  view,
  winners,
  tournament,
  imageUrl,
  add,
  del,
  sports,
  addData,
  image,
  edit,
  button,
  dialogData,
  emptyMessage,
  team,
  deleteMessage,
  handleWinnerQuery,
  match,
  video,
  videoUrl,
  notification,
  advertisement,
  avatar,
  handleDeleteClick,
  handleCreateClick,
  handleUpdateClick,
  gallery,
  editAdd,
  autocompleteList2,
  editValue,
  autocompleteList,
  textField,
  setTextField,
  autocomplete,
  setAutocomplete,
  file,
  setFile,
  autocompleteTeam,
  teamAutocompleteValue,
  setTeamAutocompleteValue,
  dateTime,
  setDateTime,
  setAutocompleteTeam,
  teamList,
  file2,
  setFile2,
  handleFetchTournament,
  handleFetchTeam,
  handleFetchTeamB,
  autocompleteTeamB,
  isChecked,
  setIsChecked,
  disableAutocomplete,
  setDisableAutocomplete,
  attach,
  value,
  setValue,
  handleChangeTab,
  offerCoin,
  setOfferCoin,
  offer,
  offerValue,
  setOfferValue,
  publish,
  codOffers,
  radio,
  offerType,
  setOfferType,
  predefinedQuestion,
  optionColumn,
  setOptionColumn,
  handleOption,
  approve,
  liveApprove,
  liveAnswer,
  setLiveAnswer,
  approved,
  logout,
  handleLogoutClick,
  setOpenSnackbar,
  setMessage,
  handleDownload,
  handleDeleteWinCodQuestion,
  options,
  answer,
  setAnswer,
  sort,
  matchCompleted,
  suspend,
  handleSuspend,
  suspendBtn,
  reason,
  setReason,
  error,
  setError,
  showReason,
  suspendMessage,
  questionAttchment,
  handleUploadPosterClick,
  unpublish,
  setDetails,
  upcomingEvents,
  setSelectedDateTime,
  details,
  selectedDateTime,
  delPoster,
  showDateTimePicker,
  setShowDateTimePicker,
  showDateTimePickerCheckbox,
  setShowDateTimePickerCheckbox,
  handletimeCheckboxClick,
  redirect_list,
  setSelectedRedirectUrl,
  selectedRedirectUrl,
  setSelectedRedirectUrlKey,
  selectedRedirectUrlKey,
}) {
  const [queryValue, setQueryValue] = useState("");
  const [disableTextfield, setDisableTextfield] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [suspendAction, setSuspendAction] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content) => {
    setEditorContent(content);
    setDetails(content);
  };
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      setAutocomplete([]);
      setDisableAutocomplete(true);
    } else {
      setDisableAutocomplete(false);
    }
  };
  const handleQuery = (e) => {
    setQueryValue(e.target.value);
    handleWinnerQuery(e.target.value);
  };
  const handleClear = () => {
    setQueryValue("");
    handleWinnerQuery();
  };
  const handleAction = (string) => {
    if (string === "Yes, Confirm") {
      if (delQues) {
        handleDeleteWinCodQuestion();
      } else if (suspend) {
        handleSuspend();
        handleCloseSuspend();
      } else {
        handleDeleteClick();
      }
      handleClose();
    } else if (
      string === "Create" ||
      string === "Submit" ||
      string === "Add" ||
      string === "Save"
    ) {
      if (suspend) {
        if (reason !== "") {
          setError({
            reason: "",
          });
          setSuspendAction(true);
        } else {
          setError({
            reason: "Reason is required",
          });
        }
      } else if (questionAttchment) {
        handleUploadPosterClick();
      } else {
        handleCreateClick();
      }
    } else if (string === "Update") {
      handleUpdateClick();
    } else if (string === "Logout") {
      handleLogoutClick();
      handleClose();
    } else if (string === "Ok" || string === "Close") {
      handleClose();
    } else if (string === "Download") {
      handleDownload();
    } else if (string === "Cancel") {
      if (suspendAction) {
        handleCloseSuspend();
      } else {
        // setSelectDateTime(dayjs())
        handleClose();
      }
    }
  };
  const handleTextfieldChange = (e, i) => {
    const inputValue = e.target.value;
    if (i === 0) {
      if (advertisement || avatar) {
        if (!isNaN(inputValue)) {
          setTextField({ ...textField, value: inputValue });
        }
      } else {
        setTextField({ ...textField, value: inputValue });
      }
    } else if (i === 1) {
      setTextField({ ...textField, value2: inputValue });
    }
  };
  const handleQuestionTextfieldChange = (e, i) => {
    const inputValue = e.target.value;
    setTextField(inputValue);
  };
  const handleChange = (index, event) => {
    const newOptionColumn = [...optionColumn];
    newOptionColumn[index].value = event.target.value;
    setOptionColumn(newOptionColumn);
  };
  const handleAutoCompleteChange = (newValue, i) => {
    const updatedValues = [...autocomplete];
    updatedValues[i] = newValue;
    setAutocomplete(updatedValues);
    if (match && i === 0) {
      handleFetchTournament(newValue?.id);
    } else if (match && i === 1) {
      handleFetchTeam(newValue?.id);
    }
  };
  const handleRedirectChange = (event, newValue) => {
    setSelectedRedirectUrl(newValue?.value);
    setSelectedRedirectUrlKey(newValue?.key);
  };
  const handleTeamChange = (newValue, string) => {
    if (string === "A") {
      setTeamAutocompleteValue({ ...teamAutocompleteValue, teamA: newValue });
      handleFetchTeamB(newValue?.tournament_id, newValue?.id);
      if (teamAutocompleteValue?.teamB?.id === newValue?.id) {
        setTeamAutocompleteValue({ teamA: newValue, teamB: "" });
      }
    } else {
      setTeamAutocompleteValue({ ...teamAutocompleteValue, teamB: newValue });
    }
  };
  const handleEventDateTimeChange = (newDateTime) => {
    // setSelectDateTime(newDateTime)
    setSelectedDateTime(newDateTime);
  };
  const handleDateTimeChange = (newValue, string) => {
    if (string === "date") {
      setDateTime({ ...dateTime, date: newValue });
    } else {
      setDateTime({ ...dateTime, time: newValue });
    }
  };
  const handleClick = () => {
    fileInputRef.current.click();
    fileInputRef.current.value = null;
  };
  const handleEditClick = () => {
    setShowDateTimePicker(true);
  };
  const handleClick2 = () => {
    fileInputRef2.current.click();
    fileInputRef2.current.value = null;
  };
  const handleFileChange = (e, value) => {
    let mediaElement;
    if (value === "adv") {
      mediaElement = document.createElement("video");
      const selectedFile = e.target.files?.[0];
      if (selectedFile.type === "video/mp4") {
        if (selectedFile.size <= 3 * 1024 * 1024) {
          mediaElement.src = URL.createObjectURL(selectedFile);
          setFile({ image: selectedFile, image_url: mediaElement.src });
        } else {
          setOpenSnackbar(true);
          setMessage({
            color: "#f44336",
            name: "Video should be less than 3mb",
          });
        }
      } else {
        setOpenSnackbar(true);
        setMessage({
          color: "#f44336",
          name: "Video should be mp4 format",
        });
      }
    } else {
      mediaElement = document.createElement("img");
      const selectedFile = e.target.files?.[0];
      if (
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpg"
      ) {
        if (selectedFile.size <= 200 * 1024) {
          mediaElement.src = URL.createObjectURL(selectedFile);
          setFile({ image: selectedFile, image_url: mediaElement.src });
        } else {
          setOpenSnackbar(true);
          setMessage({
            color: "#f44336",
            name: "Image should be less than 200kb",
          });
        }
      } else {
        setOpenSnackbar(true);
        setMessage({
          color: "#f44336",
          name: "Image should be jpeg,png or jpg",
        });
      }
    }

    // }
    // }
  };
  const handleFile = (e) => {
    let image = document.createElement("img");
    const selectedFile2 = e.target.files?.[0];
    if (
      selectedFile2.type === "image/jpeg" ||
      selectedFile2.type === "image/png" ||
      selectedFile2.type === "image/jpg"
    ) {
      if (selectedFile2.size <= 2 * 1024 * 1024) {
        image.src = URL.createObjectURL(selectedFile2);
        setFile2({ image: selectedFile2, image_url: image.src });
      } else {
        setOpenSnackbar(true);
        setMessage({
          color: "#f44336",
          name: "Image should be less than 2mb",
        });
      }
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Image should be jpeg,png or jpg",
      });
    }
  };
  const handleOfferCoinChange = (e) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue)) {
      setOfferCoin(inputValue);
    }
  };
  useEffect(() => {
    setDisableTextfield(false);
    if (
      (autocomplete?.length === 0 ||
        autocomplete?.[0] === null ||
        autocomplete?.[0]?.label === "Free") &&
      avatar
    ) {
      setDisableTextfield(true);
      setTextField("");
    }
  }, [avatar && autocomplete]);
  const handleOfferChange = (event) => {
    const selectedOffer = offer.find(
      (item) => item.offer_title === event.target.value
    );
    setOfferValue(selectedOffer);
  };
  const handleOfferChangeQuestion = (event) => {
    setAnswer(event.target.value);
  };
  const handleOfferTypeChange = (event) => {
    setOfferType(event.target.value);
  };
  const handleLiveAnswer = (event) => {
    setLiveAnswer(event.target.value);
  };
  const handleCloseSuspend = () => {
    setSuspendAction(false);
  };
  const handleReasonChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue !== "") {
      setError({
        reason: "",
      });
    } else {
      setError({
        reason: "Reason is required",
      });
    }
    setReason(inputValue);
  };
  useEffect(() => {
    setQueryValue("");
  }, [approved]);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            minWidth: image ? "" : "500px",
            maxWidth: match
              ? ""
              : predefinedQuestion || upcomingEvents
              ? "100%"
              : "600px",
            p: "24px",
          },
          // zIndex: "1500 !important",
          ".MuiPopover": {
            zIndex: 1500,
          },
        }}
      >
        <DialogTitle sx={!del ? styles.header : styles.headerflex}>
          {(del || publish || delQues || unpublish || delPoster) && (
            <Box
              sx={{
                ...styles.deleteHeader,
                color:
                  del || delQues || unpublish || delPoster
                    ? "#D42600"
                    : "#007F14",
              }}
            >
              <Box
                component="img"
                src={
                  del || delQues || unpublish || delPoster
                    ? "/img/deleteWarning.png"
                    : "/img/publishConfirmationIcon.png"
                }
                alt="delete"
              />
              {header}
            </Box>
          )}
          {winners ||
          edit ||
          add ||
          editAdd ||
          image ||
          video ||
          attach ||
          approve ||
          approved ||
          view ||
          logout ||
          sort ||
          suspend ||
          showReason ||
          questionAttchment ||
          (upcomingEvents && !del && !unpublish)
            ? header
            : null}
          <IconButton sx={{ p: 0 }}>
            <CloseIcon onClick={handleClose} />
          </IconButton>
        </DialogTitle>
        {((winners && matchCompleted) || approved) && (
          <TextField
            sx={styles.search}
            placeholder="Search"
            variant="outlined"
            onChange={(event) => handleQuery(event)}
            value={queryValue}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon
                    sx={{ color: "rgba(28,28,28,0.1)", fontSize: "20px" }}
                  />
                </InputAdornment>
              ),
              endAdornment:
                queryValue !== "" ? (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClear}>
                      <CancelIcon
                        sx={{ color: "rgba(28,28,28,0.2)", fontSize: "small" }}
                      />
                    </IconButton>
                  </InputAdornment>
                ) : null,
            }}
          />
        )}
        <DialogContent sx={{ p: "20px 0px" }}>
          <DialogContentText
            id="alert-dialog-description"
            sx={
              {
                // maxHeight: "400px",
                //   "&::-webkit-scrollbar-thumb": {
                //     borderRadius: "100px",
                //     border: "3px solid transparent",
                //     backgroundClip: "content-box",
                //     height: "58px",
                //   },
                //   "&::-webkit-scrollbar": {
                //     width: "12px",
                //   },
                //   "&::-webkit-scrollbar-track-piece": {
                //     borderLeft: "1px solid rgba(0,0,0,0.12)",
                //   },
              }
            }
          >
            {!del && !edit && !suspend && !showReason && (
              <>
                {dialogData?.length !== 0 ? (
                  <ol style={{ padding: "0px 0px 0px 22px", margin: "0px" }}>
                    {dialogData?.map((obj, index) => (
                      <Typography
                        key={obj.key}
                        sx={styles.typography}
                        component="li"
                      >
                        {obj.value || obj.username}
                      </Typography>
                    ))}
                  </ol>
                ) : dialogData?.length == 0 && !approve ? (
                  dialogData?.length == 0 && !publish ? (
                    <Typography sx={styles.typography}>
                      {emptyMessage}
                    </Typography>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </>
            )}
            {(del ||
              publish ||
              logout ||
              delQues ||
              sort ||
              unpublish ||
              delPoster) && (
              <Typography sx={styles.typography}>{deleteMessage}</Typography>
            )}
            {suspend && (
              <Grid container rowSpacing={2}>
                <Grid item md={12}>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 400,
                      lineHeight: "18.15px",
                      color: "#000000",
                    }}
                  >
                    Reason<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    multiline
                    rows={6}
                    value={reason}
                    onChange={handleReasonChange}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white !important",
                        "& fieldset": {
                          borderColor: "#4B4B4B",
                        },
                        "&:hover fieldset": {
                          borderColor: "#4B4B4B",
                        },
                        "&.Mui-focused fieldset": {
                          border: "0.93px solid #4B4B4B",
                          boxShadow: "0 0 7px rgba(0, 0, 0, 0.11)",
                        },
                      },
                    }}
                    placeholder="Enter Reason"
                  />
                  {error?.reason && (
                    <Typography
                      color="error"
                      sx={{ textTransform: "none", fontSize: "14px" }}
                    >
                      {error.reason}
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      textTransform: "none",
                      fontSize: "11px",
                      color: "#A0A0A0",
                      fontStyle: "italic",
                      fontWeight: 500,
                      lineHeight: "13.31px",
                      marginTop: "15px",
                    }}
                  >
                    * This text will be displayed on COD application
                  </Typography>
                </Grid>
              </Grid>
            )}
            {showReason && (
              <Grid container rowSpacing={2}>
                <Grid item md={12}>
                  <TextField
                    multiline
                    rows={3}
                    value={suspendMessage}
                    disabled={true}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white !important",
                        "& fieldset": {
                          borderColor: "#4B4B4B",
                        },
                        "&:hover fieldset": {
                          borderColor: "#4B4B4B",
                        },
                        "&.Mui-focused fieldset": {
                          border: "0.93px solid #4B4B4B",
                          boxShadow: "0 0 7px rgba(0, 0, 0, 0.11)",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            )}
            {edit &&
              (options?.correct_answer == null ? (
                options?.options?.length != 0 ? (
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    sx={{
                      "& .Mui-checked": {
                        color: "#6750A4 !important",
                      },
                      "& .MuiTypography-root": {
                        color: "#000000",
                      },
                      ml: 1,
                    }}
                    value={answer}
                    onChange={handleOfferChangeQuestion}
                  >
                    {options?.options?.map((item, index) => (
                      <FormControlLabel
                        key={index}
                        value={item.key}
                        control={<Radio />}
                        label={item.value}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    sx={{
                      "& .Mui-checked": {
                        color: "#6750A4 !important",
                      },
                      "& .MuiTypography-root": {
                        color: "#000000",
                      },
                      ml: 1,
                    }}
                    value={answer}
                    onChange={handleOfferChangeQuestion}
                  >
                    {emptyOptions?.map((item, index) => (
                      <FormControlLabel
                        key={index}
                        value={item.value}
                        control={<Radio />}
                        label={item.value}
                      />
                    ))}
                  </RadioGroup>
                )
              ) : (
                <Typography sx={{ color: "#000000" }}>
                  Already submitted option for this question
                </Typography>
              ))}
            {(tournament ||
              sports ||
              team ||
              match ||
              advertisement ||
              notification ||
              avatar ||
              gallery ||
              codOffers ||
              questionAttchment ||
              upcomingEvents) &&
              (add || editAdd || questionAttchment) && (
                <>
                  {codOffers && (
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#000000",
                        "& .Mui-checked": {
                          color: "#6750A4 !important",
                        },
                      }}
                      value={offerType}
                      onChange={handleOfferTypeChange}
                    >
                      {radio?.map((item, index) => (
                        <Box
                          sx={{
                            border: "1px solid #8A8A8A",
                            mr: 1,
                            width: "132px",
                            display: "flex",
                            justifyContent: "center",
                            borderRadius: "10px",
                            height: "40px",
                          }}
                        >
                          <FormControlLabel
                            key={index}
                            disabled={editAdd}
                            value={item.value}
                            control={<Radio />}
                            label={item.label}
                            sx={{ mr: 0 }}
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                  )}
                  {(tournament ||
                    team ||
                    match ||
                    notification ||
                    avatar ||
                    upcomingEvents ||
                    questionAttchment) &&
                    addData.map((obj, index) => (
                      <Box key={index}>
                        {obj.autocomplete?.map((item, idx) => (
                          <Box key={idx}>
                            <InputLabel sx={styles.label}>
                              {item.name}
                              <Typography
                                component="span"
                                sx={{ color: "red" }}
                              >
                                *
                              </Typography>
                            </InputLabel>
                            <Autocomplete
                              key={isChecked ? "reset" : "normal"}
                              id={
                                advertisement
                                  ? `tags-standard-${index}-${idx}`
                                  : `combo-box-demo-${index}-${idx}`
                              }
                              disabled={editAdd || disableAutocomplete}
                              multiple={notification}
                              limitTags={3}
                              options={
                                idx === 0 ? autocompleteList : autocompleteList2
                              }
                              onChange={(event, newValue) =>
                                handleAutoCompleteChange(newValue, idx)
                              }
                              value={autocomplete[idx]}
                              renderOption={
                                notification
                                  ? (props, option, { selected }) => (
                                      <li {...props}>
                                        <Checkbox
                                          icon={icon}
                                          checkedIcon={checkedIcon}
                                          style={{ marginRight: 1 }}
                                          checked={selected}
                                        />
                                        {option.label}
                                      </li>
                                    )
                                  : null
                              }
                              sx={{
                                ...styles.textfield,
                                width: "490px",
                                backgroundColor: disableAutocomplete
                                  ? "#E7E7E7"
                                  : undefined,
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={
                                    notification &&
                                    autocomplete[idx]?.length > 0
                                      ? ""
                                      : item.placeholder
                                  }
                                />
                              )}
                            />
                          </Box>
                        ))}
                      </Box>
                    ))}
                  {notification && !upcomingEvents && (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <FormControlLabel
                        value="top"
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="All Users"
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "17px",
                            fontWeight: "700",
                            color: "#000000",
                          },
                        }}
                      />
                    </Box>
                  )}
                  {!match && (
                    <>
                      {addData?.map((obj, index) => (
                        <Box key={index}>
                          {obj?.textfield?.map((item, idx) => (
                            <Box key={idx}>
                              <InputLabel sx={styles.label}>
                                {item.name}
                                <Typography
                                  component="span"
                                  sx={{ color: "red" }}
                                >
                                  *
                                </Typography>
                              </InputLabel>
                              <TextField
                                placeholder={item.placeholder}
                                disabled={
                                  disableTextfield ||
                                  (upcomingEvents && editAdd)
                                }
                                sx={{
                                  ...styles.textfield,
                                  width: "490px",
                                  backgroundColor: disableTextfield
                                    ? "#E7E7E7"
                                    : undefined,
                                }}
                                value={
                                  idx === 0
                                    ? textField?.value
                                    : textField?.value2
                                }
                                inputProps={{
                                  maxLength: notification ? 225 : 45,
                                }}
                                onChange={(event) => {
                                  handleTextfieldChange(event, idx);
                                }}
                              />
                            </Box>
                          ))}
                          {obj?.button && (
                            <>
                              <InputLabel sx={styles.label}>
                                Redirecting Page
                                <Typography
                                  component="span"
                                  sx={{ color: "red" }}
                                >
                                  *
                                </Typography>
                              </InputLabel>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "8px",
                                  margin: "10px 0px",
                                }}
                              >
                                {obj?.button?.map((item, idx) => (
                                  <Box key={idx}>
                                    <Button
                                      sx={{
                                        width: "100%",
                                        backgroundColor: item.backgroundColor,
                                        color: item.color,
                                        border: item.border,
                                        borderRadius: item.radius,
                                        fontWeight: 400,
                                        fontSize: "10px",
                                        textTransform: "capitalize",
                                        boxShadow: "none",
                                        minHeight:"35px"
                                      }}
                                      onClick={(event) => {
                                        
                                      }}
                                      disabled={item.disabled}
                                    >
                                      {item.name}
                                    </Button>
                                  </Box>
                                ))}
                              </Box>
                            </>
                          )}
                          {obj?.search && (
                            <Box key={index}>
                              {obj?.search?.map((item, idx) => (
                                <Box key={idx}>
                                  <Autocomplete
                                    id={
                                      advertisement
                                        ? `tags-standard-${index}-${idx}`
                                        : `combo-box-demo-${index}-${idx}`
                                    }
                                    options={redirect_list}
                                    onChange={(event, newValue) =>
                                      handleRedirectChange(event, newValue)
                                    }
                                    value={selectedRedirectUrl}
                                    renderOption={(props, option) => (
                                      <li {...props}>{option.value}</li>
                                    )}
                                    sx={{
                                      ...styles.textfield,
                                      width: "490px",
                                      
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder={item.placeholder}
                                      />
                                    )}
                                  />
                                </Box>
                              ))}
                            </Box>
                          )}

                          {obj?.editor?.map((item, idx) => (
                            <Box key={idx}>
                              <InputLabel sx={styles.label}>
                                {item.name}
                                <Typography
                                  component="span"
                                  sx={{ color: "red" }}
                                >
                                  *
                                </Typography>
                              </InputLabel>
                              <MessageEditor
                                onEditorChange={handleEditorChange}
                                placeholder={item.placeholder}
                                data={details}
                              />
                            </Box>
                          ))}
                          {obj?.dateTimeField?.map((item, idx) => (
                            <Box key={idx}>
                              <InputLabel sx={styles.label}>
                                {item.name}
                                <Typography
                                  component="span"
                                  sx={{ color: "red" }}
                                >
                                  *
                                </Typography>
                              </InputLabel>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  disabled={
                                    disableTextfield ||
                                    (upcomingEvents && editAdd)
                                  }
                                  value={dayjs(selectedDateTime)}
                                  placeholder={item.placeholder}
                                  onChange={handleEventDateTimeChange}
                                  views={[
                                    "year",
                                    "month",
                                    "day",
                                    "hours",
                                    "minutes",
                                    "seconds",
                                  ]}
                                  viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                  }}
                                  disablePast={true}
                                />
                              </LocalizationProvider>
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </>
                  )}
                  {(tournament ||
                    team ||
                    advertisement ||
                    notification ||
                    avatar ||
                    gallery ||
                    questionAttchment ||
                    (upcomingEvents && !imageUrl && !unpublish)) && (
                    <>
                      <InputLabel sx={styles.label}>
                        {addData[0]?.file}
                        <span style={{ color: "red" }}>*</span>
                      </InputLabel>
                      <Box
                        sx={{
                          borderRadius: "10px",
                          width: "490px",
                          height: "80px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                          border: "1px dashed rgba(0,0,0,0.25)",
                        }}
                      >
                        <Box
                          sx={{
                            width: "465px",
                            height: "80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {file?.image_url === "" && (
                            <>
                              <Box
                                component="img"
                                src="/img/upload.png"
                                alt="upload"
                              />
                              <Box>
                                <Typography
                                  sx={{
                                    color: "#000000",
                                    fontWeight: 400,
                                    fontSize: "13px",
                                  }}
                                >
                                  Select a file or drag and drop here
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "rgba(0,0,0,0.4)",
                                    fontWeight: 400,
                                    fontSize: "11px",
                                    mt: "5px",
                                  }}
                                >
                                  {advertisement
                                    ? "Mp4 file size no more than 3MB"
                                    : "JPG, PNG or JPEG, file size no more than 200kb"}
                                </Typography>
                              </Box>
                            </>
                          )}
                          {file?.image_url !== "" && !advertisement && (
                            <>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Avatar
                                  alt="image"
                                  src={file?.image_url}
                                  sx={{ width: 49, height: 49 }}
                                />
                                <Box>
                                  <Typography>
                                    {file?.image?.name || file?.image_name}
                                    preview
                                  </Typography>
                                </Box>
                              </Box>
                            </>
                          )}
                          {file?.image_url !== "" && advertisement && (
                            <>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Box
                                  component="video"
                                  src={file?.image_url}
                                  alt="advertisement"
                                  sx={{
                                    width: "70px",

                                    height: "48px",

                                    borderRadius: "10px",
                                  }}
                                />
                                <Box>
                                  <Typography>
                                    {file?.image?.name || file?.image_name}
                                  </Typography>
                                </Box>
                              </Box>
                            </>
                          )}
                          <Button
                            sx={{
                              width: "93px",
                              backgroundColor: "#FBFDFE !important",
                              color: "#0F91D2",
                              border: "1px solid #0F91D2",
                              fontWeight: 400,
                              fontSize: "10px",
                              textTransform: "capitalize",
                              boxShadow: "none",
                            }}
                            onClick={handleClick}
                          >
                            {file?.image_url === "" ? "Select file" : "Change"}
                          </Button>
                          <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={(e) =>
                              handleFileChange(e, advertisement ? "adv" : "img")
                            }
                          />
                        </Box>
                      </Box>
                      {advertisement && (
                        <>
                          <InputLabel sx={styles.label}>
                            {addData[0]?.thumbnail}
                            <span style={{ color: "red" }}>*</span>
                          </InputLabel>
                          <Box
                            sx={{
                              borderRadius: "10px",
                              width: "490px",
                              height: "80px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                              border: "1px dashed rgba(0,0,0,0.25)",
                            }}
                          >
                            <Box
                              sx={{
                                width: "465px",
                                height: "80px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              {file2?.image_url === "" && (
                                <>
                                  <Box
                                    component="img"
                                    src="/img/upload.png"
                                    alt="upload"
                                  />
                                  <Box>
                                    <Typography
                                      sx={{
                                        color: "#000000",
                                        fontWeight: 400,
                                        fontSize: "13px",
                                      }}
                                    >
                                      Select a file or drag and drop here
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "rgba(0,0,0,0.4)",
                                        fontWeight: 400,
                                        fontSize: "11px",
                                        mt: "5px",
                                      }}
                                    >
                                      JPG, PNG or JPEG, file size no more than
                                      2MB
                                    </Typography>
                                  </Box>
                                </>
                              )}
                              {file2?.image_url !== "" && (
                                <>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <Avatar
                                      alt="image"
                                      src={file2?.image_url}
                                      sx={{ width: 49, height: 49 }}
                                    />
                                    <Box>
                                      <Typography>
                                        {file2?.image?.name ||
                                          file2?.image_name}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                              <Button
                                sx={{
                                  width: "93px",
                                  backgroundColor: "#FBFDFE !important",
                                  color: "#0F91D2",
                                  border: "1px solid #0F91D2",
                                  fontWeight: 400,
                                  fontSize: "10px",
                                  textTransform: "capitalize",
                                  boxShadow: "none",
                                }}
                                onClick={handleClick2}
                              >
                                {file2?.image_url === ""
                                  ? "Select file"
                                  : "Change"}
                              </Button>
                              <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                ref={fileInputRef2}
                                onChange={handleFile}
                              />
                            </Box>
                          </Box>
                        </>
                      )}
                    </>
                  )}
                  {match && (
                    <Grid container>
                      <Grid item md={6}>
                        <InputLabel sx={styles.label}>
                          Team A
                          <Typography component="span" sx={{ color: "red" }}>
                            *
                          </Typography>
                        </InputLabel>
                        <Autocomplete
                          id={`combo-box-demo`}
                          disabled={editAdd}
                          options={autocompleteTeam}
                          value={teamAutocompleteValue.teamA}
                          onChange={(event, newValue) =>
                            handleTeamChange(newValue, "A")
                          }
                          sx={{ ...styles.textfield, width: "237px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={"Select team A"}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={6}>
                        <InputLabel sx={styles.label}>
                          Team B
                          <Typography component="span" sx={{ color: "red" }}>
                            *
                          </Typography>
                        </InputLabel>
                        <Autocomplete
                          id={`combo-box-demo`}
                          disabled={editAdd}
                          options={autocompleteTeamB}
                          onChange={(event, newValue) =>
                            handleTeamChange(newValue, "B")
                          }
                          value={teamAutocompleteValue.teamB}
                          sx={{ ...styles.textfield, width: "237px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={"Select team B"}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={6}>
                        <InputLabel sx={styles.label}>
                          Match Date
                          <Typography component="span" sx={{ color: "red" }}>
                            *
                          </Typography>
                        </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={dateTime.date}
                            format="YYYY/MM/DD"
                            minDate={dayjs()}
                            onChange={(newValue) =>
                              handleDateTimeChange(newValue, "date")
                            }
                            slotProps={{
                              textField: {
                                error: false,
                                onKeyDown: (event) => {
                                  event.preventDefault();
                                },
                                size: "medium",
                                fullWidth: true,
                                placeholder: "Select date",
                                sx: {
                                  ...styles.textfield,
                                  width: "237px",
                                  "& .MuiSvgIcon-root": {
                                    color: "#000000",
                                  },
                                  borderRadius: "6px",
                                  input: { cursor: "pointer" },
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item md={6}>
                        <InputLabel sx={styles.label}>
                          Match Time
                          <Typography component="span" sx={{ color: "red" }}>
                            *
                          </Typography>
                        </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileTimePicker
                            value={dateTime.time}
                            onChange={(newValue) =>
                              handleDateTimeChange(newValue, "time")
                            }
                            slotProps={{
                              layout: {
                                sx: {
                                  "& .MuiButton-root": {
                                    color: "#0042FF",
                                    fontWeight: 500,
                                  },

                                  "& .MuiPickersToolbar-content": {
                                    "& .MuiTimePickerToolbar-hourMinuteLabel": {
                                      alignItems: "center",
                                      "& .MuiPickersToolbarText-root": {
                                        fontSize: "74px",
                                        color: "#000000",
                                      },
                                    },
                                    "& .Mui-selected": {
                                      color: "#0042FF !important",
                                    },
                                  },
                                },
                              },
                              textField: {
                                error: false,
                                onKeyDown: (event) => {
                                  event.preventDefault();
                                },
                                size: "medium",
                                fullWidth: true,
                                placeholder: "Select time",
                                InputProps: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <AccessAlarmIcon
                                        sx={{
                                          color: "#000000",
                                          stroke: "#000000",
                                          strokeWidth: 0.6,
                                          fontSize: "23px",
                                        }}
                                      />
                                    </InputAdornment>
                                  ),
                                },
                                sx: {
                                  ...styles.textfield,
                                  width: "237px",
                                  borderRadius: "6px",
                                  input: { cursor: "pointer" },
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}

            {image && (
              <>
                {!avatar ? (
                  <Box
                    component="img"
                    src={imageUrl ? imageUrl : "/img/dummy1.png"}
                    alt="upload"
                    sx={{ height: "357px", width: "357px" }}
                  />
                ) : (
                  <Avatar
                    alt="Avatar"
                    src={imageUrl ? imageUrl : "/img/dummy1.png"}
                    sx={{ width: "300px", height: "300px" }}
                  />
                )}
              </>
            )}
            {video && (
              <video controls height="100%" width="100%">
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}
            {attach && (
              <Box sx={{ ml: 1 }}>
                <Tabs
                  value={value}
                  onChange={handleChangeTab}
                  variant="scrollable"
                  scrollButtons={false}
                  aria-label="scrollable auto tabs example"
                  sx={styles.tab}
                >
                  <Tab label="COD Coin" />
                  <Tab label="Vouchers" />
                  <Tab label="Coupons" />
                  <Tab label="Offers" />
                </Tabs>
                <Box sx={{ width: "100%", borderTop: "1px solid #E4E4E4" }}>
                  {value === 0 && (
                    <>
                      <InputLabel sx={styles.label}>
                        Enter Coins
                        <Typography component="span" sx={{ color: "red" }}>
                          *
                        </Typography>
                      </InputLabel>
                      <TextField
                        placeholder="Enter coins"
                        fullWidth
                        sx={styles.textfield}
                        value={offerCoin}
                        onChange={handleOfferCoinChange}
                      />
                    </>
                  )}
                  {value === 1 && (
                    <Box sx={styles.offer}>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        sx={{
                          "& .Mui-checked": {
                            color: "#6750A4 !important",
                          },
                        }}
                        value={offerValue.offer_title}
                        onChange={handleOfferChange}
                      >
                        {offer?.map((item, index) => (
                          <FormControlLabel
                            key={index}
                            value={item.offer_title}
                            control={<Radio />}
                            label={item.offer_title}
                          />
                        ))}
                      </RadioGroup>
                    </Box>
                  )}
                  {value === 2 && (
                    <Box sx={styles.offer}>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        sx={{
                          "& .Mui-checked": {
                            color: "#6750A4 !important",
                          },
                        }}
                        value={offerValue.offer_title}
                        onChange={handleOfferChange}
                      >
                        {offer?.map((item, index) => (
                          <FormControlLabel
                            key={index}
                            value={item.offer_title}
                            control={<Radio />}
                            label={item.offer_title}
                          />
                        ))}
                      </RadioGroup>
                    </Box>
                  )}
                  {value === 3 && (
                    <Box sx={styles.offer}>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        sx={{
                          "& .Mui-checked": {
                            color: "#6750A4 !important",
                          },
                        }}
                        value={offerValue.offer_title}
                        onChange={handleOfferChange}
                      >
                        {offer?.map((item, index) => (
                          <FormControlLabel
                            key={index}
                            value={item.offer_title}
                            control={<Radio />}
                            label={item.offer_title}
                          />
                        ))}
                      </RadioGroup>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            {notification && add && (
              <>
                <Box sx={{ m: "10px 0px" }}>
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showDateTimePickerCheckbox}
                          onChange={handletimeCheckboxClick}
                          sx={{
                            color: '#0042FF', // unchecked color
                            '&.Mui-checked': {
                              color: '#0042FF', // checked color
                            },
                          }}
                        />
                      }
                      label="Schedule Question"
                    />
                  </Box>
                </Box>

                {selectedDateTime && showDateTimePickerCheckbox && (
                  <div>
                    <Typography
                      sx={{
                        fontfamily: "Inter",
                        fontsize: "13px",
                        fontWeight: 600,
                        lineHeight: "14px",
                        textAlign: "left",
                      }}
                    >
                      {selectedDateTime.format("DD/MM/YYYY-DD HH:mm")}{" "}
                      <Box
                        component="img"
                        src="/img/edit_icon.png"
                        alt="edit"
                        onClick={handleEditClick}
                      />
                    </Typography>
                  </div>
                )}
                { showDateTimePicker  && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      open={ showDateTimePicker}
                      value={selectedDateTime}
                      onChange={handleEventDateTimeChange}
                      onClose={() => setShowDateTimePicker(false) }
                      views={[
                        "year",
                        "month",
                        "day",
                        "hours",
                        "minutes",
                        "seconds",
                      ]}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      disablePast
                      renderInput={() => (
                        <div style={{ display: "none" }}></div>
                      )}
                      slotProps={{
                        // layout: {
                        //   sx: {
                        //     "& .MuiButton-root": {
                        //       color: "#0042FF",
                        //       fontWeight: 500,
                        //     },

                        //     "& .MuiPickersToolbar-content": {
                        //       "& .MuiTimePickerToolbar-hourMinuteLabel": {
                        //         alignItems: "center",
                        //         "& .MuiPickersToolbarText-root": {
                        //           fontSize: "74px",
                        //           color: "#000000",
                        //         },
                        //       },
                        //       "& .Mui-selected": {
                        //         color: "#0042FF !important",
                        //       },
                        //     },
                        //   },
                        // },
                        textField: {
                         
                          sx: {
                          "& .MuiOutlinedInput-root":{
                           display:"none"
                          }
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              </>
            )}
            {(add || editAdd) && predefinedQuestion && (
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Box>
                  <InputLabel sx={styles.label}>
                    Question
                    <Typography component="span" sx={{ color: "red" }}>
                      *
                    </Typography>
                  </InputLabel>
                  <TextField
                    placeholder="Enter question"
                    sx={{
                      ...styles.textfield,
                      width: "455px",
                    }}
                    value={textField}
                    inputProps={{
                      maxLength: 100,
                    }}
                    onChange={(event) => {
                      handleQuestionTextfieldChange(event);
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <InputLabel sx={styles.label}>
                    Options
                    <Typography component="span" sx={{ color: "red" }}>
                      *
                    </Typography>
                  </InputLabel>
                  <Box
                    sx={{
                      width: "450px",
                      height: "56px",
                      border: "1px solid #4B4B4B",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    {optionColumn?.map((column, index) => (
                      <TextField
                        placeholder={`opt ${index + 1}`}
                        value={column.value}
                        onChange={(event) => handleChange(index, event)}
                        inputProps={{ maxLength: 25 }}
                        InputProps={{
                          endAdornment: optionColumn.length > 2 && (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleOption(column, index)}
                                edge="end"
                                sx={{ pl: 0 }}
                              >
                                <CloseIcon
                                  sx={{ fontSize: "16px", color: "#49454F" }}
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          ...styles.optiontextfield,
                          width: "100px",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            {approve && (
              <Box>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: 400, color: "#000000" }}
                >
                  Question
                </Typography>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#000000",
                    mt: 2,
                  }}
                >
                  {liveApprove.question}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#000000",
                    mt: 2,
                  }}
                >
                  Select option
                </Typography>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    fontSize: "18px",
                    fontWeight: 400,
                    color: "#000000",
                    "& .Mui-checked": {
                      color: "#FFFFFF !important",
                    },
                    mt: 1,
                  }}
                  value={liveAnswer}
                  onChange={handleLiveAnswer}
                >
                  {liveApprove.options?.map((item, index) => (
                    <Box
                      sx={{
                        border: "1px solid #8A8A8A",
                        backgroundColor:
                          liveAnswer == item.key ? "#008A16" : "#FFFFFF",
                        mr: 1,
                        p: "5px 10px",
                        width: "auto",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "10px",
                        height: "25px",
                      }}
                    >
                      <FormControlLabel
                        key={index}
                        value={item.key}
                        control={<Radio />}
                        label={item.value}
                        sx={{
                          mr: 0,
                          color: liveAnswer == item.key ? "#FFFFFF" : "#000000",
                        }}
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            p: "15px 0px 0px",
            borderTop: "1px solid rgba(28, 28, 28, 0.1)",
          }}
        >
          {button.map((obj, index) => (
            <Button
              key={index}
              onClick={() => handleAction(obj.name)}
              sx={obj.style}
            >
              {obj.name}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
      <Dialog
        open={suspendAction}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            minWidth: "500px",
            maxWidth: "600px",
            p: "24px",
          },
          // zIndex: "1500 !important",
          ".MuiPopover": {
            zIndex: 1500,
          },
        }}
      >
        <DialogTitle sx={styles.headerflex}>
          <Box
            sx={{
              ...styles.deleteHeader,
              color: "#D42600",
            }}
          >
            <Box component="img" src={"/img/deleteWarning.png"} alt="delete" />
            Suspend Confirmation
          </Box>
          <IconButton sx={{ p: 0 }}>
            <CloseIcon onClick={handleCloseSuspend} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: "20px 0px" }}>
          <DialogContentText id="alert-dialog-description">
            <Typography sx={styles.typography}>{suspendConfirmMsg}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            p: "15px 0px 0px",
            borderTop: "1px solid rgba(28, 28, 28, 0.1)",
          }}
        >
          {suspendBtn?.map((obj, index) => (
            <Button
              key={index}
              onClick={() => handleAction(obj.name)}
              sx={obj.style}
            >
              {obj.name}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogComponent;
