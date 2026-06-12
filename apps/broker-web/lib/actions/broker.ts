'use server';

import { auth } from '@/auth';
import {
  createBroker,
  getBrokerBySlug,
  updateBroker,
  updateBrokerStatus,
} from '../api/broker';
import { ApiError } from '../api/client';
import { BrokerStatus, CreateBrokerInput } from '../types';
import { ActionResult } from './types';

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
