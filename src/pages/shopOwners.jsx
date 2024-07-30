import { Box, Button, Paper, TablePagination, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBarComponent from "../components/searchBar";
import Table from "../components/table";
import FilterListIcon from "@mui/icons-material/FilterList";
import DrawerComponent from "../components/drawer";
import { getMethodWithParams, patchMethod } from "./api/api";
import DialogComponent from "../components/dialogComponent";
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
function ShopOwners() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [filter, setFilter] = useState({
    status: "",
  });
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
      name: "Shop Name",
      width: "18%",
      align: "left",
      size: "12px",
      weight: 500,
      color: " #676B72",
    },
    {
      name: "Phone Number",
      width: "12%",
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
      name: "GST Number",
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
      name: "Created On",
      width: "12%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Action",
      width: "18%",
      align: "center",
      size: "12px",
      weight: 500,
      color: "#676B72",
    },
  ];
  const headerMappings = {
    "Sl.No": "Sl.No",
    "Shop Name": "username",
    "Phone Number": "phone_number",
    Coins: "coins",
    "GST Number": "gst_number",
    Status: "status",
    "Created On": "date",
  };
  const filterHeaders = ["Approved", "Rejected", "Pending"];
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
        search: query,
      };
      const response = await getMethodWithParams(
        `v2/shop_owners_admin_panel`,
        param
      );
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": startingSlNo + index,
            status:
              obj.approval === "Approved"
                ? "Approved"
                : obj.approval === "Unapproved"
                ? "Rejected"
                : "Pending",
            action:
              obj.approval === "Approved"
                ? [{ 1: "Deny", 2: "#FF1515 !important" }]
                : obj.approval === "Unapproved"
                ? [{ 1: "Approve", 2: "#14A022 !important" }]
                : [
                    { 1: "Approve", 2: "#14A022 !important" },
                    { 1: "Deny", 2: "#FF1515 !important" },
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
  const updateShopowner = async (string, id) => {
    try {
      const response = await patchMethod(`v2/update_shopowner`, {
        id: id,
        approval: string,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name:
            string === "Approved"
              ? "Successfully approved shopowner"
              : "Successfully denied shopowner",
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
    setDel(false);
    if (string === "Remove") {
      setDel(true);
      setOpen(true);
    } else if (string === "Approve") {
      updateShopowner("Approved", row.id);
    } else if (string === "Deny") {
      updateShopowner("Unapproved", row.id);
    }
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleFilter = (params) => {
    setPage(0);
    setBackPage(1);
    setFilter({
      status: params ? params.status : "",
    });
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/shopOwners");
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query, filter]);
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
          placeholder={"Search by shop name"}
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
        shopOwners
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
        shopOwners
        handleFilter={handleFilter}
        filterHeaders={filterHeaders}
      />
      <DialogComponent
        open={open}
        handleClose={handleClose}
        header={"Delete Confirmation"}
        button={[{ name: "Yes, Confirm", style: styles.ok }]}
        // dialogData={dialogData}
        // emptyMessage={emptyMessage}
        // handleWinnerQuery={handleWinnerQuery}
        del={del}
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default ShopOwners;
