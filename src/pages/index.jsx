import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { postMethod } from "./api/api";
import { useRouter } from "next/router";
import Snackbar from "../components/snackbarComponent";

const styles = {
  textfield: {
    width: "400px",
    "& input::placeholder": {
      color: "#667085",
      opacity: "1",
      fontWeight: "400",
      fontSize: "13px",
    },
    "& .MuiInputBase-input": {
      borderWidth: `1px !important`,
      position: "relative",
      fontSize: 16,
      padding: "10px 14px",
    },
    "& fieldset": {
      borderWidth: `1px !important`,
      padding: "0px !important",
      borderColor: "#D0D5DD ",
      borderRadius: "10px!important",
    },
  },
};
function Login() {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [disable, setDisable] = useState(false);
  const [message, setMessage] = useState({ color: "", name: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isValid, setIsValid] = useState({
    username: false,
    password: false,
  });
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(1000));
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [errors, setErrors] = useState({
    userErrorMessage: "",
    passwordErrorMessage: "",
  });
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e, string) => {
    if (string == "username") {
      const inputValue = e.target.value;
      setLogin({
        ...login,
        username: inputValue,
      });
      setIsValid({
        ...isValid,
        username: inputValue === "",
      });
      setErrors({
        ...errors,
        userErrorMessage: inputValue === "" ? "Username is required" : "",
      });
    } else {
      const inputValue = e.target.value;
      setLogin({
        ...login,
        password: inputValue,
      });
      setIsValid({
        ...isValid,
        password: inputValue === "",
      });
      setErrors({
        ...errors,
        passwordErrorMessage: inputValue === "" ? "Password is required" : "",
      });
    }
  };
  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("usertoken");
  };
  const getCurrentPage = () => {
    return localStorage.getItem("currentPage");
  };
  useEffect(() => {
    setDisable(login.username == "" || login.password == "");
  }, [login]);
  useEffect(() => {
    const token = getTokenFromLocalStorage();
    const page = getCurrentPage();
    if (token) {
      if (page) {
        router.replace(page);
      } else {
        router.replace("/user");
      }
    } else {
      setLoading(false);
    }
  }, [router]);
  if (loading) {
    return null;
  }
  const handleSubmit = async () => {
    try {
      const param = {
        username: login.username,
        password: login.password,
        device_token: [],
      };
      if (login.username !== "" && login.password !== "") {
        const response = await postMethod(`login`, param);
        if (response?.data?.status === "success") {
          localStorage.setItem("usertoken", response.data.access_token);
          localStorage.setItem("userid", response.data.user_details.id);
          setOpenSnackbar(true);
          setMessage({ color: "#2E7D32", name: "Successfully logged in" });
          router.push("/user");
        } else {
          setOpenSnackbar(true);
          setMessage({ color: "#f44336", name: response.data.response });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = () => [setOpenSnackbar(false)];

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          item
          md={6}
          lg={6}
          sx={{ display: isSmallScreen ? "none" : "block" }}
        >
          <Box
            sx={{
              color: "white",
              position: "relative",
              background: "url('/img/loginbackground.svg')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "100%",
            }}
          >
            <Box
              component="img"
              src="/img/logo.svg"
              alt="logo"
              top={0}
              left={0}
            />
            <Box
              sx={{
                width: "100%",
                height: "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "500px", height: "auto" }}>
                <Typography
                  sx={{
                    fontSize: "50px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    lineHeight: "53px",
                    letterSpacing: "0.1px",
                  }}
                >
                  A social
                  <br />
                  <span>prediction app</span>
                </Typography>
                <Typography
                  sx={{
                    fontSize: "23px",
                    fontWeight: 500,
                    mt: 1,
                  }}
                >
                  where you can create questions and <br /> predictions based on
                  live matches.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={isSmallScreen ? 12 : 6}
          lg={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              padding: "40px",
              width: "400px",
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "18px",
                color: "#000000",
                marginTop: "30px",
              }}
            >
              Login to the Admin Panel
            </Typography>
            <Typography
              sx={{
                color: "#0042FF",
                fontWeight: 600,
                fontSize: "51px",
                marginBottom: "20px",
              }}
            >
              Welcome
            </Typography>
            <form>
              <Typography
                sx={{
                  color: "#000000",
                  fontWeight: 400,
                  fontSize: "14px",
                  marginBottom: "10px",
                }}
              >
                Username{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              </Typography>
              <TextField
                name="username"
                id="username"
                onChange={(event) => handleChange(event, "username")}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={isValid.username}
                helperText={
                  <Typography
                    style={{
                      marginTop: "0px",
                      marginLeft: "-10px",
                      fontSize: "15px",
                    }}
                  >
                    {isValid.username ? errors.userErrorMessage : ""}
                  </Typography>
                }
                variant="outlined"
                placeholder="Username"
                sx={styles.textfield}
              />
              <Typography
                sx={{
                  color: "#000000",
                  fontWeight: 400,
                  fontSize: "14px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                Password{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                onChange={(event) => handleChange(event, "password")}
                error={isValid.password}
                helperText={
                  <Typography
                    style={{
                      marginTop: "0px",
                      marginLeft: "-10px",
                      fontSize: "15px",
                    }}
                  >
                    {isValid.password ? errors.passwordErrorMessage : ""}
                  </Typography>
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon
                            sx={{ fontSize: "23px", color: "#8E8E8E" }}
                          />
                        ) : (
                          <VisibilityOutlinedIcon
                            sx={{ fontSize: "23px", color: "#8E8E8E" }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={styles.textfield}
              />
              {/* <Typography
                sx={{
                  color: "#0029FF",
                  fontSize: "12px",
                  fontWeight: 400,
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                Forgot password
              </Typography> */}
              <Button
                sx={{
                  background: "#0042FF !important",
                  color: "white",
                  width: "100%",
                  marginTop: "30px",
                  borderRadius: "9px",
                  textTransform: "none",
                }}
                variant="contained"
                disabled={disable}
                onClick={handleSubmit}
              >
                Login
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        openSnackerBar={openSnackbar}
        handleCloseSnackBar={handleClose}
        messageName={message}
      />
    </>
  );
}

export default Login;
