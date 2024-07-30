import { Box, Button, Paper, TablePagination, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBarComponent from "../components/searchBar";
import Table from "../components/table";
import {
  deleteMethod,
  getMethodWithParams,
  postMethodForFile,
} from "./api/api";
import DialogComponent from "../components/dialogComponent";
import { tournamentDeleteMessage } from "../utilities/constants";
import Snackbar from "../components/snackbarComponent";
import { useRouter } from "next/router";

function Tournament() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [sport, setSport] = useState([]);
  const [image, setImage] = useState("");
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState({
    del: false,
    add: false,
    image: false,
    editAdd: false,
  });
  const [editValue, setEditValue] = useState({ id: "" });
  const [delId, setDelId] = useState("");
  const [autocomplete, setAutocomplete] = useState([]);
  const [file, setFile] = useState({
    image: null,
    image_url: "",
    image_name: "",
  });
  const [textField, setTextField] = useState({ value: "" });

  const styles = {
    ok: {
      width: action.image
        ? "79px"
        : action.add || action.editAdd
        ? "87px"
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
      name: "Sports Name",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Tournament Name",
      width: "25%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Tournament Image",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Action",
      width: "25%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    "Sports Name": "sports_name",
    "Tournament Name": "tournament_name",
    "Tournament Image": "tournament_banner_img",
  };
  const textfield = [
    {
      autocomplete: [
        {
          name: "Sports",
          placeholder: "Select sport",
        },
      ],
      textfield: [
        { name: "Tournament Name", placeholder: "Enter tournament name" },
      ],
      file: "Tournament Image",
    },
  ];
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
        `v2/tournament_list_admin`,
        param
      );
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": startingSlNo + index,
            profile_pic:
              obj.tournament_banner_img === null
                ? ""
                : obj.tournament_banner_img,
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
  const fetchSport = async () => {
    try {
      const param = {
        page: 1,
        size: 50,
      };
      const response = await getMethodWithParams(
        `v2/get_sports_list_admin`,
        param
      );
      if (response?.data.status === "success") {
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            label: obj.sports_name,
          };
        });
        setSport(dataArray);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickDialog = (string, row) => {
    setEditValue({ id: "" });
    setTextField({ value: "" });
    setAutocomplete([]);
    setFile({ image: null, image_url: "", image_name: "" });
    setAction((prevAction) => ({
      ...prevAction,
      del: false,
      add: false,
      image: false,
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
    } else if (string === "image") {
      setAction((prevAction) => ({
        ...prevAction,
        image: true,
      }));
      setImage(row.tournament_banner_img);
    } else if (string === "Edit") {
      setAction((prevAction) => ({
        ...prevAction,
        editAdd: true,
      }));
      setEditValue({ id: row.id });
      setTextField({ value: row.tournament_name });
      setAutocomplete([row.sports_name]);
      const url = new URL(row.tournament_banner_img);
      const pathname = url.pathname;
      const decodedPathname = decodeURIComponent(pathname);
      const filename = decodedPathname.split("/").pop();
      setFile({
        image: null,
        image_url: row.tournament_banner_img,
        image_name: filename,
      });
    }
    setOpen(true);
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/tournament");
    fetchData();
    fetchSport();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query]);
  const deleteTournament = async (id) => {
    try {
      const param = {
        tournament_id: delId,
      };
      const response = await deleteMethod(`v2/delete_tournament`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully deleted tournament",
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
  const createTournament = async () => {
    try {
      const response = await postMethodForFile(`v2/save_tournament`, {
        tournament: textField.value,
        sports: autocomplete[0].sports_name,
        sports_id: autocomplete[0].id,
        file_obj: file.image,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully added tournament" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateTournament = async () => {
    try {
      const response = await postMethodForFile(`v2/update_tournament`, {
        tournament_id: editValue.id,
        tournament_name: textField.value,
        ...(typeof file.image !== "string" && { file_obj: file.image }),
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully updated tournament",
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
  const handleDeleteClick = () => {
    deleteTournament(delId);
  };
  const handleCreateClick = () => {
    if (textField.value && file.image != null && autocomplete.length != 0) {
      createTournament();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please fill all the fields",
      });
    }
  };
  const handleUpdateClick = () => {
    if (
      textField.value &&
      (file.image_url || file.image != null) &&
      autocomplete.length != 0
    ) {
      updateTournament();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please fill all the fields",
      });
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
          placeholder={"Search by tournament"}
        />

        <Button
          variant="outlined"
          onClick={() => handleClickDialog("add")}
          sx={{
            color: "#FFFFFF",
            backgroundColor: "#0042FF !important",
            border: "1px solid #0042FF!important",
            padding: "10px 16px",
            width: "142px",
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
            ? "Create Tournament"
            : action.image
            ? "Tournament Image"
            : action.editAdd
            ? "Edit Tournament"
            : "Delete Confirmation"
        }
        button={
          action.add
            ? [{ name: "Create", style: styles.ok }]
            : action.image
            ? [{ name: "Close", style: styles.ok }]
            : action.editAdd
            ? [{ name: "Update", style: styles.ok }]
            : [{ name: "Yes, Confirm", style: styles.ok }]
        }
        autocomplete={autocomplete}
        setAutocomplete={setAutocomplete}
        file={file}
        setFile={setFile}
        textField={textField}
        setTextField={setTextField}
        handleDeleteClick={handleDeleteClick}
        handleCreateClick={handleCreateClick}
        handleUpdateClick={handleUpdateClick}
        autocompleteList={sport}
        deleteMessage={tournamentDeleteMessage}
        del={action.del}
        add={action.add}
        editAdd={action.editAdd}
        addData={textfield}
        image={action.image}
        imageUrl={image}
        setOpenSnackbar={setOpenSnackbar}
        setMessage={setMessage}
        tournament
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default Tournament;
