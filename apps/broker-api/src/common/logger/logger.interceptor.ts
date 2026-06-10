// src/app.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = new Date();

    const headers = request.headers;
    const body = request.body;
    const query = request.query;
    const params = request.params;

    const reqForLog = {
      startTime,
      method: request.method,
      path: request.originalUrl ?? request.url,
      route: request.route?.path,
      controller: context.getClass()?.name,
      handler: context.getHandler()?.name,
      headers,
      query,
      params,
      body,
      user: {
        id:
          request.user?._id ??
          request.user?.id ??
          request.session?.user?._id ??
          '',
        ...request.user,
      },
    };

    return next.handle().pipe(
      tap((response) => {
        this.loggerService.info(reqForLog, response);
      }),
    );
  }
}
