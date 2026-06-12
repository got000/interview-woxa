import axios, { AxiosError } from 'axios';

const API_URL = process.env.API_URL ?? 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
});

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(err: unknown): never {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message ?? 'Something went wrong';
    const code = err.response?.data?.code;
    throw new ApiError(message, err.response?.status ?? 500, code);
  }
  throw err;
}
