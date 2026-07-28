import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

/**
 * The Button accessibility contract (PRD §11.3): a real <button>, <a>, or
 * <RouterLink> — never a clickable <div> — so keyboard, middle-click, and
 * "copy link address" behave the way users expect.
 */
describe('Button', () => {
  it('renders a real <button> for in-page actions', () => {
    const wrapper = mount(Button, { slots: { default: 'Open menu' } })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('renders an <a> for external destinations, with safe rel', () => {
    const wrapper = mount(Button, {
      props: { href: 'https://calendly.com/x/y', external: true },
      slots: { default: 'Book' },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://calendly.com/x/y')
    expect(wrapper.attributes('target')).toBe('_blank')
    // noopener prevents the new tab from reaching back through window.opener.
    expect(wrapper.attributes('rel')).toContain('noopener')
  })

  it('renders a RouterLink for internal navigation', () => {
    const wrapper = mount(Button, {
      props: { to: '/services' },
      slots: { default: 'Services' },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>', props: ['to'] } } },
    })

    expect(wrapper.element.tagName).toBe('A')
  })

  it('never renders a clickable div, in any mode', () => {
    const stubs = { RouterLink: { template: '<a><slot /></a>', props: ['to'] } }

    expect(mount(Button).element.tagName).not.toBe('DIV')
    expect(mount(Button, { props: { href: 'https://x.test' } }).element.tagName).not.toBe('DIV')
    expect(mount(Button, { props: { to: '/a' }, global: { stubs } }).element.tagName).not.toBe(
      'DIV',
    )
  })

  it('applies the requested variant so primary stays reserved for booking', () => {
    const wrapper = mount(Button, { props: { variant: 'primary' } })
    expect(wrapper.classes()).toContain('btn--primary')
  })
})
