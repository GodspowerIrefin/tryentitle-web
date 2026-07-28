import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BlogList from './BlogList.vue'
import type { MarkdownDoc, BlogFrontmatter } from '@/types/content'

/**
 * FR16 — the blog index paginates at 10 posts per page, newest first, and each
 * card shows title, date, and reading time.
 */

function post(n: number): MarkdownDoc<BlogFrontmatter> {
  return {
    slug: `post-${n}`,
    frontmatter: {
      title: `Post ${n}`,
      description: `Description ${n}`,
      publishedAt: `2026-01-${String(n).padStart(2, '0')}`,
      draft: false,
    },
    html: `<p>Body ${n}</p>`,
    toc: [],
    readingMinutes: 4,
    excerpt: `Excerpt ${n}`,
  }
}

const stubs = { RouterLink: { template: '<a><slot /></a>', props: ['to'] } }

describe('BlogList', () => {
  it('renders at most 10 posts per page', () => {
    const wrapper = mount(BlogList, {
      props: { posts: Array.from({ length: 25 }, (_, i) => post(i + 1)), page: 1, perPage: 10 },
      global: { stubs },
    })

    expect(wrapper.findAll('.post__title')).toHaveLength(10)
  })

  it('shows the correct slice for a later page', () => {
    const wrapper = mount(BlogList, {
      props: { posts: Array.from({ length: 25 }, (_, i) => post(i + 1)), page: 3, perPage: 10 },
      global: { stubs },
    })

    // Page 3 of 25 holds the final five posts.
    expect(wrapper.findAll('.post__title')).toHaveLength(5)
    expect(wrapper.text()).toContain('Post 21')
  })

  it('shows date and reading time on each card', () => {
    const wrapper = mount(BlogList, {
      props: { posts: [post(5)], page: 1, perPage: 10 },
      global: { stubs },
    })

    expect(wrapper.text()).toContain('4 min read')
    expect(wrapper.find('time').attributes('datetime')).toBe('2026-01-05')
  })

  it('renders no pagination when everything fits on one page', () => {
    const wrapper = mount(BlogList, {
      props: { posts: [post(1)], page: 1, perPage: 10 },
      global: { stubs },
    })

    expect(wrapper.find('.pager').exists()).toBe(false)
  })

  it('renders nothing when there are no posts', () => {
    const wrapper = mount(BlogList, {
      props: { posts: [], page: 1, perPage: 10 },
      global: { stubs },
    })

    expect(wrapper.findAll('.post__title')).toHaveLength(0)
  })
})
