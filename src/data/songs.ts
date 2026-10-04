import loop1 from './waveforms/loop1.json'
import equilibrio from './waveforms/equilibrio.json'
import cumbion from './waveforms/cumbion.json'

// To add a song: put the file in public/audio/, then run
//   python3 scripts/waveform.py public/audio/<file> > src/data/waveforms/<id>.json
// and add an entry below.

export interface Song {
  id: string
  title: string
  src: string
  /** Seconds. For loops this is the exact loop length. */
  duration: number
  color: { light: string; dark: string }
  peaks: number[]
  /** Short sample-accurate loop instead of a streamed song. */
  loop?: boolean
}

export const songs: Song[] = [
  {
    id: 'loop1',
    title: 'loop1',
    src: '/audio/loop1.m4a',
    duration: 1728627 / 44100,
    color: { light: '#6b9fbb', dark: '#34d399' },
    peaks: loop1,
    loop: true,
  },
  {
    id: 'equilibrio',
    title: 'Equilibrio',
    src: '/audio/equilibrio.mp3',
    duration: 339.7,
    color: { light: '#9878b8', dark: '#ac84d0' },
    peaks: equilibrio,
  },
  {
    id: 'cumbion',
    title: 'Cumbion',
    src: '/audio/cumbion.mp3',
    duration: 144,
    color: { light: '#b08848', dark: '#d0a250' },
    peaks: cumbion,
  },
]

export function findSong(name: string): number {
  const q = name.toLowerCase()
  return songs.findIndex((s) => s.id === q || s.title.toLowerCase() === q)
}
