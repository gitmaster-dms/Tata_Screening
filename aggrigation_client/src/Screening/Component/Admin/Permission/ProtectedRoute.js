// ProtectedRoute.js
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? <Component {...props} /> : <useNavigate to="/" />
    }
  />
);

export default ProtectedRoute;
