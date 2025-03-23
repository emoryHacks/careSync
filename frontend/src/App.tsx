import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import Chatbot from './pages/Chatbot';
import FoodIntake from './pages/FoodIntake';
import Navbar from './components/Navbar';
import { useLocation } from 'react-router-dom';

function App() {
const location = useLocation();
console.log(location.pathname); 
  return (
    <AuthProvider>
      {location.pathname != '/register' && location.pathname != "/login" && <Navbar />}
      <main className="container mx-auto">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/food-intake" element={<FoodIntake />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;