import React from 'react';
import {Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import HomePage from './pages/HomePAge/HomePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import Navbar from './components/Navbar/Navbar'
function App() {
  return (
    <>
    {window.location.pathname !== '/auth' && <Navbar />}
      <Routes>
      <Route element={<PrivateRoute />}>
          <Route path='/' element={<HomePage/>}/>
          <Route path="/home" element={<HomePage />} />
        </Route>
        <Route path='/auth' element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;
