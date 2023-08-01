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
  case_file_user_access?: CaseFileAccess[]
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
  status?: CaseFileStatus;
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
  BY_TIME_INCREMENT = 'T'
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
  total_hours:          number;
  start_date:          null;
  end_date:            null;
  created_by:          string;
  updated_by:          null;
  subscription:        string;
  type:                TaskType;
  typeName?:            string;
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


