import { experience, education } from '@/data/siteData'
import TimelineItem from '@/components/ui/TimelineItem'

export default function ExperienceTimeline() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-primary-light dark:text-primary-dark">
          Work
        </h2>
        <div>
          {experience.map((exp) => (
            <TimelineItem
              key={`${exp.organization}-${exp.period}`}
              title={exp.organization}
              subtitle={exp.role}
              period={exp.period}
              location={exp.location}
              description={exp.summary}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-primary-light dark:text-primary-dark">
          Education
        </h2>
        <div>
          {education.map((edu) => (
            <TimelineItem
              key={`${edu.institution}-${edu.period}`}
              title={edu.institution}
              subtitle={`${edu.degree}, ${edu.area}`}
              period={edu.period}
              location={edu.location}
              description={edu.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
