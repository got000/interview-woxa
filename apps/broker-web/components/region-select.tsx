'use client';

import regions from '@/lib/data/regions.json';
import { useLocale } from '@/lib/i18n/locale-context';

interface RegionSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RegionSelect({ value, onChange, className }: RegionSelectProps) {
  const { locale } = useLocale();

  return (
    <select
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      <option value="" disabled>
        {locale === 'th' ? 'เลือกภูมิภาค' : 'Select a region'}
      </option>
      {regions.map((region) => (
        <option key={region.code} value={region.code}>
          {region.flag} {region.name[locale]}
        </option>
      ))}
    </select>
  );
}
