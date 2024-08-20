import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './Authentication';
import Layout from './Layout';
import Positions from './Positions';
import Candidates from './Candidates';
import Recruiters from './Recruiters';
import Application from './Application';
import ApplicationForm from './ApplicationForm';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/authentication' element={<Authentication />} />
        <Route path='*' element={<Layout />}>
          <Route index element={<Navigate to='/candidates' />} />
          <Route path='recruiters' element={<Recruiters />} />
          <Route path='candidates' element={<Candidates />} />
          <Route path='applications/:id' element={<Application />} />
          <Route path='positions' element={<Positions />} />
          <Route path='apply/:id' element={<ApplicationForm />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
