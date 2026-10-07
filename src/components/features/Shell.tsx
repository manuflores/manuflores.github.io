import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { select, toggle as togglePlay } from '@/hooks/usePlayer'
import { complete, lsLine, run, type Line, type Section, type Segment } from '@/lib/shell'

interface Entry {
  id: number
  line: Line
  prompt?: { cwd: string; input: string }
}

interface Props {
  open: boolean
  cwd: Section
  onClose: () => void
  onToggleTheme: () => void
}

const NAVIGATE_DELAY_MS = 350

const toneClass: Record<string, string> = {
  dim: 'text-secondary-light dark:text-secondary-dark',
  accent: 'text-accent-light dark:text-accent-dark',
  purple: 'text-[#9878b8] dark:text-[#ac84d0]',
  green: 'text-[#6a9870] dark:text-[#78b47e]',
}

let nextId = 0

export default function Shell({ open, cwd, onClose, onToggleTheme }: Props) {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<Entry[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const suggestion = complete(input)

  // Greet with a clickable `ls` whenever the shell opens onto an empty screen.
  useEffect(() => {
    if (!open) return
    // Skip on touch screens so the keyboard doesn't cover the clickable `ls`.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus()
    setEntries((prev) =>
      prev.length
        ? prev
        : [
            { id: nextId++, line: [{ text: 'manu flores — type ', tone: 'dim' }, { text: 'help', tone: 'accent' }, { text: ', or click a dir', tone: 'dim' }] },
            { id: nextId++, line: [], prompt: { cwd: cwd.name, input: 'ls' } },
            { id: nextId++, line: lsLine(cwd) },
          ],
    )
  }, [open, cwd])

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight })
  }, [entries])

  function execute(command: string) {
    const trimmed = command.trim()
    if (!trimmed) return
    setHistory((h) => [...h, trimmed])
    setHistoryIndex(history.length + 1)

    const result = run(trimmed, cwd)
    const echoed: Entry = { id: nextId++, line: [], prompt: { cwd: cwd.name, input: trimmed } }
    const printed = result.lines.map((line) => ({ id: nextId++, line }))

    switch (result.action?.type) {
      case 'clear':
        setEntries([])
        return
      case 'theme':
        onToggleTheme()
        break
      case 'play':
        if (result.action.song === undefined) togglePlay()
        else select(result.action.song)
        break
      case 'navigate': {
        const { path } = result.action
        setTimeout(() => {
          navigate(path)
          onClose()
        }, NAVIGATE_DELAY_MS)
        break
      }
    }
    setEntries((prev) => [...prev, echoed, ...printed])
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      execute(input)
      setInput('')
    } else if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
      e.preventDefault()
      setInput(suggestion)
    } else if (e.key === 'Tab') {
      e.preventDefault()
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = Math.max(0, historyIndex - 1)
      setHistoryIndex(i)
      setInput(history[i])
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault()
      const i = Math.min(history.length, historyIndex + 1)
      setHistoryIndex(i)
      setInput(history[i] ?? '')
    } else if (e.key === 'l' && e.ctrlKey) {
      // Like a real terminal: clear the screen but keep what's typed.
      e.preventDefault()
      setEntries([])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-label="Site shell"
        aria-modal="true"
        inert={!open}
        onClick={() => inputRef.current?.focus()}
        className={`fixed inset-x-0 top-0 z-50 flex max-h-[60vh] flex-col font-mono text-sm leading-relaxed
          bg-surface-card-light/95 dark:bg-surface-card-dark/95 backdrop-blur-md
          border-b-2 border-accent-light dark:border-accent-dark
          transition-transform duration-300 ease-out motion-reduce:transition-none
          ${open ? 'translate-y-0 shadow-xl' : '-translate-y-[105%]'}`}
      >
        <div ref={outputRef} className="flex-1 overflow-y-auto px-6 pt-4 max-w-3xl w-full mx-auto">
          {entries.map((entry) => (
            <div key={entry.id} className="whitespace-pre-wrap break-words text-primary-light dark:text-primary-dark">
              {entry.prompt && (
                <>
                  <Prompt cwd={entry.prompt.cwd} />
                  {entry.prompt.input}
                </>
              )}
              {entry.line.map((segment, i) => (
                <SegmentView key={i} segment={segment} onOpen={(s) => execute(`cd ${s.name}`)} />
              ))}
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 px-6 pt-1 pb-4 max-w-3xl w-full mx-auto">
          <Prompt cwd={cwd.name} />
          <span className="relative flex-1 text-base md:text-sm">
            <span aria-hidden className="pointer-events-none absolute inset-0 whitespace-pre opacity-40 text-secondary-light dark:text-secondary-dark">
              {suggestion}
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Shell command"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="relative w-full bg-transparent outline-none text-primary-light dark:text-primary-dark"
            />
          </span>
        </label>
      </div>
    </>
  )
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="whitespace-nowrap">
      {/* Light: green user + accent path. Dark: the whole user:path in emerald. */}
      <span className="dark:text-accent-dark">
        <span className="text-[#6a9870] dark:text-inherit">manu@flores</span>:
        <span className={toneClass.accent}>~/{cwd === 'home' ? '' : cwd}</span>
      </span>
      $&nbsp;
    </span>
  )
}

function SegmentView({ segment, onOpen }: { segment: Segment; onOpen: (s: Section) => void }) {
  if ('section' in segment) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onOpen(segment.section)
        }}
        className={`underline-offset-4 hover:underline ${
          segment.current ? toneClass.accent : toneClass.purple
        }`}
        title={segment.section.hint}
      >
        {segment.section.name}/
      </button>
    )
  }
  return <span className={segment.tone ? toneClass[segment.tone] : undefined}>{segment.text}</span>
}
