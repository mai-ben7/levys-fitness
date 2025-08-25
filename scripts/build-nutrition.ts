import { createReadStream, writeFileSync, existsSync } from "fs";
import { parse } from "csv-parse";
import path from "path";

type Food = {
  id: string;                 // stable id from source (e.g., item code)
  name_he: string;            // Hebrew name
  name_he_norm: string;       // normalized Hebrew name for search
  category?: string;
  // Minimal core macros (adjust field names to actual CSV headers):
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  // Keep a map of all nutrients per 100g if available:
  nutrients?: Record<string, number | string | null>;
};

function normHebrew(s: string) {
  // remove nikud + trim whitespace; keep letters/numbers/space
  return s
    .normalize("NFKC")
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function loadFoods(csvPath: string): Promise<Food[]> {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];
    createReadStream(csvPath, { encoding: 'utf8' })
      .pipe(parse({ 
        columns: true, 
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        bom: true
      }))
      .on("data", (r) => rows.push(r))
      .on("end", () => {
        console.log("Parsed rows:", rows.length);
        console.log("Sample row keys:", Object.keys(rows[0] || {}));
        
        // Map CSV columns → our schema. Adjust keys to match actual headers.
        const foods: Food[] = rows.map((r, index) => {
          // Ministry of Health format
          const id = String(r["Code"] ?? r["קוד מזון"] ?? r["food_code"] ?? r["id"] ?? "");
          const name = String(r["shmmitzrach"] ?? r["שם מזון"] ?? r["name_he"] ?? r["שם מוצר"] ?? "").trim();
          const kcal = Number(r["food_energy"] ?? r["אנרגיה קקל"] ?? r["אנרגיה (קק\"ל)"] ?? r["קלוריות"] ?? r["energy_kcal"] ?? "");
          const protein = Number(r["protein"] ?? r["חלבון גרם"] ?? r["חלבון (גרם)"] ?? r["protein_g"] ?? "");
          const carbs = Number(r["carbohydrates"] ?? r["פחמימות גרם"] ?? r["פחמימות (גרם)"] ?? r["carbs_g"] ?? "");
          const fat = Number(r["total_fat"] ?? r["שומן גרם"] ?? r["שומן (גרם)"] ?? r["fat_g"] ?? "");
          const category = (r["makor"] ?? r["קבוצה"] ?? r["קטגוריה"] ?? r["category"] ?? "").trim();

          // Debug first few rows
          if (index < 3) {
            console.log(`Row ${index}:`, { id, name, kcal, protein, carbs, fat, category });
          }

          // Keep all columns as nutrients for completeness:
          const nutrients: Record<string, number | string | null> = {};
          for (const [k, v] of Object.entries(r)) {
            const num = typeof v === "string" && v.trim() !== "" ? Number(v.replace(",", ".")) : v;
            nutrients[k] = Number.isFinite(num as number) ? (num as number) : (v as string | null);
          }

          return {
            id,
            name_he: name,
            name_he_norm: normHebrew(name),
            category: category || "כללי",
            kcal: Number.isFinite(kcal) ? kcal : undefined,
            protein_g: Number.isFinite(protein) ? protein : undefined,
            carbs_g: Number.isFinite(carbs) ? carbs : undefined,
            fat_g: Number.isFinite(fat) ? fat : undefined,
            nutrients,
          };
        }).filter(f => f.id && f.name_he);

        console.log("Filtered foods:", foods.length);
        console.log("Sample food:", foods[0]);

        resolve(foods);
      })
      .on("error", reject);
  });
}

async function loadWeights(csvPath: string): Promise<Record<string, { unit: string; grams: number }[]>> {
  if (!existsSync(csvPath)) return {};
  return new Promise((resolve, reject) => {
    const map: Record<string, { unit: string; grams: number }[]> = {};
    createReadStream(csvPath, "utf8")
      .pipe(parse({ 
        columns: true, 
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        bom: true
      }))
      .on("data", (r) => {
        // Ministry of Health format
        const foodId = String(r["mmitzrach"] ?? r["קוד מזון"] ?? r["food_code"] ?? "").trim();
        const unit = String(r["mida"] ?? r["יחידת מידע"] ?? r["unit"] ?? "").trim();
        const grams = Number(r["mishkal"] ?? r["משקל לגרם"] ?? r["grams"] ?? r["גרמים ליחידה"] ?? "");
        if (!foodId || !unit || !isFinite(grams)) return;
        map[foodId] ||= [];
        map[foodId].push({ unit, grams });
      })
      .on("end", () => resolve(map))
      .on("error", reject);
  });
}

async function main() {
  const root = process.cwd();
  const foodsCsv = path.join(root, "data/raw/foods.csv");
  const weightsCsv = path.join(root, "data/raw/weights.csv");

  if (!existsSync(foodsCsv)) {
    console.error(`❌ Foods CSV not found at: ${foodsCsv}`);
    console.log("📁 Please place your foods.csv file in data/raw/");
    process.exit(1);
  }

  console.log("🔍 Loading foods from CSV...");
  const foods = await loadFoods(foodsCsv);
  
  console.log("⚖️ Loading weights from CSV...");
  const weights = await loadWeights(weightsCsv);

  // Build a lightweight search index (name + normalized)
  const index = foods.map(f => ({
    id: f.id,
    name_he: f.name_he,
    name_he_norm: normHebrew(f.name_he),
    category: f.category ?? "",
    kcal: f.kcal ?? null
  }));

  // Write compact JSONs used at runtime
  const outDir = path.join(root, "data/processed");
  const fs = await import("fs/promises").then(m => m.default);
  await fs.mkdir(outDir, { recursive: true });

  writeFileSync(path.join(outDir, "foods.json"), JSON.stringify(foods));
  writeFileSync(path.join(outDir, "index.json"), JSON.stringify(index));
  writeFileSync(path.join(outDir, "weights.json"), JSON.stringify(weights));

  console.log(`✅ Success! Wrote ${foods.length} foods, index size=${index.length}`);
  console.log(`📊 Files created in: ${outDir}`);
  console.log(`   - foods.json (${(JSON.stringify(foods).length / 1024).toFixed(1)} KB)`);
  console.log(`   - index.json (${(JSON.stringify(index).length / 1024).toFixed(1)} KB)`);
  console.log(`   - weights.json (${(JSON.stringify(weights).length / 1024).toFixed(1)} KB)`);
}

main().catch((e) => {
  console.error("❌ Build failed:", e);
  process.exit(1);
});
