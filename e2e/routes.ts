/**
 * Every route the e2e suite sweeps. Kept explicit (rather than derived from app
 * code) so a route silently disappearing from the app is caught as a test
 * failure rather than quietly shrinking the suite.
 */
export const SERVICE_SLUGS = [
  'workflow-strategy-assessment',
  'workflow-agents',
  'document-operations',
  'customer-operations',
  'internal-operations',
  'integrations-process-intelligence',
]

export const INDUSTRY_SLUGS = [
  'healthcare',
  'legal',
  'insurance',
  'accounting',
  'real-estate-property-management',
  'construction',
  'professional-services',
]

export const LEGAL_SLUGS = ['privacy', 'terms', 'security', 'dpa']

export const ROUTES: string[] = [
  '/',
  '/services',
  '/industries',
  '/blog',
  '/faq',
  ...SERVICE_SLUGS.map((s) => `/services/${s}`),
  ...INDUSTRY_SLUGS.map((s) => `/industries/${s}`),
  ...LEGAL_SLUGS.map((s) => `/${s}`),
]
