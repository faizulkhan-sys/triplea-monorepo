export declare class CustomerDevice {
    id: number;
    idx: string;
    customer_id: bigint;
    phone_brand: string | null;
    phone_os: string | null;
    os_version: string | null;
    deviceid: string;
    fcm_token: string;
    otp: string;
    token: string;
    otp_type: string | null;
    otp_status: boolean;
    total_attempt: string | null;
    otp_created_at: Date;
    created_on: Date;
    is_obsolete: boolean;
    modified_on: Date | null;
}
