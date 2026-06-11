import axios, { AxiosError } from 'axios';
import {
  Broker,
  BrokerStatus,
  BrokerType,
  CreateBrokerInput,
  CreateUserInput,
  PaginatedResponse,
} from './types';

const API_URL = process.env.API_URL ?? 'http://localhost:3001/api/v1';

const api = axios.create({
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

function handleError(err: unknown): never {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message ?? 'Something went wrong';
    const code = err.response?.data?.code;
    throw new ApiError(message, err.response?.status ?? 500, code);
  }
  throw err;
}

export async function loginUser(username: string, password: string) {
  try {
    const { data } = await api.post<{
      access_token: string;
      _id: string;
      email: string;
      full_name: string;
      status: string;
      is_deleted: boolean;
    }>('/login', { username, password });

    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function registerUser(payload: CreateUserInput) {
  try {
    const { data } = await api.post('/register', payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function getBrokers(params: {
  search?: string;
  type?: BrokerType | '';
  status?: BrokerStatus;
  limit?: number;
  skip?: number;
}) {
  try {
    const { data } = await api.get<PaginatedResponse<Broker>>('/broker', {
      params: {
        search: params.search || undefined,
        type: params.type || undefined,
        status: params.status || undefined,
        limit: params.limit ?? 20,
        skip: params.skip ?? 1,
      },
    });

    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function getBrokerBySlug(slug: string): Promise<Broker | null> {
  try {
    const { data } = await api.get<{ result: Broker | null }>(`/broker/${slug}`);
    return data.result ?? null;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 404) {
      return null;
    }
    handleError(err);
  }
}

export async function createBroker(
  payload: CreateBrokerInput,
  accessToken: string,
) {
  try {
    const { data } = await api.post('/broker', payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function updateBroker(
  id: string,
  payload: CreateBrokerInput,
  accessToken: string,
) {
  try {
    const { data } = await api.put(`/broker/${id}`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function updateBrokerStatus(
  id: string,
  status: BrokerStatus,
  accessToken: string,
) {
  try {
    const { data } = await api.patch(
      `/broker/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return data;
  } catch (err) {
    handleError(err);
  }
}
