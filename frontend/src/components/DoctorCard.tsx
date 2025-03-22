import React from 'react';
import { Calendar, Clock, BadgeCheck } from 'lucide-react';
import { format } from 'date-fns';

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

interface DoctorCardProps {
  doctor: Doctor;
  onSchedule: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onSchedule }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex md:flex-row flex-col">
        <div className="md:w-1/3">
          <img 
            src={doctor.image} 
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                {doctor.verified && (
                  <BadgeCheck className="text-blue-600 w-5 h-5" />
                )}
              </div>
              <p className="text-gray-600">{doctor.qualification} - {doctor.specialty}</p>
              <p className="text-sm text-gray-500">{doctor.experience} Years Experience</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">${doctor.fee}</p>
              <p className="text-sm text-gray-500">per visit</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
            <p className="text-gray-600 text-sm">{doctor.about}</p>
          </div>

          <button
            onClick={() => onSchedule(doctor)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
}