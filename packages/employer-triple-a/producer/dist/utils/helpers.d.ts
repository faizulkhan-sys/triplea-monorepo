export declare function subtractDate(unit: string, interval: number): Date;
export declare function hashString(str: string): Promise<string>;
export declare function handleError(error: {
    response: {
        data: {
            message: string | Record<string, any>;
            statusCode: number;
        };
    };
}): any;
export declare const Axios: import("axios").AxiosInstance;
export declare function parseDateOnly(date: Date): string;
export declare function addMaxTimeOnDate(date: Date): Date;
export declare function paginate(pages: number, page: number, total: number, host: string, result: any[]): {
    total_pages: number;
    total_items: number;
    next: string;
    previous: string;
    current_page: number;
    items: Record<string, any>;
};
export declare function hasNext(page: number, totalPages: number, hostAddress: string): string;
export declare function hasPrevious(page: number, totalPages: number, hostAddress: string): string;
export declare function validateUUID(idx: string): void;
export declare function isValidDate(date: string): boolean;
export declare function isFutureDate(date: string): boolean;
export declare function fixed2DigitDecimal(num: number, fixed?: number): number;
export declare function getEmployerData(idxs: any[]): Promise<any>;
export declare function getEmployeeData(idxs: string[]): Promise<any>;
export declare function getEmployeeNames(idxs: any[]): Promise<any>;
export declare function getAccessToken(): Promise<string>;
export declare function getPayComponent(token: string, workerId: string): Promise<import("axios").AxiosResponse<any>>;
export declare const formUrlEncoded: (x: {
    [x: string]: string | number | boolean;
    client_id?: string;
    client_secret?: string;
    grant_type?: string;
}) => string;
export declare function formatErrors(errors: any[]): string[];
export declare function excelPaycycleHelper(paycycle: string, end_date: string, employer_provider: string): any;
export declare function uniqueID(): Promise<string>;
export declare function dateToString(date: Date): Promise<string>;
export declare function removeEmpty(obj: Record<string, any> | ArrayLike<unknown>): {};
