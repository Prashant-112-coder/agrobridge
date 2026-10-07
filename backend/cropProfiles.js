// AGROBRIDGE crop intelligence profiles.
// Thresholds are deliberately conservative decision-support bands, not disease diagnoses.
// Values should be refined with agronomy validation before being used for prescriptive inputs.

export const CROP_PROFILES = {
  Tomato: {
    ndvi: { moderate: 0.40, low: 0.20 },
    temperature: { warm: 32, heat: 35 },
    soilPH: { min: 5.8, max: 7.0 },
    label: "Tomato"
  },
  Rice: {
    ndvi: { moderate: 0.45, low: 0.25 },
    temperature: { warm: 32, heat: 36 },
    soilPH: { min: 5.5, max: 7.0 },
    label: "Rice"
  },
  Wheat: {
    ndvi: { moderate: 0.42, low: 0.22 },
    temperature: { warm: 30, heat: 34 },
    soilPH: { min: 6.0, max: 7.5 },
    label: "Wheat"
  },
  Maize: {
    ndvi: { moderate: 0.42, low: 0.22 },
    temperature: { warm: 32, heat: 35 },
    soilPH: { min: 5.8, max: 7.0 },
    label: "Maize"
  },
  Sugarcane: {
    ndvi: { moderate: 0.48, low: 0.25 },
    temperature: { warm: 33, heat: 36 },
    soilPH: { min: 6.0, max: 7.5 },
    label: "Sugarcane"
  },
  Cotton: {
    ndvi: { moderate: 0.40, low: 0.20 },
    temperature: { warm: 32, heat: 36 },
    soilPH: { min: 5.8, max: 8.0 },
    label: "Cotton"
  },
  Ragi: {
    ndvi: { moderate: 0.40, low: 0.20 },
    temperature: { warm: 30, heat: 34 },
    soilPH: { min: 5.5, max: 7.5 },
    label: "Ragi"
  },
  Pomegranate: {
    ndvi: { moderate: 0.42, low: 0.20 },
    temperature: { warm: 32, heat: 36 },
    soilPH: { min: 6.0, max: 7.5 },
    label: "Pomegranate"
  },
  Other: {
    ndvi: { moderate: 0.40, low: 0.20 },
    temperature: { warm: 32, heat: 35 },
    soilPH: { min: 5.5, max: 8.0 },
    label: "General crop"
  }
};

export function getCropProfile(crop) {
  return CROP_PROFILES[crop] || CROP_PROFILES.Other;
}
