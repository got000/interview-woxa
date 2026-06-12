import { AxiosError } from 'axios';
import { api, handleError } from './client';
import {
  Broker,
  BrokerStatus,
  BrokerType,
  CreateBrokerInput,
  PaginatedResponse,
} from '../types';

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
