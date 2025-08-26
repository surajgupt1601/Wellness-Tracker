import React from 'react';
import { Activity, BarChart3, FileText, LogIn, UserPlus, ArrowRight } from 'lucide-react';

const Home = ({ setCurrentView }) => {
  const features = [
    {
      icon: Activity,
      title: 'Track Daily Activities',
      description: 'Monitor your steps, sleep hours, and daily mood to build healthy habits.',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: BarChart3,
      title: 'Visualize Progress',
      description: 'Interactive charts and graphs help you understand your wellness trends.',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: FileText,
      title: 'Manage Entries',
      description: 'Add, edit, and organize your wellness entries with detailed notes.',
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <Activity className="h-16 w-16 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to{' '}
          <span className="text-primary-600 dark:text-primary-400">
            WellnessTracker
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Take control of your health and wellness journey. Track your daily activities, 
          monitor your progress, and build sustainable healthy habits with our intuitive 
          wellness tracking platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => setCurrentView('signup')}
            className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Get Started Free
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
          
          <button
            onClick={() => setCurrentView('login')}
            className="btn-secondary text-lg px-8 py-4 flex items-center justify-center"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Sign In
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="inline-block p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-1">
            Try the demo:
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Email: demo@wellness.com | Password: demo123
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for Wellness Tracking
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools you need to monitor, 
            analyze, and improve your daily wellness habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-center">
                  <div className="inline-flex p-4 bg-gray-50 dark:bg-gray-700 rounded-full mb-6">
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-primary-50 dark:bg-primary-900/10 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join thousands of users who are already improving their health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              10K+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Daily Steps Tracked
            </div>
          </div>
          
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              7.5h
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Average Sleep Tracked
            </div>
          </div>
          
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              90%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Users Report Better Health
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentView('signup')}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center"
          >
            Start Tracking Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How WellnessTracker Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get started with our simple three-step process to begin your wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-2xl font-bold mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Sign Up & Set Goals
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your account and set your personal wellness goals to get started.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-2xl font-bold mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Track Daily Habits
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Log your daily activities including steps, sleep, mood, and personal notes.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-2xl font-bold mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Analyze & Improve
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              View your progress with interactive charts and make informed decisions about your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;