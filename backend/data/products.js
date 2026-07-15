// Prototype products use the backend's generated SVG image route.
const products = [
  {
    name: "Essential Kitchen Kit",
    slug: "essential-kitchen-kit",
    image: "/api/images/direct/product",
    description: "The basics you need for everyday cooking during your stay. Each item is sanitized, inspected, and delivered to your vacation rental before your arrival.",
    category: "Essential",
    price: 49.0,
    countInStock: 15,
    rating: 4.5,
    numReviews: 12,
    itemsIncluded: [
      { name: "Chef's knife", description: "8-inch high-quality stainless steel" },
      { name: "Cutting board", description: "Durable wood cutting surface" },
      { name: "Sauté pan", description: "10-inch non-stick with lid" },
      { name: "Saucepan", description: "2-quart stainless steel with lid" },
      { name: "Basic utensil set", description: "Spatula, spoon, tongs, whisk" },
      { name: "Mixing bowls", description: "Set of 3 nesting stainless steel bowls" },
      { name: "Measuring cups and spoons", description: "Complete set" },
      { name: "Colander", description: "Stainless steel, 5-quart" }
    ],
    specifications: [
      { name: "Kit Weight", value: "8 lbs" },
      { name: "Items Included", value: "12 pieces" },
      { name: "Materials", value: "Stainless steel, wood, silicone" },
      { name: "Storage Case", value: "Included" }
    ],
    perfect_for: [
      "Short-term stays",
      "Basic meal preparation",
      "Cooking simple dishes",
      "Budget-conscious travelers"
    ],
    isPopular: true
  },
  {
    name: "Professional Chef's Kit",
    slug: "professional-chefs-kit",
    image: "/api/images/direct/product",
    description: "Our most comprehensive collection with professional-grade tools. This premium kitchenware set includes high-carbon steel knives, heavy-bottomed cookware for even heat distribution, and precision tools.",
    category: "Chef",
    price: 89.0,
    countInStock: 10,
    rating: 4.8,
    numReviews: 15,
    itemsIncluded: [
      { name: "Professional knife set", description: "Chef's, santoku, paring, utility, bread" },
      { name: "Cast iron skillet", description: "10-inch" },
      { name: "Stainless steel saucepan", description: "2-quart" },
      { name: "Stainless steel sauté pan", description: "4-quart" },
      { name: "Premium non-stick frying pan", description: "12-inch" },
      { name: "Complete utensil collection", description: "Spatulas, spoons, tongs, etc." },
      { name: "Cutting boards", description: "Wood and plastic" },
      { name: "Measuring devices", description: "Digital scale, cups, spoons" },
      { name: "Mixing bowls", description: "Set of 5 stainless steel" },
      { name: "Bakeware essentials", description: "Sheet pan, casserole dish" }
    ],
    specifications: [
      { name: "Kit Weight", value: "18 lbs" },
      { name: "Items Included", value: "25+ pieces" },
      { name: "Materials", value: "High-carbon steel, cast iron, stainless steel" },
      { name: "Storage Case", value: "Premium hard case included" }
    ],
    perfect_for: [
      "Culinary enthusiasts",
      "Extended vacation stays",
      "Gourmet meal preparation",
      "Family gatherings"
    ],
    isPopular: true
  },
  {
    name: "Baking Collection",
    slug: "baking-collection",
    image: "/api/images/direct/product",
    description: "Specialized tools for creating delicious baked goods during your stay. This complete baking kit includes everything needed for cookies, cakes, bread, and more.",
    category: "Specialty",
    price: 65.0,
    countInStock: 8,
    rating: 4.6,
    numReviews: 10,
    itemsIncluded: [
      { name: "Mixing bowls", description: "Set of 3 nesting bowls" },
      { name: "Measuring cups and spoons", description: "Complete set" },
      { name: "Baking sheets", description: "2 non-stick pans" },
      { name: "Cake pans", description: "8-inch and 9-inch rounds" },
      { name: "Loaf pan", description: "9x5 inch" },
      { name: "Cooling rack", description: "Stainless steel" },
      { name: "Silicone spatulas", description: "Set of 3" },
      { name: "Whisk", description: "Balloon style" },
      { name: "Rolling pin", description: "French style" },
      { name: "Pastry brush", description: "Silicone" }
    ],
    specifications: [
      { name: "Kit Weight", value: "12 lbs" },
      { name: "Items Included", value: "20 pieces" },
      { name: "Materials", value: "Stainless steel, aluminum, silicone" },
      { name: "Storage Case", value: "Included" }
    ],
    perfect_for: [
      "Family baking activities",
      "Holiday treats",
      "Homemade bread and desserts",
      "Extended vacation stays"
    ],
    isPopular: false
  },
  {
    name: "Italian Cuisine Kit",
    slug: "italian-cuisine-kit",
    image: "/api/images/direct/product",
    description: "Everything you need for authentic Italian cooking. This specialized collection includes pasta-making tools, the perfect sauce pot, and authentic Italian kitchen implements.",
    category: "Specialty",
    price: 75.0,
    countInStock: 6,
    rating: 4.7,
    numReviews: 8,
    itemsIncluded: [
      { name: "Pasta roller", description: "Hand-cranked stainless steel" },
      { name: "Pasta cutter", description: "For various shapes" },
      { name: "Large stockpot", description: "8-quart with lid" },
      { name: "Sauce pan", description: "Premium 3-quart" },
      { name: "Garlic press", description: "Heavy-duty stainless steel" },
      { name: "Cheese grater", description: "Box grater with 4 sides" },
      { name: "Olive oil dispenser", description: "Glass bottle" },
      { name: "Specialty utensils", description: "Wooden spoons, stainless steel tongs" },
      { name: "Herb scissors", description: "5-blade" }
    ],
    specifications: [
      { name: "Kit Weight", value: "15 lbs" },
      { name: "Items Included", value: "15 pieces" },
      { name: "Materials", value: "Stainless steel, wood, glass" },
      { name: "Storage Case", value: "Italian-themed case included" }
    ],
    perfect_for: [
      "Italian food enthusiasts",
      "Pasta making",
      "Family-style meals",
      "Authentic sauce preparation"
    ],
    isPopular: true
  },
  {
    name: "Basic Cookware Set",
    slug: "basic-cookware-set",
    image: "/api/images/direct/product",
    description: "Just the essential pots and pans for simple meal preparation. Perfect for those who just need the cooking vessels without additional tools.",
    category: "Essential",
    price: 39.0,
    countInStock: 20,
    rating: 4.3,
    numReviews: 14,
    itemsIncluded: [
      { name: "Frying pan", description: "10-inch non-stick" },
      { name: "Saucepan", description: "2-quart with lid" },
      { name: "Dutch oven", description: "5-quart with lid" },
      { name: "Baking sheet", description: "Standard size" },
      { name: "Essential utensils", description: "Spatula, large spoon" }
    ],
    specifications: [
      { name: "Kit Weight", value: "10 lbs" },
      { name: "Items Included", value: "7 pieces" },
      { name: "Materials", value: "Aluminum with non-stick coating, stainless steel" },
      { name: "Storage Case", value: "Simple carry case included" }
    ],
    perfect_for: [
      "Budget-conscious travelers",
      "Short weekend stays",
      "Simple meal preparation",
      "Vacation rentals with limited kitchen space"
    ],
    isPopular: false
  },
  {
    name: "Knife Master Collection",
    slug: "knife-master-collection",
    image: "/api/images/direct/product",
    description: "Professional-grade knives for precision cutting and prep work. This collection features high-carbon steel blades with perfect balance and ergonomic handles.",
    category: "Chef",
    price: 55.0,
    countInStock: 12,
    rating: 4.9,
    numReviews: 20,
    itemsIncluded: [
      { name: "Chef's knife", description: "8-inch high-carbon steel" },
      { name: "Santoku knife", description: "7-inch" },
      { name: "Paring knife", description: "3.5-inch" },
      { name: "Utility knife", description: "6-inch" },
      { name: "Bread knife", description: "8-inch serrated" },
      { name: "Kitchen shears", description: "Multi-purpose" },
      { name: "Honing steel", description: "10-inch" },
      { name: "Knife block", description: "Wooden storage" }
    ],
    specifications: [
      { name: "Kit Weight", value: "7 lbs" },
      { name: "Items Included", value: "8 pieces" },
      { name: "Materials", value: "High-carbon stainless steel, polymer handles" },
      { name: "Storage Case", value: "Premium knife roll included" }
    ],
    perfect_for: [
      "Serious home chefs",
      "Precision cutting tasks",
      "Gourmet meal preparation",
      "Food enthusiasts"
    ],
    isPopular: false
  },
  {
    name: "BBQ Collection",
    slug: "bbq-collection",
    image: "/api/images/direct/product",
    description: "Premium outdoor cooking equipment for the ultimate BBQ experience. Our BBQ Collection includes everything you need for grilling and smoking at your vacation rental.",
    category: "Specialty",
    price: 89.99,
    countInStock: 8,
    rating: 4.7,
    numReviews: 9,
    itemsIncluded: [
      { name: "Professional-grade portable grill", description: "Stainless steel construction" },
      { name: "Cast iron BBQ grates", description: "Pre-seasoned for optimal heat retention" },
      { name: "Digital meat thermometer", description: "With timer function" },
      { name: "Grill tool set", description: "Tongs, spatula, fork" },
      { name: "Cedar grilling planks", description: "Set of 6" },
      { name: "BBQ spice rub collection", description: "6 signature blends" },
      { name: "Heat-resistant gloves", description: "Aramid fiber with silicone grip" },
      { name: "Basting brushes and mops", description: "Extended handles" },
      { name: "Marinade injector kit", description: "Multiple needle attachments" },
      { name: "Stainless steel skewers set", description: "Set of 12, 14-inch length" },
      { name: "Grill cleaning brush", description: "Brass bristles with scraper" }
    ],
    specifications: [
      { name: "Portable Grill", value: "255 sq. in. cooking surface, foldable design" },
      { name: "Digital Thermometer", value: "Temperature range 32°F to 572°F" },
      { name: "Total Items", value: "Approximately 25 pieces" },
      { name: "Weight", value: "Approximately 22 lbs" }
    ],
    perfect_for: [
      "Summer getaways and beach houses",
      "Outdoor entertaining and family gatherings",
      "Tailgating and sporting events",
      "Camping trips with premium meals",
      "Grill enthusiasts who want quality without commitment"
    ],
    isPopular: true
  },
  {
    name: "Holiday Cooking Kit",
    slug: "holiday-cooking-kit",
    image: "/api/images/direct/product",
    description: "Everything you need to prepare an unforgettable holiday feast at your vacation rental. Our Holiday Cooking Kit includes premium cookware, bakeware, and specialty tools for holiday entertaining.",
    category: "Specialty",
    price: 99.99,
    countInStock: 5,
    rating: 4.8,
    numReviews: 12,
    itemsIncluded: [
      { name: "Large roasting pan with rack", description: "16\" x 13\" stainless steel" },
      { name: "Digital meat thermometer with timer", description: "Programmable" },
      { name: "Professional carving set", description: "8\" knife and fork" },
      { name: "Mixing bowls", description: "Set of 3 nesting stainless steel bowls" },
      { name: "Silicone baking mats", description: "Heat resistant to 480°F" },
      { name: "Cookie cutters and decorating set", description: "12-piece holiday themes" },
      { name: "Rolling pin and pastry board", description: "Hardwood with measurements" },
      { name: "Pie dishes", description: "Set of 2, 9\" ceramic" },
      { name: "Casserole dishes", description: "Set of 3 with lids" },
      { name: "Gravy boat and separator", description: "Porcelain" },
      { name: "Wine opener and stoppers", description: "Professional quality" },
      { name: "Festive serving platters and utensils", description: "Holiday-themed" }
    ],
    specifications: [
      { name: "Roasting Pan", value: "Accommodates up to 25 lb turkey" },
      { name: "Total Items", value: "Approximately 35 pieces" },
      { name: "Weight", value: "Approximately 28 lbs" },
      { name: "Storage Case", value: "Custom-designed hard case with foam inserts" }
    ],
    perfect_for: [
      "Family holiday getaways",
      "Destination Christmas celebrations",
      "Multi-family holiday gatherings",
      "Winter vacation homes",
      "Holiday entertaining away from home"
    ],
    isPopular: true
  },
  {
    name: "Asian Fusion Kit",
    slug: "asian-fusion-kit",
    image: "/api/images/direct/product",
    description: "Master the art of Asian cuisine with premium tools. This specialized collection includes woks, steamers, and authentic Asian kitchen implements.",
    category: "Specialty",
    price: 79.0,
    countInStock: 7,
    rating: 4.6,
    numReviews: 9,
    itemsIncluded: [
      { name: "Carbon steel wok", description: "14-inch with lid" },
      { name: "Bamboo steamer", description: "10-inch, 2-tier" },
      { name: "Rice cooker", description: "6-cup capacity" },
      { name: "Chef's knife", description: "8-inch santoku" },
      { name: "Chopsticks", description: "Set of 6 pairs" },
      { name: "Spider strainer", description: "Stainless steel" },
      { name: "Cleaver", description: "7-inch stainless steel" },
      { name: "Specialty utensils", description: "Wok spatula, ladle" },
      { name: "Mortar and pestle", description: "Granite, 4-inch" }
    ],
    specifications: [
      { name: "Kit Weight", value: "14 lbs" },
      { name: "Items Included", value: "15 pieces" },
      { name: "Materials", value: "Carbon steel, stainless steel, bamboo" },
      { name: "Storage Case", value: "Asian-inspired case included" }
    ],
    perfect_for: [
      "Asian food enthusiasts",
      "Stir-fry and steaming techniques",
      "Authentic rice preparation",
      "Family-style Asian meals"
    ],
    isPopular: false
  }
];

module.exports = products;
