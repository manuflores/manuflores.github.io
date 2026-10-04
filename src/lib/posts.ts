import type { Post } from '@/types'

const files = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Parses a simple `key: value` frontmatter block delimited by `---` lines.
function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {} as Record<string, string>, content: raw }

  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (key) data[key] = value
  }
  return { data, content: match[2] }
}

const posts: Post[] = Object.entries(files)
  .flatMap(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const { data, content } = parseFrontmatter(raw)

    if (!data.title || !/^\d{4}-\d{2}-\d{2}$/.test(data.date ?? '')) {
      console.warn(`Skipping blog post "${slug}": frontmatter needs a title and a YYYY-MM-DD date.`)
      return []
    }

    return [{ slug, title: data.title, date: data.date, summary: data.summary, content }]
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function getAllPosts(): Post[] {
  return posts
}

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
