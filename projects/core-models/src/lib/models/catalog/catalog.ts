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

export enum TypeContact
{
  phone_number = 'P',
  email = 'E'
}

export enum SubtypeContact
{
  cellphone_number = 'P',
  currentphone_number = 'H',
  phoneoffice_number = 'O',
  personal_email = 'E',
  business_email = 'B'
}
