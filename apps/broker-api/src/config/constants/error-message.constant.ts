import { HttpStatusCode } from 'axios';

export const ERROR_MESSAGES = {
  SOMETHING_WENT_WRONG: {
    code: 'SOMETHING_WENT_WRONG',
    message: 'พบความผิดพลาดในระบบ',
    status_code: HttpStatusCode.InternalServerError,
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'คุณไม่มีสิทธิ์เข้าถึง',
    status_code: HttpStatusCode.Unauthorized,
  },
  CREDENTIAL_INVALID: {
    code: 'CREDENTIAL_INVALID',
    message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    status_code: HttpStatusCode.Unauthorized,
  },
  EMAIL_INVALID: {
    code: 'EMAIL_INVALID',
    message: 'รูปแบบอีเมลไม่ถูกต้อง',
    status_code: HttpStatusCode.BadRequest,
  },
  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    message: 'คุณไม่มีสิทธิ์ทำรายการนี้',
    status_code: HttpStatusCode.Forbidden,
  },
  PASSWORD_LENGTH: {
    code: 'PASSWORD_LENGTH',
    message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
    status_code: HttpStatusCode.BadRequest,
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    message:
      'ที่อยู่อีเมลที่คุณป้อนถูกลงทะเบียนในระบบของเราแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบหากคุณมีบัญชีอยู่แล้ว',
    status_code: HttpStatusCode.Conflict,
  },
  PHONE_NUMBER_ALREADY_EXISTS: {
    code: 'PHONE_NUMBER_ALREADY_EXISTS',
    message: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว',
    status_code: HttpStatusCode.BadRequest,
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'ไม่พบผู้ใช้',
    status_code: HttpStatusCode.NotFound,
  },
  PASSWORD_MISMATCH: {
    code: 'PASSWORD_MISMATCH',
    message: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน',
    status_code: HttpStatusCode.BadRequest,
  },
  SAME_PASSWORD: {
    code: 'SAME_PASSWORD',
    message: 'รหัสผ่านใหม่ต้องไม่เหมือนกับรหัสผ่านปัจจุบัน',
    status_code: HttpStatusCode.BadRequest,
  },
  PHONE_NUMBER_IVALID_FORMAT: {
    code: 'PHONE_NUMBER_IVALID_FORMAT',
    message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง',
    status_code: HttpStatusCode.BadRequest,
  },
  LOGIN_FAILED: {
    code: 'LOGIN_FAILED',
    message: 'เข้าสู่ระบบล้มเหลว',
    status_code: HttpStatusCode.Unauthorized,
  },
  ROLE_PERMISSION_DENIED: {
    code: 'ROLE_PERMISSION_DENIED',
    message: 'คุณไม่มีสิทธิ์ตามบทบาทในการทำรายการนี้',
    status_code: HttpStatusCode.Forbidden,
  },
  SLUG_ALREADY_EXISTS: {
    code: 'SLUG_ALREADY_EXISTS',
    message: 'slug ซ้ำในระบบ',
    status_code: HttpStatusCode.BadRequest,
  },
  BROKER_NOT_FOUND: {
    code: 'BROKER_NOT_FOUND',
    message: 'ไม่พบข้อมูล broker',
    status_code: HttpStatusCode.NotFound,
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'ข้อมูลไม่ถูกต้อง',
    status_code: HttpStatusCode.BadRequest,
  },
};
