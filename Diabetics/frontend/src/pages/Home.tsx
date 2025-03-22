import React from 'react';
import { Activity, Brain, Heart, Users } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Health Companion</h1>
          <p className="text-xl text-gray-600">Track, manage, and improve your health journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Heart className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Health Monitoring</h3>
            <p className="text-gray-600">Track your vital signs and health metrics in real-time</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Brain className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Health Assistant</h3>
            <p className="text-gray-600">Get instant answers to your health questions</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Activity className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nutrition Tracking</h3>
            <p className="text-gray-600">Monitor your daily food intake and nutritional goals</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
              <Users className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Doctor Appointments</h3>
            <p className="text-gray-600">Schedule and manage your medical appointments</p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80"
            alt="Healthcare professionals"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 mb-4">
              We provide a comprehensive healthcare management platform that puts you in control of your health journey.
              With advanced AI technology, real-time monitoring, and professional medical support, we ensure you receive
              the best possible care and guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}