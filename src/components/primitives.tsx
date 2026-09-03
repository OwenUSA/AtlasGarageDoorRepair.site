// Hand-rolled primitives. No component library (Appendix A) — it would ship its own token
// system and fight the palette in globals.css.
import type { ReactNode, ElementType } from 'react';
import clsx from 'clsx';

/** Content column. 1080px inside a 1440 viewport, measured from the reference. */
export function Container({
  children, className, wide = false,
}: { children: ReactNode; className?: string; wide?: boolean }) {
  return (
    <div className={clsx('mx-auto w-full px-4 md:px-gutter', wide ? 'max-w-wide' : 'max-w-content', className)}>
      {children}
    </div>
  );
}

type Tone = 'surface' | 'primary' | 'primary-deep' | 'accent' | 'accent-deep' | 'band' | 'muted';

const TONE: Record<Tone, string> = {
  surface: 'bg-surface text-neutral-600',
  primary: 'bg-primary text-surface',
  'primary-deep': 'bg-primary-deep text-surface',
  accent: 'bg-accent text-surface',
  'accent-deep': 'bg-accent-deep text-surface',
  band: 'bg-neutral-400 text-neutral-900',
  muted: 'bg-neutral-200 text-neutral-900',
};

/** A banded section. The reference's whole layout is full-bleed colour bands. */
export function Band({
  children, tone = 'surface', className, id, as: As = 'section',
}: {
  children?: ReactNode; tone?: Tone; className?: string; id?: string; as?: ElementType;
}) {
  return (
    <As id={id} className={clsx('w-full', TONE[tone], className)} data-section={id}>
      {children}
    </As>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'cta' | 'secondary' | 'ghost';
  className?: string;
  'aria-label'?: string;
};

/**
 * `cta` is the call-now button — the conversion path for the entire site, and the element
 * the Prompt 9 constraint protects: highest chroma, and its own fill separates from the
 * page. Never restyle it to recede.
 */
export function Button({ href, children, variant = 'cta', className, ...rest }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold ' +
    'text-base no-underline transition-colors duration-[var(--duration-quick)] min-h-11';
  const variants = {
    cta: 'bg-accent text-surface hover:bg-accent-deep',
    secondary: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-surface',
    ghost: 'bg-transparent text-surface border-2 border-surface hover:bg-surface hover:text-primary',
  };
  return (
    <a href={href} className={clsx(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}

/**
 * TODO(fact) chip at a fixed box, per D-14. Never becomes a claim.
 * `tone="inverted"` is for placement on a dark/accent band (e.g. the stat strip's
 * accent gradient) — the default border-strong/neutral-600 pairing is tuned for a
 * light band and drops under 2:1 on a saturated one.
 */
export function FactChip({
  label, className, tone = 'default',
}: { label: string; className?: string; tone?: 'default' | 'inverted' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center border border-dashed',
        'px-3 py-2 text-2xs font-medium',
        tone === 'inverted' ? 'border-surface text-surface' : 'border-border-strong text-neutral-600',
        className,
      )}
    >
      {label}
    </span>
  );
}
