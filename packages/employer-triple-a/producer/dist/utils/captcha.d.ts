export declare function GetCAPTCHACode(): Promise<string>;
export declare function verifyCaptcha(captcha: string, captcha_token: string): Promise<boolean>;
