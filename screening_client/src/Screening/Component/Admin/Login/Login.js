import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  Paper,
} from '@mui/material';

const validationSchema = Yup.object().shape({
  clg_ref_id: Yup.string().required('User Name is required'),
  password: Yup.string().required('Password is required'),
});

const Login = ({ onLogin, isLoggedIn }) => {
  const [error, setError] = useState('');
  const Port = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/mainscreen');
    }
  }, [isLoggedIn, navigate]);

  const isTokenExpired = () => {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (!tokenExpiration) return true;
    return new Date().getTime() > new Date(tokenExpiration).getTime();
  };

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const isExpired = isTokenExpired();
      if (!isExpired) {
        try {
          const refreshToken = localStorage.getItem('refresh');
          const clgId = localStorage.getItem('userID');
          const response = await axios.post(`${Port}/Screening/logout/`, { refreshToken, clg_id: clgId });
          if (response.status >= 200 && response.status < 300) {
            console.log('Logout successful');
            localStorage.removeItem('refreshToken');
            navigate('/');
          }
        } catch (error) {
          console.error('Logout error:', error.message);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [Port, navigate]);

  useEffect(() => {
    if (isLoggedIn && isTokenExpired()) {
      localStorage.clear();
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const formik = useFormik({
    initialValues: { clg_ref_id: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${Port}/Screening/login/`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (response.status === 200) {
          const json = await response.json();
          localStorage.setItem('refreshToken', json.token.refresh);
          localStorage.setItem('userID', json.token.colleague.id);
          localStorage.setItem('token', json.token.access);

          // other localStorage items...
          onLogin();
          navigate(`/mainscreen/${json.token.permissions[0].modules_submodule[0].moduleName}`);
        } else if (response.status === 400) {
          setLoginError('Invalid credentials. Please try again.');
        } else if (response.status === 409) {
          alert("User Already Logged In");
        } else {
          setLoginError('Invalid username or password');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setLoginError('An error occurred during login. Please try again.');
      }
    },
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'flex-end', // aligns to the right
        alignItems: 'center', // vertical centering
        minHeight: '100vh', // make it take full screen height
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="User Name"
            name="clg_ref_id"
            value={formik.values.clg_ref_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.clg_ref_id && Boolean(formik.errors.clg_ref_id)}
            helperText={formik.touched.clg_ref_id && formik.errors.clg_ref_id}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />

          {loginError && <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
              sx={{ px: 5, py: 1.5 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>

  );
};

export default Login;
