export const PAULS_JOURNEY = {
  id: "journey_paul_rome",
  title: "Paul's Voyage to Rome",
  path: [
    { latitude: 32.47, longitude: 34.9 }, // Caesarea
    { latitude: 33.51, longitude: 35.25 }, // Sidon
    { latitude: 36.85, longitude: 28.27 }, // Myra
    { latitude: 35.34, longitude: 25.13 }, // Fair Havens
    { latitude: 35.93, longitude: 14.37 }, // Malta
    { latitude: 41.9, longitude: 12.49 }, // Rome
  ],
  locations: [
    {
      id: "loc_caesarea",
      title: "Caesarea Maritima",
      description: "Paul appealed to Caesar here before Governor Festus.",
      coordinates: { latitude: 32.47, longitude: 34.9 },
      image: require("@/assets/game/images/caesarea.jpg"),
      type: "START",
    },
    {
      id: "loc_malta",
      title: "Malta Shipwreck",
      description:
        "The ship ran aground on a sandbar. All 276 on board survived.",
      coordinates: { latitude: 35.93, longitude: 14.37 },
      image: require("@/assets/game/images/malta.jpg"),
      type: "DANGER",
    },
    {
      id: "loc_rome",
      title: "Rome",
      description:
        "Paul lived here under house arrest for two years, preaching the Kingdom.",
      coordinates: { latitude: 41.9, longitude: 12.49 },
      image: require("@/assets/game/images/rome.jpg"),
      type: "FINISH",
    },
  ],
  ancientEmpirePoly: [
    // Simplified Roman Empire Polygon for overlay
    { latitude: 30, longitude: -5 },
    { latitude: 45, longitude: -5 },
    { latitude: 45, longitude: 40 },
    { latitude: 30, longitude: 40 },
    { latitude: 30, longitude: -5 },
  ],
};
