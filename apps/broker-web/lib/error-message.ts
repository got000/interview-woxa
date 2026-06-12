import { Dictionary } from './i18n/translations';

export function resolveErrorMessage(
  result: { message: string; code?: string },
  dict: Dictionary,
): string {
  if (result.code === 'TOO_MANY_REQUESTS') {
    return dict.toast.tooManyRequests;
  }

  return result.message;
}
