import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const ScreeningPending = () => (
  <Card
    sx={{
      bgcolor: "#FFF3E0",
      borderRadius: 3,
      boxShadow: 3,
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          bgcolor: "#FB8C00",
          color: "#fff",
          p: 1.5,
          borderRadius: "12px",
          mr: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PendingActionsIcon />
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Screening Pending
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          320
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default ScreeningPending;
