import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Authentication from './Authentication';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Positions from './Positions';
import Candidates from './Candidates';
import Candidate from './Candidate';
import Recruiters from './Recruiters';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/authentication' element={<Authentication />} />
        <Route path='*' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='recruiters' element={<Recruiters />} />
          <Route path='candidates' element={<Candidates />} />
          <Route path='candidates/:id' element={<Candidate />} />
          <Route path='positions' element={<Positions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
