import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { eventNames } from "process";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#15151C !important",
    boxShadow: "0px 2px 6px 2px #00000026",
    color: "#49454F",
    width: "100%",
    borderRadius: "12px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    "&:before": {
      backgroundColor: "#F3EDF7 !important",
    },
  },
});
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    boxShadow: "0 0 0 2px #FFFFFF",
    fontSize: "50px",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      content: '""',
    },
  },
}));
const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 23,
  height: 23,
  // border: `2px solid ${theme.palette.background.paper}`,
}));

const styles = {
  name: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#101828",
  },
  view: {
    width: "59px",
    backgroundColor: "#0042FF !important",
    color: "#FFFFFF",
    border: "1px solid #0042FF",
    fontWeight: 500,
    fontSize: "10px",
    textTransform: "capitalize",
    boxShadow: "none",
  },
  tournament_name: {
    fontSize: "12px",
    fontWeight: 500,
  },
  action: {
    fontWeight: 500,
    fontSize: "10px",
    width: "59px",
    textTransform: "capitalize",
    boxShadow: "none",
  },
  message: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#676B72",
  },
};

export default function Tables({
  headers,
  data,
  headerMappings,
  handleClickDialog,
  questions,
  users,
  offerQuestions,
  shopOwners,
  match,
  reportedUsers,
  predefinedQuestion,
  upcomingEvents,
  notification,
}) {
  const [menuId, setMenuId] = useState("");
  const menu = ["Edit", "Suspend"];
  const upComingenu = ["Edit", "Unpublish", "Delete"];
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event, row) => {
    setMenuId(row.id);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (rowData, itm) => {
    console.log(rowData, itm, "handleMenuClick");
    if (itm === "Suspend") {
      handleClickDialog(itm, rowData);
      handleClose();
    } else {
      handleClickDialog(itm, rowData);
      handleClose();
    }
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const convertHtmlToPlainText = (html) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  };
  function removeInlineStyles(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll('*');
    
    elements.forEach(element => {
      element.removeAttribute('style');
    });
    
    return doc.body.innerHTML;
  }
  const formatDate = (dateString, withTime) => {
    const date = new Date(dateString);

    if (withTime) {
      // Get date part
      const datePart = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

      // Get time part with 12-hour format and AM/PM
      const timePart = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);

      // Combine date and time parts, ensuring AM/PM is capitalized
      return `${datePart} ${timePart
        .replace(" am", " AM")
        .replace(" pm", " PM")}`;
    } else {
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    }
  };
  return (
    <>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#FCFCFD" }}>
              {headers.map((header) => (
                <TableCell
                  key={header}
                  width={header.width}
                  align={header.align}
                  sx={{
                    color: "#667085",
                    fontWeight: 500,
                  }}
                >
                  {header.name}
                </TableCell>
              ))}
              {(questions || offerQuestions) && (
                <TableCell
                  width={questions ? "2px" : "4px"}
                  align="center"
                ></TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  align="center"
                  sx={{ borderBottom: "none" }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#202020",
                    }}
                  >
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{
                    backgroundColor: upcomingEvents
                      ? row.publish_status === false
                        ? "#FFE9E9"
                        : row.expired
                        ? "#EFEFEF"
                        : row.live
                        ? "#FFFFFF"
                        : ""
                      : "",
                  }}
                >
                  {headers.map((header, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      align={header.align}
                      sx={{
                        fontSize: header.size,
                        fontWeight: header.weight,
                        color: header.color,
                      }}
                    >
                      {header.name === "User Name" ||
                      header.name === "Created By" ||
                      header.name === "User" ||
                      header.name === "Shop Name" ||
                      header.name === "Tournament Image" ||
                      header.name === "Wishlist Image" ||
                      header.name === "Avatar" ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {header.name === "User Name" && (
                            <StyledBadge
                              overlap="circular"
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              variant="dot"
                              sx={{
                                "& .MuiBadge-badge": {
                                  backgroundColor:
                                    row.status === "Active"
                                      ? "#44b700"
                                      : "#bdbdbd",
                                  color:
                                    row.status === "Active"
                                      ? "#44b700"
                                      : "#bdbdbd",
                                },
                              }}
                            >
                              <Avatar
                                src={
                                  row.profile_pic
                                    ? row.profile_pic
                                    : "/img/photo.svg "
                                }
                                alt="Urgent Image"
                                sx={{ width: 45, height: 45 }}
                              />
                            </StyledBadge>
                          )}
                          {header.name === "Avatar" && (
                            <Badge
                              overlap="circular"
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              badgeContent={
                                row.modified_price != "Free" ? (
                                  <SmallAvatar
                                    alt="Remy Sharp"
                                    src="/img/paid.png"
                                  />
                                ) : null
                              }
                            >
                              <Avatar
                                alt="Avatar"
                                src={row.profile_pic}
                                sx={{
                                  width: 62,
                                  height: 62,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleClickDialog("image", row)}
                              />
                            </Badge>
                          )}
                          {(header.name === "Created By" ||
                            header.name === "User" ||
                            header.name === "Tournament Image" ||
                            header.name === "Wishlist Image") && (
                            <Avatar
                              src={row.profile_pic || "/img/photo.svg "}
                              alt="Urgent Image"
                              sx={{
                                width: 45,
                                height: 45,
                                cursor:
                                  header.name === "Tournament Image" ||
                                  header.name === "Wishlist Image"
                                    ? "pointer"
                                    : "default",
                              }}
                              onClick={
                                header.name === "Tournament Image" ||
                                header.name === "Wishlist Image"
                                  ? () => handleClickDialog("image", row)
                                  : undefined
                              }
                            />
                          )}
                          {header.name !== "Tournament Image" && (
                            <Box>
                              <Typography sx={styles.name}>
                                {row.username || row.user_name}
                              </Typography>
                              {(users || shopOwners || reportedUsers) && (
                                <Typography
                                  sx={{
                                    fontSize: header.size,
                                    fontWeight: header.weight,
                                    color: header.color,
                                  }}
                                >
                                  {row.email}
                                </Typography>
                              )}
                              {(users || reportedUsers) && (
                                <Typography
                                  sx={{
                                    fontSize: header.size,
                                    fontWeight: header.weight,
                                    color: header.color,
                                  }}
                                >
                                  {row.phone_number}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      ) : header.name === "Status" &&
                        (users || shopOwners || match || reportedUsers) ? (
                        <Chip
                          sx={{
                            color:
                              row.status === "Active" ||
                              row.status === "Approved" ||
                              row.status === "completed"
                                ? "#027A48"
                                : row.status === "Rejected" ||
                                  row.status === "Pending"
                                ? "#4C4C4C"
                                : "#344054",
                            background:
                              row.status === "Active" ||
                              row.status === "Approved" ||
                              row.status === "completed"
                                ? "#ECFDF3"
                                : row.status === "Rejected"
                                ? "#FFD6D6"
                                : row.status === "Pending"
                                ? "#DBDFFF"
                                : "",
                          }}
                          icon={
                            <FiberManualRecordIcon
                              sx={{
                                fontSize: "10px",
                                color:
                                  row.status === "Active" ||
                                  row.status === "Approved" ||
                                  row.status === "completed"
                                    ? "#12B76A !important"
                                    : row.status === "Rejected"
                                    ? "#FE1414 !important"
                                    : row.status === "Pending"
                                    ? "#1223B7 !important"
                                    : "#344054 !important",
                              }}
                            />
                          }
                          label={row.status === null ? "Created" : row.status}
                        />
                      ) : header.name === "Question" &&
                        (questions || offerQuestions || predefinedQuestion) ? (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: header.size,
                              fontWeight: header.weight,
                              color: header.color,
                            }}
                          >
                            {row[headerMappings[header.name]]}
                          </Typography>
                          {questions && (
                            <Typography
                              sx={{
                                fontSize: "10px",
                                fontWeight: 500,
                                color: "#0042FF",
                                textDecoration: "underline",
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                              onClick={() => handleClickDialog("view", row)}
                            >
                              View Options
                            </Typography>
                          )}
                          {predefinedQuestion && (
                            <Box sx={{ display: "flex" }}>
                              {row.options.map((opt, index) => (
                                <Box
                                  key={opt.key}
                                  sx={{
                                    backgroundColor: "#E8DEF8",
                                    height: "10px",
                                    minWidth: "50px",
                                    borderRadius: "5px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mr: "5px",
                                    p: "5px",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "10px",
                                      fontWeight: 500,
                                      color: "#1D192B",
                                    }}
                                  >
                                    {opt.value}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ) : header.name === "Winners" ? (
                        <Button
                          variant="contained"
                          onClick={() => handleClickDialog("winners", row)}
                          sx={styles.view}
                        >
                          View
                        </Button>
                      ) : header.name === "Match & Tournament" ? (
                        row[headerMappings[header.name]] ? (
                          <Box>
                            <Typography
                              sx={{
                                fontSize: header.size,
                                fontWeight: header.weight,
                                color: header.color,
                              }}
                            >
                              {row[headerMappings[header.name]]}
                            </Typography>
                            <Typography
                              sx={{
                                ...styles.tournament_name,
                                color: "#0042FF",
                              }}
                            >
                              {row.tournament_name}
                            </Typography>
                            <Typography
                              sx={{
                                ...styles.tournament_name,
                                color: "#969696",
                              }}
                            >
                              {`${row.match_date}, ${row.match_time} `}
                              <Typography
                                component="span"
                                sx={{
                                  ...styles.tournament_name,
                                  color: "#0042FF",
                                }}
                              >
                                {`(${capitalizeFirstLetter(row.type)})`}
                              </Typography>
                            </Typography>
                          </Box>
                        ) : (
                          "N/A"
                        )
                      ) : header.name === "Attach" ? (
                        row[headerMappings[header.name]] ? (
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <Box
                              component="img"
                              src={
                                row.team_flag ||
                                row.image_url ||
                                row.thumbnail_url ||
                                "/img/attchment.png"
                              }
                              alt="teamflag"
                              onClick={
                                header.name === "Image" ||
                                header.name === "Thumbnail" ||
                                row.image_url
                                  ? () => handleClickDialog("image_url", row)
                                  : undefined
                              }
                              sx={{
                                width:
                                  header.name === "Team Flag"
                                    ? "43px"
                                    : header.name === "Thumbnail"
                                    ? "70px"
                                    : "41px",
                                height:
                                  header.name === "Team Flag"
                                    ? "30px"
                                    : header.name === "Thumbnail"
                                    ? "48px"
                                    : "41px",
                                borderRadius:
                                  header.name === "Team Flag" ? "" : "10px",
                                cursor:
                                  header.name === "Image" ||
                                  header.name === "Thumbnail" ||
                                  header.name === "Attach"
                                    ? "pointer"
                                    : "default",
                              }}
                            />
                            <Box
                              component="img"
                              src="/img/close_attachment.png" // Replace with the actual path to your close button image
                              alt="close"
                              onClick={() =>
                                handleClickDialog("remove_poster", row)
                              }
                              sx={{
                                position: "absolute",
                                top: "15px",
                                right: "-35px",
                                width: "16px",
                                height: "16px",
                                cursor: "pointer",
                              }}
                            />
                          </Box>
                        ) : (
                          <Box
                            component="img"
                            src={"/img/attchment.png"}
                            alt="teamflag"
                            onClick={
                              header.name === "Attach" ||
                              header.name === "Thumbnail" ||
                              header.name === "Attach"
                                ? () => handleClickDialog("image", row)
                                : undefined
                            }
                            sx={{
                              width:
                                header.name === "Team Flag"
                                  ? "43px"
                                  : header.name === "Thumbnail"
                                  ? "70px"
                                  : header.name === "Attach"
                                  ? "33px"
                                  : "41px",

                              height:
                                header.name === "Team Flag"
                                  ? "30px"
                                  : header.name === "Thumbnail"
                                  ? "48px"
                                  : header.name === "Attach"
                                  ? "25px"
                                  : "41px",
                              borderRadius:
                                header.name === "Team Flag" ||
                                header.name === "Attach"
                                  ? ""
                                  : "10px",
                              cursor:
                                header.name === "Image" ||
                                header.name === "Thumbnail" ||
                                header.name === "Attach"
                                  ? "pointer"
                                  : "default",
                            }}
                          />
                        )
                      ) : header.name === "Sort Winners" &&
                        row.status == "completed" &&
                        row.offer_notification_status == null ? (
                        <Button
                          variant="contained"
                          onClick={() => handleClickDialog("sort", row)}
                          sx={styles.view}
                        >
                          Sortout
                        </Button>
                      ) : header.name === "Action" ? (
                        <Box
                          sx={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            justifyContent: header.align,
                          }}
                        >
                          {row.action?.map((obj, index) => (
                            <Button
                              key={index}
                              variant="contained"
                              onClick={() => handleClickDialog(obj[1], row)}
                              sx={{
                                ...styles.action,
                                backgroundColor: obj[2],
                              }}
                            >
                              {obj[1]}
                            </Button>
                          ))}
                        </Box>
                      ) : header.name === "Team Flag" ||
                        header.name === "Image" ||
                        header.name === "Thumbnail" ||
                        header.name === "Poster" ? (
                        <Box
                          component="img"
                          src={
                            row.team_flag ||
                            row.image_url ||
                            row.thumbnail_url ||
                            row.event_url ||
                            "/img/photo.svg "
                          }
                          alt="teamflag"
                          onClick={
                            header.name === "Image" ||
                            header.name === "Thumbnail" ||
                            header.name === "Poster"
                              ? () => handleClickDialog("poster", row)
                              : undefined
                          }
                          sx={{
                            width:
                              header.name === "Team Flag"
                                ? "43px"
                                : header.name === "Thumbnail"
                                ? "70px"
                                : "41px",
                            height:
                              header.name === "Team Flag"
                                ? "30px"
                                : header.name === "Thumbnail"
                                ? "48px"
                                : "41px",
                            borderRadius:
                              header.name === "Team Flag" ? "" : "10px",
                            cursor:
                              header.name === "Image" ||
                              header.name === "Thumbnail" ||
                              header.name === "Poster"
                                ? "pointer"
                                : "default",
                          }}
                        />
                      ) : header.name === "Match Date & Time" ? (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: header.size,
                              fontWeight: header.weight,
                              color: header.color,
                            }}
                          >
                            {row[headerMappings[header.name]]}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: header.size,
                              fontWeight: header.weight,
                              color: header.color,
                              mt: "2px",
                            }}
                          >
                            {row.match_time}
                          </Typography>
                        </Box>
                      ) : header.name === "Notification" ? (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: header.size,
                              fontWeight: header.weight,
                              color: header.color,
                            }}
                          >
                            {row[headerMappings[header.name]]}
                          </Typography>
                          <Typography sx={styles.message}>
                            {row.message}
                          </Typography>
                        </Box>
                      ) : header.name === "Date/Time" ? (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: header.size,
                              fontWeight: header.weight,
                              color: header.color,
                            }}
                          >
                            {row[headerMappings[header.name]]}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: header.size,
                              fontWeight: header.weight,
                              color: header.color,
                            }}
                          >
                            {row.notification_time}
                          </Typography>
                        </Box>
                      ) : header.name === "Advertisement" ? (
                        <Box
                          component={
                            row.advertisement_url.endsWith(".mp4")
                              ? "video"
                              : "img"
                          }
                          src={row.advertisement_url}
                          alt="advertisement"
                          onClick={() =>
                            handleClickDialog(
                              row.advertisement_url.endsWith(".mp4")
                                ? "video"
                                : "image",
                              row
                            )
                          }
                          sx={{
                            width: "70px",

                            height: "48px",

                            borderRadius: "10px",
                            cursor: "pointer",
                          }}
                        />
                      ) : header.name === "Status" && questions ? (
                        <Typography
                          sx={{
                            color: row?.delete_status ? "#D42600" : "#101828",
                          }}
                          onClick={
                            row?.delete_status
                              ? () => handleClickDialog("showReason", row)
                              : undefined
                          }
                        >
                          {row?.delete_status
                            ? "Suspended"
                            : capitalizeFirstLetter(row?.status)}
                        </Typography>
                      ) : header.name === "Created Date" ? (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#101828",
                              lineHeight: "20px",
                            }}
                          >
                            {formatDate(
                              row[headerMappings[header.name]],
                              false
                            )}
                          </Typography>
                        </Box>
                      ) : header.name === "Event Date/time" ? (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#101828",
                              lineHeight: "20px",
                            }}
                          >
                            {formatDate(row[headerMappings[header.name]], true)}
                          </Typography>
                        </Box>
                      ) : header.name === "Event Name" ? (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#101828",
                              lineHeight: "20px",
                            }}
                          >
                            {row[headerMappings[header.name]]}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#838383",
                              lineHeight: "20px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 1, // Limit to one line
                              WebkitBoxOrient: "vertical",
                              position: "relative", // Ensures icon is positioned correctly
                            }}
                          >
                            <div style={{width:"90%"}}
                              dangerouslySetInnerHTML={{
                                __html:removeInlineStyles(row?.description_details?.split("\n")[0]) , // Render only the first line
                              }}
                            />
                          <CustomTooltip
                              title={
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: row?.description_details,
                                  }}
                                />
                              }
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: 13,
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: "8px",
                                }}
                              >
                                <img
                                  src="/img/upcoming_details.svg"
                                  alt="Upcoming Details Icon"
                                  style={{ width: "17px", height: "17px" }}
                                />
                              </span>
                            </CustomTooltip>
                          </Typography>
                        
                        </Box>
                      ) : (
                        row[headerMappings[header.name]] || "N/A"
                      )}
                    </TableCell>
                  ))}
                  {questions  && (
                    <>
                      <TableCell>
                        <IconButton onClick={(e) => handleClick(e, row)}>
                          <MoreVertIcon
                            sx={{ color: "#000000", fontSize: "20px" }}
                          />
                        </IconButton>
                      </TableCell>
                      {menuId == row.id && (
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
                          {menuId == row.id &&
                            menu.map((item, index) => (
                              <MenuItem
                                key={item}
                                disabled={
                                  row?.delete_status && item === "Suspend"
                                    ? true
                                    : false
                                }
                                onClick={() => handleMenuClick(row, item)}
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: index == 0 ? "#000000" : "#D42600",
                                  borderBottom: "1px solid #DCDCDC",
                                }}
                              >
                                {item}
                              </MenuItem>
                            ))}
                        </Menu>
                      )}
                    </>
                  )}
                     {upcomingEvents  && (
                    <>
                      <TableCell>
                        <IconButton onClick={(e) => handleClick(e, row)}>
                          <MoreVertIcon
                            sx={{ color: "#000000", fontSize: "20px" }}
                          />
                        </IconButton>
                      </TableCell>
                      {menuId == row.id && (
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
                          {menuId == row.id &&
                            upComingenu.map((item, index) => (
                              <MenuItem
                                key={item}
                                disabled={
                                  row?.delete_status && item === "Suspend"
                                    ? true
                                    : false
                                }
                                onClick={() => handleMenuClick(row, item)}
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: index == 2 ?"#D42600": "#000000"  ,
                                  borderBottom: "1px solid #DCDCDC",
                                }}
                              >
                                {item}
                              </MenuItem>
                            ))}
                        </Menu>
                      )}
                    </>
                  )}
                   {notification && (
                    <>
                      <TableCell>
                        <IconButton onClick={(e) => handleClick(e, row)}>
                          <MoreVertIcon
                            sx={{ color: "#000000", fontSize: "20px" }}
                          />
                        </IconButton>
                      </TableCell>
                      {menuId == row.id && (
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
                          {menuId == row.id &&
                            menu.map((item, index) => (
                              <MenuItem
                                key={item}
                                disabled={
                                  row?.delete_status && item === "Suspend"
                                    ? true
                                    : false
                                }
                                onClick={() => handleMenuClick(row, item)}
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: index == 0 ? "#000000" : "#D42600",
                                  borderBottom: "1px solid #DCDCDC",
                                }}
                              >
                                {item}
                              </MenuItem>
                            ))}
                        </Menu>
                      )}
                    </>
                  )}
                  {offerQuestions && (
                    <TableCell>
                      {/* <Box component="img" src="/img/delete1.png" alt="deletequestion" sx={{width:"15px",height:"15px"}}/> */}
                      <IconButton
                        sx={{ p: 0 }}
                        onClick={() => handleMenuClick(row, "Delete")}
                      >
                        <DeleteOutlineOutlinedIcon
                          sx={{ fontSize: "20px", color: "#000000" }}
                        />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
