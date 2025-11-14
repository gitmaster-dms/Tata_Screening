import React from "react";
import { Box, Tabs, Tab, MenuItem, Select } from "@mui/material";

const FilterTabs = () => {
  const [tab, setTab] = React.useState(1);
  const [state, setState] = React.useState("");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#fff",
        p: 1,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Today" />
        <Tab label="This Month" />
        <Tab label="Till Date" />
      </Tabs>

      <Select
        size="small"
        value={state}
        onChange={(e) => setState(e.target.value)}
        displayEmpty
        sx={{ width: 180 }}
      >
        <MenuItem value="">Select State</MenuItem>
        <MenuItem value="Maharashtra">Maharashtra</MenuItem>
        <MenuItem value="Gujarat">Gujarat</MenuItem>
      </Select>
    </Box>
  );
};

export default FilterTabs;
