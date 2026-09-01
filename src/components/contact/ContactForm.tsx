// STUB: no submission target
//
// Contact form — reference s03, ADAPTED. D-05: name, phone, service needed, preferred
// callback window, message. NO email field, no captcha, no consent checkbox, no backend.
// Client-side validation only, per docs/behavior/06-form-field-states.md.
//
// Validation timing (the whole design of that spec):
//   - never validate while typing before first blur
//   - on blur, if the field has content, validate
//   - once a field has errored, re-validate on change so the error clears as it's fixed
//   - selects validate on change (blur semantics are awkward for a dropdown)
//   - on submit, validate everything and move focus to the first invalid control

'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';

const s = copy.routes['/contact'].sections.find((x) => x.id === 's03')!;
const [nameField, phoneField, serviceField, windowField, messageField] = s.fields!;

type Key = 'name' | 'phone' | 'service' | 'window' | 'message';
type Values = Record<Key, string>;
type Errors = Partial<Record<Key, string | null>>;
type ErroredMap = Partial<Record<Key, boolean>>;

const EMPTY: Values = { name: '', phone: '', service: '', window: '', message: '' };

/** Strip everything but digits; a leading country-code "1" on an 11-digit paste is dropped. */
function normalizePhoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  return digits;
}

function formatPhone(raw: string): string {
  const d = normalizePhoneDigits(raw);
  if (d.length !== 10) return raw;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function validate(key: Key, value: string): string | null {
  switch (key) {
    case 'name':
      return value.trim().length > 0 ? null : 'Enter your name.';
    case 'phone':
      return normalizePhoneDigits(value).length === 10 ? null : 'Enter a 10-digit phone number.';
    case 'service':
      return value ? null : 'Choose the closest match.';
    case 'window':
      return value ? null : 'Choose a callback window.';
    case 'message':
      return null; // optional — never required
  }
}

const FIELD_ORDER: Key[] = ['name', 'phone', 'service', 'window', 'message'];

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [erroredOnce, setErroredOnce] = useState<ErroredMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const windowRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const refs: Record<Key, React.RefObject<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>> = {
    name: nameRef,
    phone: phoneRef,
    service: serviceRef,
    window: windowRef,
    message: messageRef,
  };

  useEffect(() => {
    if (submitted) headingRef.current?.focus();
  }, [submitted]);

  function handleTextChange(key: Key, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (erroredOnce[key]) {
      setErrors((e) => ({ ...e, [key]: validate(key, value) }));
    }
  }

  function handleTextBlur(key: Key) {
    const value = values[key];
    if (key === 'message') return; // optional, never validated
    if (!value.trim()) return; // no validation on blur for an empty, untouched field
    const err = validate(key, value);
    setErrors((e) => ({ ...e, [key]: err }));
    if (err) setErroredOnce((m) => ({ ...m, [key]: true }));
    if (key === 'phone' && !err) {
      setValues((v) => ({ ...v, phone: formatPhone(value) }));
    }
  }

  function handleSelectChange(key: Key, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    const err = validate(key, value);
    setErrors((e) => ({ ...e, [key]: err }));
    if (err) setErroredOnce((m) => ({ ...m, [key]: true }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: Errors = {};
    let firstInvalid: Key | null = null;
    for (const key of FIELD_ORDER) {
      const err = validate(key, values[key]);
      nextErrors[key] = err;
      if (err && !firstInvalid) firstInvalid = key;
    }
    setErrors(nextErrors);
    setErroredOnce((prev) => {
      const next = { ...prev };
      FIELD_ORDER.forEach((key) => {
        if (nextErrors[key]) next[key] = true;
      });
      return next;
    });
    setAttemptCount((n) => n + 1);

    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    // STUB: no backend. Nothing is sent anywhere.
    // eslint-disable-next-line no-console
    console.warn('STUB: contact form has no submission target — no request was made.');
    setSubmitted(true);
  }

  const invalidCount = FIELD_ORDER.filter((k) => errors[k]).length;

  if (submitted) {
    return (
      <div className="flex flex-col gap-loose bg-neutral-200 px-gutter py-band">
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="flex items-center gap-2 text-2xl font-semibold leading-heading text-primary outline-none"
        >
          <CheckCircle2 aria-hidden size={24} strokeWidth={2} className="text-success" />
          We&apos;ll call you back
        </h3>
        <p className="max-w-[48ch] text-base leading-body">
          Thanks — that&apos;s on its way to us. Expect a call from {business.phone.display}
          {' '}inside the window you picked. Need it sooner? Call us now.
        </p>
        <a
          href={telHref}
          aria-label={`Call ${business.name} at ${business.phone.display}`}
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 bg-accent px-5 py-3 font-semibold text-surface no-underline transition-colors duration-[var(--duration-quick)] hover:bg-accent-deep"
        >
          {business.phone.display}
        </a>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-wide">
      <div aria-live="polite" role="status" className="min-h-[1.5rem]">
        {attemptCount > 0 && invalidCount > 0 && (
          <p className="flex items-center gap-2 text-sm font-semibold text-error">
            <AlertCircle aria-hidden size={16} strokeWidth={2} />
            {invalidCount} {invalidCount === 1 ? 'field needs' : 'fields need'} attention.
          </p>
        )}
      </div>

      <TextField
        id="contact-name"
        inputRef={nameRef}
        label={nameField.label}
        hint={nameField.hint}
        value={values.name}
        error={errors.name}
        onChange={(v) => handleTextChange('name', v)}
        onBlur={() => handleTextBlur('name')}
        autoComplete="name"
      />

      <TextField
        id="contact-phone"
        inputRef={phoneRef}
        label={phoneField.label}
        hint={phoneField.hint}
        value={values.phone}
        error={errors.phone}
        onChange={(v) => handleTextChange('phone', v)}
        onBlur={() => handleTextBlur('phone')}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
      />

      <SelectField
        id="contact-service"
        selectRef={serviceRef}
        label={serviceField.label}
        hint={serviceField.hint}
        value={values.service}
        error={errors.service}
        options={serviceField.options ?? []}
        onChange={(v) => handleSelectChange('service', v)}
      />

      <SelectField
        id="contact-window"
        selectRef={windowRef}
        label={windowField.label}
        hint={windowField.hint}
        value={values.window}
        error={errors.window}
        options={windowField.options ?? []}
        onChange={(v) => handleSelectChange('window', v)}
      />

      <div className="flex flex-col gap-tight">
        <label htmlFor="contact-message" className="text-sm font-semibold text-primary">
          {messageField.label}
        </label>
        {messageField.hint && (
          <p id="contact-message-hint" className="text-xs text-neutral-600">
            {messageField.hint}
          </p>
        )}
        <textarea
          id="contact-message"
          ref={messageRef}
          name="message"
          rows={4}
          data-state="idle"
          value={values.message}
          onChange={(e) => handleTextChange('message', e.target.value)}
          aria-describedby="contact-message-hint"
          className="w-full border border-border bg-surface px-4 py-3 text-base leading-body text-neutral-900 outline-none transition-colors duration-[var(--duration-quick)] focus-visible:border-focus focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        />
      </div>

      <div className="flex flex-col gap-loose sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 bg-accent px-5 py-3 font-semibold text-surface transition-colors duration-[var(--duration-quick)] hover:bg-accent-deep"
        >
          {s.cta?.primary}
        </button>
        <a
          href={telHref}
          aria-label={`Call ${business.name} at ${business.phone.display}`}
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 border-2 border-primary bg-transparent px-5 py-3 font-semibold text-primary no-underline transition-colors duration-[var(--duration-quick)] hover:bg-primary hover:text-surface"
        >
          {s.cta?.secondary}
        </a>
      </div>
      {s.cta?.note && <p className="text-xs text-neutral-600">{s.cta.note}</p>}
    </form>
  );
}

function fieldClasses(state: 'idle' | 'invalid' | 'valid') {
  const base =
    'w-full border bg-surface px-4 py-3 text-base leading-body text-neutral-900 outline-none ' +
    'transition-colors duration-[var(--duration-quick)] ease-out ' +
    'focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2';
  if (state === 'invalid') return `${base} border-error focus-visible:border-error`;
  return `${base} border-border focus-visible:border-focus`;
}

function TextField({
  id, inputRef, label, hint, value, error, onChange, onBlur, type = 'text', inputMode, autoComplete,
}: {
  id: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  label: string;
  hint?: string;
  value: string;
  error?: string | null;
  onChange: (v: string) => void;
  onBlur: () => void;
  type?: string;
  inputMode?: 'numeric' | 'text';
  autoComplete?: string;
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const state: 'idle' | 'invalid' | 'valid' = error ? 'invalid' : 'idle';
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-tight">
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-neutral-600">
          {hint}
        </p>
      )}
      <input
        id={id}
        ref={inputRef}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        data-state={state}
        value={value}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={fieldClasses(state)}
      />
      <div className="min-h-[1.25rem]">
        {error && (
          <p
            id={errorId}
            role="status"
            aria-live="polite"
            className="flex items-center gap-1 text-xs font-medium text-error"
          >
            <AlertCircle aria-hidden size={14} strokeWidth={2} />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function SelectField({
  id, selectRef, label, hint, value, error, options, onChange,
}: {
  id: string;
  selectRef: React.RefObject<HTMLSelectElement | null>;
  label: string;
  hint?: string;
  value: string;
  error?: string | null;
  options: string[];
  onChange: (v: string) => void;
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const state: 'idle' | 'invalid' | 'valid' = error ? 'invalid' : 'idle';
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-tight">
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-neutral-600">
          {hint}
        </p>
      )}
      <select
        id={id}
        ref={selectRef}
        data-state={state}
        value={value}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClasses(state)}
      >
        <option value="" disabled hidden>
          Select one
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="min-h-[1.25rem]">
        {error && (
          <p
            id={errorId}
            role="status"
            aria-live="polite"
            className="flex items-center gap-1 text-xs font-medium text-error"
          >
            <AlertCircle aria-hidden size={14} strokeWidth={2} />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
