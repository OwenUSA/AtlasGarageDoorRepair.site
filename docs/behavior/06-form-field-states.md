# Behavior spec — form field focus, error and success states

`/contact` only. Spec only. Built in Prompt 7. **Not implemented yet.**

> **Reference form, as captured.** Gravity Forms, `POST /contact/`, 8 visible fields:
> text ×4, `tel` ×1, **`email` ×1**, `select` ×1, `textarea` ×1, plus a consent checkbox,
> reCAPTCHA and hidden state fields. **No field carries `required`** — validation is
> entirely server-side, so the first feedback a user gets is a page reload.
>
> **Ours per D-05:** name, phone, service needed (select), preferred callback window
> (select), message. **No email field, no captcha, no consent checkbox, no backend.**
> Client-side validation only. The component is marked `// STUB: no submission target` at
> the top of the file.

---

## Mechanism

Native form controls with real `<label for>` elements. Validation state is a **`data-state`
attribute** (`idle` / `invalid` / `valid`) set by React, styled in CSS.

**Validation timing — the whole design of this spec:**

| moment | behaviour |
|---|---|
| while typing, field never blurred | **no validation**, ever |
| on **blur**, if the field has content | validate, show error if invalid |
| after a field has errored once | validate **on change**, so the error clears as it is fixed |
| on **submit** | validate all, focus the first invalid field |

Errors are rendered in a `<p>` tied to the input by **`aria-describedby`**, inside a
container with **`aria-live="polite"`**.

**Do NOT use, where the wrong choice is plausible:**

| not this | why |
|---|---|
| validate on every keystroke from the start | the field is invalid while it is being typed into; the user is told they are wrong before they finish |
| CSS `:invalid` alone | matches on first paint, so every empty required field is red before the user touches the form |
| `:user-invalid` alone | correct timing but no support for our custom messages, and inconsistent for the select |
| `placeholder` as the label | disappears on input, fails contrast, unusable for screen readers |
| `aria-live="assertive"` | interrupts the user mid-typing |
| colour alone to signal error | fails WCAG 1.4.1; needs an icon and text too |
| `react-hook-form` + `zod` | barred by the allowlist — five fields, no backend |
| `libphonenumber` | barred — one country |
| a `<div>` styled as a select | native `<select>` is keyboard- and screen-reader-correct for free |

**Phone validation** (Appendix A): strip non-digits, require **exactly 10**, format on blur
to `(NNN) NNN-NNNN`, **permissive paste** — accept `+1`, dots, dashes, spaces, parentheses.
No country selector.

**Submit** (D-05): `preventDefault`, validate, `console.warn` the stub notice, then render
the callback-confirmation state. No network request is made.

## Ratio, and why

| transition | duration | easing |
|---|---|---|
| focus ring appearance | **0.12s** | `ease-out` |
| border colour on state change | **0.15s** | `ease-out` |
| error message enter | **0.15s**, opacity + `translateY(-2px)` | `ease-out` |
| error message exit | **0s** — immediate | — |
| success panel enter | **0.3s**, opacity + `translateY(4px)` | `cubic-bezier(0.22, 1, 0.36, 1)` |

**Focus at 0.12s** is near-instant. A focus ring is a response to a direct action and any
perceptible delay makes the form feel unresponsive to the keyboard.

**Errors leave instantly, arrive in 0.15s.** Fading an error out as it is fixed makes the
correction feel unacknowledged; it should vanish the moment the input becomes valid. The
asymmetry is deliberate.

**The error message must not shift layout.** Its space is reserved via `min-height` on the
field wrapper, so showing and hiding it never moves the fields below. Otherwise every
blur-validation event jumps the rest of the form under the cursor.

**Success panel at 0.3s** is the one place a slightly slower transition is right — it marks
a state change for the whole form, not a single field.

## Failure mode

- **Validating on keystroke from the first character.** "1" in a phone field is invalid, so
  the user is scolded for typing. The most common and most irritating form bug there is.
- **Bare CSS `:invalid`.** Every empty required field is red on load. The form looks broken
  before it is touched.
- **Placeholder-as-label.** Vanishes the moment there is input, so the user cannot check
  what a field was for; typically 2.5:1 contrast; and it is not a label to a screen reader.
- **Error text not reserved.** Fields jump downward as messages appear. On mobile, blurring
  one field can move the next one out from under the thumb.
- **`aria-live="assertive"`.** Interrupts whatever the user is doing. `polite` queues until
  they pause.
- **Red border only.** Invisible to a colour-blind user. Needs icon plus text.
- **Not focusing the first invalid field on submit.** On a long form the user presses submit
  and nothing appears to happen, because the error is above the fold they are on.
- **Clearing the whole form on a failed submit.** Never.
- **Implying the message was sent.** There is no backend. The confirmation must promise a
  **callback**, not a reply, and must not say "we have received your message".
- **Adding an email field back** because "the form needs a contact method". It has one: the
  phone number. D-03 bars email absolutely.

## Trigger

- **Focus / blur** on each field — blur is the primary validation trigger.
- **Change** on a field that has already errored — clears the error as it is corrected.
- **Submit** — validates everything, focuses the first invalid control, announces a summary.
- **Select fields** validate on `change`, since blur semantics are awkward for a dropdown.

Repeating. Re-entry into an errored field does **not** clear the error until the value
actually becomes valid — an error that disappears on focus and returns on blur flickers.

On **client-side route change** the form unmounts and all state is lost, including any typed
input. That is acceptable given there is no submission target, but the confirmation state
must not be restored on remount — arriving back on `/contact` shows a fresh, empty form,
never a stale "we'll call you back".

The success state is **not** a route change: it replaces the form in place, so the browser
back button does not undo it.

## Accessibility

- Every control has a real **`<label for="...">`**. No placeholder-only fields, no
  `aria-label` substituting for a visible label.
- Hints are separate elements referenced by **`aria-describedby`**, alongside the error id
  when one is present.
- Invalid fields get **`aria-invalid="true"`** and their error id in `aria-describedby`.
- The error container is **`aria-live="polite"`** and `role="status"`; on submit failure it
  announces a count ("3 fields need attention") before per-field messages.
- **Focus moves to the first invalid field** on failed submit.
- On success, focus moves to the confirmation heading, which has `tabindex="-1"`, so screen
  reader users are told the outcome rather than left on a submit button that no longer
  exists.
- Errors are conveyed by **icon + text + colour**, never colour alone (WCAG 1.4.1).
- Focus ring **3:1 against both the input and the page** (D-19), verified again after the
  Prompt 9 recolor.
- Error text meets **4.5:1** — red-on-white error text is the most common contrast failure
  on a form, and the Prompt 9 rotation must leave semantic colours alone.
- The phone input uses `type="tel"` with `inputmode="numeric"` and `autocomplete="tel"`;
  the name field uses `autocomplete="name"`.
- Full keyboard path: every control reachable and operable, native `<select>` kept for that
  reason. **Note (chain amendment A-4): the manual keyboard pass is dropped from Prompt 11,
  so this path is spec-verified only and is a `docs/PRE-LAUNCH.md` blocker.**
- **`prefers-reduced-motion: reduce`** → all transitions above drop to 0.01s; states change
  instantly and remain fully legible.
