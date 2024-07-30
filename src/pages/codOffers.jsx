import { Box, Button, Paper, TablePagination, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBarComponent from "../components/searchBar";
import Table from "../components/table";
import {
  deleteMethod,
  getMethodWithParams,
  patchMethod,
  postMethod,
} from "./api/api";
import DialogComponent from "../components/dialogComponent";
import {
  codOfferDeleteMessage,
  sportDeleteMessage,
} from "../utilities/constants";
import Snackbar from "../components/snackbarComponent";
import { useRouter } from "next/router";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function codOffers() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [delId, setDelId] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [offerType, setOfferType] = useState("");
  const [textField, setTextField] = useState({ value: "", value2: "" });
  const [editValue, setEditValue] = useState({ id: "", name: "" });
  const [action, setAction] = useState({
    del: false,
    add: false,
    editAdd: false,
  });
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
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
    {
      textfield: [
        { name: "Offer Title", placeholder: "Enter title" },
        { name: "Offer Details", placeholder: "Enter details" },
      ],
      dateTimeField:[
        { name: "Expiry Date", placeholder: "Enter expiry date" },
      ],
    },
  ];
  const radio = [
    { label: "Vouchers", value: "voucher" },
    { label: "Coupons", value: "coupon" },
    { label: "Offers", value: "offer" },
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
      name: "Offer Name",
      width: "25%",
      align: "center",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Type",
      width: "20%",
      align: "center",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Created On",
      width: "20%",
      align: "center",
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
    "Offer Name": "offer_title",
    Type: "type",
    "Created On": "date",
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
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedDateTime(dayjs())
  };
  const handleClickDialog = (string, row) => {
    setDelId("");
    setEditValue({ id: "", name: "" });
    setTextField({ value: "", value2: "" });
    setOfferType("");
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
      setEditValue({ id: row.id, name: row.offer_name });
      setTextField({ value: row.offer_title, value2: row.offer_details });
      setOfferType(row.type);
    }
    setOpen(true);
  };

  const fetchData = async () => {
    try {
      const param = {
        page: backPage,
        size: rowsPerPage,
        search: query,
      };
      const response = await getMethodWithParams(
        `v2/get_predefined_offer`,
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
  const addCodOffer = async () => {
    try {
      const date = new Date(selectedDateTime);
      const response = await postMethod(`v2/save_predefined_offer`, {
        offer_name: offerType,
        type: offerType,
        offer_title: textField.value,
        offer_details: textField.value2,
        deal_end_at :date
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully added offer" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteCodOffer = async () => {
    try {
      const param = {
        offer_id: delId,
      };
      const response = await deleteMethod(`v2/delete_cod_offer`, param);
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully deleted CODOffer" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateCodOffer = async () => {
    try {
      const response = await patchMethod(`v2/update_cod_offer`, {
        offer_id: editValue.id,
        offer_name: editValue.name,
        offer_title: textField.value,
        offer_details: textField.value2,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully updated offer" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/codOffers");
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query]);
  const handleCreateClick = () => {
    if (textField.value && textField.value2 && offerType && selectedDateTime) {
      addCodOffer();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please fill all the fields",
      });
    }
  };
  const handleDeleteClick = () => {
    deleteCodOffer(delId);
  };
  const handleUpdateClick = () => {
    if (textField.value && textField.value2 && offerType) {
      updateCodOffer();
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
          placeholder="Search"
        />

        <Button
          variant="outlined"
          onClick={() => handleClickDialog("add")}
          sx={{
            color: "#FFFFFF",
            backgroundColor: "#0042FF !important",
            border: "1px solid #0042FF!important",
            padding: "10px 16px",
            width: "160px",
            borderRadius: "10px!important",
            textTransform: "none",
            height: "42px",
          }}
        >
          Create New Offer
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
            ? "Vouchers / Coupons"
            : action.editAdd
            ? "Edit Vouchers / Coupons"
            : "Delete Confirmation"
        }
        button={
          action.add
            ? [{ name: "Add", style: styles.ok }]
            : action.editAdd
            ? [{ name: "Update", style: styles.ok }]
            : [{ name: "Yes, Confirm", style: styles.ok }]
        }
        handleDeleteClick={handleDeleteClick}
        handleCreateClick={handleCreateClick}
        handleUpdateClick={handleUpdateClick}
        deleteMessage={codOfferDeleteMessage}
        del={action.del}
        textField={textField}
        radio={radio}
        setTextField={setTextField}
        offerType={offerType}
        setOfferType={setOfferType}
        add={action.add}
        editAdd={action.editAdd}
        addData={textfield}
        setSelectedDateTime={setSelectedDateTime}
        selectedDateTime={selectedDateTime}
        codOffers
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default codOffers;
