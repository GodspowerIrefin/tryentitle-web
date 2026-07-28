import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProofStrip from './ProofStrip.vue'
import type { Testimonial } from '@/types/content'

/**
 * FR12 / §8.4 — the proof section renders NOTHING until real proof exists.
 * This is the test that protects the site's honesty: no placeholder logos, no
 * invented quotes, no "trusted by" grey boxes at launch.
 */
describe('ProofStrip', () => {
  it('renders nothing when the proof collection is empty', () => {
    const wrapper = mount(ProofStrip, { props: { items: [] } })

    expect(wrapper.find('section').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
    // No skeletons or placeholder markup left behind.
    expect(wrapper.html()).not.toMatch(/trusted by|placeholder|skeleton/i)
  })

  it('renders testimonials with full attribution when proof exists', () => {
    const items: Testimonial[] = [
      {
        quote: 'Intake went from three days to same day.',
        name: 'Jane Doe',
        role: 'Operations Lead',
        company: 'Acme Co.',
        permission: true,
      },
    ]

    const wrapper = mount(ProofStrip, { props: { items } })

    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Intake went from three days to same day.')
    // Attribution is never optional — an anonymous quote would undercut credibility.
    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('Operations Lead')
    expect(wrapper.text()).toContain('Acme Co.')
  })
})
