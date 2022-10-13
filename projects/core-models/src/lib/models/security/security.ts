export interface UserSignupPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    username: string;
    password: string;
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
