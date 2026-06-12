'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { registerAction } from '@/lib/actions/auth';
import { useLocale } from '@/lib/i18n/locale-context';
import { useToast } from '@/lib/toast/toast-context';
import { isValidEmail, isValidPassword } from '@/lib/validation';
import { resolveErrorMessage } from '@/lib/error-message';
import { PasswordRequirements } from '@/components/password-requirements';

function PasswordToggleButton({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-300"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )}
    </button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { locale, dict } = useLocale();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailValid = email === '' || isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError(dict.register.invalidEmail);
      return;
    }

    if (!isValidPassword(password)) {
      setError(dict.register.passwordTooWeak);
      return;
    }

    if (password !== confirmPassword) {
      setError(dict.register.passwordMismatch);
      return;
    }

    setLoading(true);

    const result = await registerAction({
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword,
    });

    setLoading(false);

    if (!result.success) {
      const message = resolveErrorMessage(result, dict);
      setError(message);
      showToast('error', message);
      return;
    }

    showToast('success', dict.toast.registerSuccess);

    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      router.push(`/${locale}/login`);
      return;
    }

    router.push(`/${locale}/create`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="full_name"
          className="text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {dict.register.fullName}
        </label>
        <input
          id="full_name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={dict.register.fullNamePlaceholder}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {dict.register.email}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.register.emailPlaceholder}
          aria-invalid={!emailValid}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none"
        />
        {!emailValid && (
          <span className="text-xs text-red-400">
            {dict.register.invalidEmail}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            {dict.register.password}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 pr-10 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
            />
            <PasswordToggleButton
              visible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />
          </div>
          {(passwordFocused || password) && (
            <PasswordRequirements password={password} dict={dict} />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirm_password"
            className="text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            {dict.register.confirmPassword}
          </label>
          <div className="relative">
            <input
              id="confirm_password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 pr-10 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
            />
            <PasswordToggleButton
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      <label
        htmlFor="agreement"
        className="flex items-start gap-3 text-sm text-slate-300"
      >
        <input
          id="agreement"
          type="checkbox"
          required
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 accent-sky-400"
        />
        <span>
          {dict.register.agreementPrefix}{' '}
          <Link href="#" className="text-sky-400 hover:underline">
            {dict.register.agreementMsa}
          </Link>{' '}
          {dict.register.agreementAnd}{' '}
          <Link href="#" className="text-sky-400 hover:underline">
            {dict.register.agreementPrivacy}
          </Link>
          .
        </span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading || !agreed}
        className="flex items-center justify-center gap-2 rounded bg-gradient-to-r from-sky-200 to-blue-500 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? dict.register.submitting : dict.register.submit}
        {!loading && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
