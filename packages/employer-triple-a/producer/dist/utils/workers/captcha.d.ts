declare const captcha: {
    hash(): Promise<string>;
    verify(captcha: string, captcha_token: string): Promise<boolean>;
};
export declare type Captcha = typeof captcha;
export {};
