export interface CaseFile {
  uuid?:                string;
  customer:             CustomerCaseFile;
  assigned_to:          AssignedTo;
  active?:              boolean;
  created_at?:          string;
  updated_at?:          Date;
  billing_type:         BillingType;
  bt_price_per_hour:    number;
  bt_increment_factor:  number;
  bt_amt:               number;
  status?:              string;
  access_type?:         string;
  code?:                string;
  name:                 string;
  case_no:              string;
  receive_retainer:     boolean;
  retainer_amt:         number;
  created_by?:          string;
  updated_by?:          null;
  subscription:         string;
}

export interface CaseFilePayload {
  uuid?:                string;
  customer:             string;
  assigned_to:          string;
  billing_type:         string;
  bt_price_per_hour:    number;
  bt_increment_factor:  number;
  bt_amt:               number;
  access_type?:         string;
  code?:                string;
  name:                 string;
  case_no:              string;
  receive_retainer:     boolean;
  retainer_amt:         number;
  subscription:         string;
  status?: string;
}

export interface AssignedTo {
  uuid?:         string;
  subscription: string;
  user:         UserCaseFile;
  image_url:    null;
}

export interface UserCaseFile {
  email:      string;
  first_name: string;
  last_name:  string;
}

export interface CustomerCaseFile {
  uuid?:         string;
  subscription: string;
  type:         string;
  company_name: null;
  first_name:   string;
  last_name:    string;
  image?:        null;
}

export interface CaseFileDocument {
  uuid:          string;
  subscription:  string;
  case_file:     string;
  document_type: string;
  document:      string;
  document_name:string;
  document_size: number;
  active:        boolean;
  created_by:    string;
  created_at:    Date;
  updated_by:    null;
  updated_at:    Date;
}

export interface CaseFileDocumentPayload {
  uuid?:          string;
  subscription:  string;
  case_file:     string;
  document?:      File;
  document_name: string;
}

export interface CaseFileNote {
  uuid?:         string;
  active?:       boolean;
  created_at?:   Date;
  updated_at?:   Date;
  title:        string;
  body:         string;
  updated_by?:   null;
  subscription: string;
  case_file:    string;
}

export interface CaseFileWalletDetail  {
  uuid?:         string;
  active?:       boolean;
  created_at?:   Date;
  updated_at?:   Date;
  type:         string;
  amt:          string;
  description:  string;
  created_by?:   string;
  updated_by?:   null;
  subscription: string;
  wallet:       string;
  case_file:    string;
}

export interface CaseFileAccess{
    uuid?:             string;
    subscription:      string;
    case_file:         string;
    subscription_user: string;
    created_by?:        string;
}

export enum CaseFileWalletDetailType{
  ALL = 'A',
  DEBIT = 'D',
  CREDIT = 'C'
}

export enum BillingType {
  PER_HOUR = 'H',
  FLAT_FEE = 'F',
  BY_TIME_INCREMENT = 'T'
}

export enum CaseFileStatus {
  OPEN   = 'O',
  CLOSED = 'C'
}



