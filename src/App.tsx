import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import './App.css';
import Signup from './components/signup';
import Login from './components/login';
import TodoList from './components/todo';

function App() {
  return (
    <Router>
    <Routes>
    <Route path="/" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>} />
      <Route path="/todo" element={<TodoList/>} />
    </Routes>
    </Router>
  );
}

export default App;

