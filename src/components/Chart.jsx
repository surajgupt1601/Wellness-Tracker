import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Calendar, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const Chart = ({ 
  data = [], 
  type = 'line', 
  title = '', 
  height = 300,
  showControls = true,
  dateRange = '7',
  onDateRangeChange = null,
  loading = false
}) => {
  const [chartType, setChartType] = useState(type);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Chart color themes
  const colors = {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4'
  };

  // Mood colors for pie charts
  const moodColors = {
    excellent: '#10B981',
    good: '#3B82F6',
    neutral: '#6B7280',
    tired: '#F59E0B',
    stressed: '#EF4444',
    sick: '#8B5CF6'
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-300">
              {entry.dataKey}: {entry.value}
              {entry.dataKey === 'steps' && ' steps'}
              {entry.dataKey === 'sleepHours' && 'h'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Chart type selector
  const ChartTypeSelector = () => {
    const chartTypes = [
      { id: 'line', label: 'Line', icon: TrendingUp },
      { id: 'bar', label: 'Bar', icon: BarChart3 },
      { id: 'area', label: 'Area', icon: TrendingUp },
      { id: 'pie', label: 'Pie', icon: PieChartIcon }
    ];

    return (
      <div className="flex space-x-2">
        {chartTypes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setChartType(id)}
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              chartType === id
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-100'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="h-3 w-3 mr-1" />
            {label}
          </button>
        ))}
      </div>
    );
  };

  // Date range selector
  const DateRangeSelector = () => {
    const ranges = [
      { value: '7', label: '7 days' },
      { value: '14', label: '14 days' },
      { value: '30', label: '30 days' }
    ];

    return (
      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange && onDateRangeChange(e.target.value)}
        className="text-xs border border-gray-300 rounded-md px-2 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
      >
        {ranges.map(range => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="card">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
        )}
        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded" style={{ height }}>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="card">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {showControls && (
              <div className="flex items-center space-x-3">
                <ChartTypeSelector />
                <DateRangeSelector />
              </div>
            )}
          </div>
        )}
        <div 
          className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
          style={{ height }}
        >
          <div className="text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Add some wellness entries to see your progress
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Process data for pie chart (mood distribution)
  const processPieData = (data) => {
    const moodCounts = data.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      fill: moodColors[mood] || colors.primary
    }));
  };

  // Render chart based on type
  const renderChart = () => {
    const chartProps = {
      width: '100%',
      height: '100%',
      data: chartType === 'pie' ? processPieData(data) : data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const axisProps = {
      tick: { fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' },
      tickLine: { stroke: isDark ? '#4B5563' : '#D1D5DB' },
      axisLine: { stroke: isDark ? '#4B5563' : '#D1D5DB' }
    };

    const gridProps = {
      strokeDasharray: '3 3',
      stroke: isDark ? '#374151' : '#E5E7EB'
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              {...axisProps}
            />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="steps" fill={colors.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="sleepHours" fill={colors.secondary} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              {...axisProps}
            />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="steps" 
              stackId="1"
              stroke={colors.primary} 
              fill={colors.primary}
              fillOpacity={0.6}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart {...chartProps}>
            <Pie
              data={processPieData(data)}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {processPieData(data).map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      default: // line chart
        return (
          <LineChart {...chartProps}>
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              {...axisProps}
            />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="steps" 
              stroke={colors.primary} 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="sleepHours" 
              stroke={colors.secondary} 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="card">
      {/* Chart header */}
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {showControls && (
            <div className="flex items-center space-x-3">
              <ChartTypeSelector />
              <DateRangeSelector />
            </div>
          )}
        </div>
      )}

      {/* Chart container */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Specialized chart components
export const StepsChart = ({ data, ...props }) => (
  <Chart
    {...props}
    data={data}
    title="Daily Steps"
    type="line"
  />
);

export const SleepChart = ({ data, ...props }) => (
  <Chart
    {...props}
    data={data}
    title="Sleep Hours"
    type="bar"
  />
);

export const MoodChart = ({ data, ...props }) => (
  <Chart
    {...props}
    data={data}
    title="Mood Distribution"
    type="pie"
    showControls={false}
  />
);

export const CombinedChart = ({ data, ...props }) => (
  <Chart
    {...props}
    data={data}
    title="Wellness Overview"
    type="line"
  />
);
export default Chart;