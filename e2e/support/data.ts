import { Api } from './api';

/**
 * Datos de prueba creados por API. Cada función registra la limpieza para que el registro se
 * borre al terminar la prueba aunque falle. Los nombres llevan el `uid` de la prueba.
 * Los códigos (`'P'`, `'H'`, `'private'`…) son los de los enums de core-models.
 */
type Cleanup = (path: string) => void;

export async function createCustomer(api: Api, uid: string, cleanup: Cleanup): Promise<any> {
  // Con dirección: el formulario la exige y pantallas como la factura leen `addresses[0]`.
  const [country] = await api.get('common/countries/');
  const address = { country: country.uuid, state: 'Distrito Nacional', city: 'Santo Domingo', address: 'Av. Winston Churchill 1', postal_code: '10148' };
  const customer = await api.post('catalog/customers/', {
    type: 'P',
    first_name: `Cliente ${uid}`,
    last_name: 'E2E',
    contacts: [
      { type: 'P', sub_type: 'P', contact_value: '+12025550123' },
      { type: 'E', sub_type: 'E', contact_value: `${uid}@e2e.nasbu.test` },
    ],
    addresses: [
      {
        physical_country: address.country,
        physical_state: address.state,
        physical_city: address.city,
        physical_address: address.address,
        physical_postal_code: address.postal_code,
        postal_country: address.country,
        postal_state: address.state,
        postal_city: address.city,
        postal_address: address.address,
        postal_postal_code: address.postal_code,
      },
    ],
  });
  cleanup(`catalog/customers/${customer.uuid}/`);
  return customer;
}

export function customerName(customer: any): string {
  return `${customer.first_name} ${customer.last_name}`;
}

export interface CaseFileOptions {
  customer: string;
  name: string;
  access?: 'public' | 'private';
  assignedTo?: string;
  pricePerHour?: number;
}

export async function createCaseFile(api: Api, options: CaseFileOptions, cleanup: Cleanup): Promise<any> {
  const caseFile = await api.post('practice/case_files/', {
    customer: options.customer,
    name: options.name,
    assigned_to: options.assignedTo ?? '',
    access_type: options.access ?? 'public',
    billing_type: 'H',
    bt_price_per_hour: options.pricePerHour ?? 100,
    bt_increment_factor: 0,
    bt_amt: options.pricePerHour ?? 100,
    retainer_amt: 0,
    receive_retainer: false,
    case_no: null,
    casefile_type: '',
    custom_variables_data: '{}',
  });
  cleanup(`practice/case_files/${caseFile.uuid}/`);
  return caseFile;
}

/** Miembros de la firma (`security/users/`) con su correo, para elegir responsables. */
export async function members(api: Api): Promise<any[]> {
  return api.get('security/users/');
}
