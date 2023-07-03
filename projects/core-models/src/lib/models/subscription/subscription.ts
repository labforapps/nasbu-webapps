import { Address, Contact } from "../shared";

export type SubscriptionPeriod = 'M' | 'Y';

export interface SubscriptionOnboarding {
    uuid?: string;
    plan: string;
    period: SubscriptionPeriod;
    free_trial: boolean;
    total_users: number;
}

export interface Subscription extends SubscriptionPayload {
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

export interface SubscriptionPayload {
  name: string;
  contacts: SubscriptionContact[];
  schedules: Schedule[];
  addresses: SubscriptionAddress[];
  logoFile?: any;
}

export interface SubscriptionContact extends Contact{
  subscription:string;
}

export interface SubscriptionAddress extends Address{
  subscription:string;
}
export interface Schedule {
  schedule_id?: string;
  week_day:    number;
  is_closed:   boolean;
  start_time:  string;
  end_time:    string;
}

export interface SubscriptionBillingFee {
  uuid?:                string;
  subscription:        string;
  billing_fee_id:      string;
  price_per_hour:      string;
  increment_factor:    string;
  price_per_increment: string;
  allow_retainers:     boolean;
  allow_flat_fee:      boolean;
  active?:              boolean;
  created_by?:          null;
  created_at?:          Date;
  updated_by?:          null;
  updated_at?:          Date;
}

