import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import HomePage from './pages/HomePAge/HomePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Navbar from './components/Navbar/Navbar';
import Group from './pages/Group/Group';
import { AuthProvider } from './context/AuthContext/AuthContext'; // Import your Auth Provider
import { SocketProvider } from './context/SocketContext/SocketContext'; // Import your Socket Provider

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <>
          {window.location.pathname !== '/auth' && <Navbar />}
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path='/group' element={<Group />} />
            </Route>
            <Route path='/auth' element={<AuthPage />} />
          </Routes>
        </>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
