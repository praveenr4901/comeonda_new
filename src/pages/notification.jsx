import {
  Box,
  Button,
  Paper,
  TablePagination,
  TextField,
  Toolbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBarComponent from "../components/searchBar";
import Table from "../components/table";
import FilterListIcon from "@mui/icons-material/FilterList";
import DrawerComponent from "../components/drawer";
import { getMethodWithParams, postMethodForFile } from "./api/api";
import DialogComponent from "../components/dialogComponent";
import Snackbar from "../components/snackbarComponent";
import { useRouter } from "next/router";
import { Schedule } from "@mui/icons-material";
import dayjs from "dayjs";

function Notification() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [image, setImage] = useState("");
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [action, setAction] = useState({
    image: false,
    add: false,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [filter, setFilter] = useState({
    date_from: "",
    date_to: "",
  });
  const [autocomplete, setAutocomplete] = useState([]);
  const [file, setFile] = useState({
    image: null,
    image_url: "",
  });
  const [textField, setTextField] = useState({ value: "", value2: "" });
  const [isChecked, setIsChecked] = useState(false);
  const [disableAutocomplete, setDisableAutocomplete] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showDateTimePickerCheckbox, setShowDateTimePickerCheckbox] =
    useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [selectedRedirectUrl, setSelectedRedirectUrl] = useState("");
  const [selectedRedirectUrlKey, setSelectedRedirectUrlKey] = useState("");
  const styles = {
    ok: {
      width: action.add
        ? "87px"
        : action.image || action.video
        ? "79px"
        : "150px",
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
      width: "10%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Notification",
      width: "35%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Redirected to",
      width: "15%",
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
      name: "Schedule date",
      width: "15%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },

    {
      name: "Views",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Image",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    Notification: "title",
    "Schedule date": "notification_date",
    Image: "image_url",
  };
  const filterHeaders = [{ status: { name3: "Submitted Date" } }];
  const textfield = [
    {
      autocomplete: [
        {
          name: "Users",
          placeholder: "Select user",
        },
      ],
      textfield: [
        { name: "Title", placeholder: "Enter title" },
        { name: "Message", placeholder: "Enter message" },
      ],
      button: [
        {
          name: "General List",
          border: "1.5px solid #002FB5",
          radius: "8px",
          color: "#F5F5F5",
          disabled:false,
          width:"87px",
        backgroundColor: "#0042FF !important",
        fontWeight: 600,
        fontSize: "16px",
        textTransform: "capitalize",
        boxShadow: "none",
        },
        {
          name: "Contest",
          border: "1.5px solid #000000",
          radius: "8px",
          color: "#000000",
          disabled:true,
          width:"87px",
          backgroundColor: "#F5F5F5 !important",
          fontWeight: 600,
          fontSize: "16px",
          textTransform: "capitalize",
          boxShadow: "none",
        },
      ],
      search: [{ placeholder: "Select Page" }],
      checkboxClicked: [
        {
          name: "Schedule Question",
          color: "#475569",
          fontWeight: 600,
          fontSize: "15px",
          lineHeight: "14px",
        },
      ],
      file: "Notification Image",
    },
  ];
  const redirect_list = [
    { key: "general_notification", value: "common notification" },
    { key: "home", value: "home" },
    { key: "my_rewards", value: "my rewards" },
    { key: "wallet", value: "wallet" },
    { key: "daily_rewards", value: "daily rewards" },
    { key: "cod_coins", value: "cod coins" },
    { key: "leader_board", value: "leader board" },
    { key: "all_contest", value: "all contest" },
    { key: "game_zone", value: "game zone" },
    { key: "advertisement", value: "advertisement" },
    { key: "upcoming_events", value: "upcoming events" },
    { key: "invite_friends", value: "invite friends" },
    { key: "general_question", value: "general question" },
    { key: "direct_challenge", value: "direct challenge" },
    { key: "gallery", value: "gallery" },
    { key: "win_cod", value: "win cod" },
  ];
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedRedirectUrl("");
    setSelectedRedirectUrlKey("");
    setSelectedDateTime(dayjs());
    setShowDateTimePickerCheckbox(false)
  };
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

  const fetchData = async () => {
    try {
      const param = {
        page: backPage,
        size: rowsPerPage,
        date_from_: filter.date_from,
        date_to: filter.date_to,
        search: query,
      };
      const response = await getMethodWithParams(
        `v2/notification_list_admin`,
        param
      );
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": startingSlNo + index,
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
  const fetchUser = async () => {
    try {
      const param = {
        page: 1,
        size: 200,
        status: "",
      };
      const response = await getMethodWithParams(`v2/users_admin_panel`, param);
      if (response?.data.status === "success") {
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            label: obj.username,
          };
        });
        setUser(dataArray);
      } else {
        setUser([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const submitNotification = async () => {
    const users = autocomplete[0]?.map((item) => item.id);
    const output = `["${users?.join(", ")}"]`;
    try {
      const response = await postMethodForFile(`v2/admin_notification`, {
        title: textField.value,
        message: textField.value2,
        status: isChecked ? "all" : "users",
        file_obj: file.image,
        users: output,
        scheduled_date: showDateTimePickerCheckbox
          ? new Date(selectedDateTime)
          : null,
        redirecting_page: selectedRedirectUrlKey,
        redirecting_type: "general",
        schedule_status: showDateTimePickerCheckbox,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Notification successfully submitted",
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
  const handleClickDialog = (string, row) => {
    console.log("handleClickDialog",string)
    setDisableAutocomplete(false);
    setIsChecked(false);
    setTextField({ value: "", value2: "" });
    setAutocomplete([]);
    setFile({ image: null, image_url: "" });
    setAction((prevAction) => ({
      ...prevAction,
      add: false,
      image: false,
    }));

    if (string === "poster") {
      setAction((prevAction) => ({
        ...prevAction,
        image: true,
      }));
      setImage(row.image_url);
    } else if (string === "add") {
      setAction((prevAction) => ({
        ...prevAction,
        add: true,
      }));
    }
    setOpen(true);
  };
  const handleCreateClick = () => {
    if (
      (isChecked ? autocomplete?.length == 0 : autocomplete?.length != 0) &&
      textField.value &&
      textField.value2 &&
      selectedRedirectUrl
    ) {
      submitNotification();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({ color: "#f44336", name: "Please fill all the fields" });
    }
  };
  const handletimeCheckboxClick = () => {
    console.log("setShowDateTimePickerCheckbox before",showDateTimePickerCheckbox)
    setShowDateTimePickerCheckbox(!showDateTimePickerCheckbox);
    setShowDateTimePicker(!showDateTimePickerCheckbox? true:false)
    
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  const handleFilter = (params) => {
    setPage(0);
    setBackPage(1);
    setFilter({
      date_from: params ? params.date_from : "",
      date_to: params ? params.date_to : "",
    });
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/notification");
    fetchData();
    fetchUser();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query, filter]);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      {console.log(
        "user",
        autocomplete,
        textField,
        file.image,
        "checkhed",
        isChecked
      )}
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
          placeholder={"Search"}
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
        <Button
          variant="outlined"
          onClick={() => handleClickDialog("add")}
          sx={{
            color: "#FFFFFF",
            backgroundColor: "#0042FF !important",
            border: "1px solid #0042FF!important",
            padding: "10px 16px",
            width: "163px",
            borderRadius: "10px!important",
            textTransform: "none",
            height: "42px",
          }}
        >
          Add Notification
        </Button>
      </Toolbar>
      <Table
        headers={header}
        headerMappings={headerMappings}
        data={data}
        handleClickDialog={handleClickDialog}
        notification
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
        notification
        handleFilter={handleFilter}
        filterHeaders={filterHeaders}
      />
      <DialogComponent
        open={open}
        handleClose={handleClose}
        header={action.add ? "Create Notification" : "Notification Image"}
        button={
          action.add
            ? [
                { name: "Cancel", style: styles.cancel },
                { name: "Create", style: styles.ok },
              ]
            : [{ name: "Close", style: styles.ok }]
        }
        handleCreateClick={handleCreateClick}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        autocomplete={autocomplete}
        setAutocomplete={setAutocomplete}
        disableAutocomplete={disableAutocomplete}
        setDisableAutocomplete={setDisableAutocomplete}
        file={file}
        setFile={setFile}
        textField={textField}
        setTextField={setTextField}
        autocompleteList={user}
        add={action.add}
        image={action.image}
        imageUrl={image}
        addData={textfield}
        setOpenSnackbar={setOpenSnackbar}
        setMessage={setMessage}
        showDateTimePicker={showDateTimePicker}
        setShowDateTimePicker={setShowDateTimePicker}
        setSelectedDateTime={setSelectedDateTime}
        selectedDateTime={selectedDateTime}
        showDateTimePickerCheckbox={showDateTimePickerCheckbox}
        setShowDateTimePickerCheckbox={setShowDateTimePickerCheckbox}
        handletimeCheckboxClick={handletimeCheckboxClick}
        redirect_list={redirect_list}
        setSelectedRedirectUrl={setSelectedRedirectUrl}
        selectedRedirectUrl={selectedRedirectUrl}
        setSelectedRedirectUrlKey={setSelectedRedirectUrlKey}
        selectedRedirectUrlKey={selectedRedirectUrlKey}
        notification
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default Notification;
