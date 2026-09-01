// The in-page probe. Runs in the browser context; returns plain JSON.
// One source of truth for BOTH sides (reference and ours) so metrics are comparable.
export const PROBE = () => {
  const px = (v) => (v == null ? null : Math.round(parseFloat(v) * 100) / 100);
  const cs = (el) => getComputedStyle(el);

  // ---- section segmentation -------------------------------------------------
  // A "section" is a top-level banded block. We take the outermost wrapper in the
  // page flow, so a WP/Elementor tree and a hand-rolled Next tree segment alike.
  // Prioritized candidates: first framework selector that yields a real band count wins.
  // Divi (the reference) uses .et_pb_section; ours will use body/main > section.
  const CANDIDATES = [
    '.et_pb_section',                                  // Divi
    '.elementor-top-section, .elementor-section',      // Elementor
    'main > section, body > main > section',           // hand-rolled (ours)
    'body > section, [data-section]',
  ];
  const CHROME = 'header, #main-header, .et-l--header, #top-header, footer, #main-footer, .et-l--footer, [class*=call-bar], [class*=callbar]';

  let nodes = [];
  let segMode = 'fallback';
  for (const sel of CANDIDATES) {
    const hit = Array.from(document.querySelectorAll(sel))
      .filter((n) => { const r = n.getBoundingClientRect(); return r.height > 8 && r.width > 8; });
    const outer = hit.filter((n) => !hit.some((m) => m !== n && m.contains(n)));
    if (outer.length >= 2) { nodes = outer; segMode = sel; break; }
  }
  // Header / footer / sticky call bar are sections in their own right.
  const chrome = Array.from(document.querySelectorAll(CHROME))
    .filter((n) => { const r = n.getBoundingClientRect(); return r.height > 8; });
  const outerChrome = chrome.filter((n) => !chrome.some((m) => m !== n && m.contains(n)));
  for (const c of outerChrome) if (!nodes.some((n) => n === c || n.contains(c) || c.contains(n))) nodes.push(c);

  if (!nodes.length) {
    nodes = Array.from(document.body.children).filter(
      (n) => n.nodeType === 1 && !['SCRIPT', 'STYLE', 'NOSCRIPT', 'LINK'].includes(n.tagName)
    );
  }
  // Drop the scroll-to-top pip and other sub-40px chrome artifacts.
  nodes = nodes.filter((n) => {
    const r = n.getBoundingClientRect();
    return !(r.height < 60 && r.width < 120);
  });
  nodes.sort((a, b) => {
    const A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
    return (A.top + window.scrollY) - (B.top + window.scrollY);
  });

  const idOf = (el, i) => {
    const explicit = el.id || el.getAttribute('data-section') || el.getAttribute('data-id') || '';
    const h = el.querySelector('h1,h2,h3');
    const txt = (h ? h.textContent : '' || '').trim().toLowerCase().replace(/\s+/g, '-').slice(0, 34);
    let out = 's' + String(i).padStart(2, '0');
    if (explicit) out += '-' + explicit;
    if (txt) out += '-' + txt;
    return out.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/-+$/, '');
  };

  // ---- appearance: everything a geometry-only audit is blind to -------------
  const appearance = (el) => {
    const s = cs(el);
    return {
      color: s.color, backgroundColor: s.backgroundColor,
      backgroundImage: s.backgroundImage.slice(0, 240),
      backgroundSize: s.backgroundSize, backgroundPosition: s.backgroundPosition,
      fontFamily: s.fontFamily, fontSize: px(s.fontSize), fontWeight: s.fontWeight,
      lineHeight: s.lineHeight === 'normal' ? 'normal' : px(s.lineHeight),
      letterSpacing: s.letterSpacing === 'normal' ? 0 : px(s.letterSpacing),
      textTransform: s.textTransform, opacity: parseFloat(s.opacity),
      borderTopWidth: px(s.borderTopWidth), borderBottomWidth: px(s.borderBottomWidth),
      borderLeftWidth: px(s.borderLeftWidth), borderRightWidth: px(s.borderRightWidth),
      borderColor: s.borderTopColor, borderStyle: s.borderTopStyle,
      borderRadius: s.borderRadius, boxShadow: s.boxShadow.slice(0, 200),
      paddingTop: px(s.paddingTop), paddingBottom: px(s.paddingBottom),
      paddingLeft: px(s.paddingLeft), paddingRight: px(s.paddingRight),
      marginTop: px(s.marginTop), marginBottom: px(s.marginBottom),
      display: s.display, position: s.position, zIndex: s.zIndex, overflow: s.overflow,
      gridTemplateColumns: s.gridTemplateColumns, gap: s.gap,
      flexDirection: s.flexDirection, flexWrap: s.flexWrap,
      alignItems: s.alignItems, justifyContent: s.justifyContent, textAlign: s.textAlign,
    };
  };

  const geometry = (el) => {
    const r = el.getBoundingClientRect();
    const sy = window.scrollY, sx = window.scrollX;
    return {
      x: px(r.left + sx), y: px(r.top + sy), w: px(r.width), h: px(r.height),
      docTop: px(r.top + sy), docBottom: px(r.bottom + sy),
    };
  };

  // Inner grid geometry: the child boxes that define the section's rhythm.
  const innerGrid = (el) => {
    const kids = Array.from(el.querySelectorAll(':scope > *, :scope > * > *'))
      .filter((k) => { const r = k.getBoundingClientRect(); return r.width > 24 && r.height > 24; })
      .slice(0, 24);
    return kids.map((k) => {
      const g = geometry(k);
      return { tag: k.tagName.toLowerCase(), x: g.x, y: g.y, w: g.w, h: g.h };
    });
  };

  const isHidden = (n) => {
    const s = cs(n);
    return s.clip === 'rect(0px, 0px, 0px, 0px)' || s.clipPath === 'inset(100%)' ||
      parseFloat(s.height) <= 1 || s.visibility === 'hidden';
  };

  // ---- headings + split-text signature -------------------------------------
  const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map((h) => {
    const t = (h.textContent || '').trim();
    return {
      tag: h.tagName.toLowerCase(),
      text: t.slice(0, 180),
      chars: t.length,
      spanCount: h.querySelectorAll('span').length,
      splitCount: h.querySelectorAll('[class*=char],[class*=word],[class*=line]').length,
      // a visually-hidden duplicate of the same text = split-library signature
      hiddenDupe: !!Array.from(h.querySelectorAll('*')).find(
        (n) => isHidden(n) && (n.textContent || '').trim() === t && t.length > 0
      ),
      appearance: appearance(h),
      box: geometry(h),
      outerHTML: h.outerHTML.slice(0, 900),
    };
  });

  // ---- state / interactivity inventory -------------------------------------
  const q = (s) => document.querySelectorAll(s).length;
  const state = {
    forms: Array.from(document.querySelectorAll('form')).map((f) => ({
      action: f.getAttribute('action') || '', method: f.method,
      fields: Array.from(f.querySelectorAll('input,select,textarea')).map((i) => ({
        tag: i.tagName.toLowerCase(), type: i.type || null, name: i.name || null,
        required: i.required, placeholder: i.placeholder || null,
      })),
    })),
    navToggles: q('[aria-expanded],.menu-toggle,.hamburger,[class*=burger],[class*=nav-toggle],[class*=menu-toggle]'),
    accordions: q('details,[class*=accordion],[class*=toggle-title],.elementor-toggle-item,.elementor-tab-title'),
    tabs: q('[role=tab],[class*=tabs__],.elementor-tab-desktop-title'),
    carousels: q('[class*=swiper],[class*=slick],[class*=carousel],[class*=glide],[class*=splide]'),
    videos: q('video'), iframes: q('iframe'),
    stickyEls: Array.from(document.querySelectorAll('header,nav,[class*=sticky],[class*=fixed],[class*=call]'))
      .filter((e) => ['sticky', 'fixed'].includes(cs(e).position))
      .map((e) => ({
        tag: e.tagName.toLowerCase(), cls: (e.className || '').toString().slice(0, 90),
        position: cs(e).position, z: cs(e).zIndex, h: px(e.getBoundingClientRect().height),
      })),
    telLinks: Array.from(document.querySelectorAll('a[href^="tel:"]')).map((a) => a.getAttribute('href')),
    mailtoLinks: Array.from(document.querySelectorAll('a[href^="mailto:"]')).map((a) => a.getAttribute('href')),
    emailInputs: q('input[type=email]'),
    maps: Array.from(document.querySelectorAll('iframe'))
      .map((f) => (f.src || f.getAttribute('data-src') || '').slice(0, 160))
      .filter((s) => /map/i.test(s)),
  };

  // ---- motion signature: scroll-linked, time-driven, or neither? ------------
  const libs = {
    gsap: !!window.gsap,
    ScrollTrigger: !!(window.ScrollTrigger || (window.gsap && window.gsap.ScrollTrigger)),
    lenis: !!(window.Lenis || window.lenis),
    locomotive: !!window.LocomotiveScroll,
    aos: !!window.AOS, wow: !!window.WOW, swiper: !!window.Swiper,
    slick: !!(window.jQuery && window.jQuery.fn && window.jQuery.fn.slick),
    elementorMotionFx: q('[data-settings*="motion_fx"]'),
    elementorAnimation: q('[class*=elementor-animation-]'),
    elementorEntranceAnim: q('[data-settings*="_animation"]'),
    aosAttrs: q('[data-aos]'),
    parallaxAttrs: q('[data-parallax],[class*=parallax],[data-speed]'),
    cssAnimatedEls: Array.from(document.querySelectorAll('*')).filter((e) => {
      const s = cs(e); return s.animationName && s.animationName !== 'none';
    }).length,
    willChangeTransform: Array.from(document.querySelectorAll('*'))
      .filter((e) => /transform/.test(cs(e).willChange)).length,
    inlineOnScroll: !!window.onscroll,
  };

  const sections = nodes.map((el, i) => ({
    idx: i,
    id: idOf(el, i),
    tag: el.tagName.toLowerCase(),
    cls: (el.className || '').toString().slice(0, 140),
    box: geometry(el),
    appearance: appearance(el),
    innerGrid: innerGrid(el),
    headingText: ((el.querySelector('h1,h2,h3') || {}).textContent || '').trim().slice(0, 120),
    textChars: (el.textContent || '').replace(/\s+/g, ' ').trim().length,
    imgs: Array.from(el.querySelectorAll('img')).map((im) => ({
      src: (im.currentSrc || im.src || '').slice(0, 200),
      w: px(im.getBoundingClientRect().width), h: px(im.getBoundingClientRect().height),
      natW: im.naturalWidth, natH: im.naturalHeight,
      fit: cs(im).objectFit, loading: im.loading,
    })),
    listCounts: (() => {
      // Count only what is actually laid out. A display:none control is DOM, not layout,
      // and counting it makes a responsive shell diverge from a reference that hides the
      // same control a different way.
      const vis = (sel) => Array.from(el.querySelectorAll(sel))
        .filter((n) => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length;
      return {
        cards: vis('[class*=card],article,.elementor-widget-image-box,.elementor-widget-icon-box'),
        links: vis('a'),
        listItems: vis('li'),
        buttons: vis('button,.elementor-button,[class*=btn]'),
      };
    })(),
  }));

  return {
    url: location.href,
    title: document.title,
    viewport: { w: window.innerWidth, h: window.innerHeight },
    page: {
      scrollHeight: px(document.documentElement.scrollHeight),
      sectionCount: sections.length,
      segMode,
      bodyBg: cs(document.body).backgroundColor,
      bodyFont: cs(document.body).fontFamily,
      bodyFontSize: px(cs(document.body).fontSize),
      textChars: (document.body.textContent || '').replace(/\s+/g, ' ').trim().length,
    },
    sections, headings, state, libs,
  };
};
