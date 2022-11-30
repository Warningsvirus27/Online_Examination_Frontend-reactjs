import React from 'react';
import {
  Route,
  Routes
} from "react-router-dom";

import './App.css';
import Homepage from './pages/student/Homepage';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Edit from './pages/Edit';
import MySubscription from './pages/student/MySubscription';
import TestHistory from './pages/student/TestHistory';
import Test from './pages/student/Test';
import StartTest from './pages/student/StartTest';
import EditCourse from './pages/staff/EditCourse';
import EditTest from './pages/staff/EditTest';

const App = () => {
  return (
        <div className='App'>
          <Routes>
            <Route exact path="" element={<Homepage />}/>
            <Route exect path="/login" element={<Login />}/>
            <Route exect path="/logout" element={<Logout />}/>
            <Route exect path="/register" element={<Register/>}/>
            <Route exact path="/edit" element={<Edit/>}/>
            <Route exact path="/subscriptions" element={<MySubscription/>}/>
            <Route exact path="/test" element={<Test/>}/>
            <Route exact path="/test_history" element={<TestHistory/>}/>
            <Route exact path="/start_test" element={<StartTest/>}/>
            <Route exact path="/course" element={<EditCourse />}/>
            <Route exact path='/test_view' element={<EditTest/>}/>
          </Routes>
        </div>
  )
}

export default App