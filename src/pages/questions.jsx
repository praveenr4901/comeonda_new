import React, { useEffect, useState } from "react";
import DialogComponent from "../components/dialogComponent";
import Table from "../components/table";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchBarComponent from "../components/searchBar";
import DrawerComponent from "../components/drawer";
import {
  Box,
  Button,
  Paper,
  TablePagination,
  Toolbar,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { deleteMethod, getMethodWithParams, patchMethod, postMethodForFile,patchForFile } from "./api/api";
import Snackbar from "../components/snackbarComponent";
import { questionDeleteMessage } from "../utilities/constants";
import { useRouter } from "next/router";
import CheckboxGroup from "../components/checkboxGroup";
function Questions() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [matchCompleted, setMatchCompleted] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [idWinner, setIdWinner] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, setData] = useState([]);
  const [dialogData, setDialogData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [queryWinner, setQueryWinner] = useState("");
  const [view, setView] = useState(false);
  const [winners, setWinners] = useState(false);
  const [del, setDel] = useState(false);
  const [delPoster, setDelPoster] = useState(false);
  const [delId, setDelId] = useState("");
  const [delPosterId, setPosterDelId] = useState("");
  const [posterMessage, setPosterMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [options, setOptions] = useState([]);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    date_from: "",
    date_to: "",
  });
  const [buttonArray, setButtonArray] = useState([]);
  const [suspend, setSuspend] = useState(false);
  const [suspendId, setSuspendId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState({
    reason: "",
  });
  const [matchChecked, setMatchChecked] = useState(true);
  const [generalChecked, setGeneralChecked] = useState(false);
  const styles = {
    ok: {
      width: edit ? "162px" : del || suspend ? "150px" : "79px",
      backgroundColor: "#0042FF !important",
      color: "#FFFFFF",
      border: "1px solid #0042FF",
      fontWeight: 600,
      fontSize: "16px",
      textTransform: "capitalize",
      boxShadow: "none",
    },
    cancel: {
      width: "79px",
      backgroundColor: "transprant !important",
      color: "#1B54FE",
      border: "1px solid #1B54FE",
      fontWeight: 600,
      fontSize: "16px",
      textTransform: "capitalize",
      boxShadow: "none",
    },
  };

  const header = [
    {
      name: "Sl.No",
      width: "5%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Question",
      width: "24%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Answer",
      width: "4%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Created By",
      width: "17%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Match & Tournament",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },

    {
      name: "Status",
      width: "10%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Winners",
      width: "10%",
      align: "left",
      size: "12px",
      weight: 500,
      color: "#676B72",
    },
    {
      name: "Attach",
      width: "10%",
      align: "left",
      size: "12px",
      weight: 500,
      color: "#676B72",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    Question: "question",
    Answer: "correct_answer", // You might need to convert the boolean to a human-readable format
    "Created By": "user_name",
    "Match & Tournament": "match_name",
    Status: "status",
    Delete: "delete_status",
    Attach: "image_url",
  };
  const filterHeaders = [
    {
      status: {
        name3: "Match Date",
        heading1: "Status",
        name: "Created",
        name2: "Completed",
      },
    },
  ];
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  const handleClose = () => {
    setOpen(false);
    setSuspend(false);
    setShowReason(false);
    setSuspendMessage("");
    setError({
      reason: "",
    });
    setReason("");
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  const [questionAttchment, setQuestionAttchment] = useState(false);
  const [questionAttchmentPreview, setQuestionAttchmentPreview] =
    useState(false);
  const [image, setImage] = useState("");
  const [file, setFile] = useState({
    image: null,
    image_url: "",
    image_name: "",
  });
  const handleClickDialog = (string, row) => {
    setView(false);
    setMatchCompleted(false);
    setWinners(false);
    setButtonArray([]);
    setDelId("");
    setAnswer("");
    setDel(false);
    setEdit(false);
    setDialogData([]);
    setOptions([]);
    setIdWinner("");
    setQuestionAttchment(false);
    setQuestionAttchmentPreview(false);
    setEmptyMessage("");
    setDelPoster(false);
setPosterDelId("")
setPosterMessage("")
    if (string === "view") {
      setView(true);
      setDialogData(row.options);
      if (row.options.length === 0) {
        setEmptyMessage("No options found for this question");
      }
    } else if (string === "winners") {
      if (row.status == "completed") {
        setMatchCompleted(true);
      }
      setWinners(true);
      setIdWinner(row.id);
      fetchWinnersList(row.id);
    } else if (string === "Suspend") {
      setSuspend(true);
      setSuspendId(row.id);
    } else if (string === "Edit") {
      setButtonArray(
        row.correct_answer == null
          ? [{ name: "Save", style: styles.ok }]
          : [{ name: "Ok", style: styles.ok }]
      );
      setOptions(row);
      setDelId(row.id);
      setEdit(true);
    } else if (string === "showReason") {
      setShowReason(true);
      setSuspendMessage(row?.delete_reason);
    } else if (string === "image") {
      setIdWinner(row.id);
      setQuestionAttchment(true);
      setFile({ image: null, image_url: "", image_name: "" });
    } else if (string === "image_url") {
      setQuestionAttchmentPreview(true);
     
      setImage(row.thumbnail_url || row.image_url);
    }else if(string === "remove_poster"){
      setDelPoster(true);
      setPosterDelId(row.id)
      setPosterMessage("Are you sure you want to remove this poster")
    }
    setOpen(true);
  };
  const [showReason, setShowReason] = useState(false);
  const [suspendMessage, setSuspendMessage] = useState("");
  const fetchData = async () => {
    let type = "";
    if (matchChecked && generalChecked) {
      type = "all";
    } else if (matchChecked) {
      type = "match";
    } else if (generalChecked) {
      type = "general";
    }
    // Handle any side effects here
    try {
      const param = {
        page: backPage,
        size: rowsPerPage,
        type: type,
        status: filter.status,
        date_from_: filter.date_from,
        date_to: filter.date_to,
        search: query,
      };
      const response = await getMethodWithParams(`v2/question_list`, param);
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": startingSlNo + index,
            profile_pic:
              obj.created_user_pic === null ? "" : obj.created_user_pic,
            image_url: obj.poster_url,
          };
        });
        setData(dataArray);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchWinnersList = async (id) => {
    try {
      const param = {
        question_id: id ? id : idWinner,
        search: queryWinner,
      };
      const response = await getMethodWithParams(`v2/question_winners`, param);
      if (response?.data?.status === "success") {
        setDialogData(response?.data?.response);
        if (response?.data?.response.length === 0 && !questionAttchment && !questionAttchmentPreview) {
          queryWinner
            ? setEmptyMessage("No such winners found for this question")
            : setEmptyMessage("No winners found for this question");
        }
      } else {
        setDialogData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteQuestion = async (id) => {
    try {
      const param = {
        id: delId,
      };
      const response = await deleteMethod(`v2/delete_question`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully deleted question" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deletePoster = async (id) => {
    try {
      const param = {
        question_id: delPosterId,
      };
      const response = await deleteMethod(`v2/remove_poster_url`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully deleted question" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateAnswer = async () => {
    try {
      const response = await patchMethod(`v2/update_question`, {
        question_id: delId,
        correct_answer: answer,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully updated answer for the question",
        });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleCreateClick = () => {
    if (answer) {
      updateAnswer();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please select anyone of the options",
      });
    }
  };
  const handleSuspend = async () => {
    suspendQuestion(suspendId);
  };
  const suspendQuestion = async (id) => {
    try {
      if (reason !== "") {
        const response = await deleteMethod(
          `v2/admin_question?question_id=${id}&reason=${reason}`
        );
        if (response?.data?.status === "success") {
          setOpenSnackbar(true);
          setMessage({
            color: "#6FCF97",
            name: "Question deleted and coins updated for users",
          });
          fetchData();
          handleClose();
        } else {
          setOpenSnackbar(true);
          setMessage({ color: "#f44336", name: response.data.response });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteClick = () => {
   
    if(delPoster){
      deletePoster(delPosterId)
    }else{
      deleteQuestion(delId);
    }
   
  };
  const handleUploadPosterClick = () => {
    updatePosterToQuestion(idWinner);
    handleClose();
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/questions");
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [matchChecked, generalChecked]);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query, filter]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage < page) {
      setBackPage(backPage - 1);
    } else if (newPage > page) {
      setBackPage(backPage + 1);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setBackPage(1);
  };

  const handleWinnerQuery = (string) => {
    setQueryWinner(string ? string : "");
  };
  useEffect(() => {
    fetchWinnersList();
  }, [queryWinner]);

  const handleFilter = (params) => {
    setPage(0);
    setBackPage(1);
    setFilter({
      status: params ? params.checkbox1 : "",
      date_from: params ? params.date_from : "",
      date_to: params ? params.date_to : "",
    });
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("usertoken");
  };
  const textfield = [
    {
      file: "Tournament Image",
    },
  ];
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
  const updatePosterToQuestion = async (id) => {
    try {
      console.log(id,"updatePosterToQuestion")
      const response = await patchForFile(`v2/poster_question`, {
        question_id:id,
        file_obj: file.image,
        thumb_nail: file.image,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully added attachment",
        });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Box
      component={Paper}
      sx={{
        margin: "25px",
        height: "100%",
        width: "100%",
        marginLeft: "280px",
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
        <CheckboxGroup
          matchChecked={matchChecked}
          setMatchChecked={setMatchChecked}
          generalChecked={generalChecked}
          setGeneralChecked={setGeneralChecked}
        />
        <SearchBarComponent
          handleQueryValue={handleQueryValue}
          placeholder={"Search by question"}
        />

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleDrawerOpen}
          sx={{
            color: "#344054",
            border: "1px solid #D0D5DD!important",
            padding: "10px 16px",
            borderRadius: "10px!important",
            textTransform: "none",
            height: "42px",
          }}
        >
          Filter
        </Button>
      </Toolbar>
      <Table
        headers={header}
        headerMappings={headerMappings}
        data={data}
        questions
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
      <DrawerComponent
        open={openDrawer}
        close={handleDrawerClose}
        questions
        handleFilter={handleFilter}
        filterHeaders={filterHeaders}
      />
      <DialogComponent
        open={open}
        handleClose={handleClose}
        header={
          view
            ? "Options"
            : del
            ? "Delete Confirmation"
            : edit
            ? "Update Answer"
            : suspend
            ? "Suspend"
            : showReason
            ? "Suspend Reason"
            : questionAttchment || questionAttchmentPreview
            ? "Match Offer Poster"
             : delPoster
            ? "Match Offer Poster Delete Confirmation"
            : "Winners List"
        }
        button={
          edit
            ? buttonArray
            : del
            ? [{ name: "Yes,Confirm", style: styles.ok }]
            : suspend
            ? [
                { name: "Cancel", style: styles.cancel },
                { name: "Submit", style: styles.ok },
              ]
            : questionAttchment
            ? [
                { name: "Cancel", style: styles.cancel },
                { name: "Add", style: styles.ok },
              ]
            : questionAttchmentPreview
            ? [{ name: "Close", style: styles.ok }]
            : delPoster
            ? [
              { name: "Yes, Confirm", style: styles.ok }
            ]
            : [{ name: "Ok", style: styles.ok }]
        }
        suspendBtn={[
          { name: "Yes, Confirm", style: styles.ok },
          { name: "Cancel", style: styles.cancel },
        ]}
        dialogData={dialogData}
        emptyMessage={emptyMessage}
        answer={answer}
        setAnswer={setAnswer}
        handleWinnerQuery={handleWinnerQuery}
        handleCreateClick={handleCreateClick}
        handleSuspend={handleSuspend}
        handleDeleteClick={handleDeleteClick}
        options={edit ? options : ""}
        view={view}
        winners={winners}
        matchCompleted={matchCompleted}
        del={del}
        edit={edit}
        suspend={suspend}
        deleteMessage={delPoster?posterMessage:questionDeleteMessage}
        reason={reason}
        setReason={setReason}
        error={error}
        setError={setError}
        suspendMessage={suspendMessage}
        showReason={showReason}
        questionAttchment={questionAttchment}
        file={file}
        setFile={setFile}
        addData={textfield}
        imageUrl={image}
        image={questionAttchmentPreview}
        handleUploadPosterClick={handleUploadPosterClick}
        setOpenSnackbar={setOpenSnackbar}
        setMessage={setMessage}
        delPoster={delPoster}
     
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default Questions;
