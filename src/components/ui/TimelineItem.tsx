import { useScrollReveal } from '@/hooks/useFadeIn'

interface Props {
  title: string
  subtitle: string
  period: string
  location: string
  description: string
}

export default function TimelineItem({ title, subtitle, period, location, description }: Props) {
  const { ref, visible } = useScrollReveal(0.2)

  return (
    <div
      ref={ref}
      className={`fade-in-fast ${visible ? 'visible' : ''} relative pl-8 pb-8 last:pb-0 border-l-2 border-border-light dark:border-border-dark`}
    >
      <div className="timeline-dot" />
      <p className="text-sm text-secondary-light dark:text-secondary-dark mb-0.5">
        {period}
      </p>
      <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
        {subtitle}
      </h3>
      <p className="text-secondary-light dark:text-secondary-dark mb-1">
        {title} · {location}
      </p>
      <p className="text-secondary-light dark:text-secondary-dark text-sm leading-relaxed mt-2">
        {description}
      </p>
    </div>
  )
}
