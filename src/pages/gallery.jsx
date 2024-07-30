import {
  Box,
  Button,
  Paper,
  TablePagination,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBarComponent from "../components/searchBar";
import {
  deleteMethod,
  getMethodWithParams,
  postMethodForFile,
} from "./api/api";
import DialogComponent from "../components/dialogComponent";
import { Gallery } from "react-grid-gallery";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { galleryDeleteMessage } from "../utilities/constants";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Snackbar from "../components/snackbarComponent";
import { useRouter } from "next/router";

function GalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [backPage, setBackPage] = useState(1);
  const [delId, setDelId] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState({
    del: false,
    add: false,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [file, setFile] = useState({
    image: null,
    image_url: "",
  });
  const [textField, setTextField] = useState({ value: "" });

  const styles = {
    ok: {
      width: action.add ? "87px" : "150px",
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
      textfield: [{ name: "Name", placeholder: "Enter name" }],
      file: "Image",
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
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const fetchData = async () => {
    try {
      const param = {
        page: backPage,
        size: rowsPerPage,
        search: query,
      };
      const response = await getMethodWithParams(`v2/gallery_admin`, param);
      if (response?.data.status === "success") {
        const startingSlNo = (backPage - 1) * rowsPerPage + 1;
        setTotal(response.data.response.total_items);
        const dataArray = response?.data?.response?.result.map((obj, index) => {
          return {
            src: obj.posture_url,
            caption: obj.tittle,
            id: obj.id,
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
    setTextField({ value: "" });
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
  const deleteGallery = async () => {
    try {
      const param = {
        id: delId,
      };
      const response = await deleteMethod(
        `v2/delete_gallery/${param.id}`,
        param
      );
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully deleted image" });
        fetchData();
      } else {
        setOpenSnackbar(true);
        setMessage({ color: "#f44336", name: response.data.response });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateGallery = async () => {
    try {
      const response = await postMethodForFile(`v2/upload_gallery`, {
        title: textField.value,
        file_obj: file.image,
      });
      if (response?.data?.status === "success") {
        setOpenSnackbar(true);
        setMessage({ color: "#6FCF97", name: "Successfully added image" });
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
    deleteGallery(delId);
  };
  const handleCreateClick = () => {
    if (textField.value && file.image != null) {
      updateGallery();
      handleClose();
    } else {
      setOpenSnackbar(true);
      setMessage({
        color: "#f44336",
        name: "Please fill all the fields",
      });
    }
  };
  useEffect(() => {
    localStorage.setItem("currentPage", "/gallery");
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query]);

  const Images = data.map((image) => ({
    ...image,
    customOverlay: (
      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          width: "100%",
          height: "80%",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#0042FF",
            overflow: "hidden",
            position: "absolute",
            filter: "none",
            bottom: 0,
            width: "100%",
            height: "20%",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              pointerEvents: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <IconButton>
                <VisibilityOutlinedIcon
                  sx={{ color: "#FFFFFF", fontSize: "25px", ml: 1 }}
                />
              </IconButton> */}
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#FFFFFF",
                  ml: "15px",
                }}
              >
                {image?.caption}
              </Typography>
            </Box>
            <IconButton
              onClick={() => handleClickDialog("Remove", image)}
              sx={{ mr: 1 }}
            >
              <DeleteOutlineOutlinedIcon
                sx={{ color: "#FFFFFF", fontSize: "30px" }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
    ),
    width: 400, // Specify desired width
    height: 343, // Specify desired height
  }));
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
      <Gallery
        images={Images}
        enableImageSelection={false}
        margin={5}
        rowHeight={343}
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
        header={action.add ? "Add Image" : "Delete Confirmation"}
        button={
          action.add
            ? [{ name: "Submit", style: styles.ok }]
            : [{ name: "Yes, Confirm", style: styles.ok }]
        }
        file={file}
        setFile={setFile}
        textField={textField}
        setTextField={setTextField}
        handleDeleteClick={handleDeleteClick}
        handleCreateClick={handleCreateClick}
        deleteMessage={galleryDeleteMessage}
        del={action.del}
        add={action.add}
        addData={textfield}
        setOpenSnackbar={setOpenSnackbar}
        setMessage={setMessage}
        gallery
      />
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleCloseSnackbar}
        messageName={message}
      />
    </Box>
  );
}

export default GalleryPage;
