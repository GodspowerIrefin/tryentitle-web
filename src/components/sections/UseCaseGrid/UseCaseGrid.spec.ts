import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UseCaseGrid from './UseCaseGrid.vue'
import type { UseCase } from '@/data/industry-detail'

const items: UseCase[] = [
  {
    title: 'Prior-authorization packets',
    problem: 'The packet is assembled by hand for every payer.',
    build: 'Assemble the packet from the chart and track it to a decision.',
    impacts: ['Fewer packets returned incomplete', 'Denials arrive documented'],
  },
  {
    title: 'Referral intake',
    problem: 'Referrals wait to be rekeyed into the EHR.',
    build: 'Capture referrals from every channel and file them without a rekey.',
    impacts: ['Same-day referral entry'],
  },
]

const props = {
  eyebrow: 'Use cases',
  title: 'Where are your best people doing the most manual work?',
  items,
  problemLabel: 'Today',
  buildLabel: 'What we build',
  impactsLabel: 'What changes',
}

describe('UseCaseGrid', () => {
  it('renders every use case with its problem, build, and impacts', () => {
    const wrapper = mount(UseCaseGrid, { props })

    expect(wrapper.findAll('.usecase')).toHaveLength(2)
    expect(wrapper.text()).toContain('Prior-authorization packets')
    expect(wrapper.text()).toContain('The packet is assembled by hand for every payer.')
    expect(wrapper.text()).toContain('Assemble the packet from the chart and track it to a decision.')
    expect(wrapper.text()).toContain('Fewer packets returned incomplete')
    expect(wrapper.findAll('.impact')).toHaveLength(3)
  })

  it('heads each card at h3, under the section h2', () => {
    const wrapper = mount(UseCaseGrid, { props })

    expect(wrapper.findAll('h2')).toHaveLength(1)
    expect(wrapper.findAll('h3').map((h) => h.text())).toEqual([
      'Prior-authorization packets',
      'Referral intake',
    ])
  })

  it('is a set, not a sequence — no numbering (PRD §10.7)', () => {
    const wrapper = mount(UseCaseGrid, { props })

    expect(wrapper.find('ol').exists()).toBe(false)
    expect(wrapper.text()).not.toMatch(/\b01\b/)
  })
})
