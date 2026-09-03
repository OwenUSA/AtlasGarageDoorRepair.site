# Behavior spec — map lazy-mount

`/` (zoom 13) and `/contact` (zoom 15). Both required by D-08.
Spec only. Built in Prompt 5 as `<BusinessMap>`, a **lead-owned shared component**.
**Not implemented yet.**

> **Reference behaviour.** Two Google **My Maps** embeds on home
> (`maps/d/u/0/embed?mid=...`), both service-area overlays showing where they have worked.
> **Both are DELETED under D-02** — they are a locations feature.
>
> Ours is a different thing entirely: a single location pin, embedded **by coordinates
> only**, per D-07/D-08. The coordinates were geocoded once, offline, from the real street
> address via the US Census geocoder (see `CLAUDE.md`) — the embed uses that stored pair
> directly rather than re-geocoding an address string on every load. So this is a NOVEL
> component measured by token conformance, not a clone.

---

## Mechanism

A keyless iframe:

```
https://www.google.com/maps?q=26.0439,-81.6999&z=<zoom>&output=embed
```

**Coordinates only — never the address string.** The address is real, but it was already
geocoded once, offline, into `MAP_COORDS`; re-geocoding `6050 Collier Blvd, Ste 1, Naples,
FL 34114` as a string on every page load is unnecessary and less reliable than using the
stored pair.

Three layers:

1. **Aspect-ratio wrapper** — `aspect-ratio` with an explicit fallback, so the box occupies
   its final height from first paint and the iframe cannot shift layout when it loads.
2. **Static poster** — the placeholder SVG fills the wrapper until mount. No network call.
3. **The iframe**, mounted only when needed, with `loading="lazy"` and a real `title`.

Mount is gated by **`IntersectionObserver`** with `rootMargin: '200px'` — the iframe is
added to the DOM shortly before it scrolls into view, and `loading="lazy"` is kept as a
second line of defence for browsers where the observer has not fired.

Below the map, a **"Get directions"** link, always present and never gated:

```
https://www.google.com/maps/dir/?api=1&destination=26.0439,-81.6999
```

Both the coordinates and the zoom come from **`lib/business.ts`**; zoom is a prop. A
hard-coded coordinate anywhere else is a bug (Prompt 5, item 5).

**Do NOT use, where the wrong choice is plausible:**

| not this | why |
|---|---|
| the address string in `q=` | the address is real, but it is already geocoded once into `MAP_COORDS`; re-geocoding a string on every load is unnecessary and less reliable (D-07) |
| the Maps JavaScript API | needs a key; D-18 bars third-party keys |
| `@vis.gl/react-google-maps`, Leaflet, Mapbox | not on the allowlist, and none is needed for one pin |
| an iframe with no aspect-ratio wrapper | the single largest CLS source on the page |
| `loading="lazy"` alone | still fetches Google's payload on a fast connection well before it is needed |
| mounting the iframe on `useEffect` at mount | defeats the purpose — it loads immediately |
| a screenshot of a map as a static image | Google's imagery is licensed; we would be redistributing it |
| `100vh`-based sizing | mobile browser chrome changes `vh` mid-scroll |

## Ratio, and why

| breakpoint | aspect ratio | why |
|---|---|---|
| 390 | **4:3** | a wide strip on a phone shows almost no context around the pin |
| 768 | **16:9** | |
| 1440 | **16:9** | |

| property | value |
|---|---|
| `rootMargin` | **200px** |
| poster → iframe crossfade | **0.2s** `ease-out`, opacity only |
| zoom, `/` | **13** — neighbourhood context, per D-08 |
| zoom, `/contact` | **15** — the building, per D-08 |

**200px of `rootMargin`** is roughly a third of a phone viewport: enough that the map has
started loading by the time it is on screen, not so much that it loads for someone who
stops halfway down the page. Smaller and the user watches it load; larger and it is
effectively eager.

**The crossfade is 0.2s and opacity-only**, from poster to iframe. Without it the map pops
in. It must not animate the wrapper's size — the box was already final.

## Failure mode

- **No aspect-ratio wrapper.** The iframe has a default 150px height until its content
  loads, then jumps. This is the biggest CLS contributor on any page with an embed, and on
  `/contact` it moves the form under the user's cursor mid-typing.
- **Passing the address string instead of `MAP_COORDS`.** Even though the address is real,
  re-geocoding it on every load is unnecessary and less reliable than the stored
  coordinates. D-07 exists precisely because someone will try this.
- **`loading="lazy"` treated as sufficient.** Chrome's heuristics load lazily-flagged
  iframes quite eagerly on fast connections; the observer is what actually defers it.
- **Rendering the iframe on the server.** It is in the initial HTML, so it loads
  immediately and there is nothing lazy about it.
- **Omitting `title`.** The iframe is announced as "frame" with no further information.
  A hard accessibility failure, and trivially avoidable.
- **Building "Get directions" from the address.** Same geocoding trap. Use coordinates.
- **Gating the directions link behind the map's mount.** The link is text and costs
  nothing; someone with the map blocked still needs it.
- **Letting the map sit above the mobile call bar in `z-index`.** The iframe captures
  pointer events over a large area; if it overlaps the call bar the phone number stops
  being tappable.
- **Fighting the performance score.** Expected (Appendix A). It is recorded, not fixed —
  and under chain amendment A-4 Lighthouse is not run at all.

## Trigger

- **Mount**: `IntersectionObserver` fires once at 200px before entry, then **disconnects**.
  One-shot — the iframe is never unmounted on scroll-away, because tearing down and
  re-creating it would re-fetch Google's payload every time.
- **Re-entry**: nothing. The observer is already disconnected and the iframe stays mounted.
- **Client-side route change**: `/` and `/contact` carry separate instances at different
  zooms, so navigating between them unmounts one and mounts the other. The new instance
  starts from its poster with its own observer — it must **not** inherit "already mounted"
  state from the previous route, or `/contact` renders `/`'s zoom.
- **Prefers-reduced-motion**: does not affect mounting, only the crossfade.
- **No JS**: `<noscript>` renders the poster plus the directions link. The map is not
  essential; the address, the directions link and the phone number are all still there.

## Accessibility

- **`title` is mandatory** and specific: `title="Map showing Atlas Garage Door Repair,
  6050 Collier Blvd, Naples, FL"`. Not "Map".
- The **address is displayed as text beside the map** (D-07), so the location is
  available without loading, seeing, or interacting with an embed.
- **Map bypass**: an iframe is a focus trap for keyboard users, who can tab into Google's
  controls and need many presses to get out. A skip link immediately before the map —
  "Skip map" — jumps past it to the directions link. Required by D-19.
- The "Get directions" link is real text outside the iframe, keyboard reachable, and
  carries `rel="noopener noreferrer"` with `target="_blank"` plus a visually-hidden
  "opens in a new tab".
- The poster SVG is decorative: `aria-hidden="true"`, empty `alt`.
- The map is **never the only source of any information** — address, phone, hours and
  service area are all text elsewhere on both pages.
- **Privacy**: loading the iframe hands the user's IP to Google and lets it set cookies.
  Deferring until scroll means someone who never reaches the map never contacts Google.
  This is stated plainly in the privacy policy's "The map" section, which was written to
  match (Prompt 3).
- **`prefers-reduced-motion: reduce`** → the 0.2s crossfade is dropped; the iframe replaces
  the poster instantly.
