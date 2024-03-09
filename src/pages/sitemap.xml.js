export const prerender = true

import { SitemapStream, streamToPromise } from 'sitemap'

export async function GET() {
  const hostname = 'https://www.launchfa.st'
  const smStream = new SitemapStream({ hostname })
  const slugs = ['/signin', '/signup', '/terms', '/careers', '/privacy']
  try {
    slugs.forEach((url) => {
      smStream.write({ url, changefreq: 'daily', priority: 1 })
    })
    smStream.end()
    const sitemap = await streamToPromise(smStream)
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (e) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return new Response(tmp, { status: 500 })
  }
}
