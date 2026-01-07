import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { AccessTimeRounded, Sync, Timer, Timer10Rounded, TimerOff, TimerOffOutlined, Watch } from "@mui/icons-material";

const DriverStatsCards = ({ data }) => {
  console.log("Driver Stats Data:", data);
  // fallback to 0 if any key missing
  const cardData = [
    {
      title: "Total Drivers Added",
      value: data?.Total_Drivers_Added ?? 0,
      icon: <PersonAddIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "linear-gradient(140deg, #2FE5B5 0%, #0A8059 100%)",
    },
    {
      title: "Total Drivers Screened",
      value: data?.Total_Drivers_Screened ?? 0,
      icon: <AssignmentTurnedInIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "linear-gradient(140deg, #AD46FF 0%, #E60076 100%)",
    },
    {
      title: "Others",
      value: data?.Total_Others_Added ?? 0,
      icon: <AccessTimeRounded sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "linear-gradient(140deg, #FE9A00 0%, #F54900 100%)",
    },
    {
      title: "Referrals",
      value: data?.Total_Referrals_Made ?? 0,
      icon: <Sync sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "linear-gradient(140deg, #E4EF51 0%, #C7C710 100%)",
    },
  ];

  return (
    <Grid container spacing={1}>
      {cardData.map((c, i) => (
        <Grid item xs={12} sm={6} md={6} key={i}>
          <Card
            sx={{
              background: "#F8FAFCB2 70%",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "2px solid #ffffff",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                p: 1, // minimal padding
                "&:last-child": { pb: 1 }, // remove extra default bottom padding
              }}
            >
              {/* Row: icon + title */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  mb: 0, // remove bottom margin to tighten space
                }}
              >
                <Box
                  sx={{
                    background: c.iconBg,
                    borderRadius: "40%",
                    width: { xs: 24, sm: 26, md: 28 },
                    height: { xs: 24, sm: 26, md: 28 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {c.icon}
                </Box>

                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#252539",
                    fontWeight: 500,
                    fontSize: { xs: 13, sm: 14, md: 14 },
                    fontFamily: "Roboto , sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {c.title}
                </Typography>
              </Box>

              {/* Second row: value */}
              <Typography
                variant="h5"
                sx={{
                  color: "#252539",
                  fontWeight: 600,
                  fontSize: { xs: 19, sm: 21, md: 21 },
                  mt: 0.3, // minimal top margin
                  fontFamily: "Roboto",
                  lineHeight: 1,
                  ml: { xs: 0, sm: 0.3, md: 4 },
                }}
              >
                {c.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DriverStatsCards;
