import { api, handleError } from './client';
import { CreateUserInput } from '../types';

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
