import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Static server for the built site.
 *
 * `vite preview` uses SPA fallback — it would serve index.html for every path,
 * so tests would never touch the prerendered per-route HTML and would hit
 * hydration mismatches. This server instead mimics a real static host
 * (Vercel/Netlify/CDN): clean URLs map to their `.html` file, and an unknown
 * path serves 404.html with a genuine 404 status (PRD FR4).
 */

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const PORT = Number(process.env.PORT ?? 4173)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

async function readIfFile(path) {
  try {
    const s = await stat(path)
    if (!s.isFile()) return null
    return await readFile(path)
  } catch {
    return null
  }
}

/** Resolve a request path to a file, following static-host clean-URL rules. */
async function resolve(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  const base = join(DIST, safe)

  if (safe === '/' || safe === '\\') {
    return { body: await readIfFile(join(DIST, 'index.html')), ext: '.html' }
  }
  // Exact file (assets, og images, sitemap.xml, robots.txt)
  const exact = await readIfFile(base)
  if (exact) return { body: exact, ext: extname(base) }

  // Clean URL: /services -> services.html
  const asHtml = await readIfFile(`${base}.html`)
  if (asHtml) return { body: asHtml, ext: '.html' }

  // Directory index: /services/ -> services/index.html
  const asIndex = await readIfFile(join(base, 'index.html'))
  if (asIndex) return { body: asIndex, ext: '.html' }

  return null
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)
  const found = await resolve(url.pathname)

  if (found?.body) {
    res.writeHead(200, { 'Content-Type': TYPES[found.ext] ?? 'application/octet-stream' })
    res.end(found.body)
    return
  }

  const notFound = await readIfFile(join(DIST, '404.html'))
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(notFound ?? 'Not found')
}).listen(PORT, () => {
  console.log(`serving dist on http://localhost:${PORT}`)
})
