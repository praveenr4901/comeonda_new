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
  TextField,
} from "@mui/material";
import {
  deleteMethod,
  getMethodWithParams,
  patchMethod,
  postMethodForFile,
  patchForFile,
  putMethod,
  deletWithBodyMethod,
} from "./api/api";
import Snackbar from "../components/snackbarComponent";
import { questionDeleteMessage } from "../utilities/constants";
import { useRouter } from "next/router";
import CheckboxGroup from "../components/checkboxGroup";
import dayjs from "dayjs";
function UpcomingEvents() {
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
  const [delId, setDelId] = useState("");
  const [edit, setEdit] = useState(false);
  const [options, setOptions] = useState([]);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    date_from: "",
    date_to: "",
  });
  const [action, setAction] = useState({
    del: false,
    add: false,
    image: false,
    editAdd: false,
  });
  const [buttonArray, setButtonArray] = useState([]);
  const [unpublish, setUnpublish] = useState(false);
  const [unpublishId, setUnpublishId] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState({
    reason: "",
  });
  const listItems = [
    { name: "Unpublish", color: "#DBB9B9", border: "1px solid #DBB9B9" },
    { name: "Expired", color: "#EFEFEF", border: "1px solid #C2C1C1" },
    { name: "Live", color: "#FFFFFF", border: "1px solid #C2C1C1" },
  ];
  const handleCheckboxChange = (index, checked) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].checked = checked;
    setCheckboxes(newCheckboxes);
  };
  const styles = {
    ok: {
      width: edit ? "162px" : del || unpublish ? "150px" : "79px",
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
      name: "Event Name",
      width: "50%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Poster",
      width: "13%",
      align: "left",
      size: "12px",
      weight: 500,
      color: "#676B72",
    },
    {
      name: "Created Date",
      width: "13%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Event Date/time",
      width: "12%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    "Event Name": "event",
    Poster: "event_url",
    "Created Date": "created_date", // You might need to convert the boolean to a human-readable format
    "Event Date/time": "start_date",
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
    setUnpublish(false);
    setShowReason(false);
    setSuspendMessage("");
    setError({
      reason: "",
    });
    setReason("");
    setSelectedDateTime(dayjs());
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
    setImage("");
    setEventMessge("");
    setUnpublishId();
    setUnpublish(false);
    setUnpublishId("");
    setAction((prevAction) => ({
      ...prevAction,
      editAdd: false,
      add: false,
    }));
    setEditValue({ id: "" });
    setTextField({ value: "" });
    setDetails("");

    setFile({
      image: null,
      image_url: "",
      image_name: "",
    });
    if (string === "add") {
      setAction((prevAction) => ({
        ...prevAction,
        add: true,
      }));
    } else if (string === "view") {
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
    } else if (string === "Unpublish") {
      setEventMessge("Are you sure you want to unpublish this event?");
      setUnpublish(true);
      setUnpublishId(row.id);
      setAction((prevAction) => ({
        ...prevAction,
        editAdd: false,
        add: false,
      }));
    } else if (string === "Edit") {
      setUnpublish(false);
      setUnpublishId(row.id);
      setAction((prevAction) => ({
        ...prevAction,
        editAdd: true,
        add: false,
      }));
      setEditValue({ id: row.id });
      setTextField({ value: row.event });
      setDetails(row.description_details);
      setSelectedDateTime(row.start_date);
      const url = new URL(row.event_url);
      const pathname = url.pathname;
      const decodedPathname = decodeURIComponent(pathname);
      const filename = decodedPathname.split("/").pop();
      setFile({
        image: null,
        image_url: row.event_url,
        image_name: filename,
      });
    } else if (string === "showReason") {
      setShowReason(true);
      setSuspendMessage(row?.delete_reason);
    } else if (string === "image") {
      setIdWinner(row.id);
      setFile({ image: null, image_url: "", image_name: "" });
    } else if (string === "poster") {
      setQuestionAttchmentPreview(true);
      setAction((prevAction) => ({
        ...prevAction,
        add: false,
      }));
      setImage(row.thumbnail_url || row.event_url);
    } else if (string === "Delete") {
      setDel(true);
      setDelId(row.id);
      setEventMessge("Are you sure you want to remove this event?");
    }

    setOpen(true);
  };

  const [showReason, setShowReason] = useState(false);
  const [suspendMessage, setSuspendMessage] = useState("");
  const [textField, setTextField] = useState({ value: "" });
  const [eventMessage, setEventMessge] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [editValue, setEditValue] = useState({ id: "" });
  const fetchData = async () => {
    let type = "";

    // Handle any side effects here
    try {
      const param = {
        page: backPage,
        size: rowsPerPage,
        search: query,
      };
      const response = await getMethodWithParams(`v2/upcoming_events`, param);

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
        if (
          response?.data?.response.length === 0 &&
          !questionAttchment &&
          !questionAttchmentPreview
        ) {
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
  const deleteEvent = async (id) => {
    try {
      const param = {
        event_id: delId,
        status: true,
      };
      const response = await deleteMethod(`v2/upcoming_events`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully deleted upcoming event",
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
  const updateAnswer = async () => {
    try {
      const date = new Date(selectedDateTime);
      const container = document.createElement("div");
      container.innerHTML = details;

      const pTags = container.querySelectorAll("p");

      pTags.forEach((p) => {
        const span = document.createElement("span");
        if (!p?.querySelector("span")) {
          span.style.color = "white";

          span.textContent = p.textContent.trim();
          p.textContent = "";
          // Append the new <span> to the <p> element
          p.appendChild(span);
        }
      });

      const updatedDetails = container.innerHTML;
      const response = await postMethodForFile(`v2/upcoming_events`, {
        title: textField.value,
        event_details: updatedDetails,
        start_date: date,
        file_obj: file.image,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully added upcoming event",
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
  const unpublishEvent = async (id) => {
    try {
      const param = {
        event_id: id,
        status: false,
      };
      const response = await patchMethod(`v2/unpublish_event`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully unpublished upcoming event",
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
  const updateEvent = async () => {
    try {
      const formattedDate = new Date(selectedDateTime);
      const container = document.createElement("div");
      container.innerHTML = details;

      const pTags = container.querySelectorAll("p");

      pTags.forEach((p) => {
        // Create a new <span> element
        const span = document.createElement("span");
        if (!p?.querySelector("span")) {
          span.style.color = "white";

          // Set the span's text to the text content of the <p> tag
          span.textContent = p.textContent.trim();
          p.textContent = "";
          // Append the new <span> to the <p> element
          p.appendChild(span);
        }
        // Set the span's color to white
      });

      const updatedDetails = container.innerHTML;
      const response = await patchForFile(`v2/upcoming_events`, {
        title: textField.value,
        event_details: updatedDetails,
        start_date: selectedDateTime,
        file_obj: file.image,
        event_id: editValue.id,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully updated upcoming event",
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
    if (
      textField.value &&
      (file.image || file.image_url || file.image_name) &&
      selectedDateTime &&
      details.length > 0 &&
      details.length <= 500
    ) {
      updateAnswer();
      handleClose();
    } else {
      setOpenSnackbar(true);
      if (details.length > 500) {
        setMessage({
          color: "#f44336",
          name: "Maximum allowed characters is 500",
        });
      } else {
        setMessage({
          color: "#f44336",
          name: "Please fill all the fields",
        });
      }
    }
  };
  const handleSuspend = async () => {
    suspendQuestion(unpublishId);
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
    if (del) {
      deleteEvent(delId);
    } else if (unpublish) {
      unpublishEvent(unpublishId);
    }
  };
  const handleUpdateClick = () => {
    console.log(details.length);
    if (
      textField.value &&
      (file.image || file.image_url || file.image_name) &&
      details.length > 0 &&
      details.length <= 500
    ) {
      updateEvent();
      handleClose();
    } else {
      if (details.length > 500) {
        setMessage({
          color: "#f44336",
          name: "Maximum allowed characters is 500",
        });
      } else {
        setMessage({
          color: "#f44336",
          name: "Please fill all the fields",
        });
      }
      setOpenSnackbar(true);
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
      textfield: [{ name: "Event Name", placeholder: "Enter event name" }],
      editor: [{ name: "Event Details", placeholder: "Enter event details*" }],
      dateTimeField: [{ name: "Starts Date", placeholder: "Enter start date" }],
      file: "Event Poster",
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
      const response = await patchForFile(`v2/poster_question`, {
        question_id: id,
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
  };
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
          justifyContent: "space-between", // Aligns the children with space between them
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {listItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "16px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: item.color,
                  height: "20px",
                  width: "20px",
                  border: item.border,
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              />
              <Typography>{item.name}</Typography>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <SearchBarComponent
            handleQueryValue={handleQueryValue}
            placeholder={"Search"}
          />
          <Button
            variant="outlined"
            onClick={() => handleClickDialog("add")}
            sx={{
              backgroundColor: "#0042FF !important",
              border: "1px solid #0042FF!important",
              padding: "10px 16px",
              borderRadius: "10px!important",
              textTransform: "none",
              height: "44px",
              width: "142px",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 500,
              lineHeight: "18px",
            }}
          >
            Add New
          </Button>
        </div>
      </Toolbar>

      <Table
        headers={header}
        headerMappings={headerMappings}
        data={data}
        upcomingEvents
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
            : action.editAdd
            ? "Update Upcoming Event"
            : unpublish
            ? "Unpublish Confirmation"
            : showReason
            ? "Suspend Reason"
            : image
            ? "Event Poster"
            : action?.add
            ? "Add Upcoming Event"
            : "Winners List"
        }
        button={
          action.add
            ? [
                { name: "Cancel", style: styles.cancel },
                { name: "Create", style: styles.ok },
              ]
            : del
            ? [{ name: "Yes, Confirm", style: styles.ok }]
            : unpublish
            ? [{ name: "Yes, Confirm", style: styles.ok }]
            : image
            ? [{ name: "Close", style: styles.ok }]
            : action.editAdd
            ? [{ name: "Update", style: styles.ok }]
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
        handleUpdateClick={handleUpdateClick}
        options={edit ? options : ""}
        view={view}
        winners={winners}
        matchCompleted={matchCompleted}
        del={del}
        editAdd={action.editAdd}
        add={action.add}
        unpublish={unpublish}
        deleteMessage={eventMessage}
        reason={reason}
        setReason={setReason}
        error={error}
        setError={setError}
        suspendMessage={suspendMessage}
        showReason={showReason}
        file={file}
        setFile={setFile}
        addData={textfield}
        imageUrl={image}
        image={questionAttchmentPreview}
        handleUploadPosterClick={handleUploadPosterClick}
        setOpenSnackbar={setOpenSnackbar}
        setMessage={setMessage}
        setTextField={setTextField}
        setDetails={setDetails}
        setSelectedDateTime={setSelectedDateTime}
        textField={textField}
        details={details}
        selectedDateTime={selectedDateTime}
        upcomingEvents
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default UpcomingEvents;
