import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SummaryCard = ({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  trend = null, 
  trendValue = null,
  color = 'blue',
  subtitle = null,
  loading = false,
  onClick = null
}) => {
  // Color variations for different card types
  const colorClasses = {
    blue: {
      icon: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    green: {
      icon: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800'
    },
    purple: {
      icon: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800'
    },
    yellow: {
      icon: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    red: {
      icon: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800'
    },
    gray: {
      icon: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-800'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  // Trend indicator component
  const TrendIndicator = ({ trend, value }) => {
    if (!trend || !value) return null;

    const trendClasses = {
      up: 'text-green-600 dark:text-green-400',
      down: 'text-red-600 dark:text-red-400',
      neutral: 'text-gray-500 dark:text-gray-400'
    };

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

    return (
      <div className={`flex items-center space-x-1 text-xs ${trendClasses[trend]}`}>
        <TrendIcon className="h-3 w-3" />
        <span>{value}</span>
      </div>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  const cardContent = (
    <div className="flex items-center">
      {/* Icon */}
      {Icon && (
        <div className={`p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      )}

      {/* Content */}
      <div className="ml-4 flex-1">
        {/* Title */}
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>

        {/* Value */}
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
            {unit && (
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400 ml-1">
                {unit}
              </span>
            )}
          </p>
          
          {/* Trend indicator */}
          <TrendIndicator trend={trend} value={trendValue} />
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  // Render as clickable card or static card
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="card hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 w-full text-left"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="card">
      {cardContent}
    </div>
  );
};

// Specialized summary card variants
export const StepsSummaryCard = ({ steps, target = 10000, trend, trendValue }) => {
  const percentage = Math.min((steps / target) * 100, 100);
  const subtitle = `${percentage.toFixed(0)}% of ${target.toLocaleString()} goal`;
  
  return (
    <SummaryCard
      title="Daily Steps"
      value={steps?.toLocaleString() || '0'}
      icon={require('lucide-react').Activity}
      color="blue"
      trend={trend}
      trendValue={trendValue}
      subtitle={subtitle}
    />
  );
};

export const SleepSummaryCard = ({ sleepHours, target = 8, trend, trendValue }) => {
  const subtitle = `Target: ${target}h`;
  const color = sleepHours >= target ? 'green' : sleepHours >= target - 1 ? 'yellow' : 'red';
  
  return (
    <SummaryCard
      title="Sleep Hours"
      value={sleepHours?.toFixed(1) || '0'}
      unit="h"
      icon={require('lucide-react').Moon}
      color={color}
      trend={trend}
      trendValue={trendValue}
      subtitle={subtitle}
    />
  );
};

export const MoodSummaryCard = ({ mood, moodEmoji, onClick }) => {
  const moodColors = {
    excellent: 'green',
    good: 'blue',
    neutral: 'gray',
    tired: 'yellow',
    stressed: 'red',
    sick: 'purple'
  };
  
  return (
    <SummaryCard
      title="Current Mood"
      value={`${moodEmoji || '😐'} ${mood || 'Not set'}`}
      icon={require('lucide-react').Smile}
      color={moodColors[mood] || 'gray'}
      onClick={onClick}
      subtitle="Tap to update"
    />
  );
};

export const WeeklyAverageSummaryCard = ({ title, value, unit, icon, color }) => {
  return (
    <SummaryCard
      title={title}
      value={value}
      unit={unit}
      icon={icon}
      color={color}
      subtitle="7-day average"
    />
  );
};

// Grid container for summary cards
export const SummaryCardGrid = ({ children, columns = 'auto' }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    auto: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {children}
    </div>
  );
};
export default SummaryCard;