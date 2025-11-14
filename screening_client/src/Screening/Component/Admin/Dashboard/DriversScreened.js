import React from "react";
import { Card, CardContent, Typography, Avatar, Stack,Box} from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";

const TotalDriversScreened = () => (
  <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: "#E8EAF6" }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: "#3F51B5", width: 48, height: 48 }}>
          <FactCheckIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            Total Drivers Screened
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            1,250
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default TotalDriversScreened;
