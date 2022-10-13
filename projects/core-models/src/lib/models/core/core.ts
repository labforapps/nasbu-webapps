export interface Feature {
  id: number;
  code: string;
  name: string;
  description: string;
  price: string;
}

export interface PlanFeature {
  id: number;
  feature: Feature;
  quantity: number;
  price: string;
}

export interface Plan {
  id: number;
  type: string;
  name: string;
  price: string;
  trial_total_days: number;
  anual_discount_pct?: any;
  features: PlanFeature[];
}
