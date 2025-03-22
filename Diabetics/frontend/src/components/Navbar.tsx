import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Utensils, Calendar, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-blue-600">
              <Home size={24} />
              <span className="font-semibold">Home</span>
            </Link>
            <Link to="/chatbot" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <MessageSquare size={24} />
              <span>Chatbot</span>
            </Link>
            <Link to="/food-intake" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <Utensils size={24} />
              <span>Food Intake</span>
            </Link>
            <Link to="/appointments" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <Calendar size={24} />
              <span>Appointments</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
              <User size={20} />
              <span>{user?.name}</span>
            
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </button>
          </div>
        </div>
      </div>
    </nav>
  );
}