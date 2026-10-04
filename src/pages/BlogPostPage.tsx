import { Link, Navigate, useParams } from 'react-router-dom'
import MarkdownContent from '@/components/features/MarkdownContent'
import { useFadeIn } from '@/hooks/useFadeIn'
import { formatDate, getPost } from '@/lib/posts'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const heading = useFadeIn(100)
  const content = useFadeIn(300)
  const post = getPost(slug)

  if (!post) return <Navigate to="/blog" replace />

  return (
    <article className="py-12">
      <div ref={heading.ref} className={`fade-in ${heading.visible ? 'visible' : ''}`}>
        <Link
          to="/blog"
          className="text-base text-secondary-light dark:text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors"
        >
          ← ~/blog
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-3 text-primary-light dark:text-primary-dark">
          {post.title}
        </h1>
        <time
          dateTime={post.date}
          className="block mb-8 text-sm text-secondary-light dark:text-secondary-dark"
        >
          {formatDate(post.date)}
        </time>
      </div>
      <div ref={content.ref} className={`fade-in ${content.visible ? 'visible' : ''}`}>
        <MarkdownContent content={post.content} />
      </div>
    </article>
  )
}
