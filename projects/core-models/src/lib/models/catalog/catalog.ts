import { Address, Contact } from "../shared";

export interface Customer {
  uuid?: string;
  subscription?: string;
  intake_request?: string;
  type: string;
  document_type: string;
  document_no: string;
  company_name: string;
  first_name: string;
  last_name: string;
  born_date: string;
  image: any;
  marital_status: string;
  occupation: string;
  linked_customer?: null;
  contacts: Contact[];
  addresses: Address[];
  wallet?: string;
  active?: boolean;
  created_at?: Date;
  updated_by?: null;
  updated_at?: Date;
}

export interface CustomerIntakeRequest {
  uuid?: string;
  subscription: string;
  type: string;
  name: string;
  send_by: string;
  to_origin_value: string;
  token?: string;
  intake_request_url?: string;
  active?: boolean;
  created_at?: Date;
  updated_by?: null;
  updated_at?: Date;
}

export interface CustomerIntakeValidateRequest{
  is_valid: boolean;
  subscription: string;
  subscription_logo: string;
  subscription_name: string;
}

export interface CustomerWalletSummary {
  customer:  string;
  case_file: string;
  total_amt: number;
}


export enum CustomerIntakeSendingMethod{
  email = 'email',
  sms = 'sms'
}

export enum TypeCustomer{
  person = 'P',
  business = 'B'
}

export enum MaritalStatus {
  single   = 'Single',
  married  = 'Married',
  widowed  = 'Widowed',
  divorced = 'Divorced',
}

export interface CustomerContact extends Contact {
  customer?: string;
}

export interface CustomerAddress extends Address {
  customer: string;
}
