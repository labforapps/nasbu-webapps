import { SubscriptionOnboarding } from "../subscription";

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
  attributes: UserAtribetes;
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

export interface Group {
  uuid: string;
  subscription:   string;
  name:           string;
  modules_access: ModulesAccess[];
  group: number;
  created_at: Date;
  active: Boolean;
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
  ALL = 'all'
}

export const modulesDescription = new Map<string, string>([
  [modules.CUSTOMERS, 'Customers'],
  [modules.CASE_FILES, 'Case Files'],
  [modules.BILLING, 'Invoicing'],
  [modules.REPORTS, 'Reports'],
  [modules.TASKS, 'Tasks'],
  [modules.CONFIG, 'Settings'],
  [modules.USERS, 'Users']

]);


export enum typeAccess{
  ADMINISTRATOR = 'A',
  WRITE = 'W',
  READ = 'R'
}
