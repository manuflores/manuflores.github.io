import Markdown from 'react-markdown'
import { profile } from '@/data/siteData'
import SocialIcon from '@/components/ui/SocialIcon'
import { useFadeIn } from '@/hooks/useFadeIn'

export default function HeroSection() {
  const heading = useFadeIn(100)
  const tagline = useFadeIn(250)
  const socials = useFadeIn(400)

  return (
    <section className="relative py-16 md:py-24">
      <div className="relative">
        <div
          ref={heading.ref}
          className={`fade-in ${heading.visible ? 'visible' : ''}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-light dark:text-primary-dark">
            {profile.name}
          </h1>
        </div>
        <div
          ref={tagline.ref}
          className={`fade-in ${tagline.visible ? 'visible' : ''} text-lg md:text-xl text-secondary-light dark:text-secondary-dark mb-8 max-w-xl [&_a]:text-accent-light dark:[&_a]:text-accent-dark [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0`}
        >
          <Markdown>{profile.tagline}</Markdown>
        </div>
        <div
          ref={socials.ref}
          className={`fade-in ${socials.visible ? 'visible' : ''} flex gap-3`}
        >
          {profile.socials.map((s) => (
            <SocialIcon key={s.platform} social={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
