import MarkdownContent from '@/components/features/MarkdownContent'
import { useMarkdown } from '@/hooks/useMarkdown'

interface Props {
  path: string
}

export default function MarkdownRenderer({ path }: Props) {
  const { content, loading } = useMarkdown(path)

  if (loading) {
    return (
      <div className="text-secondary-light dark:text-secondary-dark animate-pulse">
        Loading...
      </div>
    )
  }

  return <MarkdownContent content={content} />
}
