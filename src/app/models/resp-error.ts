export class RespError {
  static JUMP_LOGIN_PAGE_ERRORS = [
    'JWT_EXPIRED',
    'ERROR_JWT_FORMAT',
    'JWT_PARAM_INCOMPLETE',
    'PASSWORD_CHANGED',
  ];

  code: number;
  identifier: string;
  msg: string;
}
