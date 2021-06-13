declare const password: {
    hashString(value: string): Promise<string>;
};
export declare type Password = typeof password;
export {};
