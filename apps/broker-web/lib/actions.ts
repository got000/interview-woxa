'use server';

import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { createBroker, getBrokerBySlug, registerUser, ApiError } from './api';
import { CreateBrokerInput, CreateUserInput } from './types';
import { Locale, LOCALE_COOKIE } from './i18n/config';

type ActionResult = { success: true } | { success: false; message: string };

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

export async function checkSlugAvailableAction(slug: string): Promise<boolean> {
  if (!slug) return true;
  const existing = await getBrokerBySlug(slug);
  return !existing;
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
    };
  }
}
