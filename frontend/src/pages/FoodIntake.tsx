import React, { useState } from 'react';
import { Utensils, Coffee, Sun, Moon, Calculator } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface FoodItem {
  name: string;
  quantity: string;
  calories: string;
}

interface MealFormProps {
  mealType: string;
  items: FoodItem[];
  setItems: (items: FoodItem[]) => void;
  totalCalories: number;
  setTotalCalories: (totalCalories: number) => void;
  onSubmit: (items: FoodItem[]) => void;
}

function MealForm({ mealType, items, setItems, totalCalories, setTotalCalories, onSubmit }: MealFormProps) {
  const [draftItems, setDraftItems] = useState<FoodItem[]>(JSON.parse(JSON.stringify(items)));

  const handleQuantityChange = (index: number, value: string) => {
    const updated = [...draftItems];
    updated[index] = { ...updated[index], quantity: value };
    setDraftItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate total calories on submit
    const total = draftItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const caloriesPer100g = parseFloat(item.calories);
      return sum + (quantity * caloriesPer100g) / 100;
    }, 0);

    // Update parent state
    setItems(draftItems);
    setTotalCalories(Math.round(total));
    onSubmit(draftItems);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6">
          {draftItems.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <label className="text-sm font-medium text-gray-700">{item.name}</label>
                <p className="text-xs text-gray-500">{item.calories} kcal/100g</p>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-4 pr-12"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">g</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {item.quantity ? Math.round((parseFloat(item.quantity) * parseFloat(item.calories)) / 100) : 0} kcal
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-medium text-gray-900">Total Calories:</span>
            </div>
            <span className="text-xl font-bold text-blue-600">
              {
                draftItems.reduce((sum, item) => {
                  const quantity = parseFloat(item.quantity) || 0;
                  const caloriesPer100g = parseFloat(item.calories);
                  return sum + (quantity * caloriesPer100g) / 100;
                }, 0).toFixed(0)
              } kcal
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <span>Save {mealType}</span>
        </button>
      </form>
    </div>
  );
}


export default function FoodIntake() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('breakfast');

  const [breakfastItems, setBreakfastItems] = useState<FoodItem[]>([
    { name: "Oatmeal", quantity: "", calories: "68" },
    { name: "Whole Wheat Bread", quantity: "", calories: "247" },
    { name: "Eggs", quantity: "", calories: "155" },
    { name: "Milk", quantity: "", calories: "42" },
    { name: "Banana", quantity: "", calories: "89" }
  ]);
  const [breakfastCalories, setBreakfastCalories] = useState(0);

  const [lunchItems, setLunchItems] = useState<FoodItem[]>([
    { name: "Brown Rice", quantity: "", calories: "111" },
    { name: "Chicken Breast", quantity: "", calories: "165" },
    { name: "Mixed Vegetables", quantity: "", calories: "65" },
    { name: "Fish", quantity: "", calories: "206" },
    { name: "Lentils", quantity: "", calories: "116" }
  ]);
  const [lunchCalories, setLunchCalories] = useState(0);

  const [dinnerItems, setDinnerItems] = useState<FoodItem[]>([
    { name: "Quinoa", quantity: "", calories: "120" },
    { name: "Lean Beef", quantity: "", calories: "250" },
    { name: "Sweet Potato", quantity: "", calories: "86" },
    { name: "Greek Yogurt", quantity: "", calories: "59" },
    { name: "Almonds", quantity: "", calories: "579" }
  ]);
  const [dinnerCalories, setDinnerCalories] = useState(0);

  const handleMealSubmit = async (mealType: string, items: FoodItem[]) => {
    console.log(`${mealType} items:`, items);

    // Filter only items with quantity > 0
    const filteredItems = items
      .filter((item) => parseFloat(item.quantity) > 0)
      .map((item) => ({
        name: item.name,
        quantity_g: parseFloat(item.quantity),
        calories: Math.round((parseFloat(item.quantity) * parseFloat(item.calories)) / 100)
      }));

    try {
      const token = localStorage.getItem('token');
      const payload = {
        meal: mealType.toLowerCase(),
        items: filteredItems
      }
      
      await axios.post(
        'http://localhost:5000/api/food-intake',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert(`${mealType} saved successfully!`);
    } catch (error) {
      console.error('Error saving food intake:', error);
      alert('Failed to save food intake.');
    }
  };

  const tabs = [
    { id: 'breakfast', name: 'Breakfast', icon: Coffee },
    { id: 'lunch', name: 'Lunch', icon: Sun },
    { id: 'dinner', name: 'Dinner', icon: Moon },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Utensils className="h-8 w-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Daily Food Intake Tracker</h2>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className={`
                      -ml-0.5 mr-2 h-5 w-5
                      ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Meal Forms */}
      <div className="mt-8">
        {activeTab === 'breakfast' && (
          <MealForm
            mealType="Breakfast"
            items={breakfastItems}
            setItems={setBreakfastItems}
            totalCalories={breakfastCalories}
            setTotalCalories={setBreakfastCalories}
            onSubmit={(items) => handleMealSubmit("Breakfast", items)}
          />
        )}
        {activeTab === 'lunch' && (
          <MealForm
            mealType="Lunch"
            items={lunchItems}
            setItems={setLunchItems}
            totalCalories={lunchCalories}
            setTotalCalories={setLunchCalories}
            onSubmit={(items) => handleMealSubmit("Lunch", items)}
          />
        )}
        {activeTab === 'dinner' && (
          <MealForm
            mealType="Dinner"
            items={dinnerItems}
            setItems={setDinnerItems}
            totalCalories={dinnerCalories}
            setTotalCalories={setDinnerCalories}
            onSubmit={(items) => handleMealSubmit("Dinner", items)}
          />
        )}
      </div>
    </div>
  );
}