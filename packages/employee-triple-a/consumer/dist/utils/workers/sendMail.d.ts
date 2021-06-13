declare const email: {
    sendMail(to: string, mailTemplate: string, replacements: any, subject: string): Promise<void>;
};
export declare type Email = typeof email;
export {};
