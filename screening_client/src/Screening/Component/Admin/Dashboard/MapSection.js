// import React from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Select,
//   MenuItem,
//   Box,
//   Stack,
//   TextField,
// } from "@mui/material";
// import health from "../../../Images/DashboardIcons/Vector.png";
// import ScannerIcon from "@mui/icons-material/DocumentScanner"; // ✅ Scanner icon from MUI

// const MapSection = () => (
//   <Card
//     sx={{
//       borderRadius: 3,
//       boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//       background: "#F8FAFCB2",
//       border: "2px solid #fff",
//       height: "90%",
//     }}
//   >
//     <CardContent sx={{ p: 1 }}>
//       {/* ---------- Header ---------- */}
//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         spacing={1}
//       >
//         <Stack direction="row" alignItems="center" spacing={0.5}>
//           <Box
//             sx={{
//               width: 26,
//               height: 26,
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Box
//               component="img"
//               src={health} // ✅ replace with your map icon (like other cards)
//               alt="Map Icon"
//               sx={{ width: 14, height: 14, objectFit: "contain" }}
//             />
//           </Box>

//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 600,
//               color: "#252539",
//               fontSize: 15,
//               fontFamily: "Roboto",
//               // lineHeight: 1.2,
//             }}
//           >
//             Map
//           </Typography>
//         </Stack>

//         {/* ---------- Dropdown ---------- */}
//         <Stack direction="row" alignItems="center" spacing={1}>
//           <TextField
//             select
//             size="small"
//             label="district"
//             displayEmpty
//             sx={{
//               minWidth: { xs: 130, sm: 180, md: 200 },
//               borderRadius: 2,
//               bgcolor: "#f5f8ff",
//               boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.05)",
//               fontSize: 13,
//               "& .MuiSelect-select": { py: 0.5, fontSize: 13 },
//               "& fieldset": { border: "none" },
//               color: "#252539 15%",
//             }}
//           >
//             <MenuItem value="" sx={{ color: "#777" }} disabled>
//               Select District
//             </MenuItem>
//             <MenuItem value="Aurangabad">Aurangabad</MenuItem>
//             <MenuItem value="Jalna">Jalna</MenuItem>
//             <MenuItem value="Nashik">Nashik</MenuItem>
//           </TextField>

//           {/* ✅ Scanner icon next to dropdown */}
//           <Box
//             sx={{
//               width: 28,
//               height: 28,
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ScannerIcon sx={{ color: "#fff", fontSize: 16 }} />
//           </Box>
//         </Stack>
//       </Stack>

//       {/* ---------- Map Container ---------- */}
//       <Box
//         sx={{
//           mt: 1.5,
//           borderRadius: "16px",
//           overflow: "hidden",
//           border: "1px solid #E5EAF2",
//         }}
//       >
//         <iframe
//           title="district-map"
//           width="100%"
//           height="270"
//           style={{ border: 0 }}
//           loading="lazy"
//           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.533!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzM0LjIiTiA3MsKwNTInMzkuOCJF!5e0!3m2!1sen!2sin!4v1675699555000!5m2!1sen!2sin"
//         ></iframe>
//       </Box>
//     </CardContent>
//   </Card>
// );

// export default MapSection;

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Box,
  Stack,
  TextField,
  Select,
} from "@mui/material";
import health from "../../../Images/DashboardIcons/Vector.png";
import ScannerIcon from "@mui/icons-material/DocumentScanner";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useSourceContext } from "../../../../contexts/SourceContext";
import workshopIconImg from "../../../Images/car-workshop.png";
import axios from "axios";
const MapSection = ({ selectedState }) => {
  const port = process.env.REACT_APP_API_KEY;
  const [districtList, setDistrictList] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  console.log(selectedDistrict, "selectedDistrict");

  // 👇 Fetch districts when selectedState changes
  useEffect(() => {
    if (selectedState) {
      getDistricts(selectedState);
    }
  }, [selectedState]);

  const getDistricts = async (stateId) => {
    try {
      const response = await axios.get(
        `${port}/Screening/District_Get/${stateId}/`
      );
      console.log("District List:", response.data);

      setDistrictList(response.data || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const workshopIcon = L.icon({
    iconUrl: workshopIconImg,
    iconSize: [20, 20], // adjust as you want
    iconAnchor: [20, 40], // center bottom
    popupAnchor: [0, -40],
  });

  //  GET CONTEXT VALUES
  const {
    workshops,
    dateFilter,
    setDateFilter,
    districtFilter,
    setDistrictFilter,
  } = useSourceContext();

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const workshopMarkers = useRef([]); // store dynamic markers

  // INITIALIZE MAP
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      attributionControl: false, // 🚀 disable Leaflet attribution
    }).setView([19.076, 72.8777], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!dateFilter) {
      console.log("No tab selected → No markers displayed");
      return;
    }
    // Clear previous markers
    workshopMarkers.current.forEach((marker) => marker.remove());
    workshopMarkers.current = [];

    const bounds = L.latLngBounds([]);

    // Add new markers & extend bounds
    workshops.forEach((item) => {
      const lat = parseFloat(item.latitude);
      const lon = parseFloat(item.longitude);

      const marker = L.marker([lat, lon], { icon: workshopIcon }).addTo(
        mapRef.current
      ).bindPopup(`
        <b>${item.Workshop_name}</b><br/>
        ${item.ws_address}
      `);

      workshopMarkers.current.push(marker);

      // extend map bounds
      bounds.extend([lat, lon]);
    });

    // Fit map to marker bounds (only if there is data)
    if (workshops.length > 0) {
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50], // smooth zoom with padding
      });
    }
  }, [workshops]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        background: "#F8FAFCB2",
        border: "2px solid #fff",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 1 }}>
        {/*HEADER */}
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
                src={health}
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
              }}
            >
              Map
            </Typography>
          </Stack>

          {/* FILTERS */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* DISTRICT FILTER */}
            <Select
              size="small"
              fullWidth
              displayEmpty
              value={selectedDistrict}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDistrict(value); // UI update
                setDistrictFilter(value); // CONTEXT update (important)
                console.log("District Selected →", value);
              }}
              inputProps={{ "aria-label": "Select District" }}
              sx={{
                height: "2.5rem",
                width: "100%",
                "& .MuiInputBase-input": {
                  color: `#9e9e9e !important`,
                },
                "& .MuiInputBase-root": {
                  height: "100%",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                },
                borderRadius: "12px",
                "& fieldset": {
                  border: "none",
                },
                backgroundColor: "#fff",
                "& input::placeholder": {
                  fontSize: "0.85rem",
                  color: ` #9e9e9e!important`,
                },
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <MenuItem value="" disabled>
                Select District
              </MenuItem>

              {districtList.map((dist) => (
                <MenuItem key={dist.dist_id} value={dist.dist_id}>
                  {dist.dist_name}
                </MenuItem>
              ))}
            </Select>

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

        {/* Leaflet Map */}
        <Box
          sx={{
            mt: 1.5,
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #E5EAF2",
          }}
        >
          <div
            ref={mapContainerRef}
            style={{ width: "100%", height: "230px" }}
          ></div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MapSection;
