import { FoodItem } from "@/types";
export type { FoodItem } from "@/types";

export const FOOD_DATABASE: FoodItem[] = [
  // Proteins
  { name: "Chicken Breast", servingSize: "100g", macros: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, keywords: ["chicken", "breast", "grilled chicken", "baked chicken"] },
  { name: "Salmon", servingSize: "100g", macros: { calories: 208, protein: 20, carbs: 0, fat: 13 }, keywords: ["salmon", "fish"] },
  { name: "Eggs", servingSize: "1 large", macros: { calories: 72, protein: 6, carbs: 0.4, fat: 5 }, keywords: ["egg", "eggs", "boiled egg", "fried egg", "scrambled"] },
  { name: "Greek Yogurt", servingSize: "170g", macros: { calories: 100, protein: 17, carbs: 6, fat: 0.7 }, keywords: ["greek yogurt", "yogurt", "yoghurt"] },
  { name: "Tofu", servingSize: "100g", macros: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 }, keywords: ["tofu", "bean curd"] },
  { name: "Ground Beef (lean)", servingSize: "100g", macros: { calories: 250, protein: 26, carbs: 0, fat: 15 }, keywords: ["beef", "ground beef", "mince", "hamburger"] },
  { name: "Turkey Breast", servingSize: "100g", macros: { calories: 135, protein: 30, carbs: 0, fat: 1 }, keywords: ["turkey", "turkey breast"] },
  { name: "Tuna", servingSize: "100g", macros: { calories: 132, protein: 29, carbs: 0, fat: 1 }, keywords: ["tuna", "tuna fish"] },
  { name: "Shrimp", servingSize: "100g", macros: { calories: 99, protein: 24, carbs: 0.2, fat: 0.3 }, keywords: ["shrimp", "prawns"] },
  { name: "Cottage Cheese", servingSize: "100g", macros: { calories: 98, protein: 11, carbs: 3.4, fat: 4.3 }, keywords: ["cottage cheese"] },
  { name: "Whey Protein Shake", servingSize: "1 scoop (30g)", macros: { calories: 120, protein: 24, carbs: 3, fat: 1.5 }, keywords: ["protein shake", "whey", "protein powder", "shake"] },
  { name: "Paneer", servingSize: "100g", macros: { calories: 265, protein: 18, carbs: 1.2, fat: 21 }, keywords: ["paneer", "cottage cheese indian"] },

  // Grains & Carbs
  { name: "White Rice (cooked)", servingSize: "1 cup (158g)", macros: { calories: 206, protein: 4.3, carbs: 45, fat: 0.4 }, keywords: ["rice", "white rice", "steamed rice"] },
  { name: "Brown Rice (cooked)", servingSize: "1 cup (195g)", macros: { calories: 216, protein: 5, carbs: 45, fat: 1.8 }, keywords: ["brown rice"] },
  { name: "Oatmeal", servingSize: "1 cup cooked (234g)", macros: { calories: 154, protein: 5, carbs: 27, fat: 2.6 }, keywords: ["oats", "oatmeal", "porridge"] },
  { name: "Whole Wheat Bread", servingSize: "1 slice (28g)", macros: { calories: 69, protein: 3.6, carbs: 12, fat: 1.1 }, keywords: ["bread", "wheat bread", "toast", "whole wheat"] },
  { name: "Pasta (cooked)", servingSize: "1 cup (140g)", macros: { calories: 220, protein: 8, carbs: 43, fat: 1.3 }, keywords: ["pasta", "spaghetti", "penne", "noodles"] },
  { name: "Quinoa (cooked)", servingSize: "1 cup (185g)", macros: { calories: 222, protein: 8, carbs: 39, fat: 3.6 }, keywords: ["quinoa"] },
  { name: "Sweet Potato", servingSize: "1 medium (130g)", macros: { calories: 112, protein: 2, carbs: 26, fat: 0.1 }, keywords: ["sweet potato", "yam"] },
  { name: "Potato", servingSize: "1 medium (150g)", macros: { calories: 130, protein: 3, carbs: 30, fat: 0.2 }, keywords: ["potato", "baked potato", "boiled potato"] },
  { name: "Roti/Chapati", servingSize: "1 piece (40g)", macros: { calories: 120, protein: 3, carbs: 18, fat: 3.7 }, keywords: ["roti", "chapati", "chapatti", "flatbread", "naan"] },

  // Fruits
  { name: "Banana", servingSize: "1 medium (118g)", macros: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 }, keywords: ["banana"] },
  { name: "Apple", servingSize: "1 medium (182g)", macros: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }, keywords: ["apple"] },
  { name: "Blueberries", servingSize: "1 cup (148g)", macros: { calories: 84, protein: 1.1, carbs: 21, fat: 0.5 }, keywords: ["blueberries", "berries"] },
  { name: "Orange", servingSize: "1 medium (131g)", macros: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2 }, keywords: ["orange"] },
  { name: "Mango", servingSize: "1 cup (165g)", macros: { calories: 99, protein: 1.4, carbs: 25, fat: 0.6 }, keywords: ["mango"] },

  // Vegetables
  { name: "Broccoli", servingSize: "1 cup (91g)", macros: { calories: 31, protein: 2.6, carbs: 6, fat: 0.3 }, keywords: ["broccoli"] },
  { name: "Spinach", servingSize: "1 cup (30g)", macros: { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1 }, keywords: ["spinach", "palak"] },
  { name: "Mixed Salad", servingSize: "1 bowl (100g)", macros: { calories: 20, protein: 1.5, carbs: 3.5, fat: 0.2 }, keywords: ["salad", "green salad", "mixed salad"] },
  { name: "Avocado", servingSize: "1 whole (200g)", macros: { calories: 322, protein: 4, carbs: 17, fat: 29 }, keywords: ["avocado", "avo", "guacamole"] },

  // Dairy & Drinks
  { name: "Whole Milk", servingSize: "1 cup (244ml)", macros: { calories: 149, protein: 8, carbs: 12, fat: 8 }, keywords: ["milk", "whole milk"] },
  { name: "Skim Milk", servingSize: "1 cup (244ml)", macros: { calories: 83, protein: 8, carbs: 12, fat: 0.2 }, keywords: ["skim milk", "fat free milk"] },
  { name: "Cheddar Cheese", servingSize: "1 oz (28g)", macros: { calories: 113, protein: 7, carbs: 0.4, fat: 9 }, keywords: ["cheese", "cheddar"] },
  { name: "Butter", servingSize: "1 tbsp (14g)", macros: { calories: 102, protein: 0.1, carbs: 0, fat: 11.5 }, keywords: ["butter"] },

  // Nuts & Seeds
  { name: "Almonds", servingSize: "1 oz (28g)", macros: { calories: 164, protein: 6, carbs: 6, fat: 14 }, keywords: ["almonds", "almond"] },
  { name: "Peanut Butter", servingSize: "2 tbsp (32g)", macros: { calories: 188, protein: 8, carbs: 6, fat: 16 }, keywords: ["peanut butter", "pb"] },
  { name: "Walnuts", servingSize: "1 oz (28g)", macros: { calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5 }, keywords: ["walnuts", "walnut"] },

  // Common meals
  { name: "Chicken Tikka", servingSize: "1 serving (200g)", macros: { calories: 260, protein: 35, carbs: 8, fat: 10 }, keywords: ["chicken tikka", "tikka"] },
  { name: "Dal (Lentil Curry)", servingSize: "1 cup (200g)", macros: { calories: 180, protein: 12, carbs: 28, fat: 2.5 }, keywords: ["dal", "daal", "lentil", "lentils", "dal fry"] },
  { name: "Caesar Salad", servingSize: "1 bowl (250g)", macros: { calories: 360, protein: 14, carbs: 18, fat: 26 }, keywords: ["caesar salad", "caesar"] },
  { name: "Burrito Bowl", servingSize: "1 bowl (400g)", macros: { calories: 620, protein: 32, carbs: 72, fat: 22 }, keywords: ["burrito bowl", "burrito", "chipotle"] },
  { name: "Pizza Slice (Cheese)", servingSize: "1 slice (107g)", macros: { calories: 285, protein: 12, carbs: 36, fat: 10 }, keywords: ["pizza", "pizza slice"] },
  { name: "Hamburger", servingSize: "1 burger", macros: { calories: 540, protein: 34, carbs: 40, fat: 27 }, keywords: ["hamburger", "burger", "cheeseburger"] },
  { name: "Sandwich (Turkey)", servingSize: "1 sandwich", macros: { calories: 350, protein: 24, carbs: 35, fat: 12 }, keywords: ["sandwich", "turkey sandwich", "sub"] },
  { name: "Sushi Roll", servingSize: "6 pieces", macros: { calories: 250, protein: 9, carbs: 38, fat: 7 }, keywords: ["sushi", "sushi roll", "california roll", "maki"] },
  { name: "Fried Rice", servingSize: "1 cup (200g)", macros: { calories: 340, protein: 10, carbs: 48, fat: 12 }, keywords: ["fried rice"] },
  { name: "Butter Chicken", servingSize: "1 serving (250g)", macros: { calories: 440, protein: 30, carbs: 14, fat: 30 }, keywords: ["butter chicken", "murgh makhani"] },
  { name: "Biryani (Chicken)", servingSize: "1 plate (300g)", macros: { calories: 490, protein: 22, carbs: 60, fat: 18 }, keywords: ["biryani", "chicken biryani"] },

  // Snacks
  { name: "Protein Bar", servingSize: "1 bar (60g)", macros: { calories: 210, protein: 20, carbs: 22, fat: 7 }, keywords: ["protein bar", "bar"] },
  { name: "Trail Mix", servingSize: "1/4 cup (40g)", macros: { calories: 175, protein: 5, carbs: 16, fat: 11 }, keywords: ["trail mix", "mixed nuts"] },
  { name: "Dark Chocolate", servingSize: "1 oz (28g)", macros: { calories: 155, protein: 1.4, carbs: 17, fat: 9 }, keywords: ["dark chocolate", "chocolate"] },
  { name: "Chips/Crisps", servingSize: "1 oz (28g)", macros: { calories: 152, protein: 2, carbs: 15, fat: 10 }, keywords: ["chips", "crisps", "potato chips", "lays"] },
  { name: "Ice Cream", servingSize: "1/2 cup (66g)", macros: { calories: 137, protein: 2.3, carbs: 16, fat: 7 }, keywords: ["ice cream", "icecream"] },

  // Drinks
  { name: "Black Coffee", servingSize: "1 cup (240ml)", macros: { calories: 2, protein: 0.3, carbs: 0, fat: 0 }, keywords: ["coffee", "black coffee", "americano"] },
  { name: "Latte", servingSize: "12 oz (360ml)", macros: { calories: 150, protein: 10, carbs: 13, fat: 6 }, keywords: ["latte", "cafe latte", "coffee latte"] },
  { name: "Orange Juice", servingSize: "1 cup (248ml)", macros: { calories: 112, protein: 1.7, carbs: 26, fat: 0.5 }, keywords: ["orange juice", "oj", "juice"] },
  { name: "Smoothie (Mixed Berry)", servingSize: "1 cup (250ml)", macros: { calories: 160, protein: 3, carbs: 36, fat: 1 }, keywords: ["smoothie", "berry smoothie"] },
  { name: "Coca Cola", servingSize: "1 can (355ml)", macros: { calories: 140, protein: 0, carbs: 39, fat: 0 }, keywords: ["coke", "cola", "coca cola", "soda", "soft drink"] },
];

export function searchFoods(query: string): FoodItem[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];

  return FOOD_DATABASE.filter(
    (item) =>
      item.name.toLowerCase().includes(lower) ||
      item.keywords.some((kw) => kw.includes(lower) || lower.includes(kw))
  ).slice(0, 10);
}
