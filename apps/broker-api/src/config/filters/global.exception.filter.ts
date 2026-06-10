import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';
import { ERROR_STATUS_CODES } from '../constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const ctxType: string = host.getType();
    const response = ctx.getResponse<Response>();
    let request: any;

    const message = this.getExceptionMessage(exception);
    const statusCode = this.getExceptionStatusCode(exception);
    const code = exception?.response?.code ?? ERROR_STATUS_CODES[statusCode];
    const file_url = exception?.response?.file_url ?? '';
    const result_import = exception?.response?.result_import ?? null;

    console.error('ERROR: ', exception);

    if (ctxType === 'http') {
      request = ctx.getRequest();
    }

    if (ctxType === 'http') {
      response.status(statusCode).json({
        status_code: statusCode,
        code,
        message,
        ...(file_url && { file_url }),
        ...(result_import && { result_import }),
      });
    } else {
      throw exception;
    }
  }

  private getExceptionMessage(exception: any): string {
    if (exception instanceof AxiosError) {
      exception = exception as AxiosError;
      return exception.response?.data?.message ?? exception.message;
    }
    if (exception instanceof HttpException) {
      exception = exception as HttpException;
      return exception?.response?.message ?? exception?.message;
    }
    exception = exception as Error;
    return exception instanceof Error ? exception.message : String(exception);
  }

  private getExceptionStatusCode(exception: any): number {
    if (exception instanceof AxiosError) {
      return exception.status ?? 500;
    }
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return 500;
  }
}
