import React, { useState, useEffect } from 'react';
import '../Login/Login.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  clg_ref_id: Yup.string().required('User Name is required'),
  password: Yup.string().required('Password is required'),
});

const Login = ({ onLogin, isLoggedIn }) => {
  const [error, setError] = useState('');
  const Port = process.env.REACT_APP_API_KEY;
  let history = useNavigate();

  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      history(`/mainscreen`); // Redirect to the dashboard or any other page
    }
  }, [isLoggedIn, history]);

  const isTokenExpired = () => {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (!tokenExpiration) {
      return true; // Token does not exist or expired
    }

    const expirationTime = new Date(tokenExpiration).getTime();
    const currentTime = new Date().getTime();

    return currentTime > expirationTime;
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
            history('/');
          } else {
            console.error('Logout failed:', response.statusText);
          }
        } catch (error) {
          console.error('Logout error:', error.message);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const isExpired = isTokenExpired();
      if (isExpired) {
        localStorage.clear(); // Clear expired token and related data
        history('/'); // Redirect to login page
      } else {
        history('/mainscreen');
      }
    }
  }, [isLoggedIn, history]);

  const [logoUrl, setLogoUrl] = useState('');

  const formik = useFormik({
    initialValues: {
      clg_ref_id: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${Port}/Screening/login/`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clg_ref_id: values.clg_ref_id,
            password: values.password,
          }),
        });

        console.log('Request Body:', JSON.stringify({
          clg_ref_id: values.clg_ref_id,
          password: values.password,
        }));

        if (response.status === 200) {
          const json = await response.json();
          const colleagueId = json.token.colleague.id;
          console.log(colleagueId, 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');

          const colleagueEmail = json.token.colleague.email;
          localStorage.setItem('colleagueEmail', colleagueEmail);

          const phoneNumber = json.token.colleague.phone_no;
          localStorage.setItem('phoneNumber', phoneNumber);

          const location = json.token.colleague.address;
          localStorage.setItem('location', location);

          const name = json.token.colleague.name;
          localStorage.setItem('name', name);

          const logo = json.registration_details.Registration_details;
          const logoUrl = `${Port}${logo}`; // Construct the URL
          setLogoUrl(logoUrl, 'jhjhhhhhhhhhhhhhhhhhhhhhhhh'); // Set the URL in state
          localStorage.setItem('logoooooooooooooooooooooooooooo', `${Port}${logo}`);

          console.log(logoUrl); // Log the URL to the console

          localStorage.setItem('refreshToken', json.token.refresh);
          localStorage.setItem('userID', json.token.colleague.id);
          localStorage.setItem('UserGroup:', json.user_group);
          localStorage.setItem('token', json.token.access);
          localStorage.setItem('refresh', json.token.refresh);
          localStorage.setItem('usergrp', json.token.user_group);


          //State District Tehsil LocalStorage SetUp
          localStorage.setItem('StateLogin', json.token?.colleague?.clg_source?.clg_state_id)
          console.log('StateLogin', json.token?.colleague?.clg_source?.clg_state_id)

          localStorage.setItem('DistrictLogin', json.token?.colleague?.clg_source?.clg_district_id)
          localStorage.setItem('TehsilLogin', json.token?.colleague?.clg_source?.clg_tahsil_id)

          // fetch source
          localStorage.setItem('loginSource', json.token?.colleague?.clg_source?.source_id)
          console.log('login source getting.....', json.token?.colleague?.clg_source?.source_id);

          // fetch sourceName
          localStorage.setItem('SourceNameFetched', json.token?.colleague?.clg_source?.source_name_id)
          console.log('login source name getting......', json.token?.colleague?.clg_source?.source_name_id);

          const stringValue = JSON.stringify(json.token.permissions);
          localStorage.setItem('permissions', stringValue);
          localStorage.setItem('path', json.token.permissions[0].modules_submodule[0].moduleName);
          history(`/mainscreen/${json.token.permissions[0].modules_submodule[0].moduleName}`);

          const isAuthenticated = true; // Replace with your actual authentication logic

          if (isAuthenticated) {
            onLogin();
            history(`/mainscreen/${json.token.permissions[0].modules_submodule[0].moduleName}`);
          } else {
            setError('Invalid username or password');
          }
        } else if (response.status === 400) {
          setLoginError('Invalid credentials. Please try again.');
        } else if (response.status === 409) {
          alert("User Already Logged In")
        } else {
          setLoginError('Invalid username or password ');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setLoginError('An error occurred during login. Please try again.');
      }
    },
  });

  return (
    <div className='container-fluid'>
      <div className='row login_container'>
        <div className='col-md-4 offset-md-8 login'>
          <div className='login-form mt-5'>
            <h4 className='d-flex justify-content-center mb-4 login_head'>Login</h4>
            <form onSubmit={formik.handleSubmit}>
              <div class="mb-3">
                <label class="form-label loginlable" style={{ fontFamily: 'Roboto', fontSize: '16px' }}>User Name</label>
                <input type="text" class="form-control"
                  className={`form-control ${formik.touched.clg_ref_id && formik.errors.clg_ref_id ? 'is-invalid' : ''}`}
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder='Enter UserName'
                  name='clg_ref_id'
                  required
                  value={formik.values.clg_ref_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginTop: '-0.4em' }}
                />
                {formik.touched.clg_ref_id && formik.errors.clg_ref_id && (
                  <div className='invalid-feedback'>{formik.errors.clg_ref_id}</div>
                )}
              </div>
              <div class="mb-3">
                <label class="form-label" style={{ fontFamily: 'Roboto', fontSize: '16px' }}>Password</label>
                <input
                  type='password'
                  className={`form-control loginlable ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                  placeholder='Enter Password'
                  name='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  style={{ marginTop: '-0.4em' }}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='invalid-feedback'>{formik.errors.password}</div>
                )}

              </div>
              {loginError && <div className='alert alert-danger p-2' style={{ fontSize: '.8rem' }}>{loginError}</div>}
              <div className='d-flex justify-content-center my-4'>
                <button className='btn px-5' type='submit' disabled={formik.isSubmitting} style={{ backgroundColor: '#313774', color: '#ffffff' }}>Submit</button>
              </div>
              {error && <p>{error}</p>}
            </form>
          </div>
        </div>
        {/* <div className='col-md-8 mt-2'>
          <img src={loginiomage} style={{ height: '25rem', marginLeft: '8rem', margin: '1rem 0 0s' }} className='d-flex justify-content-center' />
        </div> */}
      </div>
    </div>
  )
}

export default Login
