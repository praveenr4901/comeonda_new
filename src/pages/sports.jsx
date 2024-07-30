import { Box, Button, Paper, TablePagination, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBarComponent from "../components/searchBar";
import Table from "../components/table";
import { deleteMethod, getMethodWithParams, postMethod } from "./api/api";
import DialogComponent from "../components/dialogComponent";
import { sportDeleteMessage } from "../utilities/constants";
import Snackbar from "../components/snackbarComponent";
import { useRouter } from "next/router";

function Sports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState({
    del: false,
    add: false,
    editAdd: false,
  });
  const [editValue, setEditValue] = useState({ id: "", name: "" });
  const [delId, setDelId] = useState("");
  const [textField, setTextField] = useState({ value: "" });

  const styles = {
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
  const textfield = [
    { textfield: [{ name: "Sports Name", placeholder: "Enter Name" }] },
  ];
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
      name: "Sports Name",
      width: "45%",
      align: "center",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Action",
      width: "45%",
      align: "center",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    "Sports Name": "sports_name",
  };
  const handleClose = () => {
    setOpen(false);
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
        search: query,
      };
      const response = await getMethodWithParams(
        `v2/get_sports_list_admin`,
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
        setData(dataArray);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickDialog = (string, row) => {
    setEditValue("");
    setTextField({ value: "" });
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
      setEditValue({ id: row.id, name: row.sports_name });
      setTextField({ value: row.sports_name });
    }
    setOpen(true);
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/sports");
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query]);
  const deleteSport = async () => {
    try {
      const param = {
        sports_id: delId,
      };
      const response = await deleteMethod(`v2/delete_sports`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully deleted sport" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const addSport = async () => {
    try {
      const param = {
        sports: textField.value,
      };
      const response = await postMethod(
        `v2/save_sports?sports=${textField.value}`,
        param
      );
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully added sport" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateSport = async () => {
    try {
      const response = await postMethod(`v2/update_sports`, {
        id: editValue.id,
        sports: textField.value,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully updated sport" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteClick = () => {
    deleteSport(delId);
  };
  const handleCreateClick = () => {
    if (textField.value) {
      addSport();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({ color: "#f44336", name: "Sports name is mandatory" });
    }
  };
  const handleUpdateClick = () => {
    if (textField.value) {
      updateSport();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({ color: "#f44336", name: "Sports name is mandatory" });
    }
  };
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
          placeholder={"Search by sports"}
        />

        <Button
          variant="outlined"
          onClick={() => handleClickDialog("add")}
          sx={{
            color: "#FFFFFF",
            backgroundColor: "#0042FF !important",
            border: "1px solid #0042FF!important",
            padding: "10px 16px",
            width: "147px",
            borderRadius: "10px!important",
            textTransform: "none",
            height: "42px",
          }}
        >
          Add New
        </Button>
      </Toolbar>
      <Table
        headers={header}
        headerMappings={headerMappings}
        data={data}
        tournament
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
      <DialogComponent
        open={open}
        handleClose={handleClose}
        header={
          action.add
            ? "Add Sports"
            : action.editAdd
            ? "Edit Sports"
            : "Delete Confirmation"
        }
        button={
          action.add
            ? [{ name: "Create", style: styles.ok }]
            : action.editAdd
            ? [{ name: "Update", style: styles.ok }]
            : [{ name: "Yes, Confirm", style: styles.ok }]
        }
        // dialogData={dialogData}
        // emptyMessage={emptyMessage}
        handleDeleteClick={handleDeleteClick}
        handleCreateClick={handleCreateClick}
        handleUpdateClick={handleUpdateClick}
        deleteMessage={sportDeleteMessage}
        del={action.del}
        textField={textField}
        setTextField={setTextField}
        add={action.add}
        editAdd={action.editAdd}
        addData={textfield}
        sports
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default Sports;
