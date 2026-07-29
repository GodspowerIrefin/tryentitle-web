/**
 * Navigation model (PRD §6.1).
 *
 * Header: Services, Industries, Insights + the primary CTA (rendered separately as a
 * BookingButton, not as a nav link, so it stays visually distinct).
 *
 * Footer groups: Solutions (the 6 services), Industries (the 7 industries),
 * Company, Legal. Solutions and Industries are derived from the canonical data
 * so the footer can never drift from the source of truth.
 */
import { SERVICES } from './services'
import { INDUSTRIES } from './industries'
import { CONTACT } from '@/lib/constants'

export interface NavLink {
  label: string
  to: string
  /** External destinations render as <a>, not <RouterLink>. */
  external?: boolean
}

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Industries', to: '/industries' },
  { label: 'Blog', to: '/blog' },
]

export interface FooterGroup {
  heading: string
  links: NavLink[]
}

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    heading: 'Solutions',
    links: SERVICES.map((s) => ({ label: s.name, to: `/services/${s.slug}` })),
  },
  {
    heading: 'Industries',
    links: INDUSTRIES.map((i) => ({ label: i.name, to: `/industries/${i.slug}` })),
  },
  {
    // The PRD's draft Company group listed "About" and "Contact". There is no
    // /about route in the IA (§6), and FR3 forbids dead or `#` hrefs, so it is
    // omitted until that page exists. Booking is reachable from the CTA in this
    // same footer, which is the only component permitted to know the booking URL.
    heading: 'Company',
    links: [
      { label: 'Insights', to: '/blog' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: `mailto:${CONTACT.general}`, external: true },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Security', to: '/security' },
      { label: 'Data Processing Agreement', to: '/dpa' },
    ],
  },
]
