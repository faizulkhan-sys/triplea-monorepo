import { BaseDto } from './Base.dto';
declare const ChangeUserPass_base: import("@nestjs/common").Type<Pick<BaseDto, "password">>;
export declare class ChangeUserPass extends ChangeUserPass_base {
    current_password: string;
}
export {};
