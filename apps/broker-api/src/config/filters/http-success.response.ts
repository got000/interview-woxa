export interface IPaginationResponse {
  current_page: number;
  total_pages: number;
  total: number;
}

export interface ISuccessResponse<T = unknown> {
  status_code?: number;
  code?: string;
  message: string;
  result?: T;
  pagination?: IPaginationResponse;
}

export const successResponse = <T = unknown>({
  status_code = 200,
  code = 'SUCCESSFULLY',
  message,
  result,
  pagination,
}: ISuccessResponse<T>) => {
  return {
    status_code,
    code,
    message,
    ...(result !== undefined && { result }),
    ...(pagination && { pagination }),
  };
};
