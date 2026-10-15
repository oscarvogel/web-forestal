import site from '../content/site.json'

// Same policy as the Eleventy robots.njk: everything open, AI crawlers included.
const agents = ['*', 'Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai']

export function loader() {
  const body = `${agents.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n')}\n\nSitemap: ${site.url}/sitemap.xml\n`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
