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
import { useSourceContext } from "../../../../contexts/SourceContext";
const Dashboard = () => {
  const { setDateFilter } = useSourceContext();
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
      const response = await axios.get(`${port}/Screening/State_Get/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("response state", response.data);
      setStateList(response.data || []); // ✅ store list
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const [districtList, setDistrictList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    if (selectedState) {
      getDistricts(selectedState);
    }
  }, [selectedState]);

  const getDistricts = async (stateId) => {
    try {
      const response = await axios.get(
        `${port}/Screening/District_Get/${stateId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("District List:", response.data);

      setDistrictList(response.data || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };
  // const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    // UPDATE DATE FILTER BASED ON SELECTED TAB
    if (newValue === 0) {
      setDateFilter("today");
    } else if (newValue === 1) {
      setDateFilter("this_month");
    } else if (newValue === 2) {
      setDateFilter("till_date");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [tabValue]); // if your API depends on tab value (like dt=1,2,3)

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dtValue = tabValue === 0 ? 1 : tabValue === 1 ? 2 : 3; // example
      const response = await axios.get(
        `${port}/Screening/total_driver_count/?dt=${dtValue}/state=${selectedState}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
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
        `${port}/Screening/bmi_vitals_count/?dt=${dtValue}/state=${selectedState}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
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
        `${port}/Screening/health_score_count/?dt=${dtValue}/state=${selectedState}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
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
          gap: 1, // ✅ small gap between tabs and dropdown
          mb: 1,
          pl: 1,
          flexWrap: "wrap",
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
         
          <Select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
            }}
            size="small"
            fullWidth
            displayEmpty
            inputProps={{ "aria-label": "Select State" }}
            // sx={selectStyles}
            sx={{
              height: "2.5rem",
              width: "100%",
              "& .MuiInputBase-input": {
                color: `#9e9e9e !important`,
              },
              "& .MuiInputBase-root": {
                height: "100%",
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
              },
              borderRadius: "12px",
              "& fieldset": {
                border: "none",
              },
              backgroundColor: "#fff",
              "& input::placeholder": {
                fontSize: "0.85rem",
                color: ` #9e9e9e!important`,
              },
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <MenuItem value="" disabled>
              Select State
            </MenuItem>
            {stateList.map((state) => (
              <MenuItem key={state.state_id} value={state.state_id}>
                {state.state_name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Grid container spacing={1}>
        {/* Left 9-column section */}
        <Grid item xs={12} md={9} sm={12}>
          <Grid container spacing={1}>
            {/* Row 1: Driver Stats + Health Status */}
            <Grid item xs={12} md={6} sm={12}>
              <DriverStatsCards data={dashboardData} />
            </Grid>

            <Grid item xs={12} md={6} sm={12}>
              <HealthStatusCard healthStatusData={healthStatusData} />
            </Grid>

            {/* Row 2: Medical Staff + Follow-up (stacked vertically) + Map */}
            <Grid item xs={12} md={4} sm={12}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <MedicalStaff data={dashboardData} />
                <FollowUpCard data={dashboardData} />
              </Box>
            </Grid>

            <Grid item xs={12} md={8} sm={12}>
              <MapSection selectedState={selectedState} />
            </Grid>
          </Grid>
        </Grid>

        {/* Right 3-column section for Vitals */}
        <Grid item xs={12} md={3} sm={12}>
          <VitalsCard vitalsData={vitalsData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
