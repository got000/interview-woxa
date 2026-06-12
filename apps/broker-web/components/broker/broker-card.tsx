'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Broker } from '@/lib/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useToast } from '@/lib/toast/toast-context';
import { updateBrokerStatusAction } from '@/lib/actions/broker';
import { resolveErrorMessage } from '@/lib/error-message';
import { BrokerEditModal } from '@/components/broker/broker-edit-modal';
import { ConfirmDialog } from '@/components/confirm-dialog';

export function BrokerCard({
  broker,
  isLoggedIn,
}: {
  broker: Broker;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const { locale, dict } = useLocale();
  const { showToast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const isActive = broker.status !== 'inactive';

  const handleConfirmToggle = async () => {
    setStatusLoading(true);

    const result = await updateBrokerStatusAction(
      broker._id,
      isActive ? 'inactive' : 'active',
    );

    setStatusLoading(false);
    setConfirmOpen(false);

    if (!result.success) {
      showToast('error', resolveErrorMessage(result, dict));
      return;
    }

    showToast('success', dict.toast.brokerStatusUpdateSuccess);
    router.refresh();
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900 transition-colors hover:border-slate-700">
      {isLoggedIn && (
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
            className="rounded bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-slate-100 backdrop-blur hover:bg-slate-800"
          >
            {dict.home.edit}
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            title={isActive ? dict.home.disable : dict.home.enable}
            onClick={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full border backdrop-blur transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              isActive
                ? 'border-sky-400/40 bg-sky-500/90'
                : 'border-slate-600/60 bg-slate-950/80'
            }`}
          >
            <span
              className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}

      <Link
        href={`/${locale}/broker/${broker.slug}`}
        className="flex flex-1 flex-col"
      >
        <div className="relative h44 sm:h50 lg:h-70 w-full overflow-hidden bg-slate-800">
          {broker.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={broker.logo_url}
              alt={broker.name[locale]}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon/building.svg" className="h-10 w-10" alt="" />
            </div>
          )}
          {broker.region && (
            <span className="absolute right-3 top-3 rounded bg-slate-950/70 px-2 py-1 text-xs uppercase tracking-wider text-slate-200 backdrop-blur">
              {broker.region}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h2 className="font-serif text-lg font-bold text-slate-100">
            {broker.name[locale]}
          </h2>
          <p className="line-clamp-3 text-sm text-slate-400">
            {broker.desc[locale]}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon/shield.svg" className="h-3.5 w-3.5" alt="" />
              {broker.broker_type}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-sky-400 group-hover:underline">
              {dict.home.viewDetails}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>

      {editOpen && (
        <BrokerEditModal broker={broker} onClose={() => setEditOpen(false)} />
      )}

      {confirmOpen && (
        <ConfirmDialog
          title={
            isActive
              ? dict.home.confirmDisableTitle
              : dict.home.confirmEnableTitle
          }
          message={
            isActive
              ? dict.home.confirmDisableMessage
              : dict.home.confirmEnableMessage
          }
          confirmLabel={dict.home.confirm}
          cancelLabel={dict.home.cancel}
          loading={statusLoading}
          onConfirm={handleConfirmToggle}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
