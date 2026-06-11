'use client';

import { Toast, useToast } from '@/lib/toast/toast-context';

const ICON_BY_TYPE: Record<Toast['type'], string> = {
  success: '/icon/shield-sky.svg',
  error: '/icon/shield.svg',
  info: '/icon/shield.svg',
};

const STYLE_BY_TYPE: Record<Toast['type'], string> = {
  success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-200',
  error: 'border-red-500/40 bg-red-950/90 text-red-200',
  info: 'border-slate-700 bg-slate-900/90 text-slate-200',
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur ${STYLE_BY_TYPE[toast.type]}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ICON_BY_TYPE[toast.type]} className="mt-0.5 h-4 w-4 flex-shrink-0" alt="" />
          <p className="flex-1">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss"
            className="text-current opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
