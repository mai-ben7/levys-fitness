"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Utensils } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchResult {
  id: string;
  name_he: string;
  category: string;
  kcal: number | null;
}

interface FoodDetails {
  id: string;
  name_he: string;
  category?: string;
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  nutrients?: Record<string, any>;
  servings: {
    unit: string;
    grams: number;
  }[];
  perServing?: {
    kcal?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  };
}

interface FoodSearchProps {
  onSelectFood: (food: FoodDetails) => void;
  onClose: () => void;
}

export default function FoodSearch({ onSelectFood, onClose }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/foods/search?q=${encodeURIComponent(searchQuery)}&limit=15`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search for foods');
      }

      setSearchResults(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search for foods');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFood = async (food: SearchResult) => {
    setIsLoadingDetails(true);
    setError(null);

    try {
      const response = await fetch(`/api/foods/food?id=${food.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get food details');
      }

      onSelectFood(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get food details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Search className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">חיפוש מזון</h3>
              <p className="text-sm text-gray-500">חפש מזון במסד הנתונים של משרד הבריאות</p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="הקלד שם מזון..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10 text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="mr-2 text-gray-600">מחפש...</span>
            </div>
          )}

          {isLoadingDetails && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="mr-2 text-gray-600">טוען פרטי מזון...</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!isLoading && !isLoadingDetails && !error && searchResults.length === 0 && query && (
            <div className="p-4 text-center">
              <Utensils className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">לא נמצאו תוצאות</p>
            </div>
          )}

          <AnimatePresence>
            {searchResults.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 last:border-b-0"
              >
                <button
                  onClick={() => handleSelectFood(food)}
                  disabled={isLoadingDetails}
                  className="w-full p-4 text-right hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{food.name_he}</h4>
                      {food.category && (
                        <p className="text-sm text-gray-500 mb-2">{food.category}</p>
                      )}
                      <div className="text-xs text-gray-400">
                        לחץ לבחירה וטעינת פרטי תזונה
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mr-3">
                      {food.kcal ? `${food.kcal} קלוריות` : 'ללא מידע'}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            ביטול
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
