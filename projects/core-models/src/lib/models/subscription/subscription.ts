import { PaymentGateway } from "../common";
import { Address, Contact } from "../shared";

export type SubscriptionPeriod = 'M' | 'Y';

export enum SubscriptionStatus {
  ACTIVE    = 'A',
  SUSPENDED = 'S',
  DELAYED   = 'D',
  EXPIRED   = 'E',
  // Alta por lightbox recien creada, a la espera del trigger de Cognito.
  PENDING_CONFIRMATION = 'P',
  // Alta por redirect que todavia no tokenizo la tarjeta. La cuenta de Cognito puede
  // estar confirmada igual, asi que es el estado que hay que bloquear.
  PENDING_TOKENIZATION = 'Z'
}

export interface ResumeTokenizationResult {
  subscription_id: string;
  checkout_url: string;
}

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
  increment_factor:    number;
  price_per_increment: number | string;
  tax_pct: string
  low_retainer_threshold?: number | string | null;
  allow_retainers:     boolean;
  allow_flat_fee:      boolean;
  allow_time_increment: boolean;
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
    status:               SubscriptionBillingInvoiceStatus;
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

export enum SubscriptionBillingInvoiceStatus {
  PENDING = 'pending',
  PAYED = 'payed'
}

export interface ChangePlanRequest {
  subscription: string;
  period:       string;
  to_plan:      string;
}

export interface SubscriptionNotificaction {
  uuid: string
  active: boolean
  created_at: string
  updated_at: string
  notification_id: string
  entity_type: string
  entity_id: string
  callback_url: string
  type: string
  title: string
  sub_title: string
  body: string
  viewed: boolean
  to_email: string
  created_by: string
  updated_by: string
  subscription: string
  assigned_to: string
}

