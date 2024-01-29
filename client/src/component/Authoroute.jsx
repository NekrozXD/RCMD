// AuthRoute.jsx
import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const AuthRoute = ({ element, authenticated, redirectPath = '/' }) => {
  return authenticated ? element : <Navigate to={redirectPath} />;
};

export default AuthRoute;

