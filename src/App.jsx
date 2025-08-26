import React, { useState, useEffect } from 'react';
import Layout from './routes/Layout.jsx';
import Home from './routes/Home.jsx';
import Login from './routes/Login.jsx';
import Signup from './routes/Signup.jsx';
import Dashboard from './routes/Dashboard.jsx';
import Entries from './routes/Entries.jsx';
import NewEntry from './routes/NewEntry.jsx';
import EditEntry from './routes/EditEntry.jsx';
import { authHelpers } from './lib/auth.js';
import { storageHelpers } from './lib/storage.js';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Dark mode persistence
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ✅ Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (authHelpers.isAuthenticated()) {
          const user = authHelpers.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            setCurrentView('dashboard');

            const userEntries = storageHelpers.getEntries() || [];
            setEntries(Array.isArray(userEntries) ? userEntries : []);
          }
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // ✅ Handle user login
  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    const userEntries = storageHelpers.getEntries() || [];
    setEntries(Array.isArray(userEntries) ? userEntries : []);
  };

  // ✅ Handle user signup
  const handleSignup = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    const userEntries = storageHelpers.getEntries() || [];
    setEntries(Array.isArray(userEntries) ? userEntries : []);
  };

  // ✅ Handle user logout
  const handleLogout = () => {
    setCurrentUser(null);
    setEntries([]);
    setCurrentView('home');
  };

  // ✅ Handle entry operations
  const handleAddEntry = (entryData) => {
    const result = storageHelpers.addEntry(entryData);
    if (result.success) {
      const updatedEntries = storageHelpers.getEntries() || [];
      setEntries(updatedEntries);
      setCurrentView('entries');
      return true;
    } else {
      alert(result.error);
      return false;
    }
  };

  const handleUpdateEntry = (entryId, entryData) => {
    const result = storageHelpers.updateEntry(entryId, entryData);
    if (result.success) {
      const updatedEntries = storageHelpers.getEntries() || [];
      setEntries(updatedEntries);
      setCurrentView('entries');
      setSelectedEntryId(null);
      return true;
    } else {
      alert(result.error);
      return false;
    }
  };

  const handleDeleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const result = storageHelpers.deleteEntry(entryId);
      if (result.success) {
        const updatedEntries = storageHelpers.getEntries() || [];
        setEntries(updatedEntries);
      } else {
        alert(result.error);
      }
    }
  };

  const handleEditEntry = (entryId) => {
    setSelectedEntryId(entryId);
    setCurrentView('edit-entry');
  };

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading WellnessTracker...</p>
        </div>
      </div>
    );
  }

  // ✅ Router
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home setCurrentView={setCurrentView} />;

      case 'login':
        return (
          <Login
            setCurrentView={setCurrentView}
            onLogin={handleLogin}
          />
        );

      case 'signup':
        return (
          <Signup
            setCurrentView={setCurrentView}
            onSignup={handleSignup}
          />
        );
    }

    if (!currentUser) {
      return <Home setCurrentView={setCurrentView} />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            entries={entries}
            user={currentUser}
            onNavigate={setCurrentView}
          />
        );

      case 'entries':
        return (
          <Entries
            entries={entries}
            onAddNew={() => setCurrentView('new-entry')}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        );

      case 'new-entry':
        return (
          <NewEntry
            onSave={handleAddEntry}
            onCancel={() => setCurrentView('entries')}
          />
        );

      case 'edit-entry':
        const entryToEdit = entries.find(e => e.id === selectedEntryId);
        return (
          <EditEntry
            entry={entryToEdit}
            onSave={(entryData) => handleUpdateEntry(selectedEntryId, entryData)}
            onCancel={() => {
              setSelectedEntryId(null);
              setCurrentView('entries');
            }}
          />
        );

      default:
        return <Dashboard entries={entries} user={currentUser} onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      setCurrentView={setCurrentView}
      currentUser={currentUser}
      onLogout={handleLogout}   // ✅ Navbar ke liye pass kiya
    >
      {renderCurrentView()}
    </Layout>
  );
};

export default App;


