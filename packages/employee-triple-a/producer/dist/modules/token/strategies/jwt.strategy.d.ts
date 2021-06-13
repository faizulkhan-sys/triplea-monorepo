import { Customer } from '@entities/Customer.entity';
import { Repository } from 'typeorm';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersRepo;
    constructor(usersRepo: Repository<Customer>);
    validate(payload: {
        idx: string;
    }): Promise<Customer>;
}
export {};
