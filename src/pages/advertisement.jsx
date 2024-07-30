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
import { advertisementDeleteMessage } from "../utilities/constants";
import Snackbar from "../components/snackbarComponent";
import { useRouter } from "next/router";

function Advertisement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [backPage, setBackPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [delId, setDelId] = useState("");
  const [message, setMessage] = useState({ color: "", name: "" });
  const [action, setAction] = useState({
    del: false,
    add: false,
    image: false,
    video: false,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [textField, setTextField] = useState({ value: "" });
  const [file, setFile] = useState({
    image: null,
    image_url: "",
  });
  const [file2, setFile2] = useState({
    image: null,
    image_url: "",
  });
  const styles = {
    ok: {
      width: action.add
        ? "87px"
        : action.image || action.video
        ? "79px"
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
      name: "Advertisement",
      width: "25%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Thumbnail",
      width: "25%",
      align: "left",
      size: "14px",
      weight: 500,
      color: "#101828",
    },
    {
      name: "Coins",
      width: "20%",
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
    Advertisement: "advertisement_url",
    Thumbnail: "thumbnail_url",
    Coins: "coins",
  };
  const textfield = [
    {
      textfield: [{ name: "Coins", placeholder: "Enter coins" }],
      file: "Advertisement Video",
      thumbnail: "Thumbnail",
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
        search: query,
      };
      const response = await getMethodWithParams(
        `v2/advertisement_list_admin`,
        param
      );
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            ...obj,
            "Sl.No": startingSlNo + index,
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
  const handleClickDialog = (string, row) => {
    setAction((prevAction) => ({
      ...prevAction,
      del: false,
      add: false,
      image: false,
      video: false,
    }));
    setImage("");
    setTextField({ value: "" });
    setFile2({ image: null, image_url: "" });
    setFile({
      image: null,
      image_url: "",
    });

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
      setImage(row.thumbnail_url || row.advertisement_url);
    } else if (string === "video") {
      setAction((prevAction) => ({
        ...prevAction,
        video: true,
      }));
      setVideo(row.advertisement_url);
    }
    setOpen(true);
  };
  const handleQueryValue = (string) => {
    setBackPage(1);
    setPage(0);
    setQuery(string);
  };
  const deleteAdvertisement = async () => {
    try {
      const param = {
        id: delId,
      };
      const response = await deleteMethod(
        `v2/delete_advertisement/${param.id}`,
        param
      );
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully deleted advertisement",
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
  const createAdvertisement = async () => {
    try {
      const response = await postMethodForFile(`v2/upload_advertisements`, {
        coins: textField.value,
        file_obj: file.image,
        thumb_nail: file2.image,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({
          color: "#6FCF97",
          name: "Successfully added advertisement",
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
    deleteAdvertisement(delId);
  };
  const handleCreateClick = () => {
    if (textField.value && file.image != null && file2.image != null) {
      createAdvertisement();
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
  useEffect(() => {
    localStorage.setItem("currentPage", "/advertisement");
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query]);
  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("usertoken");
  };
  useEffect(() => {
    setLoading(true);
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
            ? "Create Advertisement"
            : action.image
            ? "Advertisement Image"
            : action.video
            ? "Advertisement Video"
            : "Delete Confirmation"
        }
        button={
          action.add
            ? [{ name: "Create", style: styles.ok }]
            : action.image || action.video
            ? [{ name: "Close", style: styles.ok }]
            : [{ name: "Yes, Confirm", style: styles.ok }]
        }
        textField={textField}
        setTextField={setTextField}
        file={file}
        setFile={setFile}
        file2={file2}
        setFile2={setFile2}
        handleDeleteClick={handleDeleteClick}
        handleCreateClick={handleCreateClick}
        deleteMessage={advertisementDeleteMessage}
        del={action.del}
        add={action.add}
        video={action.video}
        image={action.image}
        imageUrl={image}
        videoUrl={video}
        addData={textfield}
        setOpenSnackbar={setOpenSnackbar}
        setMessage={setMessage}
        advertisement
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default Advertisement;
