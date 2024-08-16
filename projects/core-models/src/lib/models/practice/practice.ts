import { TaskType } from "../common";
import { SecurityUser } from "../security/index";

export interface CaseFile {
  uuid?:                  string;
  customer:               CustomerCaseFile;
  assigned_to:            AssignedTo;
  active?:                boolean;
  created_at?:            string;
  updated_at?:            Date;
  billing_type:           BillingType;
  case_file_user_access?: CaseFileAccess[];
  casefile_type:          CaseFileType;
  bt_price_per_hour:      number;
  bt_increment_factor:    number;
  bt_amt:                 number;
  status?:                CaseFileStatus;
  access_type?:           string;
  code?:                  string;
  name:                   string;
  case_no:                string;
  receive_retainer:       boolean;
  retainer_amt:           number;
  created_by?:            string;
  updated_by?:            null;
  subscription:           string;
  custom_variables_data?: string;
}

export interface CaseFilePayload {
  uuid?:                string;
  customer:             string;
  assigned_to:          string;
  casefile_type:        string;
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
  status?:              CaseFileStatus;
  custom_variables_data: string;
}

export interface AssignedTo {
  uuid?:         string;
  subscription: string;
  user:         UserCaseFile;
  image_url:    null;
}

export interface UserCaseFile {
  uuid?:      string;
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
  type:          string;
  amt:           number;
  description:   string;
  created_by?:   string;
  updated_by?:   null;
  subscription:  string;
  wallet:        string;
  case_file:     string;
}

export interface CaseFileAccess{
    uuid?:              string;
    subscription:       string;
    case_file:          string;
    subscription_user:  string;
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
  BY_TIME_INCREMENT = 'T',
  NO_BILLABLE = 'N'
}

export enum CaseFileStatus {
  OPEN   = 'O',
  CLOSED = 'C'
}

export interface TaskPayload {
  uuid?:               string;
  subscription:        string;
  type:                string;
  priority:            string;
  customer:            string;
  case_file:           string;
  name:                string;
  description:         string;
  assigned_to:         string;
  has_due_date:        boolean;
  start_date:          Date;
  end_date:            Date;
  billing_type:        string;
  bt_price_per_hour:   string;
  bt_increment_factor: number;
  bt_amt:              number;
}


export interface Task {
  uuid?:               string;
  customer:            CustomerTask;
  assigned_to:         AssignedTo;
  case_file:           CaseFile;
  active:              boolean;
  created_at:          Date;
  updated_at:          Date;
  billing_type:        string;
  bt_price_per_hour:   string;
  bt_increment_factor: number;
  bt_amt:              string;
  bt_billable:         boolean;
  priority:            string;
  code:                string;
  status:              string;
  name:                string;
  description:         string;
  has_due_date:        boolean;
  total_hours:         number;
  start_date:          null;
  end_date:            Date | null;
  created_by:          string;
  updated_by:          null;
  subscription:        string;
  type:                TaskType;
  typeName?:           string;
  overdue?:            Boolean;
  total_amt?:           number;
}


export interface CustomerTask {
  uuid?:         string;
  subscription: string;
  type:         string;
  company_name: null;
  first_name:   string;
  last_name:    string;
  image?:        null;
}


export interface TimeTask {
  uuid?:          string;
  subscription:   string;
  task:           Task;
  title:          string;
  description:    string;
  executed_by:    string;
  user?:          SecurityUser;
  total_time_str: string;
  total_time:     number;
  total_amt:      number;
  start_at:       Date;
  end_at:         Date;
  not_billable:   boolean;
  created_at:     string;
  fixed_time?:    Boolean;
}


export enum TaskStatus {
  ALL  = 'all',
  OPEN = 'open',
  CLOSED = 'closed',
  OVERDUE = 'overdue'
}

export enum PriorityTask {
  High   = 'hight',
  Medium = 'medium',
  Low    = 'low'
}

export interface DocumentTemplate {
  uuid:          string;
  active:        boolean;
  created_at:    Date;
  updated_at:    Date;
  name:          string;
  document:      string;
  created_by:    string;
  updated_by:    string;
  subscription:  string;
  template_type: string;
}

export interface DocumentTemplatePayload{
  uuid?:string;
  subscription:string;
  template_type:string;
  name:string;
  file:string;
}

export interface DocumentGeneration {
    uuid:                                string;
    subscription:                        string;
    document_template:                   string;
    customer:                            string;
    case_file:                           null | string;
    representative:                      string;
    name:                                string;
    document:                            null | string;
    expiration_date:                     Date;
    require_signature:                   boolean;
    sent_for_signature_request:          boolean;
    last_signature_request_created_at:   Date | null;
    last_signature_request_expires_at:   Date | null;
    last_signature_request_status:       null | string;
    last_signature_request_doc_evidence: string[] | null;
    custom_variables_data:               string;
    created_at:                          Date;
    created_by:                          string;
}
export interface DocumentGenerationPayload {
  uuid?:             string;
  subscription:      string;
  document_template: string;
  customer:          string;
  case_file:         string;
  representative:    string;
  name:              string;
  expiration_date:   Date;
  custom_variables_data: string;
}


export interface DocumentTemplateType {
  uuid?:              string;
  code:               string;
  name:               string;
  subscription:       string;
  casefile_type?:     string;
  require_signature:  boolean;
  copied_from?:       string;
  variables?:         VariableDocumentTemplateType[];
  active?:            boolean;
  created_by?:        string;
  created_at?:        Date;
}

export interface VariableDocumentTemplateType {
  uuid?:           string;
  template_type?:  string;
  section:         string;
  code?:           string;
  name:            string;
  description?:    string;
  value_path:      string;
  casefile_type?:  string;
  system_default?: boolean;
}

export interface CaseFileType {
  subscription: string;
  uuid?:        string;
  copied_from:  string;
  code:         string;
  name:         string;
  variables:    VariableCaseFileType[];
  created_at?:  Date
}

export interface VariableCaseFileType {
  uuid?:         string;
  variable_id?:  string;
  section:       string;
  code?:          string;
  name:          string;
  description?:  string;
  value_path:    string;
}


export interface SignatureRequest {
  subscription:            string;
  gen_document:            string;
  esig_signers_list:       string;
  subject:                 string;
  message:                 string;
  send_by:                 string;
  to_origin_value:         string;
  esignature_request_url?: string;
}

export enum AccessType {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export enum SortingTaskFilter {
  NEXT_TO_DUE = 'next_to_due',
  CREATED_DATE = 'created_date',
  DUE_DATE = 'due_date'
}
