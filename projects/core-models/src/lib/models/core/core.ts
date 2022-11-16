export interface Feature {
  uuid: string;
  code: string;
  name: string;
  description: string;
  price: string;
}

export interface PlanFeature {
  uuid: string;
  feature: Feature;
  quantity: number;
  price: string;
}

export interface Plan {
  uuid: string;
  type: string;
  name: string;
  price: string;
  trial_total_days: number;
  anual_discount_pct?: any;
  features: PlanFeature[];
}
