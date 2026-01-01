import React, { useState, useEffect } from "react";
import axios from "axios";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import {
  Grid,
  Card,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Snackbar,
  Alert,
  FormControlLabel,
  MenuItem,
  IconButton,
} from "@mui/material";
import { API_URL } from "../../../../../../Config/api";
import VisibilityIcon from "@mui/icons-material/Visibility";

const InvestigationInfo = ({
  citizensPkId,
  pkid,
  fetchVital,
  selectedName,
  onAcceptClick,
}) => {
  const accessToken = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  /* -------------------- STATES -------------------- */
  const [nextName, setNextName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChecks, setSelectedChecks] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [investData, setInvestData] = useState({
    investigation_report: [],
    urine_report: [],
    ecg_report: [],
    x_ray_report: [],
  });

  const investtData = JSON.parse(localStorage.getItem("investiData")) || [];
  const [previewType, setPreviewType] = useState(null);

  const handleDeleteFile = (field, index) => {
  setInvestData((prev) => ({
    ...prev,
    [field]: prev[field].filter((_, i) => i !== index),
  }));
};

  const handleDownload = async (filePath) => {
    if (!filePath || typeof filePath !== "string") return;

    const response = await fetch(`${API_URL}${filePath}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filePath.split("/").pop();
    link.click();

    URL.revokeObjectURL(url);
  };

  const handlePreview = (filePath) => {
    if (!filePath) return;

    // New uploaded file (File object)
    if (filePath instanceof File) {
      const url = URL.createObjectURL(filePath);
      setPreviewFile(url);
      setPreviewType(filePath.type);
      setPreviewOpen(true);
      return;
    }

    // File from API (string)
    if (typeof filePath === "string") {
      const ext = filePath.split(".").pop().toLowerCase();

      // ❌ Excel / Word → preview not supported
      if (["xlsx", "xls", "doc", "docx"].includes(ext)) {
        alert("Preview not supported for this file type");
        return;
      }

      setPreviewFile(`${API_URL}${filePath}`);
      setPreviewType(ext);
      setPreviewOpen(true);
    }
  };

  /* -------------------- NEXT SCREEN LOGIC -------------------- */
  useEffect(() => {
    if (fetchVital && selectedName) {
      const index = fetchVital.findIndex(
        (item) => item.screening_list === selectedName
      );
      if (index !== -1 && index < fetchVital.length - 1) {
        setNextName(fetchVital[index + 1].screening_list);
      }
    }
  }, [selectedName, fetchVital]);

  /* -------------------- GET API PREFILL -------------------- */
  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const res = await fetch(
          `${API_URL}/Screening/investigation_get_api/${pkid}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data?.length > 0) {
            const item = data[0];

            setSelectedChecks(item.selected_submodules || []);
            setInvestData({
              investigation_report: item.investigation_report
                ? [item.investigation_report]
                : [],
              urine_report: item.urine_report ? [item.urine_report] : [],
              ecg_report: item.ecg_report ? [item.ecg_report] : [],
              x_ray_report: item.x_ray_report ? [item.x_ray_report] : [],
            });
          }
        }
      } catch (error) {
        console.error("GET error:", error);
      }
    };

    fetchDataById();
  }, [pkid]);

  /* -------------------- FILE CHANGE -------------------- */
  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setInvestData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ...files],
    }));
  };

  /* -------------------- DOWNLOAD -------------------- */
  const downloadFile = async (file) => {
    try {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        window.open(url);
        return;
      }

      const response = await fetch(`${API_URL}${file}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setOpenDialog(false);

    const formData = new FormData();
    Object.entries(investData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      }
    });

    formData.append("selected_submodules", JSON.stringify(selectedChecks));
    formData.append("form_submit", "True");
    formData.append("added_by", userID);
    formData.append("modify_by", userID);

    try {
      await axios.post(
        `${API_URL}/Screening/investigation_post_api/${pkid}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSnackbar({
        open: true,
        message: "Investigation submitted successfully!",
        severity: "success",
      });

      onAcceptClick(nextName);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to submit investigation!",
        severity: "error",
      });
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Box>
      {/* CONFIRM DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          Are you sure you want to submit the investigation reports?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmSubmit}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card sx={{ p: 2, borderRadius: 3 }}>
        {/* CHECKBOXES */}
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {investtData.map((data, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={selectedChecks.includes(data.submoduleName)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedChecks([
                        ...selectedChecks,
                        data.submoduleName,
                      ]);
                    } else {
                      setSelectedChecks(
                        selectedChecks.filter(
                          (item) => item !== data.submoduleName
                        )
                      );
                    }
                  }}
                />
              }
              label={data.submoduleName}
            />
          ))}
        </Box>

        {/* FILE UPLOADS */}
        <Grid container spacing={3} mt={2}>
          {[
            ["Blood Report", "investigation_report"],
            ["Urine Report", "urine_report"],
            ["ECG Report", "ecg_report"],
            ["X-Ray Report", "x_ray_report"],
          ].map(
            ([label, field]) =>
              selectedChecks.includes(label) && (
                <Grid item xs={12} md={6} key={field}>
                  <Typography mb={1}>{label}</Typography>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, field)}
                  />

                  {investData[field]?.length > 0 && (
                    <IconButton
                      color="primary"
                      onClick={() => handlePreview(investData[field][0])}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  )}
                  {investData[field]?.length > 0 && (
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        investData[field].forEach((file) =>
                          handleDownload(file)
                        )
                      }
                    >
                      <CloudDownloadOutlinedIcon />
                    </IconButton>
                  )}

                  <Typography variant="caption">
                    {investData[field]?.length
                      ? `${investData[field].length} file(s) uploaded`
                      : "No file uploaded"}
                  </Typography>
                </Grid>
              )
          )}
        </Grid>
      </Card>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>File Preview</DialogTitle>

        <DialogContent dividers>
          {previewType === "pdf" && (
            <iframe
              src={previewFile}
              width="100%"
              height="500px"
              title="PDF Preview"
            />
          )}

          {["jpg", "jpeg", "png"].includes(previewType) && (
            <img
              src={previewFile}
              alt="Preview"
              style={{ width: "100%", maxHeight: 500 }}
            />
          )}

          {!["pdf", "jpg", "jpeg", "png"].includes(previewType) && (
            <Typography color="error">
              Preview not available for this file type
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Box textAlign="center" mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default InvestigationInfo;
