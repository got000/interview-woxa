export interface IElasticFields {
  timestamp?: Date;
  REQUEST_ID: string;
  RESPONSE_BODY: string;
  REQUEST_URI: string;
  REQUEST_BODY: any;
  RESPONSE_STATUS: number;
  RESPONSE_TIME: string;
  LOGTYPE: string;
  REQUEST_HEADERS: any;
  REQUEST_METHOD: string;
  USER_ID: string;
  REQUEST_PARAMS: string;
  IP: string;
  RESPONSE_HEADERS: string;
  USER_EMAIL: string;
  RESPONSE_STATUS_MESSAGE: string;
}

export interface IRootLog {
  url: string;
  message: string;
  statusCode?: number;
  requestBody?: string;
  user?: any;
  response?: any;
}

export interface IDebugLog {
  url?: string;
  messageType: string;
  message: string;
  statusCode: string;
  userId: string;
  requestBody?: string;
}

export enum LogTypeEnum {
  ACCESS = 'access',
  INFO = 'info',
  SERVICE = 'service',
  ROOT = 'root',
  DEBUG = 'debug',
}

export interface ICreateLogMessage {
  req?: any;
  res?: any;
  data?: IRootLog | IDebugLog;
  logType: LogTypeEnum;
}
