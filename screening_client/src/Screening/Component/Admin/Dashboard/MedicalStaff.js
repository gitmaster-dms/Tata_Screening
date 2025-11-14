import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { PieChart } from "react-minimal-pie-chart";
import PersonIcon from "@mui/icons-material/Person"; // Replaced with user icon

const MedicalStaff = ({ data }) => {
  const available = data?.Medical_staff_Available ?? 0;
  const unavailable = data?.Medical_staff_NotAvailable ?? 0;

  const pieData = [
    { title: "Available", value: available, color: "#087ED3" },
    { title: "Unavailable", value: unavailable, color: "#F35A81" },
  ];

  const total = data?.Total_Medical_Staff;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        background: "#F8FAFCB2",
        border: "2px solid #fff",
        height: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 1.2 }}>
        {/* ---------- Header ---------- */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(90deg, #00B8DB 0%, #2B7FFF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PersonIcon sx={{ color: "#fff", fontSize: 17 }} />
          </Box>
          <Typography
            sx={{
              fontSize: 15,
              color: "#1A1A1A",
              fontFamily: "Roboto",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Medical Staff
          </Typography>
        </Stack>

        {/* ---------- Content ---------- */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          // spacing={{ xs: 1, sm: 2, md: 1 }}
          // sx={{ mt: 1 }}
        >
          {/* Pie Chart */}
          <Box
            sx={{
              width: { xs: 70, sm: 80, md: 90 },
              height: { xs: 70, sm: 80, md: 90 },
              position: "relative",
            }}
          >
            <PieChart
              data={pieData}
              totalValue={total}
              lineWidth={30}
              rounded
              animate
              startAngle={260}
              lengthAngle={-360}
              paddingAngle={2}
              style={{ height: "auto" }}
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
                sx={{
                  fontSize: { xs: 16, sm: 18 },
                  fontWeight: 600,
                  color: "#252539",
                  // lineHeight: 1,
                  fontFamily: "Roboto",
                }}
              >
                {total}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 10.5, sm: 11 },
                  color: "#777",
                  // lineHeight: 1.1,
                  fontFamily: "Roboto",
                }}
              >
                Total
              </Typography>
            </Box>
          </Box>

          {/* Legends */}
          <Stack spacing={0.8} sx={{ mt: { xs: 0.5, sm: 0 } }}>
            {/* Available */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "#087ED3",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#252539",
                  fontFamily: "Roboto",
                }}
              >
                {available}&nbsp;
                <Box component="span" sx={{ fontSize: 12, fontWeight: 400 }}>
                  Available
                </Box>
              </Typography>
            </Stack>

            {/* Unavailable */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "#F35A81",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#252539",
                  fontFamily: "Roboto",
                }}
              >
                {unavailable}&nbsp;
                <Box component="span" sx={{ fontSize: 12, fontWeight: 400 }}>
                  Unavailable
                </Box>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MedicalStaff;
