import { useState } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import EntryForm from '../components/EntryForm.jsx';

const EditEntry = ({ entry, onSave, onCancel }) => {
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
      console.error('Error updating entry:', error);
      alert('Failed to update entry. Please try again.');
      setLoading(false);
    }
  };

  // If entry doesn't exist, show error state
  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Entry Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The entry you're trying to edit could not be found. It may have been deleted 
            or you may not have permission to edit it.
          </p>
          <button
            onClick={onCancel}
            className="btn-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Entries
          </button>
        </div>
      </div>
    );
  }

  const entryDate = new Date(entry.date);
  const formattedDate = entryDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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
        <span className="text-gray-900 dark:text-white">Edit Entry</span>
      </div>

      {/* Entry Info Header */}
      <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-1">
              Editing Entry for {formattedDate}
            </h2>
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              Make changes to your wellness entry below. Your original data will be updated 
              when you save your changes.
            </p>
          </div>
        </div>
      </div>

      {/* Current Entry Summary */}
      <div className="card bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Current Entry Summary:
        </h3>
      {/* Current Entry Summary */}
      <div className="card bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Current Entry Summary:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Steps:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {entry.steps.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Sleep:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {entry.sleepHours}h
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Mood:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
            </span>
          </div>
        </div>
        {entry.notes && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Notes:</span>
            <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm italic">
              "{entry.notes}"
            </p>
          </div>
        )}
      </div>

      {/* Entry Form */}
      <EntryForm
        entry={entry}
        onSave={handleSave}
        onCancel={onCancel}
        loading={loading}
        title="Update Wellness Entry"
      />

      {/* Edit History Placeholder */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 dark:text-blue-400">📝</div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Edit History
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">
              This entry was created on {new Date(entry.createdAt || entry.date).toLocaleDateString()}.
            </p>
            {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Last modified on {new Date(entry.updatedAt).toLocaleDateString()}.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Warning about editing past entries */}
      {(() => {
        const today = new Date().toISOString().split('T')[0];
        const isOldEntry = entry.date < today;
        const daysDiff = Math.floor((new Date(today) - new Date(entry.date)) / (1000 * 60 * 60 * 24));
        
        if (isOldEntry && daysDiff > 7) {
          return (
            <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Editing Old Entry
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    You're editing an entry from {daysDiff} days ago. While you can update any 
                    information, consider whether the changes accurately reflect what happened on that specific date.
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}
    </div>
  </div>
  );
};
export default EditEntry;