import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import HomePage from './pages/HomePage/HomePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Navbar from './components/Navbar/Navbar';
import GroupsPage from './pages/Group/GroupsPage';
import ChatRoom from './pages/Group/ChatRoom';
import './App.css';
import TimeTable from './pages/TimeTable/TimeTable';
import Flashcards from './pages/Flashcard/Flashcards';
import Task from './pages/Task/Task';
import AboutPage from './pages/About/AboutPage'
import DoubtChat from './pages/Doubt/DoubtChat';
function App() {
  
  return (
    
        <>
          {window.location.pathname !== '/auth' && <Navbar />}
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<HomePage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/chatroom/:groupId" element={<ChatRoom />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/TimeTable" element={<TimeTable />} />
              <Route path="/Task" element={<Task />} />
              <Route path="/about" element={<AboutPage/>} />
              <Route path="/doubt" element={<DoubtChat/>} />
            </Route>
            <Route path='/auth' element={<AuthPage />} />
          </Routes>
        </>

  );
}

export default App;
