import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Utensils, Calendar, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClasses = (path: string) => {
    return `flex items-center space-x-2 transition-colors duration-200 ${
      location.pathname === path
        ? 'text-blue-600 font-semibold'
        : 'text-gray-600 hover:text-blue-600'
    }`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className={getLinkClasses('/')}>
              <Home size={24} />
              <span>Home</span>
            </Link>
            <Link to="/chatbot" className={getLinkClasses('/chatbot')}>
              <MessageSquare size={24} />
              <span>Chatbot</span>
            </Link>
            <Link to="/food-intake" className={getLinkClasses('/food-intake')}>
              <Utensils size={24} />
              <span>Food Intake</span>
            </Link>
            <Link to="/appointments" className={getLinkClasses('/appointments')}>
              <Calendar size={24} />
              <span>Appointments</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User size={20} />
              <span>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
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