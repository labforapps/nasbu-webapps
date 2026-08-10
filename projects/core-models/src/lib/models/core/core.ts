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
  show_in_public_pricing: boolean;
  description: string;
}

export interface PlanModule {
  uuid: string;
  plan: string;
  module: string;         // identificador (coincide con el enum modules)
  module_display: string; // nombre legible
}

export interface Plan {
  uuid: string;
  type: string;
  name: string;
  price: string;
  trial_total_days: number;
  anual_discount_pct?: any;
  features: PlanFeature[];
  available_modules?: PlanModule[];
  suggested: boolean;
}

export interface DocumentTemplateTypeTest {
  uuid:       string;
  code:       string;
  name:       string;
  variables:  VariableDocumentTemplateTest[];
  active:     boolean;
  created_by: string;
  created_at: Date;
}

export interface VariableDocumentTemplateTest {
  uuid:          string;
  template_type: string;
  name:          string;
  description:   string;
  value_path:    string;
}
