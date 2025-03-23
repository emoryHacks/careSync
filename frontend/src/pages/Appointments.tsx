import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PatientApp from '../components/PatientApp.tsx';
import DoctorAppointments from '../components/DoctorAppointments.tsx';


export default function App() {
  const { user } = useAuth();
  
  return user?.role === 'doctor' ? <DoctorAppointments /> : <PatientApp />;
}