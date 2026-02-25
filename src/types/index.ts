export interface Profile {
  name: string
  tagline: string
  socials: Social[]
}

export interface Social {
  platform: string
  url: string
  label: string
}

export interface Experience {
  organization: string
  role: string
  period: string
  location: string
  summary: string
}

export interface Education {
  institution: string
  degree: string
  area: string
  period: string
  location: string
  description: string
}

export interface Track {
  url: string
  title?: string
}
