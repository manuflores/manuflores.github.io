import { useState, useEffect } from 'react'

export function useMarkdown(path: string) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(path)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) {
          setContent(text)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContent('Failed to load content.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [path])

  return { content, loading }
}
