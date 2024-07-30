import React, { useState } from "react";
import { Box, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import DialogComponent from "./dialogComponent";
import { logoutMessage } from "../utilities/constants";

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

export default function Header() {
  const router = useRouter();
  const currentRoute = router?.pathname;
  let title = "";
  if (currentRoute === "/user") {
    title = "User List";
  } else if (currentRoute === "/questions") {
    title = "All Questions";
  } else if (currentRoute === "/offerQuestions") {
    title = "Offer Questions";
  } else if (currentRoute === "/shopOwners") {
    title = "Shop Owners";
  } else if (currentRoute === "/sports") {
    title = "Sports";
  } else if (currentRoute === "/team") {
    title = "Team";
  } else if (currentRoute === "/match") {
    title = "Match";
  } else if (currentRoute === "/tournament") {
    title = "Tournament";
  } else if (currentRoute === "/notification") {
    title = "Notification";
  } else if (currentRoute === "/advertisement") {
    title = "Advertisement";
  } else if (currentRoute === "/wishlist") {
    title = "Wishlist";
  } else if (currentRoute === "/reportedUsers") {
    title = "Reported Users";
  } else if (currentRoute === "/winCOD") {
    title = "Win COD";
  } else if (currentRoute === "/codOffers") {
    title = "COD Offers";
  }
  else if (currentRoute === "/upcomingEvents") {
    title = "Upcoming Events";
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const openMenu = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
    setLogout(false);
  };
  const handleMenuClick = () => {
    setAnchorEl(true);
    setOpen(true);
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setLogout(true);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleLogoutClick = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "98px",
          background: "#1B1B1B",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "0%", sm: "5%" },
            width: "50%",
          }}
        >
          <Box
            component="img"
            src="/img/logo.svg"
            alt="logo"
            sx={{
              paddingLeft: "10px",
              marginTop: "5px",
              width: { xs: "100px", sm: "185px" },
            }}
          />

          <Typography
            sx={{
              color: "white",
              fontWeight: 500,
              fontSize: "20px",
              // marginTop: { xs: "31px", sm: "24px" },
              letterSpacing: "1px",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            marginTop: "30px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: "10px", sm: "20px" },
            }}
          >
            <Avatar
              alt="bellIcon"
              src="/img/bellIcon.svg"
              sx={{
                width: { xs: "30px", sm: "45px" },
                height: { xs: "30px", sm: "45px" },
                marginTop: { xs: "-3px", sm: "-6px" },
              }}
            />
            <Box
              component="img"
              src="/img/logo2.png"
              alt="logo2"
              sx={{
                marginTop: { xs: "-6px", sm: "-8px" },
                width: { xs: "40px", sm: "55px" },
                height: { xs: "40px", sm: "55px" },
              }}
            />
          </Box>
          <>
            <Box
              component="img"
              src="/img/arrowIcon.svg"
              alt="arrowIcon"
              onClick={(e) => handleClick(e)}
              sx={{
                padding: "10px 20px 10px 10px",
                marginTop: "0px",
                width: { xs: "10px", sm: "20px" },
                height: { xs: "10px", sm: "20px" },
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{
                "& .MuiMenu-list": {
                  py: 0,
                },
              }}
            >
              <MenuItem
                onClick={handleMenuClick}
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#333333",
                  backgroundColor: "#FFFFFF !important",
                  borderBottom: "1px solid #DCDCDC",
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        </Box>
      </Box>

      <DialogComponent
        open={open}
        handleClose={handleCloseDialog}
        header="Confirm Logout"
        button={[{ name: "Logout", style: styles.ok }]}
        handleLogoutClick={handleLogoutClick}
        logout={logout}
        deleteMessage={logoutMessage}
      />
    </>
  );
}
