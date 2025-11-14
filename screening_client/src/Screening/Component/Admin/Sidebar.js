import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip , Drawer} from "@mui/material";
import { Link } from "react-router-dom";

import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";

const Sidebarnew = () => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [permission, setPermission] = useState([]);

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
    setPermission(parsedPermissions);
  }, []);

  const iconMapping = {
    Dashboard: <SpaceDashboardIcon />,
    Citizen: <PersonAddAltOutlinedIcon />,
    Source: <MapsHomeWorkIcon />,
    "Schedule Screening": <SummarizeIcon />,
    Report: <SummarizeIcon />,
    Screening: <CoPresentIcon />,
    HealthCard: <HealthAndSafetyIcon />,
    "System User": <SummarizeIcon />,
    Permission: <SummarizeIcon />,
    "Follow-Up": <FollowTheSignsIcon />,
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
const open = true; // Sidebar is always open
  return (
    // <Box
    //   sx={{
    //     width: "55px",
    //     height: "80vh",
    //     background: "linear-gradient(180deg, #2FB3F5 0%, #1439A4 100%)",
    //     display: "flex",
    //     flexDirection: "column",
    //     alignItems: "center",
    //     py: 2,
    //     borderRadius: "50px",
    //     position: "fixed",
    //     top: "5em",
    //     left: 0,
    //     boxShadow: 3,
    //     ml: 1,
    //     overflowY: "auto",
    //     overflowX: "hidden",
    //     scrollbarWidth: "none",
    //     "&::-webkit-scrollbar": {
    //       display: "none",
    //     },
    //   }}
    // >
    //   {permission.map((module, index) =>
    //     module.modules_submodule
    //       .filter((sub) => sub.moduleName !== "Investigation")
    //       .map((submodule, subIndex) => {
    //         const isActive = selectedItem === submodule.moduleName;

    //         return (
    //           <Tooltip
    //             key={`${index}-${subIndex}`}
    //             title={submodule.moduleName}
    //             placement="right"
    //             arrow
    //           >
    //             <IconButton
    //               component={Link}
    //               to={`/mainscreen/${submodule.moduleName}`}
    //               onClick={() => handleItemClick(submodule.moduleName)}
    //               sx={{
    //                 my: 0.8,
    //                 backgroundColor: isActive ? "white" : "transparent",
    //                 color: isActive ? "#1439A4" : "white",
    //                 "&:hover": {
    //                   backgroundColor: "rgba(255,255,255,0.2)",
    //                   transform: "scale(1.1)",
    //                 },
    //                 transition: "all 0.3s ease",
    //               }}
    //             >
    //               {iconMapping[submodule.moduleName]}
    //             </IconButton>
    //           </Tooltip>
    //         );
    //       })
    //   )}
    // </Box>

     <Drawer
      variant="persistent" // keeps it fixed
      anchor="left"
      open={open}
      sx={{
        width: 55,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 55,
          height: "80vh",
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #2FB3F5 0%, #1439A4 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          borderRadius: "50px",
          mt: "5em",
          boxShadow: 3,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      }}
    >
      {permission.map((module, index) =>
        module.modules_submodule
          .filter((sub) => sub.moduleName !== "Investigation")
          .map((submodule, subIndex) => {
            const isActive = selectedItem === submodule.moduleName;
            return (
              <Tooltip
                key={`${index}-${subIndex}`}
                title={submodule.moduleName}
                placement="right"
                arrow
              >
                <IconButton
                  component={Link}
                  to={`/mainscreen/${submodule.moduleName}`}
                  onClick={() => handleItemClick(submodule.moduleName)}
                  sx={{
                    my: 0.8,
                    backgroundColor: isActive ? "white" : "transparent",
                    color: isActive ? "#1439A4" : "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {iconMapping[submodule.moduleName]}
                </IconButton>
              </Tooltip>
            );
          })
      )}
    </Drawer>
  );
};

export default Sidebarnew;
