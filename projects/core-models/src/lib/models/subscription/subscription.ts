export type SubscriptionPeriod = 'M' | 'Y';

export interface SubscriptionOnboarding {
    uuid?: string;
    plan: string;
    period: SubscriptionPeriod;
    free_trial: boolean;
}

export interface Subscription {
  uuid: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  type: string;
  status: string;
  name: string;
  email: string;
  tax_id?: any;
  phone_number: string;
  contact_name: string;
  contact_phone_number: string;
  contact_email: string;
  logo_url?: any;
  gross_amt: string;
  tax_amt: string;
  discount_amt: string;
  net_amt: string;
  effective_date: Date;
  expiration_date?: any;
  first_checkout_url?: any;
  created_by: string;
  updated_by?: any;
  plan: string;
}

