import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Box,
  Stack,
  TextField,
} from "@mui/material";
import health from "../../../Images/DashboardIcons/Vector.png";
import ScannerIcon from "@mui/icons-material/DocumentScanner"; // ✅ Scanner icon from MUI

const MapSection = () => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      background: "#F8FAFCB2",
      border: "2px solid #fff",
      height: "90%",
    }}
  >
    <CardContent sx={{ p: 1 }}>
      {/* ---------- Header ---------- */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={health} // ✅ replace with your map icon (like other cards)
              alt="Map Icon"
              sx={{ width: 14, height: 14, objectFit: "contain" }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#252539",
              fontSize: 15,
              fontFamily: "Roboto",
              // lineHeight: 1.2,
            }}
          >
            Map
          </Typography>
        </Stack>

        {/* ---------- Dropdown ---------- */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            select
            size="small"
            label="district"
            displayEmpty
            sx={{
              minWidth: { xs: 130, sm: 180, md: 200 },
              borderRadius: 2,
              bgcolor: "#f5f8ff",
              boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.05)",
              fontSize: 13,
              "& .MuiSelect-select": { py: 0.5, fontSize: 13 },
              "& fieldset": { border: "none" },
              color: "#252539 15%",
            }}
          >
            <MenuItem value="" sx={{ color: "#777" }} disabled>
              Select District
            </MenuItem>
            <MenuItem value="Aurangabad">Aurangabad</MenuItem>
            <MenuItem value="Jalna">Jalna</MenuItem>
            <MenuItem value="Nashik">Nashik</MenuItem>
          </TextField>

          {/* ✅ Scanner icon next to dropdown */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScannerIcon sx={{ color: "#fff", fontSize: 16 }} />
          </Box>
        </Stack>
      </Stack>

      {/* ---------- Map Container ---------- */}
      <Box
        sx={{
          mt: 1.5,
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #E5EAF2",
        }}
      >
        <iframe
          title="district-map"
          width="100%"
          height="270"
          style={{ border: 0 }}
          loading="lazy"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.533!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzM0LjIiTiA3MsKwNTInMzkuOCJF!5e0!3m2!1sen!2sin!4v1675699555000!5m2!1sen!2sin"
        ></iframe>
      </Box>
    </CardContent>
  </Card>
);

export default MapSection;
