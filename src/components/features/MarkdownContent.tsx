import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

interface Props {
  content: string
}

export default function MarkdownContent({ content }: Props) {
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
