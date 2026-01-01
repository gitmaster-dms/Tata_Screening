import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Box,
  Typography,
  Card,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from '@mui/material';
import { API_URL } from '../../../../../../Config/api';

const Immunisation = ({ pkid, citizensPkId, dob, fetchVital, selectedName, onAcceptClick }) => {
  const [nextName, setNextName] = useState('');
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [immunizationData, setImmunizationData] = useState([]);
  const [apiError, setApiError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const accessToken = localStorage.getItem('token');
  const userID = localStorage.getItem('userID');
  // const API_URL = process.env.REACT_APP_API_KEY;

  // Calculate Next Section Name
  useEffect(() => {
    if (fetchVital && selectedName) {
      const currentIndex = fetchVital.findIndex(item => item.screening_list === selectedName);
      if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
        setNextName(fetchVital[currentIndex + 1].screening_list);
      } else {
        setNextName('');
      }
    }
  }, [selectedName, fetchVital]);

  // Fetch Immunisation Master Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/Screening/get_immunisation/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setData(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [API_URL]);

  // Fetch Citizen-specific Data
const fetchData1 = async () => {
  try {
    const res = await axios.get(`${API_URL}/Screening/immunisation_get_api/${pkid}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setData1(res.data);
  } catch (error) {
    console.error('Error fetching citizen data:', error);
  }
};
useEffect(() => {
  fetchData1();
}, [API_URL, pkid]);


  // Set Immunisation Data State
  useEffect(() => {
    setImmunizationData(
      data.map(item => ({
        immunisations: item.immunisations,
        given_yes_no: '',
        scheduled_date_from: item.scheduled_date_from || '',
        scheduled_date_to: item.scheduled_date_to || '',
        window_period_days_from: item.window_period_days_from || '',
        window_period_days_to: item.window_period_days_to || '',
      }))
    );
  }, [data]);

  // Handle Field Changes
const handleInputChange = async (index, field, value, i_pk_id) => {
  const updated = [...immunizationData];
  updated[index][field] = value;

  if (field === 'given_yes_no' && (value === '1' || value === '2')) {
    updated[index].scheduled_date_from = '';
    updated[index].scheduled_date_to = '';
  }

  if (field === 'given_yes_no' && value === '3') {
    try {
      const res = await axios.get(`${API_URL}/Screening/calculate_days/${dob}/${i_pk_id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setApiResponse(res.data.status);
      setShowModal(true);
    } catch (error) {
      setApiError('Error fetching data from the API');
      setShowModal(true);
    }
  }

  setImmunizationData(updated);
};


  const handleCloseModal = () => {
    setShowModal(false);
    setApiResponse(null);
    setApiError(null);
  };

  const normalizeForPayload = (item) => ({
  immunisations: item.immunisations,
  given_yes_no: item.given_yes_no || null,
  scheduled_date_from: item.scheduled_date_from || null,
  scheduled_date_to: item.scheduled_date_to || null,
  window_period_days_from: item.window_period_days_from || null,
  window_period_days_to: item.window_period_days_to || null,
});


  
  // Save Data
const handleSave = async () => {
  const confirmationStatus = 'True';

  // Prioritize citizen-filled data (data1). Fallback to master data.
const source = immunizationData;


  // Final normalized payload (converts blank → null)
  const finalPayload = source.map(item => normalizeForPayload({
    immunisations: item.immunisations,
    given_yes_no: item.given_yes_no,
    scheduled_date_from: item.scheduled_date_from,
    scheduled_date_to: item.scheduled_date_to,
    window_period_days_from: item.window_period_days_from,
    window_period_days_to: item.window_period_days_to
  }));

  try {
    const response = await axios.post(
      `${API_URL}/Screening/immunisation_post_api/${pkid}/`,
      {
        name_of_vaccine: finalPayload,
        citizen_pk_id: citizensPkId,
        form_submit: confirmationStatus,
        modify_by: userID,
        added_by: userID,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (response.status === 201) {
      await fetchData1();
      onAcceptClick(nextName);
    }
  } catch (error) {
    console.error('Error posting data:', error);
  }
};


useEffect(() => {
  if (data.length === 0) return;

  const merged = data.map(master => {
    const matched = data1.length > 0
      ? data1[0].name_of_vaccine.find(v => v.immunisations === master.immunisations)
      : null;

    return {
      immunisations: master.immunisations,
      given_yes_no: matched?.given_yes_no || '',
      scheduled_date_from: matched?.scheduled_date_from || master.scheduled_date_from || '',
      scheduled_date_to: matched?.scheduled_date_to || master.scheduled_date_to || '',
      window_period_days_from: master.window_period_days_from || '',
      window_period_days_to: master.window_period_days_to || '',
      immunization_info_pk_id: matched?.immunization_info_pk_id || master.immunization_info_pk_id
    };
  });

  setImmunizationData(merged);
}, [data, data1]);



  return (
    <Box>
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: 300,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1">{apiResponse || apiError}</Typography>
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

      <Card sx={{ borderRadius: "20px", p: 0.5, mb: 1, background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)" }}>
        <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "white" }}>
          Immunisation
        </Typography>
      </Card> 

      {apiError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )}

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: "20px", p: 1, mb: 1, background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)", color: "white" }}>
            <Grid container>
              <Grid item xs={3}>
                <Typography sx={{fontSize:"15px",fontWeight:550,fontFamily:"Roboto ,sans-serif"}}>Name of Vaccine</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{fontSize:"15px",fontWeight:550,fontFamily:"Roboto,sans-serif"}}>Given Yes/No</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography sx={{fontSize:"15px",fontWeight:550,fontFamily:"Roboto,sans-serif"}} align="center">
                  Scheduled Date (From / To)
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{fontSize:"15px",fontWeight:550,fontFamily:"Roboto,sans-serif"}} align="center">
                  Days From
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{fontSize:"15px",fontWeight:550,fontFamily:"Roboto,sans-serif"}} align="center">
                  Days To
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

      {immunizationData.map((item, index) => (
  <Grid item xs={12} key={index}>
    <Card sx={{ borderRadius: "20px", p: 1, background: "white", color: "black" }}>
      <Grid container spacing={1} alignItems="center">

        {/* Vaccine Name */}
        <Grid item xs={3}>
          <Typography sx={{fontSize:"13px",fontWeight:500,fontFamily:"Roboto,sans-serif"}}>{item.immunisations}</Typography>
        </Grid>

        {/* Given Yes/No */}
        <Grid item xs={2} sm={3} md={2}>
          <Select
            size="small"
            fullWidth
            value={item.given_yes_no || ""}
            onChange={(e) =>
              handleInputChange(
                index,
                "given_yes_no",
                e.target.value,
                item.immunization_info_pk_id
              )
            }
             sx={{
                
                "& .MuiInputBase-input.MuiSelect-select": {
                  color: "#000 !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "#000",
                },
              }}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="1">Already Taken</MenuItem>
            <MenuItem value="2">Already Taken (ODR)</MenuItem>
            <MenuItem value="3">Not Yet Taken</MenuItem>
          </Select>
        </Grid>

        {/* Dates */}
        <Grid item xs={5} sm={6} md={5}>
          <Grid container spacing={1}>
            {/* From Date */}
            <Grid item xs={6}>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={item.scheduled_date_from || ""}
                onChange={(e) =>
                  handleInputChange(index, "scheduled_date_from", e.target.value)
                }
                inputProps={{
                  max:
                    item.given_yes_no === "1" || item.given_yes_no === "2"
                      ? new Date().toISOString().split("T")[0]
                      : undefined,
                  min:
                    item.given_yes_no === "3"
                      ? new Date().toISOString().split("T")[0]
                      : undefined,
                }}
                sx={{
                  bgcolor:
                    item.given_yes_no === "1"
                      ? "#90EE90"
                      : item.given_yes_no === "2"
                      ? "#FFC000"
                      : item.given_yes_no === "3"
                      ? "#FF726F"
                      : "",
                  borderRadius: 1,
                }}
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={6}>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={item.scheduled_date_to || ""}
                onChange={(e) =>
                  handleInputChange(index, "scheduled_date_to", e.target.value)
                }
                disabled={item.given_yes_no === "1" || item.given_yes_no === "2"}
                inputProps={{
                  max:
                    item.given_yes_no === "1" || item.given_yes_no === "2"
                      ? new Date().toISOString().split("T")[0]
                      : undefined,
                  min:
                    item.given_yes_no === "3"
                      ? new Date().toISOString().split("T")[0]
                      : undefined,
                }}
                sx={{
                  bgcolor: item.given_yes_no === "3" ? "#FF726F" : "",
                  borderRadius: 1,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Days From */}
        <Grid item xs={1}>
          <Typography variant="body2" align="center">
            {item.window_period_days_from || "-"}
          </Typography>
        </Grid>

        {/* Days To */}
        <Grid item xs={1}>
          <Typography variant="body2" align="center">
            {item.window_period_days_to || "-"}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  </Grid>
))}
      </Grid >

      <Grid
        item
        xs={12}
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
  variant="contained"
  color="primary"
  size="medium"
  onClick={() => setOpenConfirmDialog(true)}
  sx={{
    textTransform: "none",
    borderRadius: 2,
    mb: 3
  }}
>
  Submit
</Button>
      </Grid>
      <Dialog
  open={openConfirmDialog}
  onClose={() => setOpenConfirmDialog(false)}
>
  <DialogTitle>Confirm Submission</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to submit the Immunisation Form?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
      Cancel
    </Button>
    <Button
      onClick={() => {
        setOpenConfirmDialog(false);
        handleSave(); // Actual submit function
      }}
      color="primary"
      variant="contained"
    >
      Confirm
    </Button> 
  </DialogActions>
</Dialog>
    </Box >
  );
};

export default Immunisation;
