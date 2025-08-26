import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Calendar, Activity, Moon } from 'lucide-react';
import { getMoodDetails } from '../lib/mockData.js';

const Entries = ({ entries, onAddNew, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      // Search in notes
      const matchesSearch = searchTerm === '' || 
        entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by mood
      const matchesMood = moodFilter === 'all' || entry.mood === moodFilter;
      
      // Filter by date range
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const entryDate = new Date(entry.date);
        const today = new Date();
        const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'week':
            matchesDate = daysDiff <= 7;
            break;
          case 'month':
            matchesDate = daysDiff <= 30;
            break;
          case 'quarter':
            matchesDate = daysDiff <= 90;
            break;
          default:
            matchesDate = true;
        }
      }
      
      return matchesSearch && matchesMood && matchesDate;
    });

    // Sort entries
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      switch (sortOrder) {
        case 'oldest':
          return dateA - dateB;
        case 'steps-high':
          return b.steps - a.steps;
        case 'steps-low':
          return a.steps - b.steps;
        case 'sleep-high':
          return b.sleepHours - a.sleepHours;
        case 'sleep-low':
          return a.sleepHours - b.sleepHours;
        default: // newest
          return dateB - dateA;
      }
    });
  }, [entries, searchTerm, moodFilter, dateFilter, sortOrder]);

  // Get unique moods for filter
  const availableMoods = useMemo(() => {
    const moods = [...new Set(entries.map(entry => entry.mood))];
    return moods.map(mood => ({
      value: mood,
      label: getMoodDetails(mood).label,
      emoji: getMoodDetails(mood).emoji
    }));
  }, [entries]);

  const clearFilters = () => {
    setSearchTerm('');
    setMoodFilter('all');
    setDateFilter('all');
    setSortOrder('newest');
  };

  const hasActiveFilters = searchTerm !== '' || moodFilter !== 'all' || dateFilter !== 'all' || sortOrder !== 'newest';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Wellness Entries
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredAndSortedEntries.length} of {entries.length} entries
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Entry
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Mood Filter */}
          <div>
            <select
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Moods</option>
              {availableMoods.map(mood => (
                <option key={mood.value} value={mood.value}>
                  {mood.emoji} {mood.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="steps-high">Most Steps</option>
              <option value="steps-low">Least Steps</option>
              <option value="sleep-high">Most Sleep</option>
              <option value="sleep-low">Least Sleep</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredAndSortedEntries.length > 0 ? (
          filteredAndSortedEntries.map((entry) => {
            const entryDate = new Date(entry.date);
            const mood = getMoodDetails(entry.mood);
            const isToday = entry.date === new Date().toISOString().split('T')[0];
            const isYesterday = entry.date === new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            let dateLabel = entryDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            if (isToday) dateLabel = 'Today';
            else if (isYesterday) dateLabel = 'Yesterday';

            return (
              <div
                key={entry.id}
                className="card hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  {/* Entry Content */}
                  <div className="flex-1">
                    {/* Date and Mood */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{mood.emoji}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {dateLabel}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Feeling {mood.label.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {entry.steps.toLocaleString()} steps
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {entry.sleepHours}h sleep
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {entry.notes && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          "{entry.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 md:ml-4">
                    <button
                      onClick={() => onEdit(entry.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Edit entry"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            {entries.length === 0 ? (
              <>
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No entries yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Start your wellness journey by adding your first entry. Track your daily steps, 
                  sleep, mood, and notes to monitor your progress.
                </p>
                <button
                  onClick={onAddNew}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Entry
                </button>
              </>
            ) : (
              <>
                <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No entries match your filters
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      {filteredAndSortedEntries.length > 20 && (
        <div className="flex justify-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing all {filteredAndSortedEntries.length} entries
          </p>
        </div>
      )}
    </div>
  );
};
export default Entries;