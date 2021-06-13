/// <reference types="node" />
export declare const readHTMLFile: (path: string) => Promise<unknown>;
export declare function subtractDate(unit: string, interval: number): Date;
export declare function getHost(): string;
export declare function hashString(string: string): Promise<string>;
export declare function handleError(error: {
    response: {
        data: {
            message: string | Record<string, any>;
            statusCode: number;
        };
    };
}): any;
export declare const Axios: import("axios").AxiosInstance;
export declare function sendMail(from: string, to: string, mailTemplate: string, replacements: any, subject: string): Promise<any>;
export declare function serverOptions(): {
    httpsOptions: {
        key: Buffer;
        cert: Buffer;
    };
};
