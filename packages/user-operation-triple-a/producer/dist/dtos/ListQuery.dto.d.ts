export declare class ListQueryBaseDto {
    page: number;
    limit: number;
    search: string;
    status: string;
    request_type: string;
}
declare const ListActiveUserDto_base: import("@nestjs/common").Type<Pick<ListQueryBaseDto, "status" | "page" | "limit" | "search">>;
export declare class ListActiveUserDto extends ListActiveUserDto_base {
    user_type: string;
}
declare const ListActiveUserTypeDto_base: import("@nestjs/common").Type<Pick<ListQueryBaseDto, "page" | "limit" | "search">>;
export declare class ListActiveUserTypeDto extends ListActiveUserTypeDto_base {
}
declare const ListPendingDto_base: import("@nestjs/common").Type<Pick<ListQueryBaseDto, "page" | "limit" | "search" | "request_type">>;
export declare class ListPendingDto extends ListPendingDto_base {
}
export {};
