'use client';

// <BusinessMap> — implements docs/behavior/07-map-lazy-mount.md.
//
// D-07: embedded by COORDINATES ONLY. The street address is fictional and must never be
// passed to a geocoder. D-08: home at zoom ~13, /contact at zoom ~15, lazy, titled,
// fixed aspect-ratio wrapper so it cannot shift layout, plus a directions link.
//
// The IntersectionObserver here gates a NETWORK FETCH, not an animation. It is the only
// observer in the build (docs/behavior/08).

import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { business, mapEmbedSrc, directionsHref } from '@/lib/business';

export function BusinessMap({
  zoom, className, headingId,
}: { zoom: number; className?: string; headingId?: string }) {
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || mounted) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  const skipId = `skip-map-${zoom}`;

  return (
    <div className={className}>
      {/* Map bypass — an iframe is a focus trap for keyboard users (D-19). */}
      <a href={`#${skipId}`} className="skip-link">Skip map</a>

      {/* Aspect-ratio wrapper: the box is final from first paint, so the iframe cannot
          shift layout when it loads. 4:3 on phones, 16:9 above — a wide strip shows
          almost no context around the pin at 390. */}
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden bg-neutral-200 aspect-[4/3] md:aspect-video"
      >
        {mounted ? (
          <iframe
            title={`Map showing ${business.name}, ${business.address.display}`}
            src={mapEmbedSrc(zoom)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 opacity-100 transition-opacity duration-200 ease-out motion-reduce:transition-none"
          />
        ) : (
          <img
            src="/placeholders/home-map-poster.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      <p id={skipId} className="mt-3 text-sm">
        <span className="block font-semibold text-neutral-900">{business.address.display}</span>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 font-semibold"
        >
          Get directions
          <ExternalLink aria-hidden size={14} strokeWidth={2} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </div>
  );
}
