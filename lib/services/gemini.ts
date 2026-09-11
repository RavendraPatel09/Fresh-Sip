import { GoogleGenerativeAI } from '@google/generative-ai';
import { SAMPLE_PRODUCTS } from '@/lib/data/productsData';
import { Product } from '@/types';

// Structured system prompt to ensure grounded responses
const SYSTEM_PROMPT = `
You are FreshSip AI, an expert juice sommelier, nutritionist, and personal order assistant for FreshSip Juice Bar.
Your goal is to provide warm, vibrant, helpful, and 100% accurate advice on fresh juices, smoothies, shakes, and wellness.

CRITICAL ACCURACY & GROUNDING RULES:
1. You MUST ONLY provide facts (ingredients, prices, calories, sugar content, health benefits) from the official product catalog provided below.
2. DO NOT invent or fabricate any unlisted products, ingredients, prices, or discounts.
3. If the user asks for medical advice, gently state that you provide general wellness information and recommend consulting a healthcare provider.
4. Keep answers concise, friendly, and visually structured with clean bullet points and emojis.

OFFICIAL PRODUCT CATALOG:
${JSON.stringify(
  SAMPLE_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: `₹${p.price} (250ml)`,
    sizePrices: p.sizePrices,
    description: p.description,
    ingredients: p.ingredients,
    calories: `${p.nutrition.calories} kcal`,
    sugar: p.nutrition.sugar,
    vitaminC: p.nutrition.vitaminC,
    protein: p.nutrition.protein,
    healthBenefits: p.healthBenefits,
    tags: p.tags,
  })),
  null,
  2
)}

AVAILABLE ACTION CAPABILITIES:
- If recommending a product, refer to it by its exact catalog name.
- If the user asks to filter or view a category (Fruit Juices, Detox, Smoothies, Shakes, Combos), suggest exploring that category.
- If the user explicitly asks to add items to their cart (e.g. "add 2 Mango Bursts"), include a special JSON marker at the very end of your response like:
[ACTION: {"type": "ADD_TO_CART", "productId": "mango-burst", "quantity": 2, "size": "250ml"}]
`;

export async function getGeminiAIResponse(userMessage: string, chatHistory: Array<{ sender: string; text: string }> = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Intelligent fallback responder when GEMINI_API_KEY is not configured
    return fallbackSmartResponse(userMessage);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Understood! I am FreshSip AI, ready to assist customers strictly based on the official FreshSip catalog.' }] },
      ...chatHistory.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    const result = await model.generateContent({ contents });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return fallbackSmartResponse(userMessage);
  }
}

// Fallback intelligent responder matching query intents
function fallbackSmartResponse(userQuery: string): string {
  const query = userQuery.toLowerCase();

  // Add to cart intent
  if (query.includes('add') && (query.includes('mango') || query.includes('burst'))) {
    return `I've added 2 🍊 **Mango Burst** juices (250ml) to your cart! You can view your cart or proceed to checkout anytime. 

[ACTION: {"type": "ADD_TO_CART", "productId": "mango-burst", "quantity": 2, "size": "250ml"}]`;
  }

  if (query.includes('workout') || query.includes('fitness') || query.includes('protein')) {
    return `For workout recovery and post-exercise muscle repair, I highly recommend:

• 🏋️ **Fitness Combo** (₹449) — Includes 1 Chocolate Protein Shake (22g vegan protein) + 1 Watermelon Hydration Splash.
• 🥤 **Chocolate Shake** (₹199) — Rich Dutch cocoa blended with Medjool dates and 18g pea protein.
• 🍓 **Strawberry Dream** (₹169) — Greek yogurt smoothie with 9g protein and chia seeds.`;
  }

  if (query.includes('detox') || query.includes('cleanse') || query.includes('green')) {
    return `Looking to refresh and cleanse your system? Check out our top Detox elixirs:

• 🥬 **Green Detox** (₹159) — Organic kale, spinach, green apple, and celery (Only 75 kcal, 9g low sugar).
• 🥒 **Cucumber Mint** (₹129) — Ultra-hydrating aloe vera gel with spearmint and cucumber.
• 🍋 **Lemon Ginger** (₹139) — Spicy immunity booster with cold-pressed lemon and fiery ginger root.`;
  }

  if (query.includes('least sugar') || query.includes('low sugar') || query.includes('sugar')) {
    return `Here are our juices with the lowest natural sugar content:

• 🥒 **Cucumber Mint** — Only 4g ultra-low natural sugar.
• 🥬 **Green Detox** — Only 9g natural sugar from crisp green apples.
• 🍋 **Lemon Ginger** — 12g natural sugar from wildflower honey.`;
  }

  if (query.includes('mango burst') || query.includes('mango')) {
    const mango = SAMPLE_PRODUCTS[0];
    return `🍊 **Mango Burst Details**:
• **Price**: ₹149 (250ml) | ₹249 (500ml) | ₹449 (1L)
• **Ingredients**: Fresh Alphonso Mango Pulp, Organic Coconut Water, Lime Juice, Mint.
• **Calories**: 160 kcal
• **Vitamin C**: 140% Daily Value
• **Health Benefits**: Energy, Immunity, Refreshment.`;
  }

  if (query.includes('hydration') || query.includes('hydrate')) {
    return `Stay ultra-hydrated with these customer favorites:

• 🍉 **Watermelon Splash** (₹119) — Cold-pressed ruby watermelon with fresh basil and Himalayan pink salt.
• 🥒 **Cucumber Mint** (₹129) — Organic aloe vera gel and spearmint.
• 🍊 **Orange Glow** (₹129) — Valencia orange juice with coconut water and turmeric.`;
  }

  return `Welcome to FreshSip! 🍊 
I can help you explore our menu, find juices for specific health goals (Energy, Immunity, Hydration, Detox, Fitness), check ingredients, or add items directly to your cart. 

What can I get fresh for you today?`;
}
