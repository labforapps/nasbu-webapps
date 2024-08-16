import { PaymentGateway } from "../common";
import { Address, Contact } from "../shared";

export type SubscriptionPeriod = 'M' | 'Y';

export interface SubscriptionOnboarding {
    uuid?: string;
    plan: string;
    period: SubscriptionPeriod;
    free_trial: boolean;
    total_users: number;
    pm_request_id?: string;
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
  tutorial_was_completed?: boolean;
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
  price_per_hour:      number;
  increment_factor:    string;
  price_per_increment: number | string;
  tax_pct: string
  allow_retainers:     boolean;
  allow_flat_fee:      boolean;
  active?:              boolean;
  created_by?:          null;
  created_at?:          Date;
  updated_by?:          null;
  updated_at?:          Date;
}

export interface OnboardingTokenizationSessionResult {
   status: any
   requestId: string;
   processUrl: string;
   message: string;
}


export interface SubscriptionPaymentMethod {
    uuid: string;
    subscription: string;
    franchise_name: string;
    issuer: string;
    last_four_digits: string;
    expiration_date: string;
    is_default: boolean;
    active: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
}

export interface SubscriptionPaymentMethodPayload {
    subscription: string;
    request_id: string;
}

export interface SubscriptionPaymentGateway {
    uuid:                 string;
    active:               boolean;
    created_at:           Date;
    updated_at:           Date;
    payment_gateway_info: string;
    is_default:           boolean;
    created_by:           string;
    updated_by:           string;
    subscription:         string;
    payment_gateway:      PaymentGateway;
}

export interface CreateSubscriptionPaymentGateway {
  uuid?:                string
  subscription:         string;
  payment_gateway:      string;
  payment_gateway_info: string;
  is_default:           boolean;
}

export interface SubscriptionBillingInvoice {
    uuid:                 string;
    active:               boolean;
    created_at:           string;
    updated_at:           string;
    code:                 string;
    description:          string;
    gross_amt:            string;
    tax_amt:              string;
    discount_amt:         string;
    sub_total_amt:        string;
    net_amt:              string;
    status:               string;
    collect_at:           string;
    billing_cycle:        string;
    bc_start_date:        string;
    bc_end_date:          string;
    total_attempts_count: number;
    generated_file:       string;
    created_by:           null;
    updated_by:           null;
    subscription:         string;
    plan:                 string;
}
