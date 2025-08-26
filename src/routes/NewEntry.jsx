import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import EntryForm from '../components/EntryForm.jsx';

const NewEntry = ({ onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async (entryData) => {
    setLoading(true);
    
    try {
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const success = onSave(entryData);
      if (!success) {
        setLoading(false);
      }
      // If successful, the parent component will handle navigation
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <button
          onClick={onCancel}
          className="flex items-center hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Entries
        </button>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">New Entry</span>
      </div>

      {/* Instructions */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Add a New Wellness Entry
        </h2>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Track your daily wellness by logging your steps, sleep hours, mood, and any notes 
          about your day. This information will help you understand patterns in your health 
          and wellness over time.
        </p>
      </div>

      {/* Entry Form */}
      <EntryForm
        onSave={handleSave}
        onCancel={onCancel}
        loading={loading}
        title="Add New Wellness Entry"
      />

      {/* Tips */}
      <div className="card bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          💡 Tips for accurate tracking:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span>Log your entry at the same time each day for consistency</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span>Be honest about your mood - it helps identify patterns</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span>Use notes to track what influenced your wellness that day</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span>Don't worry about perfect numbers - progress is what matters</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default NewEntry;