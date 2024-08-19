import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Authentication from './Authentication';
import Layout from './Layout';
import Dashboard from './Dashboard';
import CompleteProfile from './CompleteProfile';
import Browse from './Browse';
import Position from './Position';

const App = observer(() => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/authentication' element={<Authentication />} />
        <Route path='/complete-profile' element={<CompleteProfile />} />
        <Route path='*' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='browse' element={<Browse />} />
          <Route path='position/:id' element={<Position />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
});

export default App;
