export const initialForm = {
  farmerName: "Ravi Kumar",
  country: "India",
  state: "Karnataka",
  taluk: "Mandya",
  village: "Mandya",
  latitude: "12.5218",
  longitude: "76.8951",
  crop: "Tomato",
  area: "2.5",
  cropAge: "35",
  irrigation: "Drip",
  previousCrop: "Maize",
  plantingDate: "2026-02-15",
  cropStage: "Vegetative",
  soilSource: "none",
  soilPH: "6.8",
  nitrogen: "Medium",
  phosphorus: "High",
  potassium: "Medium",
  organicCarbon: "0.8",
  soilType: "Red Soil"
};

export const locationData = {
  India: {
    Karnataka: {
      Mandya: ["Mandya", "Hosahalli", "Holalu", "Muthathi"],
      Maddur: ["Maddur", "Besagarahalli", "Koppa", "Huliyurdurga"],
      Malavalli: ["Malavalli", "Halagur", "Koratagere", "Kirugavalu"],
      Krishnarajpet: ["Krishnarajpet", "Kikkeri", "Akkihebbalu", "Bookanakere"],
      Srirangapatna: ["Srirangapatna", "Palahalli", "Belagola", "Arakere"],
      Nagamangala: ["Nagamangala", "Bellur", "Bindahalli", "Devalapura"],
      Pandavapura: ["Pandavapura", "Melukote", "Somanahalli", "Kyathanahalli"]
    },
    "Tamil Nadu": {
      "Coimbatore North": ["Coimbatore", "Kovilpalayam", "Saravanampatti"],
      "Madurai North": ["Madurai", "Alanganallur", "Vilangudi"]
    },
    Kerala: {
      Alathur: ["Alathur", "Kuzhalmannam", "Kannambra"],
      Kottayam: ["Kottayam", "Kumarakom", "Pallom"]
    },
    "Andhra Pradesh": {
      Guntur: ["Guntur", "Ponnur", "Tenali"],
      Tirupati: ["Tirupati", "Renigunta", "Chandragiri"]
    },
    Telangana: {
      Hyderabad: ["Hyderabad", "Shamshabad", "Rajendranagar"],
      Warangal: ["Warangal", "Hanamkonda", "Kazipet"]
    },
    Maharashtra: {
      Pune: ["Pune", "Haveli", "Mulshi"],
      Nashik: ["Nashik", "Dindori", "Sinnar"],
      Solapur: ["Solapur", "Pandharpur", "Barshi"]
    },
    Goa: {
      Tiswadi: ["Panaji", "Ribandar", "Taleigao"],
      Salcete: ["Margao", "Navelim", "Colva"]
    }
  }
};

export const crops = [
  "Tomato",
  "Rice",
  "Wheat",
  "Maize",
  "Sugarcane",
  "Cotton",
  "Ragi",
  "Pomegranate",
  "Other"
];

export const soilTypes = [
  "Black Soil",
  "Red Soil",
  "Alluvial Soil",
  "Sandy Soil",
  "Clay Soil",
  "Loamy Soil",
  "Other"
];

export const cropStages = [
  "Seedling",
  "Vegetative",
  "Flowering",
  "Fruiting",
  "Maturity"
];
