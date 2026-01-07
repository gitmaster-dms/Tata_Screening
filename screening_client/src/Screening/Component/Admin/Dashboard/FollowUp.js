import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { PieChart } from "react-minimal-pie-chart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const FollowUpCard = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const followUpData = [
    {
      title: "Done",
      value: data?.Followups_Done ?? 0,
      color: "#4ED7AA",
      icon: <CheckCircleIcon sx={{ fontSize: 14, color: "#fff" }} />,
    },
    {
      title: "In-progress",
      value: data?.Followups_InProgress ?? 0,
      color: "#FFC769",
      icon: <AutorenewIcon sx={{ fontSize: 14, color: "#fff" }} />,
    },
    {
      title: "Pending",
      value: data?.Followups_Pending ?? 0,
      color: "#F35A81",
      icon: <HourglassEmptyIcon sx={{ fontSize: 14, color: "#fff" }} />,
    },
  ];

  const total =
    data?.Total_Followups ??
    followUpData.reduce((sum, item) => sum + item.value, 0);

  const selectedLabel =
    selectedIndex !== null ? followUpData[selectedIndex]?.title : "Total";
  const selectedValue =
    selectedIndex !== null ? followUpData[selectedIndex]?.value : total;
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        background: "#F8FAFCB2 70%",
        border: "2px solid #fff",
        height: "auto",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2, md: 0.5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          // gap: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 0.5, // 🔹 reduced vertical space
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #00B8DB 0%, #2B7FFF 94%)",
              borderRadius: "40%",
              width: { xs: 26, sm: 28, md: 20 },
              height: { xs: 26, sm: 28, md: 20 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              mr: 1,
              // right: 1,
            }}
          >
            <TrendingUpIcon sx={{ color: "#fff", fontSize: 16 }} />
          </Box>
          <Typography
            fontWeight={600}
            sx={{ fontSize: 15, color: "#1A1A1A", fontFamily: "Roboto" }}
          >
            Follow-up
          </Typography>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          {/* Pie Chart */}
          <Box
            sx={{
              position: "relative",
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              flexShrink: 0,
            }}
          >
            <PieChart
              data={followUpData}
              totalValue={total}
              lineWidth={30}
              rounded
              animate
              startAngle={270}
              lengthAngle={-360}
              paddingAngle={2}
              style={{ height: "100%", cursor: "pointer" }}
              onClick={(_, index) => setSelectedIndex(index)}
            />

            {/* Center Label */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{ fontSize: 17, fontWeight: 700, color: "#252539" }}
              >
                {selectedValue}
              </Typography>
              <Typography
                sx={{ fontSize: 11, fontWeight: 600, color: "#6f42c1" }}
              >
                {selectedLabel}
              </Typography>
            </Box>
          </Box>

          {/* Progress Bars */}
          <Stack spacing={0.8} sx={{ flex: 1 }}>
            {followUpData.map((item, i) => (
              <Box key={i} sx={{ position: "relative" }}>
                <LinearProgress
                  variant="determinate"
                  value={(item.value / total) * 100}
                  sx={{
                    height: 26,
                    borderRadius: 4,
                    backgroundColor: "#F3F3F3",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: item.color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1,
                  }}
                >
                  {/* LEFT SIDE: Icon + Title together */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5, // 👈 yahin se gap control hoga (0.3 / 0.4 bhi try kar sakte ho)
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#000",
                        textTransform: "capitalize",
                        fontFamily: "Roboto, sans-serif",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>

                  {/* RIGHT SIDE: Value */}
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#252539",
                      fontFamily: "Roboto, sans-serif",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FollowUpCard;
