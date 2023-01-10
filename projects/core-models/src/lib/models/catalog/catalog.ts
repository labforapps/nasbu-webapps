import { Address, Contact } from "../common/common";

export interface Customer {
  subscription: string;
  intake_request?: string;
  type: string;
  document_type: string;
  document_no: string;
  company_name: string;
  first_name: string;
  last_name: string;
  contacts: Contact[];
  addresses: Address[];
}

export enum TypeCustomer{
  person = 'P',
  business = 'B'
}
