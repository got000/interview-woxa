'use server';

import { registerUser } from '../api/auth';
import { ApiError } from '../api/client';
import { CreateUserInput } from '../types';
import { ActionResult } from './types';

export async function registerAction(payload: CreateUserInput): Promise<ActionResult> {
  try {
    await registerUser(payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : 'Something went wrong',
      code: err instanceof ApiError ? err.code : undefined,
    };
  }
}
