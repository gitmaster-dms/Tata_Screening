import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Checkbox
} from '@mui/material';

const Vision = ({ pkid, citizensPkId, fetchVital, selectedName, onAcceptClick }) => {
  const [nextName, setNextName] = useState('');
  const [specialist, setSpecialist] = useState(null);
  const [eyeMuscles, setEyeMuscles] = useState('');
  const [referractive, setReferractive] = useState('');
  const [editMode, setEditMode] = useState(false);

  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const source = localStorage.getItem('source');
  const userID = localStorage.getItem('userID');
  const userGroup = localStorage.getItem('usergrp');

  const [visionForm, setVisionForm] = useState({
    if_other_commnet: '',
    vision_with_glasses: '',
    vision_without_glasses: '',
    visual_perimetry: '',
    comment: '',
    treatment: '',
    color_blindness: '',
    vision_screening: '',
    vision_screening_comment: '',
    referred_to_surgery: '',
    citizen_pk_id: citizensPkId,
    re_near_without_glasses: null,
    re_far_without_glasses: null,
    le_near_without_glasses: null,
    le_far_without_glasses: null,
    re_near_with_glasses: null,
    re_far_with_glasses: null,
    le_near_with_glasses: null,
    le_far_with_glasses: null,
  });

  useEffect(() => {
    if (fetchVital && selectedName) {
      const currentIndex = fetchVital.findIndex(item => item.screening_list === selectedName);
      if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
        const nextItem = fetchVital[currentIndex + 1];
        setNextName(nextItem.screening_list);
      } else {
        setNextName('');
      }
    }
  }, [selectedName, fetchVital]);

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    if (name === "reffered_to_specialist") {
      setSpecialist(parseInt(value));
    } else if (name === "eye_muscle_control") {
      setEyeMuscles(value);
    } else if (name === "refractive_error") {
      setReferractive(value);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setVisionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm('Submit Vision Form');
    const confirmationStatus = isConfirmed ? 'True' : 'False';

    const formData = {
      ...visionForm,
      reffered_to_specialist: specialist,
      eye_muscle_control: eyeMuscles,
      refractive_error: referractive,
      citizen_pk_id: citizensPkId,
      form_submit: confirmationStatus,
      added_by: userID,
      modify_by: userID,
    };

    try {
      const response = await fetch(`${Port}/Screening/vision_post_api/${pkid}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
      }
    } catch (error) {
      console.error('Error sending data:', error.message);
    }

    onAcceptClick(nextName);
  };

  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(`${Port}/Screening/vision_get_api/${pkid}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const visionForm = data[0];
          setVisionForm(prev => ({
            ...prev,
            ...visionForm,
          }));
          setSpecialist(visionForm.reffered_to_specialist);
          setEyeMuscles(visionForm.eye_muscle_control?.toString());
          setReferractive(visionForm.refractive_error?.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchDataById(pkid);
  }, [pkid]);

  return (
    <Box >
      <Card sx={{ borderRadius: "20px", p: 1, mb: 1, background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)" }}>
        <Grid item xs={12} >
          <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "white" }}>
            Vision Screening
          </Typography>
        </Grid>
      </Card>

      <Grid item xs={12}>
        <Card sx={{ p: 1, borderRadius: "20px" }}>
          <form onSubmit={handleSubmit}>
            {source === '1' ? (
              <>
                {['UG-DOCTOR', 'UG-EXPERT', 'UG-SUPERADMIN', 'UG-ADMIN', 'CO-HR'].includes(userGroup) && (
                  <>
                    <Grid container spacing={2}>
                      {['Exophthalmos', 'Squint_nys', 'Tagmus', 'Other'].map((label) => (
                        <Grid item xs={3} key={label}>
                          <FormControlLabel
                            control={<Checkbox />}
                            label={label}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    <TextField
                      fullWidth
                      label="If Other / Comment"
                      name="if_other_commnet"
                      value={visionForm.if_other_commnet}
                      onChange={handleChange}
                      sx={{ mt: 2 }}
                    />
                  </>
                )}

                {['UG-EXPERT', 'UG-SUPERADMIN', 'UG-ADMIN', 'CO-HR'].includes(userGroup) && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Visual Acuity Test</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Vision With Glasses</InputLabel>
                          <Select
                            size='small'
                            name="vision_with_glasses"
                            value={visionForm.vision_with_glasses}
                            onChange={handleChange}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="2">Good</MenuItem>
                            <MenuItem value="1">Poor</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Vision Without Glasses</InputLabel>
                          <Select
                            size='small'
                            name="vision_without_glasses"
                            value={visionForm.vision_without_glasses}
                            onChange={handleChange}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="1">Good</MenuItem>
                            <MenuItem value="2">Poor</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>Eye Muscle Control</Typography>
                    <RadioGroup row name="eye_muscle_control" value={eyeMuscles} onChange={handleRadioChange}>
                      <FormControlLabel value="1" control={<Radio />} label="Good" />
                      <FormControlLabel value="2" control={<Radio />} label="Poor Control" />
                      <FormControlLabel value="3" control={<Radio />} label="Poor Coordination" />
                    </RadioGroup>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>Refractive Error</Typography>
                    <RadioGroup row name="refractive_error" value={referractive} onChange={handleRadioChange}>
                      <FormControlLabel value="1" control={<Radio />} label="Yes" />
                      <FormControlLabel value="2" control={<Radio />} label="No" />
                    </RadioGroup>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Visual Field Perimetry"
                          name="visual_perimetry"
                          value={visionForm.visual_perimetry}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Comment"
                          name="comment"
                          value={visionForm.comment}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Treatment Given"
                          name="treatment"
                          value={visionForm.treatment}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Color Blindness</InputLabel>
                          <Select
                            size='small'
                            name="color_blindness"
                            value={visionForm.color_blindness}
                            onChange={handleChange}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="1">Yes</MenuItem>
                            <MenuItem value="2">No</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Vision Screening</InputLabel>
                          <Select
                            name="vision_screening"
                            value={visionForm.vision_screening}
                            onChange={handleChange}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="1">Hypermertropia</MenuItem>
                            <MenuItem value="2">Myopia</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Vision Screening Comment"
                          name="vision_screening_comment"
                          value={visionForm.vision_screening_comment}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel>Referred to Surgery</InputLabel>
                          <Select
                            name="referred_to_surgery"
                            value={visionForm.referred_to_surgery}
                            onChange={handleChange}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="1">Yes</MenuItem>
                            <MenuItem value="2">No</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>Referred To Specialist</Typography>
                    <RadioGroup row name="reffered_to_specialist" value={specialist} onChange={handleRadioChange}>
                      <FormControlLabel value={1} control={<Radio />} label="Yes" />
                      <FormControlLabel value={2} control={<Radio />} label="No" />
                    </RadioGroup>
                  </>
                )}
              </>
            ) : (
              <>
                <Grid container spacing={2}>
                  {[
                    { title: 'Vision Without Glasses', near: ['re_near_without_glasses', 'le_near_without_glasses'], far: ['re_far_without_glasses', 'le_far_without_glasses'] },
                    { title: 'Vision With Glasses', near: ['re_near_with_glasses', 'le_near_with_glasses'], far: ['re_far_with_glasses', 'le_far_with_glasses'] }
                  ].map((section, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                        {section.title}
                      </Typography>

                      {/* Near Section */}
                      <Grid container spacing={2} alignItems="center" sx={{ mt: 1, mr: 2 }}>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Near</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4.5}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Right"
                            name={section.near[0]}
                            value={visionForm[section.near[0]]}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4.5}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Left"
                            name={section.near[1]}
                            value={visionForm[section.near[1]]}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>

                      {/* Far Section */}
                      <Grid container spacing={2} alignItems="center" sx={{ mt: 1, mr: 2 }}>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Far</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4.5}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Right"
                            name={section.far[0]}
                            value={visionForm[section.far[0]]}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4.5}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Left"
                            name={section.far[1]}
                            value={visionForm[section.far[1]]}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel>Color Blindness</InputLabel>
                      <Select
                        sx={{
                          "& .MuiInputBase-input.MuiSelect-select": {
                            color: "#000 !important",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "#000",
                          },
                        }}
                        size='small'
                        name="color_blindness"
                        value={visionForm.color_blindness}
                        onChange={handleChange}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="1">Yes</MenuItem>
                        <MenuItem value="2">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      size='small'
                      fullWidth
                      label="Comment"
                      name="comment"
                      value={visionForm.comment}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Referred To Specialist</Typography>
                    <RadioGroup row name="reffered_to_specialist" value={specialist} onChange={handleRadioChange}>
                      <FormControlLabel value={1} control={<Radio />} label="Yes" />
                      <FormControlLabel value={2} control={<Radio />} label="No" />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </>
            )}

            <Box sx={{ textAlign: 'center' }}>
              <Button type="submit" variant="contained" size="small">Submit</Button>
            </Box>
          </form>
        </Card>
      </Grid>
    </Box>
  );
};

export default Vision;
