import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
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

  return (
    <div className="prose-custom space-y-4 text-lg leading-relaxed text-secondary-light dark:text-secondary-dark">
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {content}
      </Markdown>
    </div>
  )
}
