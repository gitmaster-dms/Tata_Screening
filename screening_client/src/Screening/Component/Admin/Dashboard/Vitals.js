import React from "react";
import { Box, Stack, Typography, LinearProgress } from "@mui/material";

// 🖼 Import icons
import auditory from "../../../Images/DashboardIcons/auditory.png";
import bmi from "../../../Images/DashboardIcons/bmi.png";
import health from "../../../Images/DashboardIcons/health.png";
import eye from "../../../Images/DashboardIcons/eye.png";
import lifeline from "../../../Images/DashboardIcons/lifeline.png";
import lungs from "../../../Images/DashboardIcons/lungs.png";
import tooth from "../../../Images/DashboardIcons/tooth.png";
import Investation from "../../../Images/DashboardIcons/investation.png";
import Immunization from "../../../Images/DashboardIcons/immunization.png";

const Vitals = ({ vitalsData }) => {
  const vitalsResult = [
    {
      name: "BMI",
      icon: bmi,
      color: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
      gradient: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
      value: vitalsData?.bmi_count,
    },
    {
      name: "Vital",
      icon: health,
      color: "#E91E63",
      gradient: "linear-gradient(135deg, #AD46FF 0%, #E60076 100%)",
      value: vitalsData?.vital_count,
    },
    {
      name: "Auditory",
      icon: auditory,
      color: "#2ECC71",
      gradient: "linear-gradient(135deg, #03AC64 0%, #087945 100%)",
      value: vitalsData?.auditory_count,
    },
    {
      name: "Dental",
      icon: tooth,
      color: "#F44336",
      gradient: "linear-gradient(135deg, #FF6900 0%, #E7000B 100%)",
      value: vitalsData?.dental_count,
    },
    {
      name: "Vision",
      icon: eye,
      color: "#2196F3",
      gradient: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
      value: vitalsData?.vision_count,
    },
    {
      name: "Medical History",
      icon: lifeline,
      color: "#E91E63",
      gradient: "linear-gradient(135deg, #AD46FF 0%, #E60076 100%)",
      value: vitalsData?.medical_history_count,
    },
    {
      name: "Investation",
      icon: Investation,
      color: "#2ECC71",
      gradient: "linear-gradient(135deg, #03AC64 0%, #087945 100%)",
      value: vitalsData?.investigation_info_count,
    },
    {
      name: "PFT",
      icon: lungs,
      color: "#FF7043",
      gradient: "linear-gradient(135deg, #FF6900 0%, #E7000B 100%)",
      value: vitalsData?.pft_info_count,
    },
    {
      name: "Immunization",
      icon: Immunization,
      color: "#AB47BC",
      gradient: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
      value: vitalsData?.immunisation_info_count,
    },
  ];
  return (
    <Box
      sx={{
        background: "#F8FAFCB2 70%",
        borderRadius: "16px",
        p: 2,
        width: "100%",
        height: "100%", // 🔥 REQUIRED
        minHeight: { xs: "100%", sm: "100%", md: 450 }, // 🔥 increase card height
        border: "2px solid #fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ---------- Title ---------- */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={health}
            alt="Vitals"
            sx={{ width: 14, height: 14, objectFit: "contain" }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#252539",
            fontFamily: "Roboto",
            fontSize: { xs: 14, sm: 15 },
            lineHeight: 1,
          }}
        >
          Vitals
        </Typography>
      </Stack>

      {/* ---------- List ---------- */}
      <Stack spacing={1} mt={1.3}>
        {vitalsResult.map((item, index) => (
          <Box key={index}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              {/* Icon + Label */}
              <Stack direction="row" alignItems="center" spacing={0.8}>
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: item.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={item.icon}
                    alt={item.name}
                    sx={{ width: 14, height: 14, objectFit: "contain" }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: { xs: 12.5, sm: 13 },
                    fontWeight: 600,
                    color: "#252539",
                    fontFamily: "Roboto",
                    lineHeight: 1.1,
                  }}
                >
                  {item.name}
                </Typography>
              </Stack>

              {/* Value */}
              <Typography
                sx={{
                  fontSize: { xs: 12.5, sm: 13 },
                  fontWeight: 500,
                  color: "#252539",
                  lineHeight: 2,
                }}
              >
                {item.value}
              </Typography>
            </Stack>

            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={60}
              sx={{
                height: 4,
                borderRadius: 2,
                mt: 0.5,
                background: "#D9D9D9",
                "& .MuiLinearProgress-bar": {
                  background: item.gradient,
                },
              }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Vitals;
