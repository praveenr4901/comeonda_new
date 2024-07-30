import React, { useEffect, useState } from "react";
import Table from "../components/table";
import { getMethodWithParams, postMethod } from "./api/api";
import { Box, Button, Paper, TablePagination, Toolbar } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchBarComponent from "../components/searchBar";
import DrawerComponent from "../components/drawer";
import DialogComponent from "../components/dialogComponent";
import { reportedDeleteMessage } from "../utilities/constants";
import Snackbar from "../components/snackbarComponent";
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

function ReportedUsers() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState({
    del: false,
  });
  const [filter, setFilter] = useState({
    status: "",
    type: "",
    coin_from: "",
    coin_to: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [delId, setDelId] = useState("");

  const filterHeaders = [
    {
      status: {
        heading1: "Status",
        name: "Active",
        name2: "Inactive",
        heading2: "User Type",
        name4: "User",
        name5: "Shop",
      },
    },
  ];
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
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  const handleClose = () => {
    setOpen(false);
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
      name: "User Name",
      width: "20%",
      align: "left",
      size: "12px",
      weight: 500,
      color: "#676B72",
    },
    {
      name: "Count",
      width: "10%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "User Type",
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
      name: "Reason",
      width: "25%",
      align: "center",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Action",
      width: "15%",
      align: "center",
      size: "12px",
      weight: 500,
      color: "#676B72",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    "User Name": "username",
    Count: "count_of_reports",
    "User Type": "user_type",
    Status: "status",
    Reason: "reason",
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  const fetchData = async () => {
    try {
      const param = {
        page: backPage,
        size: rowsPerPage,
        status: filter.status,
        type: filter.type,
        coin_from_: filter.coin_from,
        coin_to: filter.coin_to,
        search: query,
      };
      const response = await getMethodWithParams(
        `v2/reported_admin_panel`,
        param
      );
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": startingSlNo + index,
            status: obj.delete_status == "active" ? "Active" : "Inactive",
            profile_pic:
              obj.profile_pic_url === null ? "" : obj.profile_pic_url,
            action: [{ 1: "Remove", 2: "#FF1B1B !important" }],
            user_type: obj.user_status == true ? "User" : "Shop owner",
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

  useEffect(() => {
    localStorage.setItem("currentPage", "/reportedUsers");
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
      type: params ? params.checkbox2 : "",
      coin_from: params ? params.coin_from : "",
      coin_to: params ? params.coin_to : "",
    });
  };
  const handleClickDialog = (string, row) => {
    setAction((prevAction) => ({
      ...prevAction,
      del: false,
    }));
    if (string === "Remove") {
      setAction((prevAction) => ({
        ...prevAction,
        del: true,
      }));
      setDelId(row.id);
    }
    setOpen(true);
  };
  const deleteUser = async () => {
    try {
      const response = await postMethod(`v2/delete_user`, { user_id: delId });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully inactivated user" });
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
    deleteUser(delId);
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
          placeholder={"Search by username"}
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
        handleClickDialog={handleClickDialog}
        reportedUsers
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
        handleFilter={handleFilter}
        reportedUser
        filterHeaders={filterHeaders}
      />
      <DialogComponent
        open={open}
        handleClose={handleClose}
        header={"Delete Confirmation"}
        button={[{ name: "Yes, Confirm", style: styles.ok }]}
        deleteMessage={reportedDeleteMessage}
        del={action.del}
        handleDeleteClick={handleDeleteClick}
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default ReportedUsers;
