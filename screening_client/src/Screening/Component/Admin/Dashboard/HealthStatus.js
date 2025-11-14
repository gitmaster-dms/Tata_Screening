import React from "react";
import { Card, Box, Typography, Stack, LinearProgress } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import healthstatus from "../../../Images/DashboardIcons/Vector.png";
const HealthStatusCard = ({ healthStatusData }) => {
  // --- Group API data into 3 logical categories ---
  const apiData = healthStatusData?.health_score_count || [];

  // Fit-to-Drive → Normal
  const fitData = apiData.find((i) => i.Category === "Normal");

  // Under Observation → Underweight + Overweight
  const underObsData = apiData.filter(
    (i) => i.Category === "Underweight" || i.Category === "Overweight"
  );
  const underObsCount = underObsData.reduce((sum, i) => sum + i.Count, 0);
  const underObsPercent = underObsData.reduce(
    (sum, i) => sum + i.Percentage,
    0
  );

  // Unfit / Critical → Obese (Class I) + Obese (Class II & III)
  const unfitData = apiData.filter(
    (i) =>
      i.Category === "Obese (Class I)" ||
      i.Category === "Obese (Class II & III)"
  );
  const unfitCount = unfitData.reduce((sum, i) => sum + i.Count, 0);
  const unfitPercent = unfitData.reduce((sum, i) => sum + i.Percentage, 0);

  // --- Prepare final 3-bar data ---
  const healthData = [
    {
      label: "Fit-to-Drive",
      count: fitData?.Count || 0,
      value: fitData?.Percentage || 0,
      color: "#00BCD4",
      icon: <CheckCircleIcon sx={{ color: "#000", fontSize: 18, mr: 1 }} />,
    },
    {
      label: "Under Observation",
      count: underObsCount,
      value: underObsPercent,
      color: "#4E73DF",
      icon: <WarningAmberIcon sx={{ color: "#000", fontSize: 18, mr: 1 }} />,
    },
    {
      label: "Unfit / Critical",
      count: unfitCount,
      value: unfitPercent,
      color: "#FF9843",
      icon: <CancelIcon sx={{ color: "#000", fontSize: 18, mr: 1 }} />,
    },
  ];

  return (
    <Card
      sx={{
        background: "#F8FAFCB2 70%",
        borderRadius: 3,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        p: 1,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // aligned to top
        border: "1px solid #fff",
      }}
    >
      {/* ---------- Header ---------- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1.2, // tighter spacing
        }}
      >
        <Box
          sx={{
            background: "#087ED3", // "linear-gradient(140deg, #FF9843 0%, #FF6A00 100%)",
            borderRadius: "40%",
            width: { xs: 26, sm: 28, md: 30 },
            height: { xs: 26, sm: 28, md: 30 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            // mr: 1,
            right: 0.5,
          }}
        >
          <Box
            component="img"
            src={healthstatus}
            alt="Health Icon"
            sx={{
              width: 20,
              height: 20,
              mr: 1,
            }}
          />
        </Box>

        <Typography
          fontWeight={700}
          sx={{
            fontSize: { xs: 14, sm: 15, md: 14},
            color: "#252539",
            fontFamily: "Roboto",
            ml: 1,
          }}
        >
          Health Status
        </Typography>
      </Box>

      {/* ---------- Bars ---------- */}
      <Stack spacing={0.5}>
        {" "}
        {/* tighter vertical spacing */}
        {healthData.map((item, i) => (
          <Box key={i} sx={{ position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={item.value}
              sx={{
                height: 28,
                borderRadius: 8,
                backgroundColor: "#f3f3f3",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: item.color,
                  borderRadius: 2,
                },
              }}
            />

            {/* ---------- Text inside bar ---------- */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.3,
              }}
            >
              {/* Left: icon + label */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                {item.icon}
                <Typography
                  sx={{
                    fontSize: { xs: 12, sm: 13 },
                    fontWeight: 600,
                    color: "#000",
                    fontFamily: "Roboto",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>

              {/* Right: count + percentage */}
              <Typography
                sx={{
                  fontSize: { xs: 12, sm: 13 },
                  fontWeight: 500,
                  color: "#000",
                  fontFamily: "Roboto",
                }}
              >
                {item.count}
                <Box
                  component="span"
                  sx={{
                    color: "#62748E",
                    fontWeight: 500,
                    fontFamily: "Roboto",
                  }}
                >
                  ({item.value}%)
                </Box>
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

export default HealthStatusCard;
