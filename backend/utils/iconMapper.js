/**
 * Icon mapper utility
 * Maps product names to icon identifiers
 */

const iconMappings = {
  // Dairy
  milk: 'milk',
  cheese: 'cheese',
  butter: 'butter',
  yogurt: 'yogurt',

  // Bakery
  bread: 'bread',
  baguette: 'bread',
  croissant: 'bakery',

  // Fruits
  apple: 'apple',
  banana: 'banana',
  orange: 'orange',
  grapes: 'grapes',
  strawberry: 'strawberry',

  // Vegetables
  tomato: 'tomato',
  potato: 'potato',
  carrot: 'carrot',
  lettuce: 'lettuce',
  onion: 'onion',

  // Meat
  chicken: 'chicken',
  beef: 'beef',
  pork: 'pork',
  fish: 'fish',

  // Beverages
  water: 'water',
  juice: 'juice',
  soda: 'soda',
  coffee: 'coffee',
  tea: 'tea',

  // Pantry
  rice: 'rice',
  pasta: 'pasta',
  flour: 'flour',
  sugar: 'sugar',
  salt: 'salt',
  oil: 'oil',

  // Snacks
  chips: 'chips',
  cookies: 'cookie',
  chocolate: 'chocolate',
  candy: 'candy',

  // Spanish Mappings
  leche: 'milk',
  queso: 'cheese',
  mantequilla: 'butter',
  yogur: 'yogurt',
  pan: 'bread',
  baguette: 'bread',
  croissant: 'bakery',
  bolleria: 'bakery',
  manzana: 'apple',
  platano: 'banana',
  naranja: 'orange',
  uvas: 'grapes',
  fresa: 'strawberry',
  tomate: 'tomato',
  patata: 'potato',
  papas: 'potato',
  zanahoria: 'carrot',
  lechuga: 'lettuce',
  cebolla: 'onion',
  pollo: 'chicken',
  carne: 'beef',
  ternera: 'beef',
  cerdo: 'pork',
  pescado: 'fish',
  agua: 'water',
  zumo: 'juice',
  jugo: 'juice',
  refresco: 'soda',
  coca: 'soda',
  cafe: 'coffee',
  te: 'tea',
  arroz: 'rice',
  pasta: 'pasta',
  harina: 'flour',
  azucar: 'sugar',
  sal: 'salt',
  aceite: 'oil',
  galletas: 'cookie',
  chocolate: 'chocolate',
  dulces: 'candy',
  caramelos: 'candy',
};

/**
 * Get icon identifier for a product name
   * @param {string} productName - The product name
   * @returns {string} Icon identifier
   */
export const getIconForProduct = (productName) => {
  if (!productName) return 'generic';

  const normalized = productName.toLowerCase().trim();

  // Check for exact match
  if (iconMappings[normalized]) {
    return iconMappings[normalized];
  }

  // Check for partial match
  for (const [key, icon] of Object.entries(iconMappings)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }

  // Default icon
  return 'generic';
};
