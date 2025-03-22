import React from 'react';
import ChatbotForm from '../components/ChatbotForm';

export default function Chatbot() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Diabetes Risk Assessment</h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill in your details below to assess your diabetes risk factors
          </p>
        </div>
        <ChatbotForm />
      </div>
    </div>
  );
}