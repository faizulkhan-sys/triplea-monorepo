import { Users } from '@entities/Users';
import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersRepo;
    constructor(usersRepo: Repository<Users>);
    validate(payload: {
        idx: string;
    }): Promise<Users>;
}
export {};
