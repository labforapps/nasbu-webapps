import { Address, Contact } from '../shared';
import { SubscriptionBillingFee, SubscriptionOnboarding } from "../subscription";

export interface UserSignupPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    username: string;
    password: string;
    subscriptionInfo: SubscriptionOnboarding;
}

export interface UserSubscription {
    uuid: string;
    subscription: string;
    member_type: string;
    member_group: string;
    case_file: string;
    permissions: string[];
    tutorial_was_completed: boolean;
}

export interface UserInfo {
    uuid: string;
    username: string;
    email: string;
    subscriptions: UserSubscription[];
}

export interface SelectedSubscription {
    //ssid: SSID;
    ssid:any
    mt: string;
    twc?: boolean;
    permissions: string[];
}

export interface SSID {
  uuid: string;
  type: string;
  free_trial: boolean;
  effective_date: Date;
  expiration_date: null;
  plan: string;
  status: string;
  tutorial_was_completed: boolean;
}

export interface ForgotPasswordSubmit {
    username: string;
    code: string;
    newPassword: string;
}

export interface CurrentUserInfo {
  username: string;
  attributes: any | UserAtribetes;
}

export interface ChangeFirstPasswordPayload {
  user: string,
  oldPassword: string,
  newPassword: string
}

export interface UserAtribetes {
    email: string;
    email_verified: boolean;
    given_name: string;
    locale: string;
    middle_name: string;
    name: string;
    phone_number: string;
    phone_number_verified: boolean;
    fals: string;
    sub: string;
    updated_at: string;
}

export interface SecurityGroup {
  uuid?: string;
  subscription:   string;
  name:           string;
  modules_access: ModulesAccess[];
  group?: number;
  created_at?: Date;
  active?: Boolean;
}

export interface ModulesAccess {
  module:    string;
  type:      string;
  access_id?: string;
  active: Boolean;
}

export enum modules{
  CUSTOMERS = 'customers',
  CASE_FILES = 'case_files',
  BILLING = 'billing',
  REPORTS = 'reports',
  TASKS = 'tasks',
  CONFIG = 'config',
  USERS = 'users',
  DOCUMENT_TEMPLATE = 'document_template',
  ALL = 'all'
}

export const modulesDescription = new Map<string, string>([
  [modules.CUSTOMERS, 'Customers'],
  [modules.CASE_FILES, 'Case Files'],
  [modules.BILLING, 'Invoicing'],
  [modules.REPORTS, 'Reports'],
  [modules.TASKS, 'Tasks'],
  [modules.CONFIG, 'Settings'],
  [modules.USERS, 'Users'],
  [modules.ALL, 'All'],
  [modules.DOCUMENT_TEMPLATE, 'Documents and Templates'],
]);


export enum typeAccess{
  ADMINISTRATOR = 'A',
  WRITE = 'W',
  READ = 'R'
}

export interface SecurityUser {
  uuid?: string;
  subscription:   string;
  user:           User;
  origin_country: string;
  group:          number;
  contacts:       SecurityUserContact[];
  addresses:      SecurityUserAddress[];
  licenses:       License[];
  billing_fees:   SubscriptionBillingFee[];
  image_url?:     string;
  active?:        boolean;
  created_at?:    Date;
  birthdate?: Date;
  subscription_member_type?: SubscriptionMemberType;
}

export enum SubscriptionMemberType {
  OWNER = 'O',
  USER = 'U',
  COLLABORATOR = 'C'
}

export interface User {
  email:      string;
  first_name: string;
  last_name:  string;
}

export interface SecurityUserContact extends Contact {
  subscription:         string;
  subscription_user:    string;
}

export interface SecurityUserAddress extends Address{
  subscription:         string;
  subscription_user:    string;
}

export interface License {
  uuid?:              string;
  subscription:      string;
  subscription_user: string;
  license_country:   string;
  license_country_state: string;
  license_id:        string;
  license_no:        string;
  created_by:        string;
  created_at:        Date;
  updated_by:        null;
  updated_at:        Date;
}

export interface Summary {
  section:    string;
  has_access: boolean;
  detail:     SummaryDetail;
}

export interface SummaryDetail {
  total_open?:      number;
  total_closed?:    number;
  total?:           number;
  total_pending?:   number;
  total_completed?: number;
  total_delayed?:   number;
}

