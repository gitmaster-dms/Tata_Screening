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




// import React, { useEffect, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   MenuItem,
//   Box,
//   Stack,
//   TextField,
// } from "@mui/material";
// import health from "../../../Images/DashboardIcons/Vector.png";
// import ScannerIcon from "@mui/icons-material/DocumentScanner";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const MapSection = () => {
//   const mapRef = useRef(null);       // Leaflet map instance
//   const mapContainerRef = useRef(null); // DOM container

//   useEffect(() => {
//     if (!mapContainerRef.current || mapRef.current) return;

//     // Initialize map
//     mapRef.current = L.map(mapContainerRef.current).setView(
//       [19.0760, 72.8777], // Mumbai
//       10
//     );

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 19,
//     }).addTo(mapRef.current);

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <Card
//       sx={{
//         borderRadius: 3,
//         boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//         background: "#F8FAFCB2",
//         border: "2px solid #fff",
//       }}
//     >
//       <CardContent sx={{ p: 1 }}>
//         {/*Header */}
//         <Stack
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//           spacing={1}
//         >
//           <Stack direction="row" alignItems="center" spacing={0.5}>
//             <Box
//               sx={{
//                 width: 26,
//                 height: 26,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Box
//                 component="img"
//                 src={health}
//                 alt="Map Icon"
//                 sx={{ width: 14, height: 14, objectFit: "contain" }}
//               />
//             </Box>

//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 600,
//                 color: "#252539",
//                 fontSize: 15,
//                 fontFamily: "Roboto",
//               }}
//             >
//               Map
//             </Typography>
//           </Stack>

//           {/* Dropdown */}
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <TextField
//               select
//               size="small"
//               label="District"
//               sx={{
//                 minWidth: 150,
//                 borderRadius: 2,
//                 bgcolor: "#f5f8ff",
//                 boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.05)",
//                 fontSize: 13,
//                 "& .MuiSelect-select": { py: 0.5 },
//                 "& fieldset": { border: "none" },
//               }}
//             >
//               <MenuItem value="" disabled>
//                 Select District
//               </MenuItem>
//               <MenuItem value="Aurangabad">Aurangabad</MenuItem>
//               <MenuItem value="Jalna">Jalna</MenuItem>
//               <MenuItem value="Nashik">Nashik</MenuItem>
//             </TextField>

//             <Box
//               sx={{
//                 width: 28,
//                 height: 28,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <ScannerIcon sx={{ color: "#fff", fontSize: 16 }} />
//             </Box>
//           </Stack>
//         </Stack>

//         {/* Leaflet Map Container */}
//         <Box
//           sx={{
//             mt: 1.5,
//             borderRadius: "16px",
//             overflow: "hidden",
//             border: "1px solid #E5EAF2",
//           }}
//         >
//           <div
//             ref={mapContainerRef}
//             style={{ width: "100%", height: "270px" }}
//           ></div>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default MapSection;












import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Box,
  Stack,
  TextField,
} from "@mui/material";
import health from "../../../Images/DashboardIcons/Vector.png";
import ScannerIcon from "@mui/icons-material/DocumentScanner";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useSourceContext } from "../../../../contexts/SourceContext";
import workshopIconImg from "../../../Images/blue_marker.png";




const MapSection = () => {


const workshopIcon = L.icon({
  iconUrl: workshopIconImg,
  iconSize: [40, 40],      // adjust as you want
  iconAnchor: [20, 40],    // center bottom
  popupAnchor: [0, -40],
});




  //  GET CONTEXT VALUES
  const {
    workshops,
    dateFilter,
    setDateFilter,
    districtFilter,
    setDistrictFilter,
  } = useSourceContext()

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const workshopMarkers = useRef([]); // store dynamic markers

  // ⭐ INITIALIZE MAP
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(
      [19.0760, 72.8777], // Mumbai
      10
    );

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

 // UPDATE MAP MARKERS WHEN WORKSHOPS CHANGE
useEffect(() => {
  if (!mapRef.current) return;

  // Clear previous markers
  workshopMarkers.current.forEach(marker => marker.remove());
  workshopMarkers.current = [];

  // Add new markers
  workshops.forEach(item => {
    const marker = L.marker(
      [parseFloat(item.latitude), parseFloat(item.longitude)],
      { icon: workshopIcon }   // ⭐ USE YOUR CUSTOM ICON HERE
    ).addTo(mapRef.current);

    marker.bindPopup(`
      <b>${item.Workshop_name}</b><br/>
      ${item.ws_address}
    `);

    workshopMarkers.current.push(marker);
  });

}, [workshops]);


  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        background: "#F8FAFCB2",
        border: "2px solid #fff",
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
            <TextField
              select
              size="small"
              label="District"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              sx={{
                minWidth: 150,
                borderRadius: 2,
                bgcolor: "#f5f8ff",
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.05)",
                fontSize: 13,
                "& .MuiSelect-select": { py: 0.5 },
                "& fieldset": { border: "none" },
              }}
            >
              <MenuItem value={5}>Aurangabad</MenuItem>
              <MenuItem value={6}>Jalna</MenuItem>
              <MenuItem value={7}>Nashik</MenuItem>
            </TextField>

         
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
            style={{ width: "100%", height: "270px" }}
          ></div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MapSection;
