import type { TranslationKey } from "./translations";

export interface Scheme {
  id: string;
  nameKey: TranslationKey;
  type: 'Subsidy' | 'Loan';
  categoryKey: 'general' | 'seeds' | 'fertilizer' | 'machinery' | 'irrigation';
  state: string; // 'All' for national schemes
  cropType: string; // 'All' for all crops
  eligibilityKey: TranslationKey;
  benefitsKey: TranslationKey;
  lastDate: string;
  link: string;
}

export const schemeCategories = [
    { key: 'general', nameKey: 'subsidies.category.general' as const },
    { key: 'seeds', nameKey: 'subsidies.category.seeds' as const },
    { key: 'fertilizer', nameKey: 'subsidies.category.fertilizer' as const },
    { key: 'machinery', nameKey: 'subsidies.category.machinery' as const },
    { key: 'irrigation', nameKey: 'subsidies.category.irrigation' as const },
];


export const schemesData: Scheme[] = [
  {
    id: 'pm-kisan',
    nameKey: 'scheme.pm-kisan.name',
    type: 'Subsidy',
    categoryKey: 'general',
    state: 'All',
    cropType: 'All',
    eligibilityKey: 'scheme.pm-kisan.eligibility',
    benefitsKey: 'scheme.pm-kisan.benefits',
    lastDate: '2024-12-31',
    link: '#',
  },
  {
    id: 'kcc',
    nameKey: 'scheme.kcc.name',
    type: 'Loan',
    categoryKey: 'general',
    state: 'All',
    cropType: 'All',
    eligibilityKey: 'scheme.kcc.eligibility',
    benefitsKey: 'scheme.kcc.benefits',
    lastDate: '2025-03-31',
    link: '#',
  },
  {
    id: 'irrigation-subsidy',
    nameKey: 'scheme.irrigation-subsidy.name',
    type: 'Subsidy',
    categoryKey: 'irrigation',
    state: 'Tamil Nadu',
    cropType: 'Sugarcane',
    eligibilityKey: 'scheme.irrigation-subsidy.eligibility',
    benefitsKey: 'scheme.irrigation-subsidy.benefits',
    lastDate: '2024-10-31',
    link: '#',
  },
    {
    id: 'machinery-loan',
    nameKey: 'scheme.machinery-loan.name',
    type: 'Loan',
    categoryKey: 'machinery',
    state: 'Punjab',
    cropType: 'Wheat',
    eligibilityKey: 'scheme.machinery-loan.eligibility',
    benefitsKey: 'scheme.machinery-loan.benefits',
    lastDate: '2024-11-30',
    link: '#',
  },
];
