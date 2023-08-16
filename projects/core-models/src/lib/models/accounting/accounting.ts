import { CaseFile,Task } from "../practice/index";

export interface Invoice {
  uuid?:             string;
  details?:          InvoiceDetail[];
  active:            boolean;
  created_at:        Date;
  updated_at:        Date;
  status:            InvoiceStatus;
  gross_amt:         string;
  tax_amt:           string;
  discount_amt:      string;
  legal_charges_amt: string;
  net_amt:           string;
  inv_date:          Date;
  inv_exp_date:      Date;
  send_by:           string;
  to_origin_value:   string;
  created_by?:       string;
  updated_by?:       string;
  subscription:      string;
  customer:          CustomerInvoice;
  case_file:         CaseFile;
  code: string;
  days_late: number;
}


export interface CustomerInvoice {
  uuid?:        string;
  subscription: string;
  type:         string;
  company_name: null;
  first_name:   string;
  last_name:    string;
  image?:       null;
}

export interface CaseFileInvoice {
  name: string;
}


export interface InvoiceDetail {
  uuid:                string;
  related_charge?:     InvoiceDetail;
  active:              boolean;
  created_at:          Date;
  updated_at:          Date;
  billing_type:        string;
  bt_price_per_hour:   string;
  bt_increment_factor: number;
  bt_amt:              string;
  bt_billable:         boolean;
  manual_entry:        boolean;
  is_legal_charge:     boolean;
  description:         string;
  total_hours:         string;
  total_amt:           string;
  created_by:          string;
  updated_by:          string;
  subscription:        string;
  invoice?:            string;
  status?:             string;
  related_invoice?:    string;
  customer?:           string;
  case_file?:          string;
  task?:               string;
}

export interface InvoicePayload {
  uuid?:             string;
  subscription:      string;
  customer:          string;
  case_file:         string;
  gross_amt:         string;
  tax_amt:           string;
  discount_amt:      string;
  legal_charges_amt: string;
  net_amt:           string;
  inv_date:          Date;
  inv_exp_date:      Date;
  send_by:           string;
  to_origin_value:   string;
  details:           DetailPayload[];
}

export interface DetailPayload {
  related_charge:      string;
  manual_entry:        boolean;
  is_legal_charge:     boolean;
  description:         string;
  total_hours:         string;
  total_amt:           string;
  billing_type:        string;
  bt_price_per_hour:   string;
  bt_increment_factor: number;
  bt_amt:              string;
}



export interface PaymentPayload {
  uuid?:           string;
  active?:         boolean;
  created_at?:     Date;
  updated_at?:     Date;
  payment_method: string;
  total_amt:      string;
  payment_date:   Date;
  created_by?:     string;
  updated_by?:     string;
  subscription:   string;
  customer:       string;
  invoice:        string;
}

export interface Payment {
  uuid:            string;
  customer:        CustomerInvoice;
  invoice:         Invoice;
  active:          boolean;
  created_at:      Date;
  updated_at:      Date;
  code:            string;
  payment_method:  string;
  total_amt:       string;
  payment_date:    Date;
  send_by:         string;
  to_origin_value: null;
  created_by:      string;
  updated_by:      null;
  subscription:    string;
}

export interface BillingCharge {
  uuid: string,
  case_file:           CaseFile;
  task:                Task;
  active:              boolean;
  billing_type:        string;
  bt_price_per_hour:   string;
  bt_increment_factor: number;
  bt_amt:              string;
  bt_billable:         boolean;
  status:              string;
  manual_entry:        boolean;
  is_legal_charge:     boolean;
  description:         string;
  total_hours:         string;
  total_amt:           string;
  created_by:          string;
  updated_by:          string;
  subscription:        string;
  related_invoice:     string;
  customer:            string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
  TRANSFER = 'transfer'
}

export enum BillingChargeEnum {
  PENDING = 'pending',
  BILLED = 'billed',
  PAYED = 'payed'
}

export enum InvoiceStatus {
  PENDING = 'pending',
  PAYED = 'payed',
  NOT_APPROVED = 'not_approved',
  EXPIRED = 'expired'
}

export const invoiceStatusDescription = new Map<string, string>([
  [InvoiceStatus.PENDING, 'En espera de pago'],
  [InvoiceStatus.PAYED, 'Pagada'],
  [InvoiceStatus.NOT_APPROVED, 'Pendiente de aprobacion'],
  [InvoiceStatus.EXPIRED,'Vencida']
]);

export interface sendDocument{
  uuid: string;
  subscription: string;
  send_by: string;
  to_origin_value: string;
}
