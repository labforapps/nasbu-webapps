export interface Address {
  uuid?: string;
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

export interface Contact {
  uuid?: string;
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

export const SubtypeContactDescripcion = new Map<string, string>([
  [SubtypeContact.cellphone_number, 'cellphone_number'],
  [SubtypeContact.currentphone_number, 'landline_number'],
  [SubtypeContact.phoneoffice_number, 'phone_office_number'],
  [SubtypeContact.personal_email, 'personal_email'],
  [SubtypeContact.business_email, 'business_email'],
]);

//Billing Type
