export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;             // uuid
  dateISO: string;        // YYYY-MM-DD (local)
  meal: MealType;
  name: string;
  calories: number;       // integer
  protein: number;        // grams
  carbs: number;          // grams
  fat: number;            // grams
  quantity?: number;      // optional quantity
  unit?: string;          // g/ml/serving, etc.
  note?: string;
  createdAt: number;      // epoch ms
  updatedAt?: number;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface TrackerState {
  version: 1;
  goalsByDate: Record<string, DailyGoals>;     // default goal can fallback if date not present
  entriesByDate: Record<string, FoodEntry[]>;  // per day
  presets: FoodEntry[];                         // used only for name/macros/cal template
}

export interface DayTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeekData {
  date: string;
  calories: number;
  goal: number;
  goalHit: boolean;
}

export interface Copy {
  title: string;
  buttons: {
    addFood: string;
    saveAsPreset: string;
    editGoals: string;
    undo: string;
    export: string;
    import: string;
    useForWeek: string;
  };
  labels: {
    meal: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    quantity: string;
    unit: string;
    notes: string;
    remaining: string;
    goal: string;
    consumed: string;
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
  emptyState: string;
  toasts: {
    foodAdded: string;
    entryDeleted: string;
    goalsUpdated: string;
    undo: string;
  };
  presets: {
    cut: string;
    maintain: string;
    bulk: string;
  };
}

