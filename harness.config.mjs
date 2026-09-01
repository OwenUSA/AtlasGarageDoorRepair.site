// Per-site harness config -- Atlas Garage Door Repair.
// The shared harness at ../_shared/harness carries no site data by design.
// Everything reference-specific lives here. See _shared/harness/src/config.mjs for defaults.

export default {
  referenceOrigin: 'https://vh1roofing.com',
  devPort: 3101,

  // ONE route map. Locations pages are DELETED per D-02 and never captured.
  routeMap: {
    '/': '/',
    '/about-vh1/': '/about',
    '/services/': '/services',
    '/contact/': '/contact',
    '/privacy-policy/': '/privacy',
  },

  breakpoints: { diff: [390, 768, 1440], extra: [430], canonical: 1440 },

  // The reference is WordPress + Divi.
  sectionCandidates: ['.et_pb_section', 'main > section', 'section'],
  // EXACT selectors only -- see config.mjs validation and Atlas defect #1.
  chromeSelectors: ['header', '#main-header', '.et-l--header', '#top-header', 'footer', '#main-footer', '.et-l--footer'],
  headerSelector: '#main-header, .et-l--header, header',
  navToggleSelector: '.mobile_menu_bar, button[aria-controls]',
  drawerSelector: '.mobile_menu_bar, .mobile_nav, .et_mobile_menu, [data-drawer]',
  ctaSelector: 'a[href^="tel:"], .et_pb_button, button, [class*=btn], [class*=button]',
  logoSelector: '#logo, .et_pb_menu__logo img, #main-header img, header img',
  iconFontFamilies: /ETmodules|FontAwesome|dashicons|gform-icons/,

  thresholds: { fidelity: 2, struct: 5, token: 0 },
  fidelityMode: 'auto',

  tokenSources: ['src/app/globals.css'],
  contractPath: 'docs/sections.md',
  reportPath: 'docs/divergence.md',
  copyModulePath: 'content/copy.ts',

  industryAllowlist: [
    'garage door', 'torsion spring', 'extension spring', 'opener', 'cable', 'roller',
    'track', 'panel', 'off-track', 'remote', 'keypad', 'sensor', 'weather seal',
    'residential', 'commercial', 'same-day', 'free estimate', 'repair', 'installation',
    'replacement',
  ],
  gramN: 5,
  trigramMax: 0.15,
  lengthTolerance: 0.1,

  // Applied palette: seed 500656, analogous, plum/crimson.
  masterSeed: 20260901,
  gradientSamples: 5,
};
