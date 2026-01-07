// import React, { useEffect, useRef, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   MenuItem,
//   Box,
//   Stack,
//   TextField,
//   Select,
// } from "@mui/material";
// import health from "../../../Images/DashboardIcons/Vector.png";
// import ScannerIcon from "@mui/icons-material/DocumentScanner";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import { useSourceContext } from "../../../../contexts/SourceContext";
// import workshopIconImg from "../../../Images/car-workshop.png";
// import axios from "axios";
// const MapSection = ({ selectedState }) => {
//   const port = process.env.REACT_APP_API_KEY;
//   const [districtList, setDistrictList] = useState([]);

//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   console.log(selectedDistrict, "selectedDistrict");

//   // 👇 Fetch districts when selectedState changes
//   useEffect(() => {
//     if (selectedState) {
//       getDistricts(selectedState);
//     }
//   }, [selectedState]);

//   const getDistricts = async (stateId) => {
//     try {
//       const response = await axios.get(
//         `${port}/Screening/District_Get/${stateId}/`
//       );
//       console.log("District List:", response.data);

//       setDistrictList(response.data || []);
//     } catch (error) {
//       console.error("Error fetching districts:", error);
//     }
//   };

//   const workshopIcon = L.icon({
//     iconUrl: workshopIconImg,
//     iconSize: [20, 20], // adjust as you want
//     iconAnchor: [20, 40], // center bottom
//     popupAnchor: [0, -40],
//   });

//   //  GET CONTEXT VALUES
//   const {
//     workshops,
//     dateFilter,
//     setDateFilter,
//     districtFilter,
//     setDistrictFilter,
//   } = useSourceContext();

//   const mapRef = useRef(null);
//   const mapContainerRef = useRef(null);
//   const workshopMarkers = useRef([]); // store dynamic markers

//   // INITIALIZE MAP
//   useEffect(() => {
//     if (!mapContainerRef.current || mapRef.current) return;

//     mapRef.current = L.map(mapContainerRef.current, {
//       attributionControl: false, // 🚀 disable Leaflet attribution
//     }).setView([19.076, 72.8777], 8);

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

//   useEffect(() => {
//     if (!mapRef.current) return;
//     if (!dateFilter) {
//       console.log("No tab selected → No markers displayed");
//       return;
//     }
//     // Clear previous markers
//     workshopMarkers.current.forEach((marker) => marker.remove());
//     workshopMarkers.current = [];

//     const bounds = L.latLngBounds([]);

//     // Add new markers & extend bounds
//     workshops.forEach((item) => {
//       const lat = parseFloat(item.latitude);
//       const lon = parseFloat(item.longitude);

//       const marker = L.marker([lat, lon], { icon: workshopIcon }).addTo(
//         mapRef.current
//       ).bindPopup(`
//         <b>${item.Workshop_name}</b><br/>
//         ${item.ws_address}
//       `);

//       workshopMarkers.current.push(marker);

//       // extend map bounds
//       bounds.extend([lat, lon]);
//     });

//     // Fit map to marker bounds (only if there is data)
//     if (workshops.length > 0) {
//       mapRef.current.fitBounds(bounds, {
//         padding: [50, 50], // smooth zoom with padding
//       });
//     }
//   }, [workshops]);

//   return (
//     <Card
//       sx={{
//         borderRadius: 3,
//         boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//         background: "#F8FAFCB2",
//         border: "2px solid #fff",
//         height: "100%",
//       }}
//     >
//       <CardContent sx={{ p: 1 }}>
//         {/*HEADER */}
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

//           {/* FILTERS */}
//           <Stack direction="row" alignItems="center" spacing={1}>
//             {/* DISTRICT FILTER */}
//             <Select
//               size="small"
//               fullWidth
//               displayEmpty
//               value={selectedDistrict}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setSelectedDistrict(value); // UI update
//                 setDistrictFilter(value); // CONTEXT update (important)
//                 console.log("District Selected →", value);
//               }}
//               inputProps={{ "aria-label": "Select District" }}
//               sx={{
//                 height: "2.5rem",
//                 width: "100%",
//                 "& .MuiInputBase-input": {
//                   color: `#9e9e9e !important`,
//                 },
//                 "& .MuiInputBase-root": {
//                   height: "100%",
//                   padding: "0 12px",
//                   display: "flex",
//                   alignItems: "center",
//                 },
//                 borderRadius: "12px",
//                 "& fieldset": {
//                   border: "none",
//                 },
//                 backgroundColor: "#fff",
//                 "& input::placeholder": {
//                   fontSize: "0.85rem",
//                   color: ` #9e9e9e!important`,
//                 },
//                 boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
//                 "&:hover": {
//                   boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
//                 },
//               }}
//             >
//               <MenuItem value="" disabled>
//                 Select District
//               </MenuItem>

//               {districtList.map((dist) => (
//                 <MenuItem key={dist.dist_id} value={dist.dist_id}>
//                   {dist.dist_name}
//                 </MenuItem>
//               ))}
//             </Select>

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

//         {/* Leaflet Map */}
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
//             style={{ width: "100%", height: "230px" }}
//           ></div>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

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

  const { workshops, dateFilter, setDistrictFilter } = useSourceContext();

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const workshopMarkers = useRef([]);
  const [mapView, setMapView] = useState([19.076, 72.8777, 8]); // [lat, lng, zoom]

  const extendedWindowRef = useRef(null);

  const workshopIcon = L.icon({
    iconUrl: workshopIconImg,
    iconSize: [20, 20],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Fetch districts when state changes
  useEffect(() => {
    if (selectedState) getDistricts(selectedState);
  }, [selectedState]);

  const getDistricts = async (stateId) => {
    try {
      const response = await axios.get(
        `${port}/Screening/District_Get/${stateId}/`
      );
      setDistrictList(response.data || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Initialize main map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      attributionControl: false,
    }).setView([mapView[0], mapView[1]], mapView[2]);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // mapRef.current.on("moveend zoomend", () => {
    //   const center = mapRef.current.getCenter();
    //   const zoom = mapRef.current.getZoom();
    //   setMapView([center.lat, center.lng, zoom]);
    // });

    mapRef.current.on("moveend zoomend", () => {
      const center = mapRef.current.getCenter();
      const zoom = mapRef.current.getZoom();

      setMapView([center.lat, center.lng, zoom]);

      // 🔁 SYNC MAIN → EXTENDED
      if (extendedWindowRef.current && !extendedWindowRef.current.closed) {
        extendedWindowRef.current.postMessage(
          {
            type: "SYNC_VIEW",
            lat: center.lat,
            lng: center.lng,
            zoom,
          },
          "*"
        );
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data || event.data.type !== "SYNC_MAP") return;

      const { lat, lng, zoom } = event.data;

      if (!mapRef.current) return;

      mapRef.current.setView([lat, lng], zoom);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Update markers on main map
  useEffect(() => {
    if (!mapRef.current || !dateFilter) return;

    workshopMarkers.current.forEach((marker) => marker.remove());
    workshopMarkers.current = [];

    const bounds = L.latLngBounds([]);

    workshops.forEach((item) => {
      const lat = parseFloat(item.latitude);
      const lon = parseFloat(item.longitude);
      if (isNaN(lat) || isNaN(lon)) return; // Null-safe

      const marker = L.marker([lat, lon], { icon: workshopIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${item.Workshop_name}</b><br/>${item.ws_address}`);

      workshopMarkers.current.push(marker);
      bounds.extend([lat, lon]);
    });

    if (workshops.length > 0 && bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // 🔁 Update extended map when main map data changes
    if (extendedWindowRef.current && !extendedWindowRef.current.closed) {
      extendedWindowRef.current.postMessage(
        {
          type: "UPDATE_MARKERS",
          workshops,
        },
        "*"
      );
    }
  }, [workshops, dateFilter]);

  const openExtendedMapInNewWindow = () => {
    const newWin = window.open(
      "",
      "_blank",
      "width=1000,height=650,scrollbars=yes,resizable=yes"
    );

    extendedWindowRef.current = newWin;

    if (!newWin) return;

    newWin.document.write(`
    <html>
      <head>
        <title>Extended Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <style>
          html, body { margin:0; padding:0; }
          #map { width:100vw; height:100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      </body>
    </html>
  `);

    newWin.document.close();

    newWin.onload = () => {
      const map = newWin.L.map("map").setView(
        [mapView[0], mapView[1]],
        mapView[2]
      );

      newWin.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = newWin.L.icon({
        iconUrl: workshopIconImg,
        iconSize: [20, 20],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const renderMarkers = (list) => {
        map.eachLayer((layer) => {
          if (layer instanceof newWin.L.Marker) {
            map.removeLayer(layer);
          }
        });

        const bounds = newWin.L.latLngBounds([]);

        list.forEach((item) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          if (isNaN(lat) || isNaN(lng)) return;

          newWin.L.marker([lat, lng], { icon })
            .addTo(map)
            .bindPopup(`<b>${item.Workshop_name}</b><br/>${item.ws_address}`);

          bounds.extend([lat, lng]);
        });

        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      };

      if (dateFilter && workshops.length > 0) {
        renderMarkers(workshops);
      }

      newWin.addEventListener("message", (event) => {
        if (event.data?.type === "SYNC_VIEW") {
          const { lat, lng, zoom } = event.data;

          map.setView([lat, lng], zoom);
        }

        if (event.data?.type === "UPDATE_MARKERS") {
          renderMarkers(event.data.workshops);
        }
      });

      // 🔄 Sync extended → main
      map.on("moveend zoomend", () => {
        const center = map.getCenter();
        const zoom = map.getZoom();

        window.postMessage(
          {
            type: "SYNC_MAP",
            lat: center.lat,
            lng: center.lng,
            zoom,
          },
          "*"
        );
      });
    };
  };

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
        {/* HEADER */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box
              sx={{
                background: "linear-gradient(90deg, #00B8DB 0%, #2B7FFF 94%)",
                borderRadius: "40%",
                width: { xs: 26, sm: 28, md: 25 },
                height: { xs: 26, sm: 28, md: 25 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                // mr: 1,
                right: 1,
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
            <Select
              size="small"
              fullWidth
              displayEmpty
              value={selectedDistrict}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDistrict(value);
                setDistrictFilter(value);
              }}
              inputProps={{ "aria-label": "Select District" }}
              sx={{
                height: "2.5rem",
                width: "100%",
                "& .MuiInputBase-input": { color: "#9e9e9e !important" },
                "& .MuiInputBase-root": {
                  height: "100%",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                },
                borderRadius: "12px",
                "& fieldset": { border: "none" },
                backgroundColor: "#fff",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                "&:hover": { boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
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

            {/* SCANNER ICON → Open Extended Map in New Window */}
            <Box
              onClick={openExtendedMapInNewWindow}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <ScannerIcon sx={{ color: "#fff", fontSize: 16 }} />
            </Box>
          </Stack>
        </Stack>

        {/* MAIN MAP */}
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
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MapSection;
