import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TablePagination,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBarComponent from "../components/searchBar";
import Table from "../components/table";
import {
  deleteMethod,
  getMethodWithParams,
  patchMethod,
  postMethod,
} from "./api/api";
import DialogComponent from "../components/dialogComponent";
import Snackbar from "../components/snackbarComponent";
import { questionDeleteMessage } from "../utilities/constants";
import dayjs from "dayjs";
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
};

function PredefinedQuestion() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [textField, setTextField] = useState("");
  const [optionColumn, setOptionColumn] = useState([
    { key: 1, value: "" },
    { key: 2, value: "" },
    { key: 3, value: "" },
    { key: 4, value: "" },
  ]);
  const [open, setOpen] = useState(false);
  const [liveMatch, setLiveMatch] = useState([]);
  const [question, setQuestion] = useState([]);
  const [matchId, setMatchId] = useState("");
  const [matchDetails, setMatchDetails] = useState({});
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [questionId, setQuestionId] = useState("");
  const [query, setQuery] = useState("");
  const [delId, setDelId] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [action, setAction] = useState({
    del: false,
    add: false,
    editAdd: false,
  });

  const button = {
    ok: {
      width: action.add || action.editAdd ? "87px" : "150px",
      backgroundColor: "#0042FF !important",
      color: "#FFFFFF",
      border: "1px solid #0042FF",
      fontWeight: 600,
      fontSize: "16px",
      textTransform: "capitalize",
      boxShadow: "none",
    },
  };

  const header = [
    {
      name: "Sl.No",
      width: "20%",
      align: "left",
      size: "13px",
      weight: 500,
      color: "#000000",
    },
    {
      name: "Question",
      width: "50%",
      align: "left",
      size: "13px",
      weight: 500,
      color: "#000000",
    },
    {
      name: "Action",
      width: "30%",
      align: "center",
      size: "10px",
      weight: 500,
      color: "#000000",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    Question: "question",
  };
  const fetchData = async () => {
    try {
      const param = {
        page: 1,
        size: 20,
      };
      const response = await getMethodWithParams(
        `v2/new_matches_win_cod`,
        param
      );
      if (response?.data.status === "success") {
        setMatchId(response?.data?.response?.result[0].id);
        setMatchDetails(response?.data?.response?.result[0]);
        setLiveMatch(response?.data?.response?.result);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchQuestion = async () => {
    try {
      const param = {
        match_id: matchId,
        page: backPage,
        size: rowsPerPage,
        search: query,
      };
      const response = await getMethodWithParams(
        `v2/list_win_cod_questions`,
        param
      );
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": startingSlNo + index,
            action: [
              { 1: "Edit", 2: "#0042FF !important" },
              { 1: "Remove", 2: "#404040 !important" },
            ],
          };
        });
        setQuestion(dataArray);
      } else {
        setTotal(0);
        setQuestion([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/predefinedQuestion");
    fetchData();
  }, []);
  useEffect(() => {
    fetchQuestion();
  }, [page, rowsPerPage, query, matchId]);
  const handleCardClick = (row) => {
    setMatchId(row.id);
    setMatchDetails(row);
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  const handleDeleteClick = () => {
    deleteQuestion();
  };
  const updateQuestion = async () => {
    try {
      const response = await patchMethod(`v2/update_cod_question`, {
        question_id: questionId,
        question: textField,
        option: optionColumn,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully updated question",
        });
        fetchQuestion();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleCreateClick = () => {
    const isOptionColumnNotEmpty = optionColumn.every(
      (option) => option.value.trim() !== ""
    );
    if (textField && isOptionColumnNotEmpty) {
      createQuestion();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please fill all the fields or delete the unnecessary empty option fields",
      });
    }
  };
  const handleUpdateClick = () => {
    const isOptionColumnNotEmpty = optionColumn.every(
      (option) => option.value.trim() !== ""
    );
    if (textField && isOptionColumnNotEmpty) {
      updateQuestion();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please fill all the fields or delete the unnecessary empty option fields",
      });
    }
  };
  const getUserIdFromLocalStorage = () => {
    return localStorage.getItem("userid");
  };
  const createQuestion = async () => {
    const date = dayjs(matchDetails.match_date).format("YYYY-MM-DD");
    const time = dayjs(matchDetails.match_date).format("hh:mm:ss");
    const userid = getUserIdFromLocalStorage();
    try {
      const response = await postMethod(`v2/save_predefined_question`, {
        tournament_id: matchDetails.tournament_id,
        match_id: matchDetails.id,
        match_name: matchDetails.match_name,
        user_id: userid,
        question: textField,
        option: optionColumn,
        match_date: date,
        match_time: time,
        team1_flag: matchDetails.team1_flag,
        team2_flag: matchDetails.team2_flag,
        sports_id: matchDetails.sports_id,
        sports_name: matchDetails.sports_name,
        remarks: "",
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully added question" });
        fetchQuestion();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteQuestion = async () => {
    try {
      const param = {
        question_id: delId,
      };
      const response = await deleteMethod(`v2/delete_cod_question`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully deleted question",
        });
        fetchQuestion();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage < page) {
      setBackPage(backPage - 1);
    } else if (newPage > page) {
      setBackPage(backPage + 1);
    }
  };
  const handleClickDialog = (string, row) => {
    setTextField("");
    setQuestionId("");
    setOptionColumn([
      { key: 1, value: "" },
      { key: 2, value: "" },
      { key: 3, value: "" },
      { key: 4, value: "" },
    ]);
    let options = [
      { key: 1, value: "" },
      { key: 2, value: "" },
      { key: 3, value: "" },
      { key: 4, value: "" },
    ];
    setAction((prevAction) => ({
      ...prevAction,
      del: false,
      add: false,
      editAdd: false,
    }));
    if (string === "Remove") {
      setAction((prevAction) => ({
        ...prevAction,
        del: true,
      }));
      setDelId(row.id);
    } else if (string === "add") {
      setAction((prevAction) => ({
        ...prevAction,
        add: true,
      }));
    } else if (string === "Edit") {
      setAction((prevAction) => ({
        ...prevAction,
        editAdd: true,
      }));
      setQuestionId(row.id);
      setTextField(row.question);
      setOptionColumn(
        options.map((option) => {
          const newValue = row?.options?.find(
            (item) => item.key === option.key
          );
          if (newValue) {
            return { ...option, value: newValue.value };
          }
          return option;
        })
      );
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOption = (column, index) => {
    setOptionColumn((prevColumns) => prevColumns.filter((_, i) => i !== index));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setBackPage(1);
  };
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
    <Grid container sx={{ marginLeft: "260px", mt: 1, mb: 2 }} spacing={2}>
      <Grid item md={3}>
        <Box
          component={Paper}
          sx={{
            height: "100%",
            borderRadius: "8px",
          }}
        >
          {liveMatch?.map((match, index) => (
            <Box
              key={index}
              onClick={() => handleCardClick(match)}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                p: "5px",
                backgroundColor: matchId === match.id ? "#0042FF" : "",
                borderBottom: "1px solid #EAECF0",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#0042FF",
                  color: "#FFFFFF !important",
                },
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
                <Typography sx={styles.liveTeam}>{match.team1_name}</Typography>
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
                <Typography sx={styles.liveDate}>{match?.date}</Typography>
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
                <Typography sx={styles.liveTeam}>{match.team2_name}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid item md={9} sx={{ pr: 2 }}>
        <Box
          component={Paper}
          sx={{
            height: "100%",
            minWidth: "200px",
          }}
        >
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              display: "flex",
              justifyContent: "flex-end",
              gap: "20px",
            }}
          >
            <SearchBarComponent
              handleQueryValue={handleQueryValue}
              placeholder="Search"
            />

            <Button
              variant="outlined"
              onClick={() => handleClickDialog("add")}
              sx={{
                color: "#FFFFFF",
                backgroundColor: "#0042FF !important",
                border: "1px solid #0042FF!important",
                padding: "10px 16px",
                width: "180px",
                borderRadius: "10px!important",
                textTransform: "none",
                height: "42px",
              }}
            >
              Add New Question
            </Button>
          </Toolbar>
          {/* {total > 0 && searchEnable && ( */}
          <>
            <Table
              headers={header}
              headerMappings={headerMappings}
              data={question}
              predefinedQuestion
              handleClickDialog={handleClickDialog}
            />

            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
          {/* )} */}
          <DialogComponent
            open={open}
            handleClose={handleClose}
            header={
              action.add
                ? "Add Question"
                : action.editAdd
                ? "Edit Question"
                : "Delete Confirmation"
            }
            button={
              action.add
                ? [{ name: "Save", style: button.ok }]
                : action.editAdd
                ? [{ name: "Update", style: button.ok }]
                : [{ name: "Yes, Confirm", style: button.ok }]
            }
            handleDeleteClick={handleDeleteClick}
            handleCreateClick={handleCreateClick}
            handleUpdateClick={handleUpdateClick}
            deleteMessage={questionDeleteMessage}
            del={action.del}
            textField={textField}
            setTextField={setTextField}
            optionColumn={optionColumn}
            setOptionColumn={setOptionColumn}
            handleOption={handleOption}
            add={action.add}
            editAdd={action.editAdd}
            predefinedQuestion
          />
          <Snackbar
            openSnackerBar={openSnackbar}
            handleCloseSnackBar={handleCloseSnackbar}
            messageName={message}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default PredefinedQuestion;
