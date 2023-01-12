export interface Customer {
  subscription: string;
  intake_request?: string;
  type: string;
  document_type: string;
  document_no: string;
  company_name: string;
  first_name: string;
  last_name: string;
  born_date:string;
  marital_status:string;
  occupation:string;
  contacts: Contact[];
  addresses: Address[];
  active:boolean;
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

export interface Contact {
  uuid?: string;
  customer?: string;
  contact_id?: string;
  type: string;
  sub_type: string;
  contact_value: string;
}

export enum TypeContact {
  phone_number = 'P',
  email = 'E',
}

export enum SubtypeContact {
  cellphone_number = 'P',
  currentphone_number = 'H',
  phoneoffice_number = 'O',
  personal_email = 'E',
  business_email = 'B',
}

export interface Address {
  uuid?: string;
  customer: string;
  address_id?: string;
  physical_country: string;
  physical_city: string;
  physical_address: string;
  physical_postal_code: string;
  postal_city: string;
  postal_address: string;
  postal_postal_code: string;
  share_same_info?:boolean;
}
