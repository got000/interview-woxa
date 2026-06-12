import { Dictionary } from '@/lib/i18n/translations';
import { hasLetter, hasMinLength, hasNumber } from '@/lib/validation';

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-2 text-xs ${
        met ? 'text-emerald-400' : 'text-red-400'
      }`}
    >
      {met ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-3.5 w-3.5 flex-shrink-0"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-3.5 w-3.5 flex-shrink-0"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
        </svg>
      )}
      <span>{label}</span>
    </li>
  );
}

export function PasswordRequirements({
  password,
  dict,
}: {
  password: string;
  dict: Dictionary;
}) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {dict.register.passwordRequirementsTitle}
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        <RequirementItem
          met={hasMinLength(password)}
          label={dict.register.passwordRuleMinLength}
        />
        <RequirementItem
          met={hasLetter(password)}
          label={dict.register.passwordRuleLetter}
        />
        <RequirementItem
          met={hasNumber(password)}
          label={dict.register.passwordRuleNumber}
        />
      </ul>
    </div>
  );
}
