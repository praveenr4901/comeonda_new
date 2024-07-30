import { Box, Button, Paper, TablePagination, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBarComponent from "../components/searchBar";
import Table from "../components/table";
import FilterListIcon from "@mui/icons-material/FilterList";
import DrawerComponent from "../components/drawer";
import {
  deleteMethod,
  getMethodWithParams,
  patchMethod,
  postMethod,
} from "./api/api";
import DialogComponent from "../components/dialogComponent";
import { matchDeleteMessage } from "../utilities/constants";
import Snackbar from "../components/snackbarComponent";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const styles = {
  ok: {
    width: "150px",
    backgroundColor: "#0042FF !important",
    color: "#FFFFFF",
    border: "1px solid #0042FF",
    fontWeight: 600,
    fontSize: "16px",
    textTransform: "capitalize",
    boxShadow: "none",
  },
};

function Match() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);
  const [editValue, setEditValue] = useState({ id: "" });
  const [action, setAction] = useState({
    del: false,
    add: false,
    editAdd: false,
  });
  const [delId, setDelId] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    date_from: "",
    date_to: "",
  });
  const [sport, setSport] = useState([]);
  const [tournament, setTournament] = useState([]);
  const [team, setTeam] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [autocomplete, setAutocomplete] = useState([]);
  const [teamAutocompleteValue, setTeamAutocompleteValue] = useState({
    teamA: "",
    teamB: "",
  });
  const [dateTime, setDateTime] = useState({ date: null, time: null });
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
      name: "Team 1",
      width: "15%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Team 2",
      width: "15%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Tournament Name",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Match Date & Time",
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
      name: "Action",
      width: "20%",
      align: "center",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    "Team 1": "first_team",
    "Team 2": "second_team",
    "Tournament Name": "tournament",
    "Match Date & Time": "match_date",
    Status: "status",
    Action: "date",
  };
  const filterHeaders = [
    {
      status: {
        heading1: "Status",
        name: "Completed",
        name2: "Created",
        name3: "Created On",
      },
    },
  ];
  const textfield = [
    {
      autocomplete: [
        {
          name: "Sports",
          placeholder: "Select sport",
        },
        {
          name: "Tournament",
          placeholder: "Select tournament",
        },
      ],
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
        status: filter.status,
        date_from_: filter.date_from,
        date_to: filter.date_to,
        search: query,
      };
      const response = await getMethodWithParams(`v2/match_list_admin`, param);
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
  const fetchTournament = async (id) => {
    try {
      const param = {
        sports_id: id,
      };
      const response = await getMethodWithParams(
        `v2/get_tournaments/${param.sports_id}`,
        param
      );
      if (response?.data?.status === "success") {
        const dataArray = response?.data?.response?.map((obj, index) => {
          return {
            ...obj,
            label: obj.tournament_name,
          };
        });
        setTournament(dataArray);
      } else {
        setTournament([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchTeam = async (id) => {
    try {
      const param = {
        tournament_id: id,
      };
      const response = await getMethodWithParams(
        `v2/get_team/${param.tournament_id}`,
        param
      );
      if (response?.data.status === "success") {
        const dataArray = response?.data?.response.map((obj, index) => {
          return {
            ...obj,
            label: obj.team_name,
          };
        });
        setTeam(dataArray);
        setTeamList(dataArray);
      } else {
        setTeam([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchTeamB = async (tournament_id, id) => {
    try {
      const response = await postMethod(`v2/team_second_admin`, {
        tournament_id: tournament_id,
        team_id: id,
      });
      if (response?.data.status === "success") {
        const dataArray = response?.data?.response.map((obj, index) => {
          return {
            ...obj,
            label: obj.team_name,
          };
        });
        setTeamB(dataArray);
      } else {
        setTeam([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickDialog = (string, row) => {
    setAction((prevAction) => ({
      ...prevAction,
      del: false,
      add: false,
      editAdd: false,
    }));
    setAutocomplete([]);
    setTeamAutocompleteValue({
      teamA: "",
      teamB: "",
    });
    setDateTime({ date: null, time: null });

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
      setAutocomplete([row.sports_name, row.tournament]);
      setTeamAutocompleteValue({
        teamA: row.first_team,
        teamB: row.second_team,
      });
      setDateTime({
        date: dayjs(row.match_date),
        time: dayjs(row.match_time, "hh:mm A"),
      });
    }
    setOpen(true);
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
      status: params ? params.checkbox1 : "",
      date_from: params ? params.date_from : "",
      date_to: params ? params.date_to : "",
    });
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/match");
    fetchData();
    fetchSport();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query, filter]);

  const deleteMatch = async (id) => {
    try {
      const param = {
        id: delId,
      };
      const response = await deleteMethod(`v2/delete_match/${param.id}`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully deleted match" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const createMatch = async () => {
    if (
      teamAutocompleteValue.teamA &&
      teamAutocompleteValue.teamA &&
      autocomplete.length == 2 &&
      dateTime.date != null &&
      dateTime.time != null
    ) {
      const time = dayjs(dateTime.time).format("hh:mm A");
      const date = dayjs(dateTime.date).format("YYYY-MM-DD");
      const combinedDateTime = dayjs(
        `${date} ${time}`,
        "YYYY-MM-DD h:mm A"
      ).toISOString();
      try {
        const response = await postMethod(`v2/save_match`, {
          team_first: teamAutocompleteValue.teamA.team_name,
          team_second: teamAutocompleteValue.teamB.team_name,
          team_first_id: teamAutocompleteValue.teamA.id,
          team_second_id: teamAutocompleteValue.teamB.id,
          tournament: autocomplete[1].tournament_name,
          tournament_id: autocomplete[1].id,
          match_date: combinedDateTime,
        });
        if (response?.data?.status === "success") {
          setOpenSnackbar(true);
          setMessage({ color: "#6FCF97", name: "Successfully added match" });
          handleClose();
          fetchData();
        } else {
          setOpenSnackbar(true);
          setMessage({ color: "#f44336", name: response.data.response });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please fill all the fields",
      });
    }
  };
  const updateMatch = async () => {
    const time = dayjs(dateTime.time).format("hh:mm A");
    const date = dayjs(dateTime.date).format("YYYY-MM-DD");
    const combinedDateTime = dayjs(
      `${date} ${time}`,
      "YYYY-MM-DD h:mm A"
    ).format("YYYY-MM-DDTHH:mm:ss.SSS");
    try {
      const response = await postMethod(`v2/update_match`, {
        match_id: editValue.id,
        match_date: combinedDateTime,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully updated match" });
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
    deleteMatch(delId);
  };
  const handleCreateClick = () => {
    createMatch();
  };
  const handleUpdateClick = () => {
    if (
      teamAutocompleteValue.teamA &&
      teamAutocompleteValue.teamA &&
      autocomplete.length == 2 &&
      dateTime.date != null &&
      dateTime.time != null
    ) {
      updateMatch();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please fill all the fields",
      });
    }
  };
  const handleFetchTournament = (sportId) => {
    setAutocomplete([]);
    fetchTournament(sportId);
  };
  const handleFetchTeam = (tournamentId) => {
    fetchTeam(tournamentId);
  };
  const handleFetchTeamB = (tournamentId, teamId) => {
    fetchTeamB(tournamentId, teamId);
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
        match
        handleClickDialog={handleClickDialog}
        //   fetchData={fetchData}
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
        match
        handleFilter={handleFilter}
        filterHeaders={filterHeaders}
      />
      <DialogComponent
        open={open}
        handleClose={handleClose}
        header={
          action.add
            ? "Add New Match"
            : action.editAdd
            ? "Edit Match"
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
        autocompleteList={sport}
        autocompleteList2={tournament.length === 0 ? [] : tournament}
        autocompleteTeam={team}
        autocompleteTeamB={teamB}
        setAutocompleteTeam={setTeam}
        teamList={teamList}
        autocomplete={autocomplete}
        setAutocomplete={setAutocomplete}
        teamAutocompleteValue={teamAutocompleteValue}
        setTeamAutocompleteValue={setTeamAutocompleteValue}
        dateTime={dateTime}
        setDateTime={setDateTime}
        handleDeleteClick={handleDeleteClick}
        handleCreateClick={handleCreateClick}
        handleUpdateClick={handleUpdateClick}
        handleFetchTournament={handleFetchTournament}
        handleFetchTeamB={handleFetchTeamB}
        handleFetchTeam={handleFetchTeam}
        deleteMessage={matchDeleteMessage}
        del={action.del}
        add={action.add}
        editAdd={action.editAdd}
        addData={textfield}
        match
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default Match;
