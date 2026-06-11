'use server';

import { cookies } from 'next/headers';
import { auth } from '@/auth';
import {
  createBroker,
  getBrokerBySlug,
  registerUser,
  updateBroker,
  updateBrokerStatus,
  ApiError,
} from './api';
import { BrokerStatus, CreateBrokerInput, CreateUserInput } from './types';
import { Locale, LOCALE_COOKIE } from './i18n/config';

type ActionResult =
  | { success: true }
  | { success: false; message: string; code?: string };

export async function registerAction(payload: CreateUserInput): Promise<ActionResult> {
  try {
    await registerUser(payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : 'Something went wrong',
    };
  }
}

export async function setLocaleAction(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
}

export async function checkSlugAvailableAction(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  if (!slug) return true;
  const existing = await getBrokerBySlug(slug);
  if (!existing) return true;
  return excludeId ? existing._id === excludeId : false;
}

export async function createBrokerAction(payload: CreateBrokerInput): Promise<ActionResult> {
  const session = await auth();

  if (!session?.accessToken) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await createBroker(payload, session.accessToken);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : 'Something went wrong',
      code: err instanceof ApiError ? err.code : undefined,
    };
  }
}

export async function updateBrokerAction(
  id: string,
  payload: CreateBrokerInput,
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.accessToken) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await updateBroker(id, payload, session.accessToken);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : 'Something went wrong',
      code: err instanceof ApiError ? err.code : undefined,
    };
  }
}

export async function updateBrokerStatusAction(
  id: string,
  status: BrokerStatus,
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.accessToken) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await updateBrokerStatus(id, status, session.accessToken);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : 'Something went wrong',
      code: err instanceof ApiError ? err.code : undefined,
    };
  }
}
