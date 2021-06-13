import { BaseDto } from './Base.dto';
declare const NotifyDto_base: import("@nestjs/common").Type<Pick<BaseDto, "employer_email">>;
export declare class NotifyDto extends NotifyDto_base {
    notify: boolean;
}
export {};
