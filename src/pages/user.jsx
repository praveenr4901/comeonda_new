import React, { useEffect, useState } from "react";
import Table from "../components/table";
import { getMethodWithParams } from "./api/api";
import { Box, Button, Paper, TablePagination, Toolbar } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchBarComponent from "../components/searchBar";
import DrawerComponent from "../components/drawer";
import { useRouter } from "next/router";

export default function User() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    coin_from: "",
    coin_to: "",
    date_from: "",
    date_to: "",
  });

  const filterHeaders = [
    {
      status: {
        heading1: "Status",
        name: "Active",
        name2: "Inactive",
        name3: "Created On",
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
    setOpen(true);
  };
  const handleDrawerClose = () => {
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
      name: "GST Number",
      width: "15%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Coins",
      width: "10%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Created On",
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
      name: "Location",
      width: "30%",
      align: "left",
      size: "12px",
      weight: 500,
      color: "#676B72",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    "User Name": "username",
    "GST Number": "gst_number",
    Coins: "coins",
    "Created On": "date",
    Status: "status",
    Location: "location",
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
        coin_from_: filter.coin_from,
        coin_to: filter.coin_to,
        date_from_: filter.date_from,
        date_to: filter.date_to,
        search: query,
      };
      const response = await getMethodWithParams(`v2/users_admin_panel`, param);
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
    localStorage.setItem("currentPage", "/user");
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
      coin_from: params ? params.coin_from : "",
      coin_to: params ? params.coin_to : "",
      date_from: params ? params.date_from : "",
      date_to: params ? params.date_to : "",
    });
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
          placeholder={"Search by user name"}
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
        fetchData={fetchData}
        users
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
        open={open}
        close={handleDrawerClose}
        handleFilter={handleFilter}
        users
        filterHeaders={filterHeaders}
      />
    </Box>
  );
}
