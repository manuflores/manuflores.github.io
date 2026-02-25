interface Props {
  trackUrl: string
  title?: string
}

export default function SoundCloudEmbed({ trackUrl, title = 'SoundCloud Player' }: Props) {
  const encodedUrl = encodeURIComponent(trackUrl)
  const src = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`

  return (
    <div className="rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
      <iframe
        title={title}
        width="100%"
        height="300"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={src}
      />
    </div>
  )
}
