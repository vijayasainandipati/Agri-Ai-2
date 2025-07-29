export interface Crop {
  translationKey: string;
  imageHint: string;
  imageUrl: string;
}

export const cropCategories = [
  { key: "fruits", label: "Fruits", nameKey: "cropCategory.fruits" },
  { key: "oilseeds", label: "Oilseeds", nameKey: "cropCategory.oilseeds" },
  { key: "cash-crops", label: "Cash Crops", nameKey: "cropCategory.cashCrops" },
  { key: "spices", label: "Spices", nameKey: "cropCategory.spices" },
  { key: "medicinal", label: "Medicinal", nameKey: "cropCategory.medicinal" },
  { key: "cereal", label: "Cereal", nameKey: "cropCategory.cereal" },
  { key: "pulses", label: "Pulses", nameKey: "cropCategory.pulses" },
  { key: "vegetables", label: "Vegetables", nameKey: "cropCategory.vegetables" },
];

export const cropsData: Record<string, Crop[]> = {
  Fruits: [
    { translationKey: "mango", imageHint: 'ripe mangoes', imageUrl: 'https://static.toiimg.com/thumb/msid-100174955,width-400,height-225,resizemode-72/100174955.jpg' },
    { translationKey: "banana", imageHint: 'banana bunch', imageUrl: 'https://static.toiimg.com/thumb/msid-89030094,width-400,height-225,resizemode-72/89030094.jpg' },
  ],
  Oilseeds: [
    { translationKey: "sunflower", imageHint: 'sunflower field', imageUrl: 'https://images.timesnownews.com/thumb/msid-117393032,thumbsize-1990533,width-400,height-225,resizemode-75/117393032.jpg' },
    { translationKey: "mustard", imageHint: 'mustard field', imageUrl: 'https://static.toiimg.com/thumb/msid-67766746,width-400,height-225,resizemode-72/67766746.jpg' },
  ],
  "Cash Crops": [
    { translationKey: "sugarcane", imageHint: 'sugarcane plantation', imageUrl: 'https://static.toiimg.com/thumb/msid-70221808,width-400,height-225,resizemode-72/70221808.jpg' },
    { translationKey: "cotton", imageHint: 'cotton plant', imageUrl: 'https://static.toiimg.com/thumb/msid-88099376,width-400,height-225,resizemode-72/88099376.jpg' },
  ],
  Spices: [
    { translationKey: "turmeric", imageHint: 'turmeric powder', imageUrl: 'https://static.toiimg.com/thumb/msid-111066644,width-400,height-225,resizemode-72/111066644.jpg' },
    { translationKey: "chilli", imageHint: 'red chillies', imageUrl: 'https://static.toiimg.com/thumb/msid-89422397,width-400,height-225,resizemode-72/89422397.jpg' },
  ],
  Medicinal: [
    { translationKey: "aloe_vera", imageHint: 'aloe vera', imageUrl: 'https://images.everydayhealth.com/images/wellness/health-benefits-of-aloe-vera-alt-1440x810.jpg?w=400&h=225' },
    { translationKey: "tulsi", imageHint: 'tulsi plant', imageUrl: 'https://static.toiimg.com/thumb/msid-71041337,width-400,height-225,resizemode-72/71041337.jpg' },
  ],
  Cereal: [
    { translationKey: "rice", imageHint: 'rice paddy', imageUrl: 'https://cdn.britannica.com/89/140889-050-EC3F00BF/Ripening-heads-rice-Oryza-sativa.jpg?w=400&h=225&c=crop' },
    { translationKey: "wheat", imageHint: 'wheat field', imageUrl: 'https://static.toiimg.com/thumb/msid-118046939,width-400,height-225,resizemode-72/118046939.jpg' },
    { translationKey: "maize", imageHint: 'corn field', imageUrl: 'https://static.toiimg.com/thumb/msid-76767236,width-400,height-225,resizemode-72/76767236.jpg' },
  ],
  Pulses: [
    { translationKey: "lentils", imageHint: 'lentil bowl', imageUrl: 'https://media.istockphoto.com/id/956458060/photo/close-up-of-lentil-plant.jpg?s=612x612&w=0&k=20&c=984-cZ0i-NJl-7B4WJ1zPcaRbPZAFKHaOlsQdHiNLSc=' },
    { translationKey: "chickpeas", imageHint: 'chickpea bowl', imageUrl: 'https://media.istockphoto.com/id/638538708/photo/woman-showing-chickpeas-in-close-up.jpg?s=612x612&w=0&k=20&c=ZAZ-5i5KuuteCEOZrrwQ3S30yh-ptUVwZ752-LG90cg=' },
  ],
  Vegetables: [
    { translationKey: "tomato", imageHint: 'fresh tomatoes', imageUrl: 'https://media.istockphoto.com/id/1545800730/photo/organic-tomato-greenhouse.jpg?s=612x612&w=0&k=20&c=o6QN6XbHKqIEpgTn7bQxNgtIOGe231Nhb-_zxz3LdZI=' },
    { translationKey: "potato", imageHint: 'potato harvest', imageUrl: 'https://images.cnbctv18.com/uploads/2025/06/air-potato-2025-06-b12d416f6d12e6995b97351041959f59.jpg?impolicy=website&width=400&height=225' },
    { translationKey: "onion", imageHint: 'onion bulbs', imageUrl: 'https://images.timesnownews.com/thumb/msid-103481351,thumbsize-701145,width-400,height-225,resizemode-75/103481351.jpg' },
  ],
};
