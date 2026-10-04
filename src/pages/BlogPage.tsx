import { Link } from 'react-router-dom'
import { useFadeIn } from '@/hooks/useFadeIn'
import { formatDate, getAllPosts } from '@/lib/posts'

export default function BlogPage() {
  const heading = useFadeIn(100)
  const content = useFadeIn(300)
  const posts = getAllPosts()

  return (
    <section className="py-12">
      <div ref={heading.ref} className={`fade-in ${heading.visible ? 'visible' : ''}`}>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary-light dark:text-primary-dark">
          Blog
        </h1>
      </div>
      <div ref={content.ref} className={`fade-in ${content.visible ? 'visible' : ''}`}>
        {posts.length === 0 ? (
          <p className="text-lg text-secondary-light dark:text-secondary-dark">No posts yet.</p>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                <time
                  dateTime={post.date}
                  className="shrink-0 text-sm sm:w-28 sm:pt-1.5 text-secondary-light dark:text-secondary-dark"
                >
                  {formatDate(post.date)}
                </time>
                <div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xl font-semibold text-primary-light dark:text-primary-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors"
                  >
                    {post.title}
                  </Link>
                  {post.summary && (
                    <p className="mt-1 text-base text-secondary-light dark:text-secondary-dark">
                      {post.summary}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
