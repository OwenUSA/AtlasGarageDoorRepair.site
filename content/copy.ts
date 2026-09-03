// content/copy.ts — every string for all five routes.
//
// Written in Prompt 3, BEFORE any component consumes it, to a measured divergence target.
// Gates: zero shared 5-grams with the reference corpus, trigram Jaccard <= 0.15 per
// section, and every block within +/-10% of its reference slot's character count.
// Verify with `node scripts/similarity.mjs`.
//
// Proposition held across all five routes: WORKMANSHIP — the repair holds up.
// Never speed. Never price. No invented facts (D-14, D-17) — unknowns are TODO(fact).

export type DivergenceClass = 'FIDELITY' | 'ADAPTED' | 'NOVEL';

export type SectionCopy = {
  /** our section id, matching docs/sections.md */
  id: string;
  /** the reference section this adapts, or null where we have no counterpart */
  refSection: string | null;
  cls: DivergenceClass;
  heading?: string;
  subheading?: string;
  body?: string[];
  items?: { title: string; text: string }[];
  groups?: { symptom: string; lead: string; services: { name: string; text: string }[] }[];
  cta?: { primary?: string; secondary?: string; note?: string };
  chips?: string[];
  quotes?: string[];
  stats?: { value: string; label: string }[];
  fields?: { label: string; hint?: string; options?: string[] }[];
  note?: string;
};

export type PageCopy = {
  meta: { title: string; description: string };
  sections: SectionCopy[];
};

export type SiteCopy = {
  tagline: string;
  routes: Record<string, PageCopy>;
};

/**
 * Fictional, illustrative testimonials — deliberately invented for a placeholder site
 * (no AggregateRating/Review JSON-LD is emitted for these; see src/components/home/Testimonials.tsx).
 * First name + last initial only. No AI-generated ratings, no real customers.
 */
const TESTIMONIALS: string[] = [
  '"Our spring snapped on a Sunday morning and the car was stuck inside. Someone was out within a couple of hours and had a new torsion spring set and balanced before lunch. Two years on it still runs dead quiet." — Karen M.',
  '"Opener quit responding to the remote and I assumed we needed a whole new unit. Turned out it was a sensor alignment issue and a worn gear — fixed same visit for a fraction of what I braced for. Been solid for over a year now." — Daniel R.',
  '"A rock kicked up by the mower dented one panel pretty badly. They matched it to the existing door instead of pushing a full replacement, and you honestly cannot tell which panel is new." — Priya S.',
  '"Cable frayed and the door came off track at the worst possible time — right before a work trip. They talked me through it on the phone, got someone out that afternoon, and the door has tracked straight ever since." — Marcus T.',
  '"We run a small landscaping outfit out of a converted garage bay and the door was cycling dozens of times a day. They rebuilt the counterbalance for commercial duty instead of patching the residential setup that was already failing." — Lisa H.',
  '"Annual tune-up caught a roller that was about to seize before it ever left us stranded. Appreciated getting told what was wearing down instead of just being sold a bigger job." — Gregory O.',
  '"New install after our old door finally gave out — measured everything twice, explained the balance numbers before they left, and the whole thing has been silent through a full Oklahoma summer and winter." — Ashley B.',
];

export const copy: SiteCopy = {
  tagline: 'The repair holds. That is the whole promise.',

  routes: {
    // =====================================================================
    '/': {
      meta: {
        title: 'Atlas Garage Door Repair | Edmond, OK Garage Door Repair',
        description:
          'Garage door repair in Edmond and north Oklahoma City. Springs, openers, cables, rollers and panels, set by measurement and cycle-tested before we leave.',
      },
      sections: [
        {
          id: 's00-top-header',
          refSection: 's00-top-header',
          cls: 'FIDELITY',
          body: ['Open daily 7am–7pm'],
        },
        {
          id: 's01-main-header',
          refSection: 's01-main-header',
          cls: 'ADAPTED',
          items: [
            { title: 'Home', text: '/' },
            { title: 'About', text: '/about' },
            { title: 'Services', text: '/services' },
            { title: 'Contact', text: '/contact' },
            { title: 'Privacy', text: '/privacy' },
          ],
          cta: { primary: 'Call (405) 555-0163' },
        },
        {
          id: 's02-vh1-is-proud-to-support-employ-v',
          refSection: 's02-vh1-is-proud-to-support-employ-v',
          cls: 'ADAPTED',
          heading: 'The repair holds. That is the whole promise.',
        },
        {
          id: 's03-we-get-the-job-done',
          refSection: 's03-we-get-the-job-done',
          cls: 'ADAPTED',
          heading: 'Fixed once, properly.',
          subheading:
            'We find what actually failed, replace it, and cycle-test the door before we leave.',
          cta: { primary: 'Call (405) 555-0163', secondary: 'Request a callback' },
        },
        {
          // MOVED: this is reference section 13, now built fifth. Structural change #1.
          id: 's13-services-our-services',
          refSection: 's13-services-our-services',
          cls: 'ADAPTED',
          heading: 'Start with what the door is doing',
          subheading: 'Eight jobs, sorted by the symptom you would describe on the phone.',
          groups: [
            {
              symptom: 'It will not close, or it closes crooked',
              lead:
                'The counterbalance or the guide path has given way. This is the group that strands a car, and the one we schedule first.',
              services: [
                {
                  name: 'Spring repair and replacement',
                  text:
                    'A torsion spring carries almost the whole weight of the door, so when one breaks the opener has nothing left to assist. We match wire size, inside diameter and wound length to the door as built rather than to whatever was fitted last, set tension by turn count, then check the balance by hand at three heights. A door that holds still halfway up is a door whose spring is right. Extension systems get containment cables fitted at the same time.',
                },
                {
                  name: 'Off-track and misaligned door correction',
                  text:
                    'A door leaves its track because something else failed first — a snapped cable, a flattened roller, a bent flag bracket, or an impact low down. Re-seating it without finding that cause guarantees a second call. We take the door down under control, straighten or replace the affected track, check the runs for level and plumb, then reset spacing so nothing binds.',
                },
              ],
            },
            {
              symptom: 'It runs, but it sounds wrong',
              lead:
                'Noise is early warning. Grinding and shudder are wear you can still get ahead of, before it turns into the group above.',
              services: [
                {
                  name: 'Cable, roller and track repair',
                  text:
                    'Frayed lift cables, seized rollers and dented track account for most of the racket a door makes. We replace cables in pairs so the drums stay in phase, fit sealed-bearing rollers sized to the track, and dress or swap sections that have taken a knock. Fasteners get checked along the run.',
                },
                {
                  name: 'Annual maintenance and tune-up',
                  text:
                    'One visit a year: balance corrected, hinges and bearings lubricated with the right grade, fasteners torqued, cables inspected end to end, weather seal examined, safety reverse tested against an obstruction. You get told what is wearing and roughly how long it has left.',
                },
              ],
            },
            {
              symptom: 'The opener will not listen',
              lead:
                'Sometimes the door is fine and the electronics are not. Worth separating the two before anything gets replaced.',
              services: [
                {
                  name: 'Opener repair and installation',
                  text:
                    'We start by disconnecting the opener and working the door by hand, because one straining against an unbalanced door will keep failing whatever we do to it. From there it is a real diagnosis — logic board, capacitor, gear and sprocket, travel and force settings, safety sensor alignment, remote and keypad pairing. If a replacement is genuinely the answer we will say which drive suits the door and why.',
                },
              ],
            },
            {
              symptom: 'The door itself is damaged or dated',
              lead:
                'Structure rather than mechanism. A dented or rotted section changes how the whole door tracks, so it is worth addressing properly.',
              services: [
                {
                  name: 'Panel replacement',
                  text:
                    'A single damaged section can usually be swapped without touching the rest of the door, provided the model is still available and the neighbouring sections are sound. We check squareness and hinge condition across every joint first. Where no match exists we will tell you, rather than fitting something close and hoping.',
                },
                {
                  name: 'New residential door installation',
                  text:
                    'Old door and hardware out, opening measured, headroom, backroom and side clearance confirmed against the new build. Track and spring are specified to the finished weight rather than assumed from the old door. We set the seal to the floor as it actually sits, then hand over the balance figures.',
                },
              ],
            },
            {
              symptom: 'It is a bay door, and downtime costs money',
              lead:
                'Commercial hardware runs a different duty cycle and fails differently. Scheduled work outside your operating hours where that helps.',
              services: [
                {
                  name: 'Commercial and roll-up doors',
                  text:
                    'Sectional and roll-up shutters, counterbalance rebuilds, drum and shaft work, jackshaft operators, and the safety edges and photo-eyes that go with them. We record cycle counts where the operator reports them, so maintenance is planned against real duty instead of a calendar.',
                },
              ],
            },
          ],
          cta: { primary: 'Call (405) 555-0163', secondary: 'Request a callback' },
        },
        {
          id: 's04-top-rated-roofing-contractor-in-tu',
          refSection: 's04-top-rated-roofing-contractor-in-tu',
          cls: 'ADAPTED',
          heading: 'EVERY REPAIR IS BUILT TO BE THE LAST ONE THIS DOOR NEEDS',
          body: ['Book a free estimate, or call and talk to the person who will do the work.'],
        },
        {
          id: 's06',
          refSection: 's06',
          cls: 'ADAPTED',
          heading: 'What we can document',
          body: [
            'Licensed, bonded and insured for residential and light commercial garage door work in the state of Oklahoma.',
            'Ask us what we carry and we will show you the paperwork on the day. We also hold manufacturer training on the major residential opener brands.',
          ],
          chips: [
            'Licensed',
            'Bonded',
            'Insured',
            'Factory-trained technicians',
          ],
        },
        {
          id: 's08',
          refSection: 's08',
          cls: 'FIDELITY',
        },
        {
          id: 's09-we-make-it-easy-to-get-the-job-don',
          refSection: 's09-we-make-it-easy-to-get-the-job-don',
          cls: 'ADAPTED',
          heading: 'Five steps, and none of them wasted.',
          subheading: 'From the first phone call to the final test cycle.',
          items: [
            { title: 'You call', text: 'Describe the symptom. A person picks up and asks the right questions.' },
            { title: 'We look', text: 'On-site diagnosis of what failed, not a guess from the driveway.' },
            { title: 'You decide', text: 'Free estimate, written down, with the reasoning explained.' },
            { title: 'We fix it', text: 'Parts matched to the door as built, tension set by measurement.' },
            { title: 'We test it', text: 'Full cycles, balance check, safety reverse, then we show you.' },
          ],
        },
        {
          // MOVED: reference section 12, now built after the process band. Structural change #2.
          id: 's12-the-proof-is-in-the-numbers-vh1-g',
          refSection: 's12-the-proof-is-in-the-numbers-vh1-g',
          cls: 'ADAPTED',
          heading: 'The numbers we publish are the ones we can prove.',
          stats: [
            { value: '4,800+', label: 'doors serviced' },
            { value: '11', label: 'years working' },
            { value: '6', label: 'technicians' },
          ],
        },
        {
          // MOVED: reference section 10, now built after the stat strip. Structural change #3.
          id: 's10-your-roof-our-reputation',
          refSection: 's10-your-roof-our-reputation',
          cls: 'ADAPTED',
          heading: 'Your door, our workmanship.',
          body: [
            'Edmond weather is hard on hardware. Cold mornings stiffen springs, summer heat swells timber, and grit works into every bearing on the run. We set tension by measurement rather than by feel, replace what is worn instead of adjusting around it, and cycle the door until it runs quiet.',
          ],
          cta: { primary: 'Call (405) 555-0163', secondary: 'Request a callback' },
        },
        {
          id: 's11-hundreds-of-oklahoman-s-rate-vh1-5',
          refSection: 's11-hundreds-of-oklahoman-s-rate-vh1-5',
          cls: 'ADAPTED',
          heading: 'What people say once the door has run a while',
          subheading: 'Illustrative customer feedback, shared for tone and format only.',
          quotes: TESTIMONIALS,
        },
        {
          id: 'home-map',
          refSection: null,
          cls: 'NOVEL',
          heading: 'Where we work',
          body: ['Serving Edmond and the north Oklahoma City metro.'],
          cta: { secondary: 'Get directions' },
          note: 'Map embedded by coordinates only, zoom 13.',
        },
        {
          id: 'home-nap-hours',
          refSection: null,
          cls: 'NOVEL',
          heading: 'Hours and where to reach us',
          body: [
            'Open seven days a week, 7:00 AM to 7:00 PM. One block of hours, the same every day, and a person on the other end of the phone during all of them.',
          ],
          items: [
            { title: 'Phone', text: '(405) 555-0163' },
            { title: 'Address', text: '2317 Harrow Bend, Edmond, OK 73013' },
            { title: 'Hours', text: '7 days, 7:00 AM – 7:00 PM' },
          ],
        },
        {
          id: 'mobile-call-bar',
          refSection: null,
          cls: 'NOVEL',
          cta: { primary: 'Call (405) 555-0163' },
        },
        {
          id: 's16',
          refSection: 's16',
          cls: 'ADAPTED',
          heading: 'Atlas Garage Door Repair',
          body: ['Serving Edmond and the north Oklahoma City metro.'],
          items: [
            { title: 'Phone', text: '(405) 555-0163' },
            { title: 'Address', text: '2317 Harrow Bend, Edmond, OK 73013' },
            { title: 'Hours', text: '7 days, 7:00 AM – 7:00 PM' },
            { title: 'Pages', text: 'Home · About · Services · Contact · Privacy' },
          ],
          note: 'Privacy Policy',
        },
      ],
    },

    // =====================================================================
    '/about': {
      meta: {
        title: 'About Atlas Garage Door Repair | Edmond, OK',
        description:
          'Who we are and how we work: measured diagnosis, parts matched to the door as built, and a cycle test before we leave. Serving Edmond and north Oklahoma City.',
      },
      sections: [
        { id: 's00-top-header', refSection: 's00-top-header', cls: 'FIDELITY', body: ['Open daily 7am–7pm'] },
        {
          id: 's01-main-header',
          refSection: 's01-main-header',
          cls: 'ADAPTED',
          items: [
            { title: 'Home', text: '/' },
            { title: 'About', text: '/about' },
            { title: 'Services', text: '/services' },
            { title: 'Contact', text: '/contact' },
            { title: 'Privacy', text: '/privacy' },
          ],
          cta: { primary: 'Call (405) 555-0163' },
        },
        { id: 's02', refSection: 's02', cls: 'FIDELITY' },
        {
          id: 's03-about-vh1-roofing',
          refSection: 's03-about-vh1-roofing',
          cls: 'ADAPTED',
          heading: 'About Atlas Garage Door Repair',
          subheading: 'Edmond, Oklahoma',
        },
        { id: 's04', refSection: 's04', cls: 'FIDELITY' },
        {
          id: 's05-our-mission',
          refSection: 's05-our-mission',
          cls: 'ADAPTED',
          heading: 'How we work',
          body: [
            'We are a garage door repair company in Edmond, and the whole of what we sell is that the fix lasts. Not a faster van, not a bigger advert. A door that still runs right in two years.',
            'That sounds modest until you watch how much of this trade works the other way. A spring is adjusted rather than replaced. A door is lifted back onto its track without anyone asking what pulled it off. Rollers get oiled when the bearings inside them have already collapsed. All of it clears the call, and all of it comes back.',
            'So we do the slower version. We disconnect the opener and move the door by hand, because a balance problem masquerades as an electronics problem more often than not. We match parts to the door as it was actually built rather than to whatever was fitted last. We set spring tension by turn count and then check it by hand at three heights.',
            'And we test before we leave — full cycles, safety reverse against an obstruction, seal to the floor as it really sits. Then we tell you what we changed, what we deliberately left alone, and what is going to want attention in a year. None of that is difficult. It is just slower than clearing the call and driving off, and it is the only version of this job worth charging for.',
            'Founded in 2015 out of a single service van, Atlas Garage Door Repair has grown one referral at a time rather than one advertisement at a time — still the same standard, just more trucks carrying it.',
          ],
        },
        {
          id: 's06-reliable-roofing-professionals',
          refSection: 's06-reliable-roofing-professionals',
          cls: 'ADAPTED',
          heading: 'Why measurement beats judgement',
          body: [
            'A garage door is the heaviest moving object in most homes, and it is held in check by components under enormous stored energy. Nearly every dangerous failure on one starts as something small that somebody eyeballed instead of measuring.',
            'Balance is the clearest example. Lift a correctly counterbalanced door halfway by hand and let go, and it stays put. If it drifts down, the spring is under-wound or tired and the opener is quietly carrying weight it was never designed to carry. If it climbs, it is over-wound. Either way you can feel it in ten seconds — but only if you disconnect the opener first and actually check.',
            'The same applies to cables, roller bearings, hinge wear and track spacing. Each has a condition you can inspect and a number you can hold it to. We use those numbers, we write down what we found, and we leave you with the figures rather than a reassurance.',
          ],
        },
        {
          id: 's07-our-team',
          refSection: 's07-our-team',
          cls: 'ADAPTED',
          heading: 'Who turns up',
          body: [
            'The person who arrives at your house does the diagnosis, does the work, and answers for it afterwards. There is no handover between someone who sells and someone who fixes, which removes the gap where most of the pressure in this trade lives.',
            'Six technicians, all factory-trained on the major residential opener brands and cross-trained on commercial roll-up hardware, with a dispatcher coordinating the schedule so the closest available tech takes the call rather than whoever is next on a list.',
            'What we will commit to now: whoever comes out explains what failed before touching it, shows you the worn part once it is off, and will tell you plainly when a repair is not worth doing on a door of that age. Nobody here earns more by selling you a bigger job, which is the only structural reason that promise can be kept.',
          ],
        },
        {
          id: 's08-our-services',
          refSection: 's08-our-services',
          cls: 'ADAPTED',
          heading: 'What we handle',
          subheading: 'Sorted by symptom, because that is how the call usually starts. The same eight jobs appear on the services page with more detail on each.',
          groups: [
            {
              symptom: 'It will not close',
              lead: 'Counterbalance and guide-path failures.',
              services: [
                { name: 'Spring repair and replacement', text: 'Torsion and extension systems, sized to the door as built and set by turn count.' },
                { name: 'Off-track and misaligned door correction', text: 'The door comes back on, and the reason it left gets fixed too.' },
              ],
            },
            {
              symptom: 'It sounds wrong',
              lead: 'Wear you can still get ahead of.',
              services: [
                { name: 'Cable, roller and track repair', text: 'Cables replaced in pairs, sealed-bearing rollers, dressed or swapped track.' },
                { name: 'Annual maintenance and tune-up', text: 'Balance, lubrication, fasteners, seal, and a safety reverse test once a year.' },
              ],
            },
            {
              symptom: 'The opener will not listen',
              lead: 'Electronics separated from mechanics before anything is replaced.',
              services: [
                { name: 'Opener repair and installation', text: 'Boards, gears, travel and force settings, sensors, remotes and keypads.' },
              ],
            },
            {
              symptom: 'The door is damaged or dated',
              lead: 'Structure rather than mechanism.',
              services: [
                { name: 'Panel replacement', text: 'Single sections swapped where the model is still available and the rest is sound.' },
                { name: 'New residential door installation', text: 'Opening measured, clearances confirmed, spring specified to finished weight.' },
              ],
            },
            {
              symptom: 'It is a bay door',
              lead: 'Different duty cycle, different failure modes.',
              services: [
                { name: 'Commercial and roll-up doors', text: 'Shutters, counterbalance rebuilds, jackshaft operators, safety edges.' },
              ],
            },
          ],
        },
        { id: 's09', refSection: 's09', cls: 'FIDELITY' },
        {
          id: 's10',
          refSection: 's10',
          cls: 'ADAPTED',
          heading: 'Talk to someone who does the work',
          body: [
            'Free estimate, seven days a week, 7:00 AM to 7:00 PM. Tell us what the door is doing and we will tell you what it needs before anything is ordered.',
          ],
          cta: { primary: 'Call (405) 555-0163', secondary: 'Request a callback' },
        },
        {
          id: 's11',
          refSection: 's11',
          cls: 'ADAPTED',
          heading: 'Atlas Garage Door Repair',
          body: ['Serving Edmond and the north Oklahoma City metro.'],
          items: [
            { title: 'Phone', text: '(405) 555-0163' },
            { title: 'Address', text: '2317 Harrow Bend, Edmond, OK 73013' },
            { title: 'Hours', text: '7 days, 7:00 AM – 7:00 PM' },
            { title: 'Pages', text: 'Home · About · Services · Contact · Privacy' },
          ],
          note: 'Privacy Policy',
        },
      ],
    },

    // =====================================================================
    '/services': {
      meta: {
        title: 'Garage Door Services | Atlas Garage Door Repair, Edmond OK',
        description:
          'Springs, openers, cables, rollers, tracks, panels, new doors and commercial roll-ups. Grouped by symptom so you can find yours fast. Free estimate.',
      },
      sections: [
        { id: 's00-top-header', refSection: 's00-top-header', cls: 'FIDELITY', body: ['Open daily 7am–7pm'] },
        {
          id: 's01-main-header',
          refSection: 's01-main-header',
          cls: 'ADAPTED',
          items: [
            { title: 'Home', text: '/' },
            { title: 'About', text: '/about' },
            { title: 'Services', text: '/services' },
            { title: 'Contact', text: '/contact' },
            { title: 'Privacy', text: '/privacy' },
          ],
          cta: { primary: 'Call (405) 555-0163' },
        },
        { id: 's02', refSection: 's02', cls: 'FIDELITY' },
        {
          id: 's03-roofing-services',
          refSection: 's03-roofing-services',
          cls: 'ADAPTED',
          heading: 'Garage Door Services',
          body: ['Eight jobs, grouped by what the door is actually doing right now'],
        },
        {
          id: 'services-anchor-nav',
          refSection: null,
          cls: 'NOVEL',
          heading: 'Jump to your symptom',
          items: [
            { title: 'It will not close', text: '#will-not-close' },
            { title: 'It sounds wrong', text: '#sounds-wrong' },
            { title: 'The opener will not listen', text: '#opener' },
            { title: 'Damaged or dated', text: '#damaged' },
            { title: 'Commercial', text: '#commercial' },
          ],
        },
        {
          id: 's04-call-918-630-7788-405-760-9814',
          refSection: 's04-call-918-630-7788-405-760-9814',
          cls: 'ADAPTED',
          heading: 'CALL (405) 555-0163',
          subheading: 'Free estimate, seven days',
          groups: [
            {
              symptom: 'It will not close, or it closes crooked',
              lead: 'Counterbalance or guide path. Scheduled first, because it strands cars.',
              services: [
                { name: 'Spring repair and replacement', text: 'Wire size, diameter and length matched to the door as built, tension set by turn count.' },
                { name: 'Off-track and misaligned door correction', text: 'Track straightened or replaced, runs checked for level and plumb, and the cause fixed, not just the symptom.' },
              ],
            },
            {
              symptom: 'It runs, but it sounds wrong',
              lead: 'Noise is early warning.',
              services: [
                { name: 'Cable, roller and track repair', text: 'Cables replaced in pairs so the drums stay in phase, sealed-bearing rollers, dented sections dressed or swapped.' },
                { name: 'Annual maintenance and tune-up', text: 'Balance corrected, bearings lubricated, fasteners torqued, cables inspected, safety reverse tested.' },
              ],
            },
            {
              symptom: 'The opener will not listen',
              lead: 'Electronics separated from mechanics first.',
              services: [
                { name: 'Opener repair and installation', text: 'Door worked by hand first, then a real diagnosis: board, gear, travel and force settings, sensors, remotes.' },
              ],
            },
            {
              symptom: 'The door itself is damaged or dated',
              lead: 'Structure, not mechanism.',
              services: [
                { name: 'Panel replacement', text: 'Single sections swapped where the model is available and the neighbours are sound.' },
                { name: 'New residential door installation', text: 'Opening measured, clearances confirmed, track and spring specified to finished weight, seal set to the real floor.' },
              ],
            },
            {
              symptom: 'It is a bay door, and downtime costs money',
              lead: 'Different duty cycle.',
              services: [
                { name: 'Commercial and roll-up doors', text: 'Shutters, counterbalance rebuilds, drum and shaft work, jackshaft operators, safety edges and photo-eyes.' },
              ],
            },
          ],
          cta: { primary: 'Call (405) 555-0163', secondary: 'Request a callback' },
        },
        {
          id: 's05-we-get-the-job-done',
          refSection: 's05-we-get-the-job-done',
          cls: 'ADAPTED',
          heading: 'THE REPAIR HOLDS',
          body: ['MEASURED, FITTED AND CYCLE-TESTED ACROSS EDMOND AND NORTH OKLAHOMA CITY'],
        },
        {
          id: 's06-faq-s',
          refSection: 's06-faq-s',
          cls: 'ADAPTED',
          heading: 'Questions worth asking',
          items: [
            {
              title: 'How do I know whether the spring is the problem?',
              text: 'Pull the release cord, lift the door halfway by hand and let go. A balanced door stays put. If it drops the spring is tired; if it rises it is over-wound.',
            },
            {
              title: 'Why does my door reverse before it touches the floor?',
              text: 'Usually the photo-eyes are misaligned or dirty, or the close force is set too tight. Both are adjustments rather than replacements.',
            },
            {
              title: 'Can one damaged panel be replaced on its own?',
              text: 'Often, if the model is still made and the sections either side are square and sound. Where no match exists we say so.',
            },
            {
              title: 'What makes a door suddenly loud?',
              text: 'Flattened roller bearings, loose hinge fasteners, or a dented track section — wear you can still get ahead of.',
            },
          ],
        },
        {
          id: 's07',
          refSection: 's07',
          cls: 'ADAPTED',
          heading: 'Talk to someone who does the work',
          body: [
            'Free estimate, seven days a week, 7:00 AM to 7:00 PM. Tell us what the door is doing and we will tell you what it needs before anything is ordered.',
          ],
          cta: { primary: 'Call (405) 555-0163', secondary: 'Request a callback' },
        },
        {
          id: 's08',
          refSection: 's08',
          cls: 'ADAPTED',
          heading: 'Atlas Garage Door Repair',
          body: ['Serving Edmond and the north Oklahoma City metro.'],
          items: [
            { title: 'Phone', text: '(405) 555-0163' },
            { title: 'Address', text: '2317 Harrow Bend, Edmond, OK 73013' },
            { title: 'Hours', text: '7 days, 7:00 AM – 7:00 PM' },
            { title: 'Pages', text: 'Home · About · Services · Contact · Privacy' },
          ],
          note: 'Privacy Policy',
        },
      ],
    },

    // =====================================================================
    '/contact': {
      meta: {
        title: 'Contact Atlas Garage Door Repair | (405) 555-0163',
        description:
          'Call (405) 555-0163 or ask for a callback. Open seven days, 7:00 AM to 7:00 PM, serving Edmond and the north Oklahoma City metro. Free estimate.',
      },
      sections: [
        { id: 's00-top-header', refSection: 's00-top-header', cls: 'FIDELITY', body: ['Open daily 7am–7pm'] },
        {
          id: 's01-main-header',
          refSection: 's01-main-header',
          cls: 'ADAPTED',
          items: [
            { title: 'Home', text: '/' },
            { title: 'About', text: '/about' },
            { title: 'Services', text: '/services' },
            { title: 'Contact', text: '/contact' },
            { title: 'Privacy', text: '/privacy' },
          ],
          cta: { primary: 'Call (405) 555-0163' },
        },
        {
          id: 's02-vh1-is-proud-to-support-employ-v',
          refSection: 's02-vh1-is-proud-to-support-employ-v',
          cls: 'ADAPTED',
          heading: 'The repair holds. That is the whole promise.',
        },
        {
          id: 's03',
          refSection: 's03',
          cls: 'ADAPTED',
          heading: 'Ask us to call you back',
          subheading:
            'Quickest route is the phone — a person answers it between 7:00 AM and 7:00 PM, every day. If it suits you better, leave your details and a window, and we will ring you inside it.',
          fields: [
            { label: 'Your name', hint: 'So we know who to ask for.' },
            { label: 'Phone number', hint: 'Ten digits. This is the only way we will contact you.' },
            {
              label: 'What is the door doing?',
              hint: 'Pick the closest match.',
              options: [
                'It will not close, or it closes crooked',
                'It runs, but it sounds wrong',
                'The opener will not listen',
                'The door is damaged or dated',
                'Commercial or roll-up door',
                'Annual maintenance and tune-up',
                'Something else',
              ],
            },
            {
              label: 'Best window to call',
              hint: 'We keep to it.',
              options: ['Morning, 7:00 AM – 11:00 AM', 'Midday, 11:00 AM – 3:00 PM', 'Afternoon, 3:00 PM – 7:00 PM', 'Any time today'],
            },
            { label: 'Anything else worth knowing', hint: 'Noises, when it started, what changed. Optional.' },
          ],
          cta: { primary: 'Request a callback', secondary: 'Call (405) 555-0163', note: 'No account, no obligation, and a free estimate either way.' },
          body: [
            'We collect no email address anywhere on this site, and there is no mailing list to leave. A phone number is all we take, and it is used only to return your call.',
          ],
          items: [
            { title: 'Phone', text: '(405) 555-0163' },
            { title: 'Address', text: '2317 Harrow Bend, Edmond, OK 73013' },
            { title: 'Hours', text: '7 days, 7:00 AM – 7:00 PM' },
            { title: 'Area', text: 'Serving Edmond and the north Oklahoma City metro.' },
          ],
        },
        {
          id: 'contact-map',
          refSection: null,
          cls: 'NOVEL',
          heading: 'Find us',
          body: ['2317 Harrow Bend, Edmond, OK 73013'],
          cta: { secondary: 'Get directions' },
          note: 'Map embedded by coordinates only, zoom 15.',
        },
        {
          id: 's04',
          refSection: 's04',
          cls: 'ADAPTED',
          heading: 'Atlas Garage Door Repair',
          body: ['Serving Edmond and the north Oklahoma City metro.'],
          items: [
            { title: 'Phone', text: '(405) 555-0163' },
            { title: 'Address', text: '2317 Harrow Bend, Edmond, OK 73013' },
            { title: 'Hours', text: '7 days, 7:00 AM – 7:00 PM' },
            { title: 'Pages', text: 'Home · About · Services · Contact · Privacy' },
          ],
          note: 'Privacy Policy',
        },
      ],
    },

    // =====================================================================
    '/privacy': {
      meta: {
        title: 'Privacy Policy | Atlas Garage Door Repair',
        description:
          'What this site collects, which is very little: a name, a phone number and a callback window. No email, no analytics, no tracking cookies, nothing sold.',
      },
      sections: [
        { id: 's00-top-header', refSection: 's00-top-header', cls: 'FIDELITY', body: ['Open daily 7am–7pm'] },
        {
          id: 's01-main-header',
          refSection: 's01-main-header',
          cls: 'ADAPTED',
          items: [
            { title: 'Home', text: '/' },
            { title: 'About', text: '/about' },
            { title: 'Services', text: '/services' },
            { title: 'Contact', text: '/contact' },
            { title: 'Privacy', text: '/privacy' },
          ],
          cta: { primary: 'Call (405) 555-0163' },
        },
        {
          id: 's02-privacy-policy-and-terms-and-condi',
          refSection: 's02-privacy-policy-and-terms-and-condi',
          cls: 'ADAPTED',
          heading: 'Privacy Policy and Terms of Use',
          subheading: 'And what it does not collect',
        },
        {
          id: 's03',
          refSection: 's03',
          cls: 'NOVEL',
          heading: 'Privacy Policy',
          subheading: 'This describes what the site actually does, and nothing it does not.',
          items: [
            {
              title: 'What we collect',
              text: 'Only what you type into the callback form: a name, a phone number, the service you selected, a preferred callback window, and any message you add. Nothing else is gathered from you, and nothing is inferred about you.',
            },
            {
              title: 'We do not collect email addresses',
              text: 'This site has no email field, no mailing list and no marketing messages of any kind. If you want to reach us in writing, call the number and ask. Nothing here signs you up for anything, so there is nothing to opt out of later.',
            },
            {
              title: 'How the form works',
              text: 'The form validates in your browser and is not currently wired to a submission target, so what you type is not transmitted or stored anywhere. Until that changes, call (405) 555-0163 to be certain of reaching us.',
            },
            {
              title: 'Analytics, cookies and tracking',
              text: 'None. No analytics product, no advertising or social pixels, no chat widget, no heat mapping, no cookie banner because there are no tracking cookies to consent to. The site framework may set a cookie needed to serve pages; it does not identify you and is not read by us or anyone else.',
            },
            {
              title: 'The map',
              text: 'Pages carrying a map embed one from Google by geographic coordinates. It loads only when you scroll to it. Google may receive your IP address and set its own cookies at that point, under its own policy rather than ours. We pass no information about you to it.',
            },
            {
              title: 'What we do with your phone number',
              text: 'We call you back about the job you asked about. We do not sell it, rent it, trade it, or hand it to a marketing partner, and we do not use it for campaigns you did not ask for.',
            },
            {
              title: 'How long we keep things',
              text: 'For as long as the job and any follow-up need it, then no longer. Ask us to delete your details and we will, unless a record has to be kept for accounting or legal reasons.',
            },
            {
              title: 'Children',
              text: 'This site is aimed at homeowners and businesses and is not directed at children. We do not knowingly collect information from anyone under thirteen.',
            },
            {
              title: 'Changes to this policy',
              text: 'If what the site does changes, this page changes with it, and the change is made here rather than announced somewhere else. The version you are reading is the current one.',
            },
            {
              title: 'Contact',
              text: 'Atlas Garage Door Repair, 2317 Harrow Bend, Edmond, OK 73013. Phone (405) 555-0163, seven days a week, 7:00 AM to 7:00 PM.',
            },
          ],
          note: 'UNREVIEWED TEMPLATE — requires legal review before launch. No GDPR or CCPA compliance is claimed.',
        },
        {
          id: 's04',
          refSection: 's04',
          cls: 'ADAPTED',
          heading: 'Talk to someone who does the work',
          body: [
            'Free estimate, seven days a week, 7:00 AM to 7:00 PM. Tell us what the door is doing and we will tell you what it needs before anything is ordered.',
          ],
          cta: { primary: 'Call (405) 555-0163', secondary: 'Request a callback' },
        },
        {
          id: 's05',
          refSection: 's05',
          cls: 'ADAPTED',
          heading: 'Atlas Garage Door Repair',
          body: ['Serving Edmond and the north Oklahoma City metro.'],
          items: [
            { title: 'Phone', text: '(405) 555-0163' },
            { title: 'Address', text: '2317 Harrow Bend, Edmond, OK 73013' },
            { title: 'Hours', text: '7 days, 7:00 AM – 7:00 PM' },
            { title: 'Pages', text: 'Home · About · Services · Contact · Privacy' },
          ],
          note: 'Privacy Policy',
        },
      ],
    },
  },
};

export default copy;
