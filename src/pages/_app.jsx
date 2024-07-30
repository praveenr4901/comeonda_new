import React from "react";
import "../styles/globals.css";
import Header from "../components/header";
import SideBar from "../components/sideBar";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/";
  // const token = localStorage.getItem("usertoken");

  // useEffect(()=>{

  // },[])

  return isLoginPage ? (
    <Component {...pageProps} />
  ) : (
    <React.Fragment>
      <Header />
      <Box
        sx={{
          display: "flex",
          backgroundColor: router.pathname == "/winCOD" ? "#f5f7fa" : "",
        }}
      >
        <SideBar />
        <Component
          {...pageProps}
          sx={{
            overflowY: "auto", // Enable vertical scrolling if needed
          }}
        />
      </Box>
    </React.Fragment>
  );
}

export default MyApp;
