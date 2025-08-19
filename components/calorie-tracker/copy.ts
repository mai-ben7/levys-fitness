import { Copy } from './types';

export const copy: Copy = {
  title: 'מחשבון קלוריות',
  buttons: {
    addFood: 'הוסף מזון',
    saveAsPreset: 'שמור כמועדף',
    editGoals: 'ערוך יעדים',
    undo: 'בטל',
    export: 'ייצא',
    import: 'ייבא',
    useForWeek: 'השתמש לשאר השבוע',
  },
  labels: {
    meal: 'ארוחה',
    calories: 'קלוריות',
    protein: 'חלבון (גרם)',
    carbs: 'פחמימות (גרם)',
    fat: 'שומן (גרם)',
    quantity: 'כמות',
    unit: 'יחידה',
    notes: 'הערות',
    remaining: 'נותר',
    goal: 'יעד',
    consumed: 'נצרך',
  },
  meals: {
    breakfast: 'ארוחת בוקר',
    lunch: 'ארוחת צהריים',
    dinner: 'ארוחת ערב',
    snack: 'חטיף',
  },
  emptyState: 'עדיין לא נרשם מזון',
  toasts: {
    foodAdded: 'המזון נוסף בהצלחה!',
    entryDeleted: 'הרשומה נמחקה — בטל?',
    goalsUpdated: 'היעדים עודכנו בהצלחה!',
    undo: 'בטל',
  },
  presets: {
    cut: 'דיאטה',
    maintain: 'תחזוקה',
    bulk: 'בניית מסה',
  },
};
