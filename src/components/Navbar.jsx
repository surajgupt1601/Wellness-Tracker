import { useState, useEffect } from 'react';
import { 
  Activity, 
  Home, 
  BarChart3, 
  FileText, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';
import { authHelpers } from '../lib/auth.js';
import { storageHelpers } from '../lib/storage.js';

const Navbar = ({ currentView, setCurrentView, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(authHelpers.getCurrentUser()); // 🔑 state banayi

  useEffect(() => {
    // Get theme preference
    const theme = storageHelpers.getTheme();
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    updateTheme(isDark);

    // ✅ Login/Logout listener
    const interval = setInterval(() => {
      const currentUser = authHelpers.getCurrentUser();
      setUser(currentUser);
    }, 500); // har 0.5s pe check karega (chhoti polling)

    return () => clearInterval(interval);
  }, []);

  const updateTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
    storageHelpers.setTheme(newDarkMode ? 'dark' : 'light');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      authHelpers.logout();
      setUser(null); // ✅ turant update hoga
      if (onLogout) onLogout();
    }
  };

  // ✅ Navigation items change depending on login state
  const navigationItems = user
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'entries', label: 'Entries', icon: FileText },
      ]
    : [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'login', label: 'Login', icon: LogIn },
        { id: 'signup', label: 'Signup', icon: UserPlus },
      ];

  const NavLink = ({ item, mobile = false }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    
    const baseClasses = mobile
      ? 'flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors'
      : 'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors';
    
    const activeClasses = mobile
      ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-100'
      : 'border-primary-500 text-primary-600 dark:text-primary-400';
    
    const inactiveClasses = mobile
      ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-600';

    return (
      <button
        onClick={() => {
          setCurrentView(item.id);
          setMobileMenuOpen(false);
        }}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <Icon className={`${mobile ? 'mr-3 h-5 w-5' : 'mr-1 h-4 w-4'}`} />
        {item.label}
      </button>
    );
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                WellnessTracker
              </span>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navigationItems.map(item => (
                <NavLink key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Right side - Theme toggle, user info, logout */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User info + logout only if logged in */}
            {user && (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map(item => (
                <NavLink key={item.id} item={item} mobile />
              ))}
            </div>

            {/* Mobile user section */}
            {user && (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center px-3 py-2">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-3">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-0 py-2 text-base font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
