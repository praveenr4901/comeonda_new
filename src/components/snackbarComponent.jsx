import { Snackbar, IconButton, Slide, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function TransitionRight(props) {
  return <Slide {...props} direction="left" />;
}
export default function SnackBar(props) {
  const {
    openSnackerBar,
    errorMsg,
    handleCloseSnackBar,
    messageName,
    errorTittleName,
  } = props;

  const action = (
    <IconButton
      aria-label="close"
      color="inherit"
      onClick={handleCloseSnackBar}
    >
      <CloseIcon sx={{ fontSize: "1.2rem", color: "#828282" }} />
    </IconButton>
  );
  return (
    <>
      <Snackbar
        sx={{
          // zIndex: "1500 !important",
          "& .MuiSnackbarContent-root": {
            padding: "12px 12px",
            backgroundColor: "#FFFFFF",
            border: `2px solid ${messageName.color}`,
          },
          "& .MuiSnackbarContent-message": {
            padding: "0px",
            fontWeight: "300",
          },
          "& .MuiSnackbarContent-action": {
            p: "0",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackerBar}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
        TransitionComponent={TransitionRight}
        action={action}
        message={
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {messageName.color == "#f44336" ? (
              <ErrorOutlineIcon
                fontSize="large"
                sx={{
                  mr: "5px",
                  letterSpacing: "0.031em",
                  color: messageName.color,
                }}
              />
            ) : (
              <CheckCircleOutlineOutlinedIcon
                fontSize="large"
                sx={{
                  mr: "5px",
                  letterSpacing: "0.031em",
                  color: messageName.color,
                }}
              />
            )}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ fontSize: "16px", fontWeight: 600, color: "#333333" }}
              >
                {messageName.color == "#f44336" ? "Failed" : "Success"}
              </Typography>
              <Typography
                sx={{ fontSize: "14px", fontWeight: 400, color: "#4D4D4D" }}
              >
                {messageName.name}
              </Typography>
            </Box>
          </Box>
        }
      ></Snackbar>
    </>
  );
}
