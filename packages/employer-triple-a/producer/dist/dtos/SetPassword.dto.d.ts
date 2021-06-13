import { BaseDto } from './Base.dto';
declare const SetPassword_base: import("@nestjs/common").Type<Pick<BaseDto, "password">>;
export declare class SetPassword extends SetPassword_base {
    token: string;
}
export {};
