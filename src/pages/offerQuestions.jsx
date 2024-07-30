import { Box, Button, Paper, TablePagination, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import DialogComponent from "../components/dialogComponent";
import SearchBarComponent from "../components/searchBar";
import Table from "../components/table";
import FilterListIcon from "@mui/icons-material/FilterList";
import DrawerComponent from "../components/drawer";
import { deleteMethod, getMethodWithParams, patchMethod } from "./api/api";
import Snackbar from "../components/snackbarComponent";
import {
  questionDeleteMessage,
  sortWinnersMessage,
} from "../utilities/constants";
import { useRouter } from "next/router";

function OfferQuestions() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [matchCompleted, setMatchCompleted] = useState(false);
  const [sort, setSort] = useState(false);
  const [winnerSort, setWinnerSort] = useState({
    question_id: "",
    offer_id: "",
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [idWinner, setIdWinner] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [queryWinner, setQueryWinner] = useState("");
  const [winners, setWinners] = useState(false);
  const [del, setDel] = useState(false);
  const [delId, setDelId] = useState("");
  const [dialogData, setDialogData] = useState([]);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    date_from_: "",
    date_to: "",
  });
  const header = [
    {
      name: "Sl.No",
      width: "3%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Question",
      width: "20%",
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
      name: "User",
      width: "15%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Type",
      width: "10%",
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
      name: "Sort Winners",
      width: "8%",
      align: "left",
      size: "12px",
      weight: 500,
      color: "#676B72",
    },
  ];
  const styles = {
    ok: {
      width: del ? "150px" : "79px",
      backgroundColor: "#0042FF !important",
      color: "#FFFFFF",
      border: "1px solid #0042FF",
      fontWeight: 600,
      fontSize: "16px",
      textTransform: "capitalize",
      boxShadow: "none",
    },
  };
  const headerMappings = {
    "Sl.No": "Sl.No",
    Question: "question",
    "Match & Tournament": "match_name",
    User: "user_name",
    Type: "type",
    Status: "status",
  };
  const filterHeaders = [
    {
      status: {
        heading1: "Status",
        name: "Created",
        name2: "Completed",
        name3: "Match Date",
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
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
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
        date_from_: filter.date_from_,
        date_to: filter.date_to,
        search: query,
      };
      const response = await getMethodWithParams(
        `v2/offer_question_list`,
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
              obj.created_user_pic === null ? "" : obj.created_user_pic,
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
      const response = await getMethodWithParams(
        `v2/offer_winners_list_admin`,
        param
      );
      if (response?.data?.status === "success") {
        setDialogData(response?.data?.response);
        if (response?.data?.response.length === 0 ) {
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
  const selectWinners = async () => {
    try {
      const response = await patchMethod(`v2/add_offers`, {
        question_id: winnerSort.question_id,
        offer_id: winnerSort.offer_id,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully submitted to sort winners",
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
    deleteQuestion(delId);
  };
  const handleCreateClick = () => {
    selectWinners();
    handleClose();
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/offerQuestions");
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query, filter]);

  const handleFilter = (params) => {
    setPage(0);
    setBackPage(1);
    setFilter({
      status: params ? params.checkbox1 : "",
      date_from_: params ? params.date_from : "",
      date_to: params ? params.date_to : "",
    });
  };
  const handleWinnerQuery = (string) => {
    setQueryWinner(string ? string : "");
  };
  useEffect(() => {
    fetchWinnersList();
  }, [queryWinner]);

  const handleClickDialog = (string, row) => {
    setWinnerSort({ question_id: "", offer_id: "" });
    setWinners(false);
    setMatchCompleted(false);
    setDel(false);
    setSort(false);
    setDialogData([]);
    setIdWinner("");
    if (string === "winners") {
      if (row.status == "completed") {
        setMatchCompleted(true);
      }
      setWinners(true);
      setIdWinner(row.id);
      fetchWinnersList(row.id);
    } else if (string === "Delete") {
      setDel(true);
      setDelId(row.id);
    } else if (string === "sort") {
      setSort(true);
      setWinnerSort({ question_id: row.id, offer_id: row.offer_id });
    }
    setOpen(true);
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
        offerQuestions
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
        offerQuestions
        handleFilter={handleFilter}
        filterHeaders={filterHeaders}
      />
      <DialogComponent
        open={open}
        handleClose={handleClose}
        header={
          del
            ? "Delete Confirmation"
            : sort
            ? "Sortout Winners"
            : "Winners List"
        }
        deleteMessage={sort ? sortWinnersMessage : questionDeleteMessage}
        button={
          del
            ? [{ name: "Yes, Confirm", style: styles.ok }]
            : sort
            ? [{ name: "Submit", style: styles.ok }]
            : [{ name: "Ok", style: styles.ok }]
        }
        dialogData={dialogData}
        handleDeleteClick={handleDeleteClick}
        handleCreateClick={handleCreateClick}
        emptyMessage={emptyMessage}
        handleWinnerQuery={handleWinnerQuery}
        winners={winners}
        matchCompleted={matchCompleted}
        del={del}
        sort={sort}
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default OfferQuestions;
