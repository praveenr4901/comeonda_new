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
import { avatarDeleteMessage } from "../utilities/constants";
import Snackbar from "../components/snackbarComponent";
import { useRouter } from "next/router";

function Avatar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [image, setImage] = useState("");
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState({
    del: false,
    add: false,
    image: false,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [delId, setDelId] = useState("");
  const [autocomplete, setAutocomplete] = useState([]);
  const [file, setFile] = useState({
    image: null,
    image_url: "",
  });
  const [textField, setTextField] = useState({ value: "" });
  const styles = {
    ok: {
      width: action.image ? "79px" : action.add ? "87px" : "150px",
      backgroundColor: "#0042FF !important",
      color: "#FFFFFF",
      border: "1px solid #0042FF",
      fontWeight: 600,
      fontSize: "16px",
      textTransform: "capitalize",
      boxShadow: "none",
    },
    download: {
      width: "101px",
      backgroundColor: "#FFFFFF !important",
      color: "#1B54FE",
      border: "1px solid #1B54FE",
      fontWeight: 600,
      fontSize: "16px",
      textTransform: "capitalize",
      boxShadow: "none",
    },
  };
  const autocompleteList = [
    { label: "Free", value: "basic" },
    { label: "Paid", value: "paid" },
  ];
  const header = [
    {
      name: "Sl.No",
      width: "20%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Avatar",
      width: "30%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Price",
      width: "25%",
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
    Avatar: "profile_pic",
    Price: "modified_price",
  };
  const textfield = [
    {
      autocomplete: [
        {
          name: "Type",
          placeholder: "Select type",
        },
      ],
      textfield: [{ name: "Price", placeholder: "Enter price" }],
      file: "Upload Avatar Image",
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
      const response = await getMethodWithParams(`v2/avatar_list_admin`, param);
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": startingSlNo + index,
            modified_price: obj.price !== "0" ? obj.price : "Free",
            profile_pic: obj.avatar_url === null ? "" : obj.avatar_url,
            action: [{ 1: "Remove", 2: "#404040 !important" }],
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
  const deleteAvatar = async () => {
    try {
      const param = {
        id: delId,
      };
      const response = await deleteMethod(
        `v2/delete_avatar/${param.id}`,
        param
      );
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully deleted avatar",
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
  const uploadAvatar = async () => {
    try {
      const response = await postMethodForFile(`v2/upload_avatar`, {
        price: textField === "" ? 0 : textField.value,
        type: autocomplete[0].value,
        file_obj: file.image,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully added avatar" });
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
    setTextField({ value: "" });
    setAutocomplete([]);
    setFile({ image: null, image_url: "" });
    setAction((prevAction) => ({
      ...prevAction,
      del: false,
      add: false,
      image: false,
    }));

    if (string === "Remove") {
      setAction((prevAction) => ({
        ...prevAction,
        del: true,
      }));
      setDelId(row.id);
    } else if (string === "image") {
      setAction((prevAction) => ({
        ...prevAction,
        image: true,
      }));
      setImage(row.avatar_url);
    } else if (string === "add") {
      setAction((prevAction) => ({
        ...prevAction,
        add: true,
      }));
    }
    setOpen(true);
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/avatar");
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query]);
  const handleDeleteClick = () => {
    deleteAvatar();
  };
  const handleCreateClick = () => {
    if (
      autocomplete[0]?.label == "Paid"
        ? textField.value
        : (textField.value == undefined || textField.value == "") &&
          file.image != null &&
          autocomplete.length != 0
    ) {
      uploadAvatar();
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
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          action.image
            ? "Avatar Image"
            : action.add
            ? "New Avatar"
            : "Delete Confirmation"
        }
        button={
          action.image
            ? [
                { name: "Download", style: styles.download },
                { name: "Close", style: styles.ok },
              ]
            : action.add
            ? [{ name: "Submit", style: styles.ok }]
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
        handleDownload={handleDownload}
        addData={textfield}
        autocompleteList={autocompleteList}
        deleteMessage={avatarDeleteMessage}
        add={action.add}
        del={action.del}
        image={action.image}
        imageUrl={image}
        setOpenSnackbar={setOpenSnackbar}
        setMessage={setMessage}
        avatar
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default Avatar;
