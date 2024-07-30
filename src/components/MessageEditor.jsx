import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Box,
  Popover,
  FormControl,
  Typography,
} from "@mui/material";
import { SketchPicker } from "react-color";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const alignmentOptions = [
  { value: "left", label: "Left", icon: <FormatAlignLeftIcon sx={{ fontSize: "16px" }} /> },
  { value: "center", label: "Center", icon: <FormatAlignCenterIcon sx={{ fontSize: "16px" }} /> },
  { value: "right", label: "Right", icon: <FormatAlignRightIcon sx={{ fontSize: "16px" }} /> },
];

const fontSizeOptions = [
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
  { value: "small", label: "Small" },
];

const formats = [
  "bold", "italic", "underline", "strike", "list", "bullet", "indent", "link", "image", "color", "size", "align",
];

// Function to check if the color is visible on black background
const isVisibleOnBlack = (hex) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 127; // Adjust threshold as needed
};

const MessageEditor = ({ onEditorChange, placeholder, data }) => {
  const [editorState, setEditorState] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [alignment, setAlignment] = useState("left");
  const [formatsApplied, setFormatsApplied] = useState([]);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [currentColor, setCurrentColor] = useState("white");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setEditorState(data);
  }, [data]);

  const handleUndo = () => {
    const quill = quillRef.current.getEditor();
    quill.history.undo();
  };

  const handleRedo = () => {
    const quill = quillRef.current.getEditor();
    quill.history.redo();
  };

  const handleFontSelection = (font) => {
    const quill = quillRef.current.getEditor();
    setFontSize(font);
    const size = font !== "normal" ? font : "";
    quill.format("size", size);
    updateFormatsApplied(quill.getFormat());
  };

  const handleAlignment = (event) => {
    const quill = quillRef.current.getEditor();
    const alignment = event.target.value;
    quill.format("align", false);
    quill.format("align", alignment);
    setAlignment(alignment);
  };

  const handleOpenColorPicker = (event) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleCloseColorPicker = () => {
    setColorPickerAnchor(null);
  };

  const handleColorChange = (color) => {
    if (isVisibleOnBlack(color.hex)) {
        setCurrentColor(color.hex);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
            quill.format("color", color.hex);
        } else {
            quill.format("color", color.hex);
        }
        setColorPickerAnchor(null);
    } else {
        setFeedbackMessage("Selected color is not visible against a black background. Please choose a lighter color.");
    }
  };

  const handleTextFormatting = (format) => {
    const quill = quillRef.current.getEditor();
    if (format === "size") {
      const size = fontSize !== "normal" ? fontSize : "";
      quill.format("size", size);
    } else {
      quill.format(format, !quill.getFormat()[format]);
    }
    updateFormatsApplied(quill.getFormat());
  };

  const handleListType = (type) => {
    const quill = quillRef.current.getEditor();
    quill.format("list", type === "bullet" ? "bullet" : "ordered");
  };

  const updateFormatsApplied = (currentFormat) => {
    const activeFormats = formats.filter((format) => currentFormat[format]);
    setFormatsApplied(activeFormats);
  };

  const handleChange = (value) => {
    if (value.length > 500) {
      setFeedbackMessage("Maximum allowed characters is 500");
    } else {
      setFeedbackMessage("");
    }
    setEditorState(value);
    onEditorChange(value);
  };

  const quillRef = useRef();

  return (
    <Box>
      <Toolbar
        id="toolbar"
        sx={{ borderBottom: "1px solid #ddd", padding: "8px" }}
      >
        <Tooltip title="Undo">
          <IconButton onClick={handleUndo}>
            <UndoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton onClick={handleRedo}>
            <RedoIcon />
          </IconButton>
        </Tooltip>
        <Select
          value={fontSize}
          onChange={(e) => handleFontSelection(e.target.value)}
          sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
        >
          {fontSizeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormControl variant="outlined">
          <Select
            value={alignment}
            onChange={handleAlignment}
            sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
          >
            {alignmentOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {option.icon}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Text Color">
        <IconButton onClick={handleOpenColorPicker} sx={{margin:"0px 8px"}}>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
     
      borderRadius: '4px',
      height:" 17px",
    width: "17px",
    }}
  >
    <div
      style={{
        width: '20px',
        height: '20px',
        backgroundColor: currentColor || 'transparent',
        borderRadius: '4px',
        paddingRight: '18px', // Adjust this value for the desired gap
      }}
    ></div>
    <ArrowDropDownIcon style={{ color: 'black' }} />
  </div>
</IconButton>

        </Tooltip>
        <Popover
          open={Boolean(colorPickerAnchor)}
          anchorEl={colorPickerAnchor}
          onClose={handleCloseColorPicker}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <SketchPicker color={currentColor} onChange={handleColorChange} />
        </Popover>
        <Tooltip title="Bold">
          <IconButton
            onClick={() => handleTextFormatting("bold")}
            color={formatsApplied.includes("bold") ? "primary" : "default"}
            sx={{margin:"0px 4px"}}
          >
            <FormatBoldIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton
            onClick={() => handleTextFormatting("italic")}
            color={formatsApplied.includes("italic") ? "primary" : "default"}
            sx={{margin:"0px 4px"}}
          >
            <FormatItalicIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton
            onClick={() => handleTextFormatting("underline")}
            color={formatsApplied.includes("underline") ? "primary" : "default"}
            sx={{margin:"0px 4px"}}
          >
            <FormatUnderlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Strikethrough">
          <IconButton
            onClick={() => handleTextFormatting("strike")}
            color={formatsApplied.includes("strike") ? "primary" : "default"}
            sx={{margin:"0px 4px"}}
          >
            <StrikethroughSIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bulleted List">
          <IconButton onClick={() => handleListType("bullet")} sx={{margin:"0px 4px"}}>
            <FormatListBulletedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <IconButton onClick={() => handleListType("number")} sx={{margin:"0px 4px"}}>
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      {isClient && (
        <ReactQuill
          ref={quillRef}
          value={editorState}
          onChange={handleChange}
          modules={{ toolbar: "#toolbar" }}
          formats={formats}
          placeholder={placeholder}
          style={{
            height: "300px",
            maxWidth: "492px",
            overflowWrap: "break-word",
            backgroundColor: "#000000",
            color: "#ffffff",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      )}
      {feedbackMessage && (
        <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
          {feedbackMessage}
        </Typography>
      )}
    </Box>
  );
};

export default MessageEditor;
