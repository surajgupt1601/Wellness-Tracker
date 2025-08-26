import { useState, useEffect } from 'react';
import { Save, X, Calendar, Activity, Moon, Smile, FileText, AlertCircle } from 'lucide-react';
import { moodOptions } from '../lib/mockData.js';
import { validateEntry } from '../lib/storage.js';

const EntryForm = ({ 
  entry = null, 
  onSave, 
  onCancel, 
  loading = false,
  title = null 
}) => {
  const [formData, setFormData] = useState({
    date: '',
    steps: '',
    sleepHours: '',
    mood: 'neutral',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date || '',
        steps: entry.steps?.toString() || '',
        sleepHours: entry.sleepHours?.toString() || '',
        mood: entry.mood || 'neutral',
        notes: entry.notes || ''
      });
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [entry]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const entryData = {
      ...formData,
      steps: parseInt(formData.steps, 10) || 0,
      sleepHours: parseFloat(formData.sleepHours) || 0
    };

    const validation = validateEntry(entryData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const entryData = {
      id: entry?.id,
      date: formData.date,
      steps: parseInt(formData.steps, 10),
      sleepHours: parseFloat(formData.sleepHours),
      mood: formData.mood,
      notes: formData.notes.trim()
    };

    onSave(entryData);
  };

  // Handle cancel with confirmation if form is dirty
  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    onCancel();
  };

  // Get mood details for display
  const getMoodOption = (value) => {
    return moodOptions.find(option => option.value === value) || moodOptions[2];
  };

  return (
    <div className="card">
      {/* Form header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title || (entry ? 'Edit Wellness Entry' : 'Add New Entry')}
        </h2>
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          disabled={loading}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="h-4 w-4 inline mr-2" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={`input-field ${errors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            disabled={loading}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.date}
            </p>
          )}
        </div>

        {/* Steps Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Activity className="h-4 w-4 inline mr-2" />
            Steps
          </label>
          <input
            type="number"
            min="0"
            max="100000"
            step="1"
            value={formData.steps}
            onChange={(e) => handleChange('steps', e.target.value)}
            className={`input-field ${errors.steps ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter number of steps"
            disabled={loading}
            required
          />
          {errors.steps && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.steps}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Daily step goal: 10,000 steps
          </p>
        </div>

        {/* Sleep Hours Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Moon className="h-4 w-4 inline mr-2" />
            Sleep Hours
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) => handleChange('sleepHours', e.target.value)}
            className={`input-field ${errors.sleepHours ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter hours of sleep"
            disabled={loading}
            required
          />
          {errors.sleepHours && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.sleepHours}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Recommended: 7-9 hours per night
          </p>
        </div>

        {/* Mood Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Smile className="h-4 w-4 inline mr-2" />
            Mood
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {moodOptions.map((option) => {
              const isSelected = formData.mood === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('mood', option.value)}
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              );
            })}
          </div>
          {errors.mood && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.mood}
            </p>
          )}
        </div>

        {/* Notes Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="h-4 w-4 inline mr-2" />
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows="4"
            maxLength="500"
            className="input-field resize-none"
            placeholder="Any additional thoughts about your day..."
            disabled={loading}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Share any thoughts about your wellness, activities, or how you're feeling
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formData.notes.length}/500
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isDirty}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {entry ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {entry ? 'Update Entry' : 'Save Entry'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Tips for tracking your wellness:
        </h4>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Try to log your data at the same time each day</li>
          <li>• Be honest about your mood and sleep quality</li>
          <li>• Use notes to track patterns or events that affect your wellness</li>
          <li>• Set realistic goals and celebrate small improvements</li>
        </ul>
      </div>
    </div>
  );
};

// Quick entry component for faster data input
export const QuickEntryForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    steps: '',
    sleepHours: '',
    mood: 'neutral'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      date: new Date().toISOString().split('T')[0],
      steps: parseInt(formData.steps, 10),
      sleepHours: parseFloat(formData.sleepHours),
      mood: formData.mood,
      notes: ''
    });
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Entry - Today
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Steps"
            value={formData.steps}
            onChange={(e) => setFormData(prev => ({ ...prev, steps: e.target.value }))}
            className="input-field"
            required
          />
          
          <input
            type="number"
            step="0.5"
            placeholder="Sleep hours"
            value={formData.sleepHours}
            onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: e.target.value }))}
            className="input-field"
            required
          />
          
          <select
            value={formData.mood}
            onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
            className="input-field"
          >
            {moodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex-1">
            Save Quick Entry
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default EntryForm;