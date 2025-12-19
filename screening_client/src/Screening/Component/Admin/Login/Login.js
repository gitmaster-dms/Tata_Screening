import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Grid,
  Snackbar,
} from "@mui/material";
import loginImage from "../../../Images/LoginImage.jpg";
import tatamotors from "../../../Images/Tata Motors.png";
import SperoLogo from "../../../Images/SperoLogo.png";
import { API_URL } from "../../../../Config/api";

const validationSchema = Yup.object().shape({
  clg_ref_id: Yup.string().required("User Name is required"),
  password: Yup.string().required("Password is required"),
});

const Login = ({ onLogin, isLoggedIn }) => {
  const [logoUrl, setLogoUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // const Port = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate(`/mainscreen`);
  }, [isLoggedIn, navigate]);

  const isTokenExpired = () => {
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    if (!tokenExpiration) return true;
    const expirationTime = new Date(tokenExpiration).getTime();
    return new Date().getTime() > expirationTime;
  };

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!isTokenExpired()) {
        try {
          const refreshToken = localStorage.getItem("refresh");
          const clgId = localStorage.getItem("userID");
          const response = await axios.post(`${API_URL}/Screening/logout/`, {
            refreshToken,
            clg_id: clgId,
          });
          if (response.status >= 200 && response.status < 300) {
            localStorage.removeItem("refreshToken");
            navigate("/");
          }
        } catch (err) {
          console.error("Logout error:", err.message);
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [API_URL, navigate]);

  const formik = useFormik({
    initialValues: { clg_ref_id: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_URL}/Screening/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (response.status === 200) {
          const json = await response.json();

          const colleague = json.token.colleague;
          console.log("ACCESS TOKEN 👉", json.token.access);
          console.log("REFRESH TOKEN 👉", json.token.refresh);
          localStorage.setItem("colleagueEmail", colleague.email);
          localStorage.setItem("phoneNumber", colleague.phone_no);
          localStorage.setItem("location", colleague.address);
          localStorage.setItem("name", colleague.name);

          const logo = json.registration_details.Registration_details;
          const logoFullUrl = `${API_URL}${logo}`;
          setLogoUrl(logoFullUrl);
          localStorage.setItem("logo", logoFullUrl);

          localStorage.setItem("refreshToken", json.token.refresh);
          localStorage.setItem("userID", colleague.id);
          localStorage.setItem("token", json.token.access);
          localStorage.setItem("refresh", json.token.refresh);
          localStorage.setItem("usergrp", json.token.user_group);
          localStorage.setItem(
            "StateLogin",
            colleague?.clg_source?.clg_state_id
          );
          localStorage.setItem(
            "DistrictLogin",
            colleague?.clg_source?.clg_district_id
          );
          localStorage.setItem(
            "TehsilLogin",
            colleague?.clg_source?.clg_tahsil_id
          );
          localStorage.setItem("loginSource", colleague?.clg_source?.source_id);
          localStorage.setItem(
            "SourceNameFetched",
            colleague?.clg_source?.source_name_id
          );

          const permissions = JSON.stringify(json.token.permissions);
          localStorage.setItem("permissions", permissions);
          localStorage.setItem(
            "path",
            json.token.permissions[0].modules_submodule[0].moduleName
          );

          onLogin();
          navigate(
            `/mainscreen/${json.token.permissions[0].modules_submodule[0].moduleName}`
          );
        } else if (response.status === 400) {
          setSnackbarMessage("Invalid credentials. Please try again.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else if (response.status === 409) {
          setSnackbarMessage("User Already Logged In");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Invalid username or password");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error during login:", error);
        setSnackbarMessage("An error occurred during login. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
  });

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: `url(${loginImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            height: "100%",
            width: "100%",
            borderRadius: 0,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: `
              linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
              linear-gradient(166.99deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.06) 90.62%),
              linear-gradient(0deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.11))
            `,
            backdropFilter: "blur(10px)",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box
              component="img"
              src={tatamotors}
              alt="Logo"
              sx={{ width: 270, height: "auto", display: "inline-block" }}
            />
          </Box>

          <Box>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                mb: 3,
                fontWeight: "bold",
                color: "#0b1442",
              }}
            >
              Login
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                size="small"
                id="clg_ref_id"
                name="clg_ref_id"
                label="User Name"
                variant="outlined"
                margin="normal"
                value={formik.values.clg_ref_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.clg_ref_id && Boolean(formik.errors.clg_ref_id)
                }
                helperText={
                  formik.touched.clg_ref_id && formik.errors.clg_ref_id
                }
                InputProps={{
                  style: {
                    backgroundColor: "white",
                  },
                }}
              />

              <TextField
                fullWidth
                size="small"
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  style: {
                    backgroundColor: "white",
                  },
                }}
              />

              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 4,
                  width: "40%",
                  backgroundColor: "#0b1442",
                  "&:hover": { backgroundColor: "#0b1442" },
                  textTransform: "none",
                  marginLeft: "7.5em",
                }}
              >
                Login
              </Button>
            </form>
          </Box>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "black" }}>
              Powered by
            </Typography>
            <Box
              component="img"
              src={SperoLogo}
              alt="Spero"
              sx={{ width: 90, height: "auto" }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Login;
