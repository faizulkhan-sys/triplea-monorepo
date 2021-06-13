import { ValidationOptions } from 'class-validator';
export declare function IsGreaterThan(property: string, validationOptions?: ValidationOptions): (object: Record<string, any>, propertyName: string) => void;
