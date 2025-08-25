# Hebrew Nutrition Database Setup

This project now uses a **local Hebrew nutrition database** from the Israeli Ministry of Health instead of external APIs like FatSecret.

## 🗂️ **File Structure**

```
data/
├── raw/                    # Place your CSV files here
│   ├── foods.csv          # Main nutrition data (REQUIRED)
│   ├── weights.csv        # Serving sizes (OPTIONAL)
│   └── units.csv          # Unit conversions (OPTIONAL)
└── processed/             # Generated JSON files
    ├── foods.json         # Processed nutrition data
    ├── index.json         # Search index
    └── weights.json       # Processed serving data
```

## 📊 **CSV Format Requirements**

### `foods.csv` (Required)
```csv
קוד מזון,שם מזון,קבוצה,אנרגיה קקל,חלבון גרם,פחמימות גרם,שומן גרם
1001,תפוח עץ,פירות,52,0.3,14,0.2
1002,בננה,פירות,89,1.1,23,0.3
```

**Required columns:**
- `קוד מזון` - Unique food ID
- `שם מזון` - Hebrew food name
- `קבוצה` - Food category (optional)
- `אנרגיה קקל` - Calories per 100g
- `חלבון גרם` - Protein per 100g
- `פחמימות גרם` - Carbs per 100g
- `שומן גרם` - Fat per 100g

### `weights.csv` (Optional)
```csv
קוד מזון,יחידת מידע,משקל לגרם
1001,יחידה בינונית,150
1001,יחידה גדולה,200
```

## 🚀 **Setup Instructions**

### 1. **Add Your CSV Files**
Place your CSV files in `data/raw/`:
- Download from Israeli Ministry of Health website
- Ensure UTF-8 encoding
- Follow the column format above

### 2. **Build the Database**
```bash
npm run build:nutrition
```

This creates optimized JSON files in `data/processed/`.

### 3. **Start Development**
```bash
npm run dev
```

## 🔧 **API Endpoints**

### Search Foods
```
GET /api/foods/search?q=תפוח&limit=25
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": "1001",
      "name_he": "תפוח עץ",
      "category": "פירות",
      "kcal": 52
    }
  ],
  "total": 1,
  "source": "hebrew_nutrition_db"
}
```

### Get Food Details
```
GET /api/foods/food?id=1001&grams=150
```

**Response:**
```json
{
  "success": true,
  "food": {
    "id": "1001",
    "name_he": "תפוח עץ",
    "category": "פירות",
    "kcal": 52,
    "protein_g": 0.3,
    "carbs_g": 14,
    "fat_g": 0.2
  },
  "servings": [
    {"unit": "יחידה בינונית", "grams": 150},
    {"unit": "יחידה גדולה", "grams": 200}
  ],
  "perServing": {
    "kcal": 78,
    "protein_g": 0.45,
    "carbs_g": 21,
    "fat_g": 0.3
  }
}
```

## 🎯 **Frontend Usage**

### Search and Select Food
```typescript
// Search for foods
const response = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
const { items } = await response.json();

// Get food details
const details = await fetch(`/api/foods/food?id=${foodId}&grams=150`);
const { food, servings, perServing } = await details.json();
```

### Auto-populate Form
The `FoodSearch` component automatically populates the calorie tracker form with:
- Hebrew food name
- Nutritional values (scaled to serving size)
- Serving unit
- Source information

## 🚀 **Deployment (Vercel)**

### Option 1: Commit Processed Files
```bash
# Build locally
npm run build:nutrition

# Commit the processed files
git add data/processed/
git commit -m "Add processed nutrition data"
git push
```

### Option 2: Build on Vercel
Add to Vercel build command:
```bash
npm run build:nutrition && npm run build
```

## 🔍 **Features**

- ✅ **Hebrew Search** - Full Hebrew text search with nikud removal
- ✅ **Fast Performance** - Pre-processed JSON files
- ✅ **Serving Sizes** - Automatic conversion from 100g to common servings
- ✅ **No External Dependencies** - Works offline
- ✅ **Ministry of Health Data** - Official Israeli nutrition database
- ✅ **TypeScript Support** - Full type safety

## 🛠️ **Customization**

### Add More Nutrients
Edit `scripts/build-nutrition.ts` to include additional columns:
```typescript
const fiber = Number(r["סיבים גרם"] ?? "");
const sodium = Number(r["נתרן מ"ג"] ?? "");
```

### Custom Search Logic
Modify `src/lib/nutrition-db.ts` to implement:
- Fuzzy search
- Category filtering
- Calorie range filtering

## 📞 **Support**

If you need help:
1. Check the CSV format matches the requirements
2. Ensure UTF-8 encoding
3. Verify the build process completes successfully
4. Test the API endpoints manually

The system is designed to be robust and handle various Hebrew text formats automatically.
