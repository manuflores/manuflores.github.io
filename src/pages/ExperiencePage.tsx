import ExperienceTimeline from '@/components/features/ExperienceTimeline'
import { useFadeIn } from '@/hooks/useFadeIn'

export default function ExperiencePage() {
  const heading = useFadeIn(100)
  const content = useFadeIn(300)

  return (
    <section className="py-12">
      <div ref={heading.ref} className={`fade-in ${heading.visible ? 'visible' : ''}`}>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary-light dark:text-primary-dark">
          Work
        </h1>
      </div>
      <div ref={content.ref} className={`fade-in ${content.visible ? 'visible' : ''}`}>
        <ExperienceTimeline />
      </div>
    </section>
  )
}
