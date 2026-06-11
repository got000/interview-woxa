import {
  Broker,
  BrokerType,
  CreateBrokerInput,
  CreateUserInput,
  PaginatedResponse,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message ?? 'Something went wrong';
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    cache: 'no-store',
  });

  return parseResponse<{
    access_token: string;
    _id: string;
    email: string;
    full_name: string;
    status: string;
    is_deleted: boolean;
  }>(res);
}

export async function registerUser(payload: CreateUserInput) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return parseResponse(res);
}

export async function getBrokers(params: {
  search?: string;
  type?: BrokerType | '';
  limit?: number;
  skip?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.type) query.set('type', params.type);
  query.set('limit', String(params.limit ?? 20));
  query.set('skip', String(params.skip ?? 1));

  const res = await fetch(`${API_URL}/broker?${query.toString()}`, {
    cache: 'no-store',
  });

  return parseResponse<PaginatedResponse<Broker>>(res);
}

export async function getBrokerBySlug(slug: string): Promise<Broker | null> {
  const res = await fetch(`${API_URL}/broker?limit=1000&skip=1`, {
    cache: 'no-store',
  });

  const data = await parseResponse<PaginatedResponse<Broker>>(res);
  return data.result?.find((broker) => broker.slug === slug) ?? null;
}

export async function createBroker(
  payload: CreateBrokerInput,
  accessToken: string,
) {
  const res = await fetch(`${API_URL}/broker`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return parseResponse(res);
}
