// Mock data for wellness tracker application
// Sample user accounts for authentication
export const mockUsers = [
  {
    id: 1,
    email: 'demo@wellness.com',
    password: 'demo123',
    name: 'Demo User',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    email: 'john.doe@email.com',
    password: 'password123',
    name: 'John Doe',
    createdAt: '2024-01-15'
  }
];

// Mood options for entries
export const moodOptions = [
  { value: 'excellent', label: 'Excellent', color: '#10B981', emoji: '😄' },
  { value: 'good', label: 'Good', color: '#3B82F6', emoji: '😊' },
  { value: 'neutral', label: 'Neutral', color: '#6B7280', emoji: '😐' },
  { value: 'tired', label: 'Tired', color: '#F59E0B', emoji: '😴' },
  { value: 'stressed', label: 'Stressed', color: '#EF4444', emoji: '😰' },
  { value: 'sick', label: 'Sick', color: '#8B5CF6', emoji: '🤒' }
];

// Generate mock wellness entries for the last 30 days
export const generateMockEntries = (userId = 1, daysBack = 30) => {
  const entries = [];
  const today = new Date();
  
  for (let i = 0; i < daysBack; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic but varied data
    const baseSteps = 7000;
    const stepVariation = Math.random() * 6000; // 0-6000 variation
    const steps = Math.floor(baseSteps + stepVariation);
    
    const baseSleep = 7;
    const sleepVariation = (Math.random() - 0.5) * 3; // -1.5 to +1.5 hours
    const sleepHours = Math.max(4, Math.min(10, baseSleep + sleepVariation));
    
    // Weight mood selection towards positive moods
    const moodWeights = [0.3, 0.35, 0.2, 0.1, 0.04, 0.01]; // excellent, good, neutral, tired, stressed, sick
    let randomValue = Math.random();
    let selectedMoodIndex = 0;
    
    for (let j = 0; j < moodWeights.length; j++) {
      if (randomValue <= moodWeights[j]) {
        selectedMoodIndex = j;
        break;
      }
      randomValue -= moodWeights[j];
    }
    
    const mood = moodOptions[selectedMoodIndex].value;
    
    // Generate notes occasionally
    const noteTemplates = [
      "Great workout session today!",
      "Had a productive day at work",
      "Felt energetic throughout the day",
      "Took a long walk in the park",
      "Had trouble sleeping last night",
      "Stressed about upcoming deadline",
      "Relaxing weekend with family",
      "Tried a new healthy recipe",
      "Morning yoga session was refreshing",
      "Feeling grateful for good health"
    ];
    
    const hasNote = Math.random() > 0.7; // 30% chance of having a note
    const notes = hasNote ? noteTemplates[Math.floor(Math.random() * noteTemplates.length)] : '';
    
    entries.push({
      id: i + 1,
      userId: userId,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      steps: steps,
      sleepHours: Math.round(sleepHours * 2) / 2, // Round to nearest 0.5
      mood: mood,
      notes: notes,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString()
    });
  }
  
  return entries.reverse(); // Return chronological order (oldest first)
};

// Default mock entries
export const mockEntries = generateMockEntries();

// Helper function to get mood details
export const getMoodDetails = (moodValue) => {
  return moodOptions.find(mood => mood.value === moodValue) || moodOptions[2]; // Default to neutral
};

// Helper function to calculate wellness metrics
export const calculateMetrics = (entries, days = 7) => {
  if (!entries || entries.length === 0) {
    return {
      avgSteps: 0,
      avgSleep: 0,
      moodDistribution: {},
      totalEntries: 0
    };
  }

  const recentEntries = entries.slice(-days);
  
  const totalSteps = recentEntries.reduce((sum, entry) => sum + (entry.steps || 0), 0);
  const totalSleep = recentEntries.reduce((sum, entry) => sum + (entry.sleepHours || 0), 0);
  
  const avgSteps = Math.round(totalSteps / recentEntries.length) || 0;
  const avgSleep = Math.round((totalSleep / recentEntries.length) * 10) / 10 || 0;
  
  // Calculate mood distribution
  const moodDistribution = recentEntries.reduce((acc, entry) => {
    const mood = entry.mood || 'neutral';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});
  
  return {
    avgSteps,
    avgSleep,
    moodDistribution,
    totalEntries: recentEntries.length
  };
};

// Sample goals/targets for wellness metrics
export const wellnessTargets = {
  steps: 10000,
  sleepHours: 8
};

export default {
  mockUsers,
  moodOptions,
  mockEntries,
  generateMockEntries,
  getMoodDetails,
  calculateMetrics,
  wellnessTargets
};