import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useParams } from "react-router-dom";
import Childview from "./Childview";
import Corporateview from "./Corporateview";

const Viewcitizen = () => {
  const { id, sourceId } = useParams();
  console.log("SourceIDfromurl", sourceId, id);
  const SourceUrlId = localStorage.getItem("loginSource");
  console.log("SourceUrlId", SourceUrlId);
  const accessToken = localStorage.getItem("token");
  const Port = process.env.REACT_APP_API_KEY;
  const [citizenData, setCitizenData] = useState(null);
  console.log(citizenData, "data1");

  const [data1, setData1] = useState([]);
  useEffect(() => {
    let apiUrl = "";

    if (sourceId === "Community") {
      apiUrl = `${Port}/Screening/add_citizen_get/${id}/`;
    } else if (sourceId === "Corporate") {
      apiUrl = `${Port}/Screening/add_employee_get/${id}/`;
    }

    if (apiUrl) {
      axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setData1(response.data);
          console.log("aaaaa", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [sourceId, id, accessToken, Port]);

  const fetchCitizenData = async () => {
    try {
      const response = await fetch(`${Port}/Screening/Citizen_Put_api/${id}/`);

      const data = await response.json();
      console.log("Citizen Data:", data);

      setCitizenData(data);
      setData1(data);
    } catch (error) {
      console.error("Error fetching citizen data:", error);
    }
  };

  useEffect(() => {
    fetchCitizenData();
  }, [id]);

  if (!data1) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        m: "0em 0em 0 3em",
        // pl: { md: 10, sm: 2, xs: 1 }, // ⭐ fixed spacing
        // pr: { md: 10, sm: 2, xs: 1 },
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Grid container alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <Link to="/mainscreen/Citizen" style={{ textDecoration: "none" }}>
              <IconButton size="small" sx={{ color: "#1A237E" }}>
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
            </Link>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              sx={{
                color: "#1A237E",
                fontWeight: 600,
                fontFamily: "Roboto",
              }}
            >
              View Citizen
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {/* <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            fullWidth
                            label="Age Group"
                            value={data1.age_name || ""}
                            size="small"
                            variant="outlined"
                            InputLabelProps={{
                                style: { fontWeight: "100", fontSize: "14px" },
                            }}
                        />
                    </Grid> */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Gender"
              value={citizenData?.gender_name || ""}
              size="small"
              variant="outlined"
              InputLabelProps={{
                style: { fontWeight: "100", fontSize: "14px" },
              }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            fullWidth
                            label="Source"
                            value={data1.source_id_name || ""}
                            size="small"
                            variant="outlined"
                            InputLabelProps={{
                                style: { fontWeight: "100", fontSize: "14px" },
                            }}
                        />
                    </Grid> */}
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Category"
              value={citizenData?.category_name || ""}
              size="small"
              variant="outlined"
              InputLabelProps={{
                style: { fontWeight: "100", fontSize: "14px" },
              }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            fullWidth
                            label="Disease"
                            value={data1.disease_name || ""}
                            size="small"
                            variant="outlined"
                            InputLabelProps={{
                                style: { fontWeight: "100", fontSize: "14px" },
                            }}
                        />
                    </Grid> */}
        </Grid>
      </Paper>

      <Box>
     
        {citizenData?.source_id_name === "Community" && (
          <Corporateview data={data1} />
        )}
      </Box>
    </Box>
  );
};

export default Viewcitizen;
