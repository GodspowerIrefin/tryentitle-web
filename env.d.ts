/// <reference types="vite/client" />

/**
 * Markdown documents under src/content are compiled to typed data modules by the
 * md-content Vite plugin (see vite/md-content.ts). Collection-specific frontmatter
 * types are applied at the import site in src/lib/content.ts.
 */
declare module '*.md' {
  const doc: import('@/types/content').MarkdownDoc<Record<string, unknown>>
  export default doc
}
