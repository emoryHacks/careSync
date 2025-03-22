import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormData {
  age: string;
  gender: string;
  bmi: string;
  familyHistory: string;
  symptoms: string[];
  fastingBloodSugar: string;
  hba1c: string;
}

const commonSymptoms = [
  'Frequent Urination',
  'Excessive Thirst',
  'Unexplained Weight Loss',
  'Extreme Hunger',
  'Blurred Vision',
  'Fatigue',
  'Slow Healing',
  'Numbness'
];

export default function ChatbotForm() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: '',
    bmi: '',
    familyHistory: '',
    symptoms: [],
    fastingBloodSugar: '',
    hba1c: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.age || parseInt(formData.age) < 0 || parseInt(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age (0-120)';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    if (!formData.bmi || parseFloat(formData.bmi) < 10 || parseFloat(formData.bmi) > 50) {
      newErrors.bmi = 'Please enter a valid BMI (10-50)';
    }
    if (!formData.familyHistory) {
      newErrors.familyHistory = 'Please select family history status';
    }
    if (!formData.fastingBloodSugar) {
      newErrors.fastingBloodSugar = 'Please enter fasting blood sugar level';
    }
    if (!formData.hba1c || parseFloat(formData.hba1c) < 3 || parseFloat(formData.hba1c) > 15) {
      newErrors.hba1c = 'Please enter a valid HbA1c value (3-15%)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Diabetes Risk Assessment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.age}
              </p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.gender}
              </p>
            )}
          </div>

          {/* BMI Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BMI
            </label>
            <input
              type="number"
              name="bmi"
              value={formData.bmi}
              onChange={handleInputChange}
              step="0.1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.bmi ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your BMI"
            />
            {errors.bmi && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.bmi}
              </p>
            )}
          </div>

          {/* Family History Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family History of Diabetes
            </label>
            <select
              name="familyHistory"
              value={formData.familyHistory}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.familyHistory ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.familyHistory && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.familyHistory}
              </p>
            )}
          </div>

          {/* Fasting Blood Sugar Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fasting Blood Sugar (mg/dL)
            </label>
            <input
              type="number"
              name="fastingBloodSugar"
              value={formData.fastingBloodSugar}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.fastingBloodSugar ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter fasting blood sugar"
            />
            {errors.fastingBloodSugar && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.fastingBloodSugar}
              </p>
            )}
          </div>

          {/* HbA1c Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HbA1c (%)
            </label>
            <input
              type="number"
              name="hba1c"
              value={formData.hba1c}
              onChange={handleInputChange}
              step="0.1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.hba1c ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter HbA1c value"
            />
            {errors.hba1c && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.hba1c}
              </p>
            )}
          </div>
        </div>

        {/* Symptoms Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symptoms (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonSymptoms.map((symptom) => (
              <div
                key={symptom}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.symptoms.includes(symptom)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'hover:bg-gray-50 border-gray-300'
                }`}
                onClick={() => handleSymptomToggle(symptom)}
              >
                <p className="text-sm">{symptom}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Analyze Risk
        </button>
      </form>
    </div>
  );
}