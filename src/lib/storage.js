// Local storage helpers for wellness entries and app data

import { mockEntries, generateMockEntries } from './mockData.js';
import { authHelpers } from './auth.js';

// Storage keys
const ENTRIES_KEY = 'entries';
const SETTINGS_KEY = 'wellness_tracker_settings';
const THEME_KEY = 'wellness_tracker_theme';

// Default settings
const defaultSettings = {
  notifications: true,
  darkMode: false,
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dataRetentionDays: 365
};

export const storageHelpers = {
  getEntries() {
  try {
    const currentUser = authHelpers.getCurrentUser();
    if (!currentUser) return [];

    const allEntries = JSON.parse(localStorage.getItem(ENTRIES_KEY) || "{}");

    let userEntries = allEntries[currentUser.id] || [];
    if (!Array.isArray(userEntries)) userEntries = [];

    return userEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error getting entries:", error);
    return [];
  }
  },

  setEntries(entries) {
  try {
    const currentUser = authHelpers.getCurrentUser();
    if (!currentUser) return false;

    const allEntries = JSON.parse(localStorage.getItem(ENTRIES_KEY) || "{}");
    allEntries[currentUser.id] = entries;

    localStorage.setItem(ENTRIES_KEY, JSON.stringify(allEntries));
    return true;
  } catch (error) {
    console.error("Error saving entries:", error);
    return false;
  }
  },



  updateEntry: (entryId, updates) => {
    try {
      const entries = storageHelpers.getEntries();
      const entryIndex = entries.findIndex(e => e.id === entryId);

      if (entryIndex === -1) {
        return { success: false, error: 'Entry not found' };
      }

      const updatedEntry = {
        ...entries[entryIndex],
        ...updates,
        id: entries[entryIndex].id, // Prevent ID changes
        userId: entries[entryIndex].userId, // Prevent user ID changes
        updatedAt: new Date().toISOString()
      };

      entries[entryIndex] = updatedEntry;
      storageHelpers.setEntries(entries);

      return { success: true, entry: updatedEntry };
    } catch (error) {
      console.error('Error updating entry:', error);
      return { success: false, error: 'Failed to update entry' };
    }
  },
  deleteEntry: (entryId) => {
    try {
      const entries = storageHelpers.getEntries();
      const filteredEntries = entries.filter(e => e.id !== entryId);

      if (filteredEntries.length === entries.length) {
        return { success: false, error: 'Entry not found' };
      }

      storageHelpers.setEntries(filteredEntries);
      return { success: true };
    } catch (error) {
      console.error('Error deleting entry:', error);
      return { success: false, error: 'Failed to delete entry' };
    }
  },
  getEntry: (entryId) => {
    try {
      const entries = storageHelpers.getEntries();
      return entries.find(e => e.id === entryId) || null;
    } catch (error) {
      console.error('Error getting entry:', error);
      return null;
    }
  },
  getEntriesInRange: (startDate, endDate) => {
    try {
      const entries = storageHelpers.getEntries();
      return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return entryDate >= start && entryDate <= end;
      });
    } catch (error) {
      console.error('Error getting entries in range:', error);
      return [];
    }
  },
  getSettings: () => {
    try {
      const currentUser = authHelpers.getCurrentUser();
      if (!currentUser) return defaultSettings;

      const allSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      const userSettings = allSettings[currentUser.id] || {};

      return { ...defaultSettings, ...userSettings };
    } catch (error) {
      console.error('Error getting settings:', error);
      return defaultSettings;
    }
  },
  updateSettings: (settings) => {
    try {
      const currentUser = authHelpers.getCurrentUser();
      if (!currentUser) return false;

      const allSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      allSettings[currentUser.id] = {
        ...storageHelpers.getSettings(),
        ...settings,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(SETTINGS_KEY, JSON.stringify(allSettings));
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  },
  getTheme: () => {
    try {
      return localStorage.getItem(THEME_KEY) || 'system';
    } catch (error) {
      console.error('Error getting theme:', error);
      return 'system';
    }
  },
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  },
  exportEntries: () => {
    try {
      const entries = storageHelpers.getEntries();
      const currentUser = authHelpers.getCurrentUser();
      
      const exportData = {
        user: currentUser ? { id: currentUser.id, name: currentUser.name, email: currentUser.email } : null,
        entries: entries,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting entries:', error);
      return '{}';
    }
  },
  importEntries: (jsonData) => {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.entries || !Array.isArray(importData.entries)) {
        return { success: false, error: 'Invalid import data format' };
      }

      const currentEntries = storageHelpers.getEntries();
      const existingDates = new Set(currentEntries.map(e => e.date));
      
      // Filter out entries that already exist
      const newEntries = importData.entries.filter(entry => 
        !existingDates.has(entry.date)
      );

      if (newEntries.length === 0) {
        return { success: false, error: 'No new entries to import' };
      }

      // Add current user ID to imported entries
      const currentUser = authHelpers.getCurrentUser();
      const processedEntries = newEntries.map(entry => ({
        ...entry,
        id: Date.now() + Math.random(), // Generate new IDs
        userId: currentUser?.id || entry.userId,
        importedAt: new Date().toISOString()
      }));

      const allEntries = [...currentEntries, ...processedEntries];
      storageHelpers.setEntries(allEntries);

      return { success: true, imported: processedEntries.length };
    } catch (error) {
      console.error('Error importing entries:', error);
      return { success: false, error: 'Failed to import entries' };
    }
  },
  clearUserData: () => {
    try {
      const currentUser = authHelpers.getCurrentUser();
      if (!currentUser) return false;

      // Clear entries
      const allEntries = JSON.parse(localStorage.getItem(ENTRIES_KEY) || '{}');
      delete allEntries[currentUser.id];
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(allEntries));

      // Clear settings
      const allSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      delete allSettings[currentUser.id];
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(allSettings));

      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  },
  getStorageStats: () => {
    try {
      const entries = storageHelpers.getEntries();
      const settings = storageHelpers.getSettings();
      
      const entriesSize = JSON.stringify(entries).length;
      const settingsSize = JSON.stringify(settings).length;
      const totalSize = entriesSize + settingsSize;

      return {
        totalEntries: entries.length,
        oldestEntry: entries.length > 0 ? entries[0].date : null,
        newestEntry: entries.length > 0 ? entries[entries.length - 1].date : null,
        storageSize: {
          entries: entriesSize,
          settings: settingsSize,
          total: totalSize
        }
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalEntries: 0,
        oldestEntry: null,
        newestEntry: null,
        storageSize: { entries: 0, settings: 0, total: 0 }
      };
    }
  }
};

// Utility functions for data validation
export const validateEntry = (entry) => {
  const errors = {};

  if (!entry.date) {
    errors.date = 'Date is required';
  }

  if (!entry.steps || entry.steps < 0) {
    errors.steps = 'Steps must be a positive number';
  }

  if (!entry.sleepHours || entry.sleepHours < 0 || entry.sleepHours > 24) {
    errors.sleepHours = 'Sleep hours must be between 0 and 24';
  }

  if (!entry.mood) {
    errors.mood = 'Mood is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatDateForStorage = (date) => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date;
};

export const parseStoredDate = (dateString) => {
  return new Date(dateString + 'T00:00:00');
};
export default storageHelpers;
      
