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
}

export interface UserInfo {
    uuid: string;
    username: string;
    email: string;
    subscriptions: UserSubscription[];
}

export interface SelectedSubscription {
    ssid: string;
    mt: string;
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