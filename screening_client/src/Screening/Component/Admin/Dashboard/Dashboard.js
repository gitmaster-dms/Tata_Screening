import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";
import DriverStatsCards from "./Drivers";
import MedicalStaff from "./MedicalStaff";
import FollowUpCard from "./FollowUp";
import HealthStatusCard from "./HealthStatus";
import MapSection from "./MapSection";
import VitalsCard from "./Vitals";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import dashbordbg from "../../../Images/DashboardIcons/bgimagedashboard.png";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
const Dashboard = () => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("accessToken");
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  useEffect(() => {
    stateget();
  }, [tabValue]);
  const stateget = async () => {
    try {
      const response = await axios.get(`${port}/Screening/State_Get/`);
      console.log("response state", response.data);
      setStateList(response.data || []); // ✅ store list
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  useEffect(() => {
    fetchDashboardData();
  }, [tabValue]); // if your API depends on tab value (like dt=1,2,3)

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dtValue = tabValue === 0 ? 1 : tabValue === 1 ? 2 : 3; // example
      const response = await axios.get(
        `${port}/Screening/total_driver_count/?dt=${dtValue}/state=${selectedState}`
      );
      setDashboardData(response.data);
      console.log("response--", response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [vitalsData, setVitalsData] = useState(null);

  useEffect(() => {
    fetchVitalsData();
  }, [tabValue]);
  const fetchVitalsData = async () => {
    try {
      setLoading(true);
      const dtValue = tabValue === 0 ? 1 : tabValue === 1 ? 2 : 3; // example
      const response = await axios.get(
        `${port}/Screening/bmi_vitals_count/?dt=${dtValue}/state=${selectedState}`
      );
      setVitalsData(response.data);
      console.log("response vitals", response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [healthStatusData, setHealthStatusData] = useState(null);

  useEffect(() => {
    healthStatus();
  }, [tabValue]);
  const healthStatus = async () => {
    try {
      setLoading(true);
      const dtValue = tabValue === 0 ? 1 : tabValue === 1 ? 2 : 3; // example
      const response = await axios.get(
        `${port}/Screening/health_score_count/?dt=${dtValue}/state=${selectedState}`
      );
      setHealthStatusData(response.data);
      console.log("response vitals", response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  // refresh content while loading
  // if (loading || !dashboardData || !vitalsData) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box
      sx={{
        backgroundImage: `url(${dashbordbg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        bgcolor: "#F0F6FB",
        minHeight: "100vh",
        pl: { md: 10, sm: 2, xs: 1 },
        pr: { md: 4, sm: 2, xs: 1 },
        pt: 2,
      }}
    >
      {/* ---------- Filter Tabs ---------- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2, // ✅ small gap between tabs and dropdown
          mb: 2,
          pl: 1,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          sx={{
            position: "relative", // ✅ ensures z-index works properly
            backgroundColor: "#fff",
            borderRadius: "30px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            color: "#252539",
            fontWeight: 500,
            fontSize: "14px",
            fontFamily: "Roboto",
            minHeight: "40px",

            "& .MuiTab-root": {
              minHeight: "40px",
              textTransform: "none",
              fontWeight: 600,
              px: 1,
              color: "#252539",
              position: "relative", // ✅ tab itself has its own stacking layer
              zIndex: 0,
            },
            "& .Mui-selected": {
              backgroundColor: "#087ED3",
              color: "#fff",
              borderRadius: "30px",
              zIndex: 1, // ✅ ensure selected tab stays above others after refresh
            },
          }}
        >
          <Tab
            label="Today"
            sx={{
              "&.Mui-selected": {
                color: "#000000", // Selected tab text
                borderRadius: "10px",
                zIndex: 1,
              },
            }}
          />
          <Tab
            label="This Month"
            sx={{
              "&.Mui-selected": {
                color: "#000000", // Selected tab text
                borderRadius: "10px",
                zIndex: 1,
              },
            }}
          />
          <Tab
            label="Till Date"
            sx={{
              "&.Mui-selected": {
                color: "#000000", // Selected tab text
                borderRadius: "10px",
                zIndex: 1,
              },
            }}
          />
        </Tabs>

        {/* --- Select State Dropdown --- */}
        <Box>
          <TextField
            required
            id="state_id"
            name="state_id"
            select
            placeholder="State"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            size="small"
            fullWidth
            sx={{
              minWidth: { xs: 130, sm: 180, md: 200 },
              textAlign: "left",
              backgroundColor: "#fff",
              borderRadius: 3, // ✅ better to use theme scale (8px)
              boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.05)",

              // ✅ remove default outlined border completely
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },

              "& .MuiSelect-select": {
                color: "black !important",
                fontSize: "16px",
                fontFamily: "Roboto",
                fontWeight: "500",
              },
              "& .MuiInputLabel-root": {
                color: "#000",
                fontWeight: "bold",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                bgcolor: "#fff",
              },
              "& .MuiSelect-icon": {
                color: "#087ED3", // ✅ dropdown arrow color
              },
            }}
          >
            <MenuItem value="" sx={{ color: "#777" }} disabled>
              Select State
            </MenuItem>
            {stateList.map((option) => (
              <MenuItem
                key={option.state_id}
                value={option.state_id}
                sx={{
                  fontSize: "14px",
                  color: "black",
                }}
              >
                {option.state_name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Left 9-column section */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={1}>
            {/* Row 1: Driver Stats + Health Status */}
            <Grid item xs={12} md={6}>
              <DriverStatsCards data={dashboardData} />
            </Grid>

            <Grid item xs={12} md={6}>
              <HealthStatusCard healthStatusData={healthStatusData} />
            </Grid>

            {/* Row 2: Medical Staff + Follow-up (stacked vertically) + Map */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <MedicalStaff data={dashboardData} />
                <FollowUpCard data={dashboardData} />
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <MapSection />
            </Grid>
          </Grid>
        </Grid>

        {/* Right 3-column section for Vitals */}
        <Grid item xs={12} md={3}>
          <VitalsCard vitalsData={vitalsData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
