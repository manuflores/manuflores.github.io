export interface Section {
  name: string
  path: string
  hint: string
}

export const sections: Section[] = [
  { name: 'home', path: '/', hint: 'start here' },
  { name: 'about', path: '/about', hint: 'who' },
  { name: 'exp', path: '/experience', hint: 'work' },
  { name: 'sound', path: '/music', hint: 'music' },
  { name: 'verses', path: '/verses', hint: 'poems' },
  { name: 'blog', path: '/blog', hint: 'writing' },
]

export function sectionForPath(pathname: string): Section {
  return (
    sections.find((s) => s.path !== '/' && pathname.startsWith(s.path)) ?? sections[0]
  )
}

// A printed line is a list of segments so the UI can style and link them.
export type Segment =
  | { text: string; tone?: 'dim' | 'accent' | 'purple' | 'green' }
  | { section: Section; current: boolean }
export type Line = Segment[]

export type Action =
  | { type: 'navigate'; path: string }
  | { type: 'theme' }
  | { type: 'play' }
  | { type: 'clear' }

export interface Result {
  lines: Line[]
  action?: Action
}

export const COMMANDS = ['help', 'ls', 'cd', 'whoami', 'theme', 'play', 'clear'] as const

export function lsLine(current: Section): Line {
  return sections.flatMap((s, i) => [
    ...(i ? [{ text: '  ' }] : []),
    { section: s, current: s.name === current.name },
  ])
}

function findSection(arg: string): Section | undefined {
  const name = arg.replace(/^~\/?/, '').replace(/\/$/, '')
  if (name === '' || name === '..') return sections[0]
  return sections.find((s) => s.name === name)
}

export function run(input: string, cwd: Section): Result {
  const [cmd, arg = ''] = input.trim().split(/\s+/)

  switch (cmd) {
    case 'help':
      return {
        lines: [
          ['ls', 'list sections'],
          ['cd <dir>', 'go to a section'],
          ['whoami', 'about me'],
          ['theme', 'toggle light/dark'],
          ['play', 'play a tune'],
          ['clear', 'clear the screen'],
        ].map(([c, d]) => [{ text: c.padEnd(10), tone: 'purple' }, { text: d, tone: 'dim' }]),
      }
    case 'ls':
      return { lines: [lsLine(cwd)] }
    case 'cd': {
      const target = findSection(arg)
      if (!target) return { lines: [[{ text: `cd: no such section: ${arg}` }]] }
      return {
        lines: [[{ text: `→ ${target.path}`, tone: 'dim' }]],
        action: { type: 'navigate', path: target.path },
      }
    }
    case 'whoami':
      return {
        lines: [[{ text: 'manu — research scientist @ lumetec. caltech phd. sound, bikes, books.' }]],
      }
    case 'theme':
      return { lines: [[{ text: 'theme toggled', tone: 'dim' }]], action: { type: 'theme' } }
    case 'play':
      return { lines: [[{ text: '♪ ', tone: 'accent' }, { text: 'toggling the tune', tone: 'dim' }]], action: { type: 'play' } }
    case 'clear':
      return { lines: [], action: { type: 'clear' } }
    default:
      return {
        lines: [[{ text: `zsh: command not found: ${cmd}  ` }, { text: '(try help)', tone: 'dim' }]],
      }
  }
}

// Fish-style completion: returns the full suggested input, or '' if none.
export function complete(input: string): string {
  const cd = input.match(/^cd\s+(~\/)?(\S*)$/)
  if (cd) {
    const hit = cd[2] && sections.find((s) => s.name.startsWith(cd[2]) && s.name !== cd[2])
    return hit ? input + hit.name.slice(cd[2].length) : ''
  }
  if (/^\S+$/.test(input)) {
    const hit = COMMANDS.find((c) => c.startsWith(input) && c !== input)
    return hit ? input + hit.slice(input.length) : ''
  }
  return ''
}
