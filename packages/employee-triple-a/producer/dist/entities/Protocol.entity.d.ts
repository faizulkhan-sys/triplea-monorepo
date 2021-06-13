export declare class Protocol {
    id: number;
    idx: string | null;
    login_attempt_interval: number;
    login_interval_unit: string;
    login_max_retry: number;
    otp_expiry_in_minutes: number;
    mpin_attempt_interval: number;
    mpin_interval_unit: string;
    mpin_max_retry: number;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
}
