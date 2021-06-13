import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly ctxPrefix;
    private readonly logger;
    private userPrefix;
    setUserPrefix(prefix: string): void;
    intercept(context: ExecutionContext, call$: CallHandler): Observable<unknown>;
    private logNext;
    private logError;
}
