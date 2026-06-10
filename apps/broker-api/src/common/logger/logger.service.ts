import { Injectable } from '@nestjs/common';
import {
  ICreateLogMessage,
  IDebugLog,
  IElasticFields,
  LogTypeEnum,
} from './logger.interface';
import * as dayjs from 'dayjs';
import { nanoid } from 'nanoid';

@Injectable()
export class LoggerService {
  constructor() {}

  async root(req: any, res: any) {
    const body = this.createLogMessage({
      req,
      logType: LogTypeEnum.ROOT,
      res,
    });
    await this.sendLogs(body);
  }

  async debug(data: IDebugLog) {
    const body = this.createLogMessage({
      data,
      logType: LogTypeEnum.DEBUG,
    });

    await this.sendLogs(body);
  }

  async info(req: any, res: any) {
    const body = this.createLogMessage({
      req,
      res,
      logType: LogTypeEnum.INFO,
    });
    await this.sendLogs(body);
  }

  private createLogMessage({
    req,
    res,
    data,
    logType,
  }: ICreateLogMessage): IElasticFields {
    const baseBody: IElasticFields = {
      timestamp: new Date(),
      IP: this.getClientIp(req),
      LOGTYPE: logType,
      REQUEST_ID: nanoid(),
      REQUEST_METHOD: this.toString(req?.method?.toUpperCase()),
      REQUEST_URI: this.toString(req?.path ?? req?.url),
      REQUEST_HEADERS: this.toString(req?.headers),
      REQUEST_PARAMS: this.toString(req?.query),
      REQUEST_BODY: this.toString(req?.body),
      RESPONSE_STATUS: Number(res?.statusCode),
      RESPONSE_HEADERS: this.toString(res?.headers),
      RESPONSE_BODY: this.toString(res),
      RESPONSE_TIME: this.toString(
        req?.startTime
          ? dayjs().diff(dayjs(req?.startTime), 'ms').toString()
          : '',
      ),
      USER_ID: this.toString(req?.user?.id ?? req?.user?._id),
      USER_EMAIL: req?.user?.email ?? req?.body?.username,
      RESPONSE_STATUS_MESSAGE: 'success',
    };

    const logTypeOverrides: Partial<
      Record<LogTypeEnum, Partial<IElasticFields>>
    > = {
      [LogTypeEnum.ROOT]: {
        RESPONSE_STATUS_MESSAGE: 'error',
      },
    };

    return { ...baseBody, ...(logTypeOverrides[logType] || {}) };
  }

  private getClientIp(req: any): string {
    const forwardedFor = req?.headers?.['x-forwarded-for'];

    if (Array.isArray(forwardedFor)) {
      return forwardedFor.join(', ');
    }

    return forwardedFor ?? this.toString(req?.socket?.remoteAddress ?? '');
  }

  private toString(data: any): string {
    if (!data) return '-';
    if (data && typeof data === 'object') {
      return JSON.stringify(data ?? '{}');
    }

    return data ?? '-';
  }

  private async sendLogs(body: IElasticFields): Promise<void> {}
}
