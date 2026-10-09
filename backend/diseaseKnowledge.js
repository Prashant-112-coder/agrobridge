/**
 * AGROBRIDGE Pomegranate Disease Knowledge Base (JavaScript)
 * Treatment recommendations integrated into the Node.js backend.
 * Keeps disease identification separate from treatment per INFERENCE_CONTRACT.md.
 */

export const DISEASE_KNOWLEDGE = {
  Healthy: {
    displayName: "Healthy Fruit",
    severity: "none",
    severityColor: "#22c55e",
    icon: "✅",
    description: "The fruit appears healthy with no visible signs of disease or damage.",
    symptoms: [],
    causes: [],
    treatment: {
      immediate: [],
      preventive: [
        "Continue regular monitoring of fruit development",
        "Maintain proper irrigation schedule",
        "Apply preventive fungicide sprays at recommended intervals during monsoon season",
        "Keep orchard floor clean and remove fallen fruits"
      ]
    },
    whenToConsult: "No immediate action needed. Consult an agronomist if you notice any changes."
  },
  Anthracnose: {
    displayName: "Anthracnose (Colletotrichum)",
    severity: "high",
    severityColor: "#ef4444",
    icon: "🔴",
    description: "A serious fungal disease caused by Colletotrichum gloeosporioides. It affects fruits, leaves, and flowers, causing dark sunken lesions.",
    symptoms: [
      "Dark brown to black sunken spots on fruit surface",
      "Spots may merge to form large necrotic areas",
      "Fruit cracking and premature dropping",
      "Pink spore masses visible in humid conditions",
      "Affected fruits show internal browning"
    ],
    causes: [
      "High humidity and frequent rainfall",
      "Warm temperatures (25–30°C)",
      "Poor air circulation in dense canopies",
      "Infected plant debris left in the orchard"
    ],
    treatment: {
      immediate: [
        "Remove and destroy all infected fruits immediately",
        "Apply Carbendazim (1g/L) or Mancozeb (2.5g/L) spray",
        "Apply copper-based fungicide (Copper Oxychloride 3g/L)",
        "Improve air circulation by pruning dense branches"
      ],
      preventive: [
        "Pre-monsoon prophylactic spray with Carbendazim + Mancozeb",
        "Spray at fruit setting stage, repeat every 15 days during rainy season",
        "Use drip irrigation — avoid overhead watering",
        "Remove and burn all fallen and mummified fruits",
        "Apply bagging on fruits during monsoon"
      ]
    },
    whenToConsult: "Consult an agronomist immediately if more than 10% of fruits show symptoms."
  },
  Bacterial_Blight: {
    displayName: "Bacterial Blight (Xanthomonas)",
    severity: "critical",
    severityColor: "#dc2626",
    icon: "🔴",
    description: "A devastating bacterial disease caused by Xanthomonas axonopodis pv. punicae. It can cause 60–80% yield loss in severe cases.",
    symptoms: [
      "Small water-soaked spots turning dark brown to black",
      "L-shaped or Y-shaped cracking on fruits",
      "Oily spots that enlarge and become necrotic",
      "Gum exudation from severely affected fruits",
      "Leaves show small irregular dark spots"
    ],
    causes: [
      "Bacterial pathogen Xanthomonas axonopodis pv. punicae",
      "Spreads through rain splash, wind, and contaminated tools",
      "Warm and humid conditions favor spread",
      "Wounds from insects or hail enable entry"
    ],
    treatment: {
      immediate: [
        "Remove and destroy all severely infected plant parts",
        "Spray Streptomycin Sulfate (500 ppm) + Copper Oxychloride (3g/L)",
        "Apply Bordeaux mixture (1%) on all exposed surfaces",
        "Disinfect all pruning tools with 2% sodium hypochlorite"
      ],
      preventive: [
        "Use disease-free planting material from certified nurseries",
        "Avoid overhead irrigation and minimize wetting of foliage",
        "Apply 3 sprays of Streptocycline (0.5g/L) at 15-day intervals before monsoon",
        "Maintain proper spacing for air circulation",
        "Remove and destroy all infected plant debris during summer pruning"
      ]
    },
    whenToConsult: "Consult an agronomist immediately. This disease can destroy entire orchards if not managed early."
  },
  Alternaria: {
    displayName: "Alternaria Fruit Spot",
    severity: "moderate",
    severityColor: "#f59e0b",
    icon: "🟡",
    description: "Caused by Alternaria alternata. It primarily affects fruit rind, causing dark brown spots with concentric rings.",
    symptoms: [
      "Circular to irregular dark brown spots on fruit surface",
      "Spots may show concentric rings (target-like pattern)",
      "Affected area becomes dry and corky",
      "Usually affects mature and ripening fruits",
      "Leaf spots with concentric rings may also appear"
    ],
    causes: [
      "Alternaria alternata fungal pathogen",
      "Warm and wet conditions, especially post-rain",
      "Stressed trees are more susceptible",
      "Poor orchard sanitation"
    ],
    treatment: {
      immediate: [
        "Remove and discard affected fruits",
        "Spray Mancozeb (2.5g/L) or Propineb (2g/L)",
        "Apply Hexaconazole (1ml/L) for severe infection"
      ],
      preventive: [
        "Apply protective fungicide sprays starting from fruit setting",
        "Maintain balanced nutrition — avoid excess nitrogen",
        "Improve drainage and air circulation",
        "Remove fallen leaves and fruits regularly",
        "Apply potassium-based foliar sprays to strengthen fruit rind"
      ]
    },
    whenToConsult: "Consult if spots spread to more than 15–20% of fruits despite spraying."
  },
  Cercospora: {
    displayName: "Cercospora Fruit Spot",
    severity: "moderate",
    severityColor: "#f59e0b",
    icon: "🟡",
    description: "Caused by Cercospora punicae. It produces distinctive small dark spots primarily on leaves and occasionally on fruits.",
    symptoms: [
      "Small, circular, dark brown to black spots on fruit surface",
      "Spots are usually smaller than Alternaria spots",
      "Heavily spotted fruits may crack or drop prematurely",
      "Leaf spots with gray centers are common",
      "Severe cases cause defoliation"
    ],
    causes: [
      "Cercospora punicae fungal pathogen",
      "Humid and warm conditions",
      "Dense planting with poor ventilation",
      "Infected leaf litter acting as inoculum source"
    ],
    treatment: {
      immediate: [
        "Apply Carbendazim (1g/L) or Thiophanate-methyl (1g/L)",
        "Remove severely infected leaves and fruits",
        "Improve air circulation through selective pruning"
      ],
      preventive: [
        "Prophylactic sprays with Mancozeb or Chlorothalonil during monsoon",
        "Maintain proper tree spacing (5m × 5m minimum)",
        "Clean orchard floor — remove all fallen leaves in summer",
        "Apply balanced fertilization with micronutrients (Zinc, Manganese)",
        "Use drip irrigation instead of flood irrigation"
      ]
    },
    whenToConsult: "Consult if defoliation exceeds 25% or fruit quality degrades noticeably."
  },
  Unknown: {
    displayName: "Unidentified Condition",
    severity: "unknown",
    severityColor: "#6b7280",
    icon: "❓",
    description: "The model could not identify this condition with sufficient confidence. This may be due to image quality, an uncommon condition, or a disease not in the current training set.",
    symptoms: [],
    causes: [],
    treatment: {
      immediate: [
        "Take a clearer, well-lit photo of the affected area",
        "Photograph from multiple angles showing the full extent",
        "Consult a local agricultural officer or plant pathology lab"
      ],
      preventive: [
        "Continue regular monitoring and field scouting",
        "Maintain general preventive fungicide schedule"
      ]
    },
    whenToConsult: "Please consult a qualified agronomist or submit samples to a plant diagnostic lab for accurate identification."
  }
};

export function getDiseaseInfo(label) {
  return DISEASE_KNOWLEDGE[label] || DISEASE_KNOWLEDGE.Unknown;
}
