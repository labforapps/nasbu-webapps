export interface Contact {
  type: string;
  sub_type: string;
  contact_value: string;
}

export interface Address {
  physical_country: string;
  physical_city: string;
  physical_address: string;
  physical_postal_code: string;
  postal_city: string;
  postal_address: string;
  postal_postal_code: string;
}

export interface Country{
  uuid:string,
  code:string,
  name:string
}
