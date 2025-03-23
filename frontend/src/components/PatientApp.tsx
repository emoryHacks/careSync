import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, X, BadgeCheck, Video } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';


interface TimeSlot {
  date: string;
  times: string[];
  available: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  about: string;
  image: string;
  fee: number;
  verified: boolean;
  timeSlots: TimeSlot[];
  webexLink: string;
}

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  doctor: Doctor;
  type: string;
  videoLink?: string;
}

const mockDoctors: Doctor[] = [
  {
    id: '3',
    name: 'Dr. Richard James',
    specialty: 'Diabetologist',
    qualification: 'MD, DM (Endocrinology)',
    experience: '12',
    about: 'Dr. James is a renowned diabetologist with extensive experience in managing complex diabetes cases.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=2340&q=80',
    fee: 80,
    verified: true,
    webexLink: 'https://gsumeetings.webex.com/meet/rnarra2',
    timeSlots: [
      { date: '2025-03-23', times: ['10:00 AM', '2:00 PM'], available: true },
      { date: '2025-03-24', times: ['11:00 AM'], available: true },
      { date: '2025-03-25', times: [], available: false }
    ]
  },
  {
    id: '4',
    name: 'Dr. Sarah Johnson',
    specialty: 'Endocrinologist',
    qualification: 'MD, DM (Endocrinology)',
    experience: '15',
    about: 'Dr. Johnson specializes in diabetes management and metabolic disorders. She uses the latest treatment protocols and technology to offer personalized care.',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=2340&q=80',
    fee: 90,
    verified: true,
    webexLink: 'https://gsumeetings.webex.com/meet/mkalyanam1',
    timeSlots: [
      { date: '2025-03-23', times: ['11:00 AM', '1:30 PM'], available: true },
      { date: '2025-03-24', times: ['2:00 PM', '4:30 PM'], available: true },
      { date: '2025-03-25', times: [], available: false }
    ]
  },
  {
    id: '5',
    name: 'Dr. Michael Chen',
    specialty: 'Diabetologist',
    qualification: 'MBBS, Fellowship in Diabetology',
    experience: '8',
    about: 'Dr. Chen focuses on managing type 1 and type 2 diabetes, with expertise in insulin pumps and continuous glucose monitoring.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=2340&q=80',
    fee: 75,
    verified: true,
    webexLink: 'https://gsumeetings.webex.com/meet/ckasanagottu1',
    timeSlots: [
      { date: '2025-03-23', times: ['10:30 AM', '3:00 PM'], available: true },
      { date: '2025-03-24', times: ['11:00 AM'], available: true },
      { date: '2025-03-25', times: [], available: false }
    ]
  }
];



export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { user } = useAuth();
  console.log(user?.role);
  const handleScheduleWithDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset previously selected time
  };

    useEffect(() => {
        const fetchAppointments = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/patient_appointments', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(res);
    
            const mappedAppointments = res.data.map((apt: any) => {
            const doctor = mockDoctors.find(doc => doc.id === apt.doctorId);
            const start = new Date(`${apt.date} ${apt.time}`);
            return {
                id: apt._id,
                title: `${apt.appointmentType} with ${apt.doctorName}`,
                start,
                end: new Date(start.getTime() + 60 * 60 * 1000),
                doctor: doctor || {
                id: apt.doctorId,
                name: apt.doctorName,
                image: 'https://via.placeholder.com/150', // fallback image
                },
                type: apt.appointmentType,
                videoLink: apt.videoLink,
            };
            });
    
            setAppointments(mappedAppointments);
        } catch (err) {
            console.error('Failed to load appointments:', err);
        }
        };
    
        fetchAppointments();
    }, []);

  const handleScheduleAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || !user) return;
  
    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem('token');
  
    try {
        const res = await axios.post(
            'http://localhost:5000/api/appointments',
            {
                doctorId: selectedDoctor.id,
                doctorName: selectedDoctor.name,
                appointmentType: formData.get('type'),
                date: selectedDate,
                time: selectedTime,
                videoLink: selectedDoctor.webexLink
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
  
        alert('Appointment successfully scheduled!');
        setShowModal(false);
        setSelectedDoctor(null);
        setSelectedDate(null);
        setSelectedTime(null);
        window.location.reload();
  
    } catch (err) {
      console.error('Appointment Error:', err);
      alert('Failed to schedule appointment. Check console.');
    }
  };

//   const cancelAppointment = (appointmentId: string) => {
//     setAppointments(appointments.filter(apt => apt.id !== appointmentId));
//   };

  const cancelAppointment = async (appointmentId: string) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`http://localhost:5000/api/cancel_appointment/${appointmentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
  
      // Remove from local UI state
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      alert('Appointment cancelled');
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel appointment.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Diabetes Specialists</h2>
          <div className="space-y-6">
            {mockDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSchedule={handleScheduleWithDoctor}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
            <div className="space-y-4">
              {appointments
                .filter(apt => apt.start > new Date())
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .map(appointment => (
                  <div key={appointment.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={appointment.doctor.image}
                        alt={appointment.doctor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{appointment.doctor.name}</h4>
                        <p className="text-gray-600">{appointment.type}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <Calendar size={16} />
                          <span>{format(appointment.start, 'MMMM d, yyyy')}</span>
                          <Clock size={16} className="ml-2" />
                          <span>{format(appointment.start, 'h:mm a')}</span>
                          <div className="text-sm text-blue-600 mt-1">

</div>
                      </div>
                    </div>
                  </div>
                  <div>
                  <button
  onClick={() => window.open(appointment.videoLink, '_blank')}
  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
>Join Video</button>
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {showModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[480px] max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Schedule Appointment</h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedDoctor(null);
                      setSelectedDate(null);
                      setSelectedTime(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold">{selectedDoctor.name}</h4>
                      {selectedDoctor.verified && <BadgeCheck className="text-blue-600 w-5 h-5" />}
                    </div>
                    <p className="text-gray-600">{selectedDoctor.qualification} - {selectedDoctor.specialty}</p>
                    <p className="text-sm text-gray-500">{selectedDoctor.experience} Years Experience</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Booking slots</h4>
                  <div className="grid grid-cols-7 gap-3">
                    {selectedDoctor.timeSlots.map((slot, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <button
                          onClick={() => handleDateSelect(slot.date)}
                          disabled={!slot.available}
                          className={`py-3 px-2 rounded-xl text-center transition-colors w-full
                            ${selectedDate === slot.date ? 'bg-blue-600 text-white' : slot.available ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200' : 'bg-gray-50 opacity-50 cursor-not-allowed border border-gray-200'}`}
                        >
                          <div className="text-sm font-medium mb-1">{format(new Date(slot.date), 'EEE')}</div>
                          <div className="text-lg font-bold">{format(new Date(slot.date), 'd')}</div>
                        </button>
                        {selectedDate === slot.date && (
                          <div className="mt-2 flex flex-wrap gap-2 justify-center">
                            {slot.times.map((time, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedTime(time)}
                                className={`text-xs px-3 py-1 rounded-md border ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <form onSubmit={handleScheduleAppointment} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Appointment Type</label>
                      <select
                        name="type"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Diabetes Consultation">Diabetes Consultation</option>
                        <option value="Diabetes Follow-up">Diabetes Follow-up</option>
                        <option value="Glucose Monitoring Review">Glucose Monitoring Review</option>
                        <option value="Diabetes Management Plan">Diabetes Management Plan</option>
                        <option value="Insulin Therapy Consultation">Insulin Therapy Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Selected Date</label>
                      <input
                        type="text"
                        value={format(new Date(selectedDate), 'MMMM d, yyyy')}
                        disabled
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Selected Time</label>
                      <input
                        type="text"
                        value={selectedTime || 'Not selected'}
                        disabled
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Confirm Appointment
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}