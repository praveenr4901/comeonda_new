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
import { teamDeleteMessage } from "../utilities/constants";
import Snackbar from "../components/snackbarComponent";
import { useRouter } from "next/router";

function Team() {
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
  const [delId, setDelId] = useState("");
  const [tournament, setTournament] = useState([]);
  const [autocomplete, setAutocomplete] = useState([]);
  const [file, setFile] = useState({
    image: null,
    image_url: "",
    image_name: "",
  });
  const [textField, setTextField] = useState({ value: "" });
  const [editValue, setEditValue] = useState({ id: "" });

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
      name: "Tournament Name",
      width: "25%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Team Name",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Team Flag",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Action",
      width: "25%",
      align: "center",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    "Tournament Name": "tournament_name",
    "Team Name": "team_name",
    "Team Flag": "team_flag",
  };
  const textfield = [
    {
      autocomplete: [
        {
          name: "Tournament Name",
          placeholder: "Select tournament",
        },
      ],
      textfield: [{ name: "Team Name", placeholder: "Enter team name" }],
      file: "Team Image",
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
      const response = await getMethodWithParams(`v2/team_list_admin`, param);
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
  const fetchTournament = async () => {
    try {
      const param = {
        page: 1,
        size: 50,
      };
      const response = await getMethodWithParams(
        `v2/tournament_list_admin`,
        param
      );
      if (response?.data.status === "success") {
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            label: obj.tournament_name,
          };
        });
        setTournament(dataArray);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickDialog = (string, row) => {
    setEditValue({ id: "", tournament_name: "" });
    setTextField({ value: "" });
    setAutocomplete([]);
    setFile({ image: null, image_url: "", image_name: "" });
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
      setEditValue({ id: row.id });
      setTextField({ value: row.team_name });
      setAutocomplete([row.tournament_name]);
      const url = new URL(row.team_flag);
      const pathname = url.pathname;
      const decodedPathname = decodeURIComponent(pathname);
      const filename = decodedPathname.split("/").pop();
      setFile({ image: null, image_url: row.team_flag, image_name: filename });
    }
    setOpen(true);
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/team");
    fetchData();
    fetchTournament();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query]);
  const deleteTeam = async (id) => {
    try {
      const param = {
        team_id: delId,
      };
      const response = await deleteMethod(`v2/delete_team`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully deleted team" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const createTeam = async () => {
    try {
      const response = await postMethodForFile(`v2/save_team`, {
        tournament_id: autocomplete[0].id,
        tournament_name: autocomplete[0].tournament_name,
        team_name: textField.value,
        file_obj: file.image,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully added team" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateTeam = async () => {
    try {
      const response = await postMethodForFile(`v2/update_team`, {
        team_id: editValue.id,
        team_name: textField.value,
        ...(typeof file.image !== null && { file_obj: file.image }),
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully updated team" });
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
    deleteTeam(delId);
  };
  const handleCreateClick = () => {
    if (autocomplete.length != 0 && textField.value && file.image != null) {
      createTeam();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({ color: "#f44336", name: "Please fill all the fields" });
    }
  };
  const handleUpdateClick = () => {
    if (
      autocomplete.length != 0 &&
      textField.value &&
      (file.image_url || file.image != null)
    ) {
      updateTeam();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({ color: "#f44336", name: "Please fill all the fields" });
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
          placeholder={"Search"}
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
            ? "Create Team"
            : action.editAdd
            ? "Edit Team"
            : "Delete Confirmation"
        }
        button={
          action.add
            ? [{ name: "Create", style: styles.ok }]
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
        autocompleteList={tournament}
        deleteMessage={teamDeleteMessage}
        del={action.del}
        add={action.add}
        editAdd={action.editAdd}
        addData={textfield}
        setOpenSnackbar={setOpenSnackbar}
        setMessage={setMessage}
        team
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default Team;
