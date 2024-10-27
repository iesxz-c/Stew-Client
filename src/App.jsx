import React from 'react';
import {Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/auth' element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;