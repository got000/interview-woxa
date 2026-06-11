import { HttpException } from '@nestjs/common';

export const throwHttpException = ({
  message,
  status_code,
  code,
  action,
}: {
  message: string;
  status_code: number;
  code: string;
  action?: string;
}) => {
  throw new HttpException(
    {
      status_code,
      message,
      code,
      ...(action && { action }),
    },
    status_code,
  );
};
