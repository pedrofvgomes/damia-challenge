import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './Authentication';
import Layout from './Layout';
import Positions from './Positions';
import Candidates from './Candidates';
import Recruiters from './Recruiters';
import Application from './Application';
import ApplicationForm from './ApplicationForm';
import Create from './Create';
import axios from 'axios';

// interceptor for axios to use the token
axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => Promise.reject(error)
)

const App = () => {
  const [whereToRedirect, setWhereToRedirect] = React.useState('/');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/authentication' element={<Authentication />} />
        <Route path='*' element={<Layout setWhereToRedirect={setWhereToRedirect} />}>
          <Route index element={<Navigate to={whereToRedirect} />} />
          <Route path='recruiters' element={<Recruiters />} />
          <Route path='candidates' element={<Candidates />} />
          <Route path='applications/:id' element={<Application />} />
          <Route path='positions' element={<Positions />} />
          <Route path='apply/:id' element={<ApplicationForm />} />
          <Route path='create' element={<Create />} />
          <Route path='*' element={<Navigate to={whereToRedirect} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
