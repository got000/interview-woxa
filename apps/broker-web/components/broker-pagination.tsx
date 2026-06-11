'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface BrokerPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function BrokerPagination({ currentPage, totalPages }: BrokerPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage}
          onClick={() => goToPage(page)}
          className={`h-2.5 rounded-full transition-all ${
            page === currentPage
              ? 'w-6 bg-sky-400'
              : 'w-2.5 bg-slate-700 hover:bg-slate-600'
          }`}
        />
      ))}
    </div>
  );
}
