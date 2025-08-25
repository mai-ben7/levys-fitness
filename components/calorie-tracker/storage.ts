import { TrackerState, DailyGoals, FoodEntry } from './types';

const STORAGE_KEY = 'calorie-tracker-state';

export const loadState = (): TrackerState => {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultState();
    }

    const data = JSON.parse(stored);
    return migrate(data);
  } catch (error) {
    console.warn('Failed to parse stored state, using defaults:', error);
    return getDefaultState();
  }
};

export const saveState = (state: TrackerState): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // Use requestIdleCallback for non-blocking save operations
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  };

  // Use requestIdleCallback if available, otherwise use setTimeout
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(saveToStorage);
  } else {
    setTimeout(saveToStorage, 0);
  }
};

const migrate = (data: unknown): TrackerState => {
  // Handle legacy data or invalid data
  if (!data || typeof data !== 'object') {
    return getDefaultState();
  }

  const legacyData = data as Record<string, unknown>;
  
  // Check if it's already the current format
  if (legacyData.version === 1 && 
      typeof legacyData.goalsByDate === 'object' && 
      typeof legacyData.entriesByDate === 'object' && 
      Array.isArray(legacyData.presets)) {
    return data as TrackerState;
  }

  // Migrate from legacy format
  return {
    version: 1,
    goalsByDate: (legacyData.goalsByDate as Record<string, DailyGoals>) || {},
    entriesByDate: (legacyData.entriesByDate as Record<string, FoodEntry[]>) || {},
    presets: Array.isArray(legacyData.presets) ? legacyData.presets : [],
  };
};

const getDefaultState = (): TrackerState => {
  return {
    version: 1,
    goalsByDate: {
      default: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
      },
    },
    entriesByDate: {},
    presets: [],
  };
};

export const exportData = (state: TrackerState): void => {
  const dataStr = JSON.stringify(state, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `calorie-tracker-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};

export const importData = (file: File): Promise<{ data: TrackerState; isValid: boolean }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        
        // Basic validation
        if (parsed && typeof parsed === 'object' && 
            typeof parsed.goalsByDate === 'object' && 
            typeof parsed.entriesByDate === 'object' && 
            Array.isArray(parsed.presets)) {
          resolve({ data: parsed as TrackerState, isValid: true });
        } else {
          resolve({ data: getDefaultState(), isValid: false });
        }
      } catch {
        resolve({ data: getDefaultState(), isValid: false });
      }
    };
    
    reader.readAsText(file);
  });
};
