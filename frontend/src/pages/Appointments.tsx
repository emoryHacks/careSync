import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, X, BadgeCheck } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';

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
}

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  doctor: Doctor;
  type: string;
}

interface TimeSlot {
  date: Date;
  available: boolean;
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Richard James',
    specialty: 'Diabetologist',
    qualification: 'MD, DM (Endocrinology)',
    experience: '12',
    about: 'Dr. James is a renowned diabetologist with extensive experience in managing complex diabetes cases. He specializes in creating personalized treatment plans and has helped numerous patients achieve better glycemic control through lifestyle modifications and appropriate medical interventions.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    fee: 80,
    verified: true
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    specialty: 'Endocrinologist',
    qualification: 'MD, DM (Endocrinology)',
    experience: '15',
    about: 'Dr. Johnson is a highly experienced endocrinologist specializing in diabetes management and metabolic disorders. She is known for her comprehensive approach to diabetes care, incorporating the latest treatment protocols and technology.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    fee: 90,
    verified: true
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    specialty: 'Diabetologist',
    qualification: 'MBBS, Fellowship in Diabetology',
    experience: '8',
    about: 'Dr. Chen specializes in managing type 1 and type 2 diabetes, with particular expertise in insulin pump therapy and continuous glucose monitoring systems. He is dedicated to helping patients achieve optimal diabetes control through education and personalized care plans.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    fee: 75,
    verified: true
  }
];

const generateTimeSlots = (startDate: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const daysToShow = 7;

  for (let day = 0; day < daysToShow; day++) {
    const currentDate = addDays(startDate, day);
    slots.push({
      date: currentDate,
      available: Math.random() > 0.3 // Randomly determine availability
    });
  }

  return slots;
};

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    // Initialize with mock appointments
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        title: 'Diabetes Consultation',
        start: new Date(2024, 2, 15, 10, 0),
        end: new Date(2024, 2, 15, 11, 0),
        doctor: mockDoctors[0],
        type: 'Diabetes Consultation'
      }
    ];
    setAppointments(mockAppointments);
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      setTimeSlots(generateTimeSlots(new Date()));
    }
  }, [selectedDoctor]);

  const handleScheduleWithDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleScheduleAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate) return;

    const formData = new FormData(e.currentTarget);
    const newAppointment: Appointment = {
      id: Math.random().toString(),
      title: `${formData.get('type')} with ${selectedDoctor.name}`,
      start: selectedDate,
      end: new Date(selectedDate.getTime() + 60 * 60 * 1000),
      doctor: selectedDoctor,
      type: formData.get('type') as string
    };
    setAppointments([...appointments, newAppointment]);
    setShowModal(false);
    setSelectedDoctor(null);
    setSelectedDate(null);
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(apt => apt.id !== appointmentId));
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
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
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
                      {selectedDoctor.verified && (
                        <BadgeCheck className="text-blue-600 w-5 h-5" />
                      )}
                    </div>
                    <p className="text-gray-600">{selectedDoctor.qualification} - {selectedDoctor.specialty}</p>
                    <p className="text-sm text-gray-500">{selectedDoctor.experience} Years Experience</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Booking slots</h4>
                  <div className="grid grid-cols-7 gap-3">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(slot.date)}
                        disabled={!slot.available}
                        className={`
                          py-3 px-2 rounded-xl text-center transition-colors
                          ${selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(slot.date, 'yyyy-MM-dd')
                            ? 'bg-blue-600 text-white'
                            : slot.available
                            ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            : 'bg-gray-50 opacity-50 cursor-not-allowed border border-gray-200'
                          }
                        `}
                      >
                        <div className="text-sm font-medium mb-1">
                          {format(slot.date, 'EEE')}
                        </div>
                        <div className="text-lg font-bold">
                          {format(slot.date, 'd')}
                        </div>
                      </button>
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
                        value={format(selectedDate, 'MMMM d, yyyy')}
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