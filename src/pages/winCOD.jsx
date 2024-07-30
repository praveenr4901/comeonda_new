import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useEffect, useState } from "react";
import {
  deleteMethod,
  getMethodWithParams,
  patchMethod,
  postMethod,
} from "./api/api";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  questionDeleteMessage,
  winCodDeleteMessage,
  winCodPublishMessage,
} from "../utilities/constants";
import DialogComponent from "../components/dialogComponent";
import Snackbar from "../components/snackbarComponent";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Approval } from "@mui/icons-material";
import Countdown from "react-countdown";
import { useRouter } from "next/router";

const styles = {
  liveHeader: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#ADB8CC",
  },
  liveDate: {
    fontSize: "10px",
    fontWeight: 800,
    color: "#000000",
  },
  liveTime: {
    fontSize: "10px",
    fontWeight: 500,
    color: "#ADB8CC",
  },
  liveTeam: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#000000",
    mt: 1,
  },
  questionHeader: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    ml: 1,
    fontSize: "14px",
    fontWeight: 500,
    color: "#667085",
  },
  listQuestion: {
    color: "#000000",
    fontWeight: 500,
    fontSize: "13px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    ml: 1,
  },
  timer: {
    fontSize: "9px",
    fontWeight: 500,
    color: "#727272",
    textAlign: "right",
  },
  live: {
    minWidth: "98px",
    height: "26px",
    fontSize: "12px",
    fontWeight: 500,
    borderRadius: "40px",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    "& .MuiTab-root": {
      border: "2px solid rgba(0,0,0,0.25)",
      borderBottom: "none",
      width: "110px",
      p: "8px 10px",
      display: "flex",
      ml: "10px",
      backgroundColor: "#FFFFFF",
      borderTopRightRadius: "20px",
      borderTopLeftRadius: "20px",
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
const picker = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px !important",
    height: "29px",
    width: "85px",
    borderRadius: "20px",
    backgroundColor: "rgba(69,152,229,0.3)",
    fontSize: "10px",
    fontWeight: 600,
    color: "#0057FF",
    "&:hover fieldset": {
      border: "1px solid #8692A6",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #8692A6",
      boxShadow: "0 0 7px rgba(0, 0, 0, 0.11)",
    },
  },
};
function winCOD() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [liveMatch, setLiveMatch] = useState([]);
  const [live, setLive] = useState([]);
  const [question, setQuestion] = useState([]);
  const [offer, setOffer] = useState([]);
  const [matchId, setMatchId] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  const [queryWinner, setQueryWinner] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [delId, setDelId] = useState({ offer_id: "", question_id: "" });
  const [quesId, setQuesId] = useState("");
  const [liveCountdown, setLiveCountdown] = useState(0);
  const [action, setAction] = useState({
    del: false,
    attach: false,
    publish: false,
    approve: false,
    approved: false,
    delQues: false,
  });
  const [value, setValue] = useState(0);
  const [valueFooter, setValueFooter] = useState(0);
  const [offerCoin, setOfferCoin] = useState("");
  const [offerValue, setOfferValue] = useState({});
  const [publish, setPublish] = useState(false);
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [countDown, setCountDown] = useState("");
  const [livecount, setLiveCount] = useState({ live: 0, approval: 0 });
  const [liveApprove, setLiveApprove] = useState({});
  const [liveAnswer, setLiveAnswer] = useState("");
  const button = {
    ok: {
      width:
        action.attach || action.approve || action.approved ? "87px" : "150px",
      backgroundColor: "#0042FF !important",
      color: "#FFFFFF",
      border: "1px solid #0042FF",
      fontWeight: 600,
      fontSize: "16px",
      textTransform: "capitalize",
      boxShadow: "none",
    },
    publish: {
      width: "59px",
      color: "#FFFFFF",
      fontWeight: 500,
      fontSize: "10px",
      textTransform: "capitalize",
      boxShadow: "none",
      borderRadius: "6px",
      mb: 1,
    },
  };
  const [message, setMessage] = useState({ color: "", name: "" });
  const [emptyMessage, setEmptyMessage] = useState("");
  const [test, setTest] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (question, string) => {
    handleAction(question, string);
    setAnchorEl(null);
  };
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setQuesId(id);
  };
  const fetchData = async () => {
    try {
      const param = {
        page: 1,
        size: 50,
      };
      const response = await getMethodWithParams(
        `v2/new_matches_win_cod`,
        param
      );
      if (response?.data.status === "success") {
        setMatchId(response?.data?.response?.result[0].id);
        setLiveMatch(response?.data?.response?.result);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchLiveCount = async () => {
    try {
      const param = {
        match_id: matchId,
      };
      const response = await getMethodWithParams(`v2/questions_count`, param);
      if (response?.data.status === "success") {
        setLiveCount({
          live: response?.data?.response?.live,
          approval: response?.data?.response?.approval,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchQuestion = async () => {
    try {
      const param = {
        match_id: matchId,
        page: 1,
        size: 200,
      };
      const response = await getMethodWithParams(
        `v2/list_win_cod_questions`,
        param
      );
      if (response?.data.status === "success") {
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": index + 1,
          };
        });
        setQuestion(dataArray);
      } else {
        setQuestion([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteQuestion = async () => {
    try {
      const param = {
        question_id: quesId,
      };
      const response = await deleteMethod(`v2/delete_cod_question`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully deleted question",
        });
        fetchQuestion();
        fetchLiveCount();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/winCOD");
    fetchData();
  }, []);
  useEffect(() => {
    fetchQuestion();
    fetchLiveCount();
  }, [matchId]);
  useEffect(() => {
    fetchLiveQuestion();
  }, [valueFooter]);
  useEffect(() => {
    if (value === 1 || value === 2 || value === 3) {
      fetchOffer();
    }

  }, [value]);
  const handleCardClick = (id) => {
    setMatchId(id);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleAction = (row, string) => {
    setEmptyMessage("");
    setDialogData([]);
    setQueryWinner("");
    setOfferValue({});
    setOfferCoin("");
    setValue(0);
    setOffer([]);
    setDelId({ offer_id: "", question_id: "" });
    setQuesId("");
    setLiveApprove({});
    setLiveAnswer("");
    setAction((prevAction) => ({
      ...prevAction,
      del: false,
      attach: false,
      publish: false,
      approve: false,
      approved: false,
      delQues: false,
    }));
    if (string === "del") {
      setAction((prevAction) => ({
        ...prevAction,
        del: true,
      }));
      setDelId({ offer_id: row.offer_id, question_id: row.id });
    } else if (string === "attach") {
      setAction((prevAction) => ({
        ...prevAction,
        attach: true,
      }));
      setQuesId(row.id);
    } else if (string === "publish") {
      if (row.offer_id == null) {
        setOpenSnackbar(true);
        setMessage({
          color: "#f44336",
          name: "Please attach an offer for this question before publish",
        });
      } else {
        setAction((prevAction) => ({
          ...prevAction,
          publish: true,
        }));
        setQuesId(row.id);
      }
    } else if (string === "approve") {
      setAction((prevAction) => ({
        ...prevAction,
        approve: true,
      }));
      setQuesId(row.id);
      setLiveApprove(row);
    } else if (string === "approved") {
      setAction((prevAction) => ({
        ...prevAction,
        approved: true,
      }));
      setQuesId(row.id);
      fetchWinnersList(row.id);
    } else if (string === "delete") {
      setAction((prevAction) => ({
        ...prevAction,
        delQues: true,
      }));
      setQuesId(row.id);
    }
    if (string === "publish" && row.offer_id == null) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  const handleDeleteClick = () => {
    if (action.publish) {
      setPublish(true);
      setSeconds(10);
      setProgress(0);
    } else {
      deleteOffer();
    }
  };
  const handleDeleteWinCodQuestion = () => {
    deleteQuestion();
  };
  const handleCreateClick = () => {
    if (action.approve) {
      if (liveAnswer) {
        submitLiveAnswer();
        handleClose();
      } else {
        setOpenSnackbar(true);
        setMessage({
          color: "#f44336",
          name: "Please select anyone of the options",
        });
      }
    } else {
      if (offerCoin || Object.keys(offerValue).length != 0) {
        addOffer();
        handleClose();
      } else {
        setOpenSnackbar(true);
        setMessage({
          color: "#f44336",
          name: "Please fill all the fields",
        });
      }
    }
  };
  const handleChangeTab = (event, newValue) => {
    setOfferValue({});
    setOfferCoin("");
    setValue(newValue);
  };
  const handleChangeTabFooter = (event, newValue) => {
    setValueFooter(newValue);
  };
  const fetchWinnersList = async (id) => {
    setEmptyMessage("");
    try {
      const param = {
        question_id: id ? id : quesId,
        search: queryWinner,
      };
      const response = await getMethodWithParams(`v2/winners_list`, param);
      if (response?.data?.status === "success") {
        setDialogData(response?.data?.response);
        // if (response?.data?.response.length === 0) {
        //   queryWinner
        //     ? setEmptyMessage("No such winners found for this question")
        //     : setEmptyMessage("No winners found for this question");
        // }
      } else {
        setDialogData([]);
        queryWinner
          ? setEmptyMessage("No such winners found for this question")
          : setEmptyMessage("No winners found for this question");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteOffer = async () => {
    try {
      const response = await postMethod(`v2/remove_offer_from_question`, {
        offer_id: delId.offer_id,
        question_id: delId.question_id,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully removed offer" });
        fetchQuestion();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const addOffer = async () => {
    const currentDateAndTime = dayjs();
    const currentISOString = currentDateAndTime.toISOString();
    try {
      const response = await postMethod(`v2/add_offer_to_question`, {
        predefined_offer_id: offerValue.id,
        question_id: quesId,
        offer_name: offerValue ? offerValue.offer_name : "",
        type: value === 0 ? "coin" : value === 1 ? "voucher" : "coupon",
        offer_title: offerValue ? offerValue.offer_title : "",
        coins: offerCoin ? offerCoin : "",
        offer_details: offerValue ? offerValue.offer_details : "",
        created_datetime: currentISOString,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully attached offer" });
        fetchQuestion();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const submitLiveAnswer = async () => {
    try {
      const response = await patchMethod(`v2/wincod_answer`, {
        question_id: quesId,
        correct_answer: liveAnswer.trim(),
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully approved" });
        fetchLiveQuestion();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchOffer = async () => {
    try {
      const param = {
        page: 1,
        size: 100,
        type: value === 1 ? "voucher" :value === 2 ? "coupon":"offer",
      };
      const response = await getMethodWithParams(
        `v2/get_voucher_coupon_list`,
        param
      );
      if (response?.data.status === "success") {
        setOffer(response?.data?.response?.result);
      } else {
        setOffer([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchOfferList = async () => {
    try {
      const param = {
        page: 1,
        size: 100,
        type: value === 1 ? "voucher" :value === 2 ? "coupon":"offer",
      };
      const response = await getMethodWithParams(
        `v2/get_voucher_coupon_list`,
        param
      );
      if (response?.data.status === "success") {
        setOffer(response?.data?.response?.result);
      } else {
        setOffer([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const publishQuestion = async () => {
    try {
      const response = await patchMethod(`v2/publish_question`, {
        question_id: quesId,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Question published successfully",
        });
        fetchQuestion();
        fetchLiveCount();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateCountDown = async () => {
    try {
      const response = await patchMethod(`v2/update_countdown`, {
        question_id: quesId,
        count_down: `00:${countDown}`,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Countdown updated successfully",
        });
        setCountDown("");
        fetchQuestion();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLiveQuestion = async () => {
    try {
      const param = {
        match_id: matchId,
        status: valueFooter === 0 ? "live" : "approval",
      };
      const response = await getMethodWithParams(
        `v2/published_question_list`,
        param
      );
      if (response?.data.status === "success") {
        const dataArray = response?.data?.response?.map((obj, index) => {
          const time = dayjs(obj.end_datetime);
          const currentTime = dayjs();
          return {
            ...obj,
            livecount: time.diff(currentTime),
          };
        });
        setLive(dataArray);
      } else {
        setLive([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClosePublish = () => {
    setSeconds(10);
    setProgress(0);
    setPublish(false);
  };
  const handleTimeChange = (newValue, index, data) => {
    const count = dayjs(newValue).format("mm:ss");
    setCountDown(count);
    setQuesId(data.id);
  };
  const handleOKButtonPress = () => {
    updateCountDown();
  };
  useEffect(() => {
    let interval;
    if (publish) {
      interval = setInterval(() => {
        if (seconds === 0) {
          clearInterval(interval);
          setPublish(false);
          publishQuestion();
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
          setProgress((prevProgress) => prevProgress + 10);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      clearInterval(interval);
    }
  }, [publish, seconds]);

  const handleWheel = (event) => {
    if (event.deltaY !== 0) {
      event.preventDefault();
      const container = event.currentTarget;
      container.scrollTo({
        left: container.scrollLeft + event.deltaY,
        behavior: "smooth",
      });
    }
  };

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      fetchLiveQuestion();
      fetchLiveCount();
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{ fontSize: "8px", fontWeight: 600, color: "#724B00" }}
          >
            {minutes}:{seconds}
          </Typography>
        </Box>
      );
    }
  };
  const handleWinnerQuery = (string) => {
    setQueryWinner(string ? string : "");
  };
  useEffect(() => {
    fetchWinnersList();
  }, [queryWinner]);
  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("usertoken");
  };
  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (!token) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [router]);
  if (loading) {
    return null;
  }
  return (
    <>
      <Box
        sx={{
          // backgroundColor: "#F5F7FA",
          width: "100%",
          height: "100%",
          marginLeft: "260px",
        }}
      >
        <Box
          sx={{
            margin: "25px",
            height: "100%",
            marginLeft: "10px",
            minWidth: "200px",
            mb: "70px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item md={3}>
              {liveMatch?.map((match, index) => (
                <Card
                  sx={{
                    mb: 1,
                    width: "100%",
                    borderRadius: "20px",
                    backgroundColor: matchId === match.id ? "#0042FF" : "",
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: "#0042FF",
                    },
                  }}
                  key={index}
                  onClick={() => handleCardClick(match.id)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={match.team1_flag}
                          alt="Team Image"
                          sx={{ width: 60, height: 60 }}
                        />
                        <Typography sx={styles.liveTeam}>
                          {match.team1_name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ ...styles.liveHeader, mb: 1 }}>
                          {match?.tournament}
                        </Typography>
                        <Typography sx={styles.liveDate}>
                          {match?.date}
                        </Typography>
                        <Typography sx={styles.liveTime}>
                          {`${match?.time} IST`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          // justifyContent: "space-between",
                        }}
                      >
                        <Avatar
                          src={match.team2_flag}
                          alt="Team Image"
                          sx={{ width: 60, height: 60 }}
                        />
                        <Typography sx={styles.liveTeam}>
                          {match.team2_name}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            <Grid item md={9}>
              <Card
                sx={{ width: "100%", height: "41px", borderRadius: "10px" }}
              >
                <Grid container sx={styles.questionHeader}>
                  <Grid item md={1}>
                    Sl.No
                  </Grid>
                  <Grid item md={6}>
                    Question
                  </Grid>
                  <Grid item md={2}>
                    Time
                  </Grid>
                  <Grid item md={3}></Grid>
                </Grid>
              </Card>

              {question.length !== 0 ? (
                question?.map((question, index) => (
                  <Card
                    sx={{
                      width: "100%",
                      height: "87px",
                      mt: 1,
                      borderRadius: "10px",
                    }}
                    key={question.id}
                  >
                    <Grid container sx={styles.listQuestion}>
                      <Grid item md={1}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Box
                            component="img"
                            src="/img/combinedShape.png"
                            alt="image"
                          />
                          <Typography>{question["Sl.No"]}</Typography>
                        </Box>
                      </Grid>
                      <Grid item md={6}>
                        {question.question}
                        <br />
                        {(question.offer_title || question.type === "coin") && (
                          <Chip
                            sx={{
                              height: "25px",
                              width: "auto",
                              mt: 1,
                              backgroundColor: "#D1B005",
                              "& .MuiChip-label": {
                                fontSize: "10px",
                                fontWeight: 600,
                                color: "#FFFFFF",
                              },
                              "&:hover": {
                                backgroundColor: "#D1B005",
                              },
                            }}
                            label={
                              question.type === "coin"
                                ? `Coins-${question.coins}`
                                : question.offer_title
                            }
                            onDelete={
                              question.publish === true
                                ? undefined
                                : () => handleAction(question, "del")
                            }
                            deleteIcon={
                              <Box
                                component="img"
                                src="/img/close.svg"
                                alt="image"
                                sx={{
                                  "&:hover": {
                                    cursor:
                                      question.publish === true
                                        ? "default"
                                        : "pointer",
                                  },
                                }}
                              />
                            }
                          />
                        )}
                      </Grid>
                      <Grid item md={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileTimePicker
                            disabled={question.publish}
                            value={dayjs(question.count_down, "hh:mm:ss")}
                            onChange={(newValue) =>
                              handleTimeChange(newValue, index, question)
                            }
                            onAccept={handleOKButtonPress}
                            views={["minutes", "seconds"]}
                            format="mm:ss"
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
                                // fullWidth: true,
                                // onKeyDown: (event) => {
                                //   event.preventDefault();
                                // },
                                InputProps: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Box
                                        component="img"
                                        src="/img/clock.png"
                                        alt="image"
                                        sx={{
                                          "&:hover": {
                                            cursor:
                                              question.publish === true
                                                ? "default"
                                                : "pointer",
                                          },
                                        }}
                                      />
                                    </InputAdornment>
                                  ),
                                },
                                sx: {
                                  ...picker,
                                  input: {
                                    cursor: question.publish
                                      ? "default"
                                      : "pointer",
                                  },
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item md={3}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          <>
                            <MoreHorizIcon
                              onClick={(e) => handleClick(e, question.id)}
                            />
                            {quesId == question.id && (
                              <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
                                MenuListProps={{
                                  "aria-labelledby": "basic-button",
                                }}
                                sx={{
                                  "& .MuiMenu-list": {
                                    py: 0,
                                  },
                                }}
                              >
                                {quesId == question.id && (
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuClick(question, "delete")
                                    }
                                    sx={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      color: "#D42600",
                                      backgroundColor: "#FFFFFF !important",
                                      borderBottom: "1px solid #DCDCDC",
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                )}
                              </Menu>
                            )}
                          </>
                          <Box
                            component="img"
                            src="/img/attach.png"
                            alt="attach"
                            sx={{
                              "&:hover": {
                                cursor:
                                  question.publish === true
                                    ? "default"
                                    : "pointer",
                              },
                            }}
                            onClick={
                              question.publish === true
                                ? undefined
                                : () => handleAction(question, "attach")
                            }
                          />
                          {question.publish === false && (
                            <Box sx={{ width: "100%" }}>
                              <Box>
                                <Button
                                  variant="contained"
                                  sx={{
                                    ...button.publish,
                                    backgroundColor:
                                      publish && quesId === question.id
                                        ? "#CCCCCC !important"
                                        : "#0042FF !important",

                                    border:
                                      publish && quesId === question.id
                                        ? "1px solid #CCCCCC"
                                        : "1px solid #0042FF",
                                  }}
                                  onClick={
                                    publish
                                      ? undefined
                                      : () => handleAction(question, "publish")
                                  }
                                >
                                  Publish
                                </Button>
                                {publish && quesId === question.id && (
                                  <IconButton
                                    sx={{ mb: 1 }}
                                    onClick={handleClosePublish}
                                  >
                                    <CloseIcon
                                      fontSize="small"
                                      sx={{ color: "#FF0000" }}
                                    />
                                  </IconButton>
                                )}
                              </Box>
                              {publish && quesId === question.id && (
                                <Box sx={{ width: "80%" }}>
                                  <LinearProgress
                                    variant="determinate"
                                    sx={{
                                      backgroundColor: "#EFEFEF",
                                      "& .MuiLinearProgress-bar": {
                                        backgroundColor: "#F93F3F !important",
                                      },
                                    }}
                                    value={progress}
                                  />
                                  <Typography
                                    sx={styles.timer}
                                  >{`00:${seconds}`}</Typography>
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))
              ) : (
                <Card
                  sx={{
                    width: "100%",
                    height: "87px",
                    mt: 1,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No Questions found.
                </Card>
              )}
            </Grid>
          </Grid>
        </Box>
        <DialogComponent
          open={open}
          handleClose={handleClose}
          header={
            action.attach
              ? "Offer List"
              : action.publish
              ? "Confirmation"
              : action.approve
              ? "Approve"
              : action.approved
              ? "Winners List"
              : "Delete Confirmation"
          }
          button={
            action.attach || action.approve
              ? [{ name: "Submit", style: button.ok }]
              : action.approved
              ? [{ name: "Ok", style: button.ok }]
              : [{ name: "Yes, Confirm", style: button.ok }]
          }
          handleWinnerQuery={handleWinnerQuery}
          handleDeleteClick={handleDeleteClick}
          handleCreateClick={handleCreateClick}
          handleDeleteWinCodQuestion={handleDeleteWinCodQuestion}
          deleteMessage={
            action.del
              ? winCodDeleteMessage
              : action.publish
              ? winCodPublishMessage
              : action.delQues
              ? questionDeleteMessage
              : ""
          }
          del={action.del}
          delQues={action.delQues}
          dialogData={dialogData}
          emptyMessage={emptyMessage}
          attach={action.attach}
          publish={action.publish}
          approve={action.approve}
          approved={action.approved}
          value={value}
          setValue={setValue}
          liveApprove={liveApprove}
          liveAnswer={liveAnswer}
          setLiveAnswer={setLiveAnswer}
          offerCoin={offerCoin}
          setOfferCoin={setOfferCoin}
          handleChangeTab={handleChangeTab}
          offer={offer}
          offerValue={offerValue}
          setOfferValue={setOfferValue}
          winCOD
        />
        <Snackbar
          openSnackerBar={openSnackbar}
          handleCloseSnackBar={handleCloseSnackbar}
          messageName={message}
        />
        <Drawer
          variant={test ? "temporary" : "permanent"}
          hideBackdrop={false}
          PaperProps={{
            sx: {
              height: test ? "300px" : "50px",
              marginLeft: "260px",
            },
          }}
          anchor="bottom"
          open={test}
          onClose={() => {
            setTest(!test);
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mr: "10px",
              height: test ? "15%" : "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: "15px",
                gap: "10px",
              }}
            >
              <Typography
                sx={{ fontSize: "18px", fontWeight: 400, color: "#BCBCBC" }}
              >
                View live game & awaiting admin approval questions
              </Typography>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Box sx={{ ...styles.live, backgroundColor: "#A3FF78" }}>
                  Live game - {livecount.live}
                </Box>
                <Box sx={{ ...styles.live, backgroundColor: "#FFA3A3" }}>
                  Approval - {livecount.approval}
                </Box>
              </Box>
            </Box>
            <Box>
              <Button
                variant="contained"
                endIcon={
                  test ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                }
                sx={{
                  width: "108px",
                  height: "35px",
                  backgroundColor: "#FFFFFF !important",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#000000",
                  border: "1px solid #EBEBEB",
                  textTransform: "capitalize",
                  boxShadow: "none",
                }}
                onClick={() => {
                  setTest(!test);
                  setValueFooter(0);
                  fetchLiveQuestion();
                  fetchLiveCount();
                }}
              >
                {test ? "collapse" : "expand"}
              </Button>
            </Box>
          </Box>
          {test && (
            <Box sx={{ width: "100%", mt: "15px" }}>
              <Tabs
                value={valueFooter}
                onChange={handleChangeTabFooter}
                variant="scrollable"
                scrollButtons={false}
                aria-label="scrollable auto tabs example"
                sx={styles.tab}
              >
                <Tab label="Live" />
                <Tab label="Approval" />
              </Tabs>
              {live?.length !== 0 ? (
                <Box
                  sx={{
                    width: "100%",
                    borderTop: "1px solid #E4E4E4",
                    display: "flex",
                    overflowX: "scroll",
                    flexDirection: "row",
                    whiteSpace: "nowrap",
                    "::-webkit-scrollbar": { display: "none" },
                    // "&::-webkit-scrollbar": {
                    //   width: "8px",
                    // },
                  }}
                  onWheel={handleWheel}
                >
                  {live?.map((ques, index) => (
                    <Box
                      key={ques.id}
                      sx={{
                        width: "202px",
                        height: "120px",
                        borderRadius: "16px",
                        whiteSpace: "normal",
                        backgroundColor:
                          valueFooter == 0 ? "#E3F5FF" : "#E5ECF6",
                        p: 2,
                        mt: 2,
                        mb: 2,
                        ml: 1,
                        mr: 1,
                        flex: "0 0 auto",
                      }}
                    >
                      <Box sx={{ height: "30px", width: "100%" }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "13px",
                            color: "#1C1C1C",
                          }}
                        >
                          {ques.question}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "fit-content",
                          borderRadius: "12px",
                          backgroundColor:
                            ques.type === "coin" ? "#D1B005" : "#0041A4",
                          mt: 2,
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          p: "5px 8px",
                          gap: "5px",
                        }}
                      >
                        <IconButton sx={{ p: 0 }}>
                          <Box
                            component="img"
                            src="/img/attach.png"
                            alt="attach"
                            sx={{ width: "9px", height: "9px" }}
                          />
                        </IconButton>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "8px",
                            color: "#FFFFFF",
                          }}
                        >
                          {ques.type === "coin"
                            ? `Coins-${ques.coins}`
                            : ques.offer_title}
                        </Typography>
                      </Box>
                      <Divider sx={{ border: "1px solid #CACACA" }} />
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        {live.correct_answer == null &&
                        valueFooter == 1 &&
                        ques.status == "created" ? (
                          <Button
                            variant="contained"
                            sx={{
                              width: "59px",
                              height: "25px",
                              backgroundColor: "#0042FF !important",
                              fontSize: "10px",
                              fontWeight: 500,
                              color: "#FFFFFF",
                              textTransform: "capitalize",
                              boxShadow: "none",
                            }}
                            onClick={() => handleAction(ques, "approve")}
                          >
                            Approve
                          </Button>
                        ) : valueFooter == 1 ? (
                          <Box
                            sx={{
                              display: "flex",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "11px",
                                fontWeight: 500,
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                              onClick={() => handleAction(ques, "approved")}
                            >
                              Approved
                            </Typography>
                            <Box
                              component="img"
                              src="/img/approved.png"
                              alt="approved"
                              sx={{ height: "10px", width: "10px" }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: "60px",
                              height: "25px",
                              backgroundColor: "rgba(247,178,0,0.3)",
                              borderRadius: "22px",
                            }}
                          >
                            <Countdown
                              date={Date.now() + ques.livecount}
                              renderer={renderer}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography>
                    {valueFooter == 0
                      ? "No Live questions"
                      : "No Approval questions"}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Drawer>
      </Box>
    </>
  );
}

export default winCOD;
