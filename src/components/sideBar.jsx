import React, { useEffect, useState } from "react";
import { Box, List, ListItemText, ListItemIcon, ListItem } from "@mui/material";
import { useRouter } from "next/router";
import UpcomingEvents from "../pages/upcomingEvents";

export default function SideBar() {
  const router = useRouter();
  const pageIndices = {
    winCOD: 0,
    predefinedQuestion: 1,
    codOffers: 2,
    user: 3,
    questions: 4,
    offerQuestions: 5,
    shopOwners: 6,
    tournament: 7,
    notification: 8,
    sports: 9,
    team: 10,
    match: 11,
    advertisement: 12,
    UpcomingEvents:13,
    avatar: 14,
    gallery: 15,
    wishlist: 16,
    reportedUsers: 17,
    reportedUsers: 18,
  };
  const currentRoute = router?.pathname ? router.pathname.slice(1) : "";
  const [selectedItem, setSelectedItem] = useState(pageIndices[currentRoute]);

  const handleItemClick = (item, index) => {
    setSelectedItem(index);
    const formattedItem = item.replace(/\s+/g, "");
    const itemPath = `/${formattedItem
      .charAt(0)
      .toLowerCase()}${formattedItem.slice(1)}`;
    router.push(itemPath);
  };
  useEffect(() => {
    setSelectedItem(pageIndices[currentRoute]);
  }, [currentRoute]);

  const getIcon = (name) => <img src={name} width={22} height={22} alt="" />;
  const navConfig = [
    {
      title: "Win COD",
      icon: getIcon("/img/wincod.png"),
    },
    {
      title: "Predefined Question",
      icon: getIcon("/img/predefinedIcon.svg"),
    },
    {
      title: "Cod Offers",
      icon: getIcon("/img/wincod.png"),
    },
    {
      title: "User",
      icon: getIcon("/img/userIcon.svg"),
    },
    {
      title: "Questions",
      icon: getIcon("/img/questionsIcon.svg"),
    },
    {
      title: "Offer Questions",
      icon: getIcon("/img/offerIcon.svg"),
    },
    {
      title: "Shop Owners",
      icon: getIcon("/img/shopIcon.svg"),
    },
    {
      title: "Tournament",
      icon: getIcon("/img/tournamentIcon.svg"),
    },
    {
      title: "Notification",
      icon: getIcon("/img/notificationIcon.svg"),
    },
    {
      title: "Sports",
      icon: getIcon("/img/sportsIcon.svg"),
    },
    {
      title: "Team",
      icon: getIcon("/img/teamIcon.svg"),
    },
    {
      title: "Match",
      icon: getIcon("/img/matchIcon.svg"),
    },
    {
      title: "Upcoming Events",
      icon: getIcon("/img/upcoming.svg"),
    },
    {
      title: "Advertisement",
      icon: getIcon("/img/advertisementIcon.svg"),
    },
    {
      title: "Avatar",
      icon: getIcon("/img/avatarIcon.svg"),
    },
    {
      title: "Gallery",
      icon: getIcon("/img/galleryIcon.svg"),
    },
    {
      title: "Wishlist",
      icon: getIcon("/img/wishlistIcon.svg"),
    },
    {
      title: "Reported Users",
      icon: getIcon("/img/reportedIcon.svg"),
    },
   
  ];
  return (
    <Box
      sx={{
        width: "260px",
        background: "#1B1B1B",
        position: "fixed",
        top: "98px",
        left: 0,
        bottom: 0,
        overflowY: "auto", // Enable vertical scrolling if needed
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "100px",
          border: "3px solid transparent",
          backgroundClip: "content-box",
          height: "58px",
          backgroundColor: "#c1c1c1 !important",
        },
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track-piece": {
          borderLeft: "1px solid rgba(0,0,0,0.12)",
        },
      }}
    >
      <List
        sx={{
          paddingTop: "0px",
        }}
      >
        {navConfig?.map((item, index) => (
          <ListItem
            key={item?.title}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedItem == index ? "#0042FF" : "",
            }}
            onClick={() => handleItemClick(item?.title, index)}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>{item.icon}</ListItemIcon>
            <ListItemText
              sx={{
                color: "white",
              }}
            >
              {item?.title}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
