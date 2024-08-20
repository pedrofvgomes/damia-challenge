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
