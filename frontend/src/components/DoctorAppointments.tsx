import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, FileText, X , VenetianMask} from 'lucide-react';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  medicalHistory: string;
}

interface Appointment {
  id: string;
  patientId: string;
  date: Date;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  videoLink: string;
  patient: Patient;
}

// Mock data for demonstration
const mockPatients: Record<string, Patient> = {
  'p1': {
    id: 'p1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    email: 'john.smith@email.com',
    medicalHistory: 'Type 2 Diabetes, Hypertension'
  },
  'p2': {
    id: 'p2',
    name: 'Emma Wilson',
    age: 32,
    gender: 'Female',
    email: 'emma.w@email.com',
    medicalHistory: 'Gestational Diabetes'
  },
  'p3': {
    id: 'p3',
    name: 'Michael Brown',
    age: 58,
    gender: 'Male',
    email: 'michael.b@email.com',
    medicalHistory: 'Type 1 Diabetes, High Cholesterol'
  }
};

// const mockAppointments: Appointment[] = [
//   {
//     id: 'a1',
//     patientId: 'p1',
//     date: new Date('2025-03-22T10:00:00'),
//     type: 'Diabetes Consultation',
//     status: 'upcoming',
//     videoLink: 'https://gsumeetings.webex.com/meet/rnarra2'
//   },
//   {
//     id: 'a2',
//     patientId: 'p2',
//     date: new Date('2025-03-22T14:00:00'),
//     type: 'Glucose Monitoring Review',
//     status: 'upcoming',
//     videoLink: 'https://gsumeetings.webex.com/meet/rnarra2'
//   },
//   {
//     id: 'a3',
//     patientId: 'p3',
//     date: new Date('2025-03-23T11:00:00'),
//     type: 'Diabetes Management Plan',
//     status: 'upcoming',
//     videoLink: 'https://gsumeetings.webex.com/meet/rnarra2'
//   }
// ];

export default function DoctorAppointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
//   const [appointments] = useState<Appointment[]>(mockAppointments);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentNotes, setAppointmentNotes] = useState<Record<string, string>>({});
    
    useEffect(() => {
        const fetchDoctorAppointments = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/doctor_appointments', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            const mapped = res.data.map((apt: any) => ({
                id: apt._id,
                patientId: apt.patientId,
                date: new Date(`${apt.date} ${apt.time}`),
                type: apt.appointmentType,
                videoLink: apt.videoLink,
                status: 'upcoming',
                patient: {
                    name: apt.patient?.name || 'Unknown',
                    age: apt.patient?.age || 'N/A',
                    gender: apt.patient?.gender || 'Male',
                    email: apt.patient?.email || 'johndoe@gmail.com',
                    medicalHistory: apt.patient?.medicalHistory || 'No history provided',
                },
            }));
            console.log(res);
    
            setAppointments(mapped);
        } catch (err) {
            console.error('Failed to fetch doctor appointments:', err);
        }
        };
    
        fetchDoctorAppointments();
    }, []);
  
    const handleSaveNotes = (appointmentId: string, notes: string) => {
        setAppointmentNotes(prev => ({
        ...prev,
        [appointmentId]: notes
        }));
    };

    // const getPatientDetails = (patientId: string): Patient => {
    //     return mockPatients[patientId];
    // };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
          
          <div className="space-y-4">
            {//appointments.map(appointment => {
              //const patient = getPatientDetails(appointment.patientId);
              appointments.map(appointment => {
                const patient = appointment.patient; // fetched from backend
              return (
                <div key={appointment.id} 
                  className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(appointment.date, 'MMMM d, yyyy')}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{format(appointment.date, 'h:mm a')}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowPatientDetails(true);
                      }}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => window.open(appointment.videoLink, '_blank')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Join Video
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      {showPatientDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Patient Details</h2>
              <button
                onClick={() => {
                  setShowPatientDetails(false);
                  setSelectedAppointment(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {(() => {
                // const patient = getPatientDetails(selectedAppointment.patientId);
                const patient = selectedAppointment.patient;
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="font-medium">Name:</span>
                          <span>{patient.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Age:</span>
                          <span>{patient.age} years</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <VenetianMask className="w-4 h-4" />
                          <span className="font-medium">Gender:</span>
                          <span>{patient.gender}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">Email:</span>
                          <span>{patient.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Medical History
                      </h3>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {patient.medicalHistory}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Appointment Notes</h3>
                      <textarea
                        className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px]"
                        placeholder="Add notes about the appointment..."
                        value={appointmentNotes[selectedAppointment.id] || ''}
                        onChange={(e) => handleSaveNotes(selectedAppointment.id, e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowPatientDetails(false);
                          setSelectedAppointment(null);
                        }}
                        className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => window.open(selectedAppointment.videoLink, '_blank')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Join Video Call
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}