export declare class Protocol {
    id: number;
    idx: string | null;
    login_attempt_interval: number;
    login_interval_unit: string;
    login_max_retry: number;
    mpin_attempt_interval: number;
    mpin_interval_unit: string;
    pwexpiry_interval: number;
    pwexpiry_interval_unit: string;
    mpin_max_retry: number;
    pw_minimum_length: number | null;
    pw_maximum_length: number | null;
    otp_expiry_in_minutes: number | null;
    lower_case_required: boolean | null;
    upper_case_required: boolean | null;
    numeric_case_required: boolean | null;
    special_character_required: boolean | null;
    pw_repeatable_after: number | null;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
}
