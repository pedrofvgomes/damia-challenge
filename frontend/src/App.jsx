import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Authentication from './Authentication';
import Layout from './Layout';
import Dashboard from './Dashboard';
import CompleteProfile from './CompleteProfile';
import Positions from './Positions';
import Position from './Position';
import Candidates from './Candidates';
import Candidate from './Candidate';

const App = observer(() => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/authentication' element={<Authentication />} />
        <Route path='/complete-profile' element={<CompleteProfile />} />
        <Route path='*' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='candidates' element={<Candidates />} />
          <Route path='candidates/:id' element={<Candidate />} />
          <Route path='positions' element={<Positions />} />
          <Route path='positions/:id' element={<Position />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
});

export default App;
