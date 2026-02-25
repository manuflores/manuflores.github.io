import SoundCloudEmbed from '@/components/ui/SoundCloudEmbed'
import MarkdownRenderer from '@/components/features/MarkdownRenderer'
import { tracks } from '@/data/siteData'
import { useFadeIn, useScrollReveal } from '@/hooks/useFadeIn'

function TrackCard({ url, title }: { url: string; title?: string }) {
  const { ref, visible } = useScrollReveal(0.15)

  return (
    <div ref={ref} className={`fade-in-fast ${visible ? 'visible' : ''}`}>
      {title && (
        <h2 className="text-lg font-semibold mb-2 text-primary-light dark:text-primary-dark">
          {title}
        </h2>
      )}
      <SoundCloudEmbed trackUrl={url} title={title} />
    </div>
  )
}

export default function MusicPage() {
  const heading = useFadeIn(100)
  const intro = useFadeIn(300)

  return (
    <section className="py-12">
      <div ref={heading.ref} className={`fade-in ${heading.visible ? 'visible' : ''}`}>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary-light dark:text-primary-dark">
          Sound
        </h1>
      </div>
      <div ref={intro.ref} className={`fade-in ${intro.visible ? 'visible' : ''} mb-10`}>
        <MarkdownRenderer path="/content/music.md" />
      </div>
      <div className="space-y-6">
        {tracks.map((track) => (
          <TrackCard key={track.url} url={track.url} title={track.title} />
        ))}
      </div>
    </section>
  )
}
