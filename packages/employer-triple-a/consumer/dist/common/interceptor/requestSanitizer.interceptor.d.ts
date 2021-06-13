import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RequestSanitizerInterceptor implements NestInterceptor {
    private except;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    cleanRequest(req: any): void;
    cleanObject(obj: Record<string, any> | null | undefined): Record<string, any>;
    transform(key: string | number, value: any): any;
    isString(value: any): value is string;
}
