import type { Profile, Experience, Education, Track } from '@/types'

export const profile: Profile = {
  name: '',
  tagline: "Hi, I'm Manu. I'm building self-improving agents for applications in healthcare at [Cainex](https://cainex.com).",
  socials: [
    {
      platform: 'github',
      url: 'https://github.com/manuflores',
      label: 'GitHub',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/eflobau',
      label: 'LinkedIn',
    },
  ],
}

export const experience: Experience[] = [
  {
    organization: 'Cainex',
    role: 'Founding Engineer',
    period: 'July 2025 - Present',
    location: 'Sunnyvale, California',
    summary: 'Designing agents that can infer that can improve their own architecture.'
  },
  {
    organization: 'Chan Zuckerberg Biohub',
    role: 'Research Internship',
    period: 'Jun 2022 - Sep 2022',
    location: 'San Francisco, California',
    summary:
      'Developed a model to investigate batch effects in single-cell data under the action of SE(n). Using model predictions, we then developed an algorithm to integrate single-cell transcriptomics data across development. Work with Alejandro Granados.',
  },
  {
    organization: 'California Institute of Technology',
    role: 'Research Fellow',
    period: 'Jun 2018 -Oct 2018',
    location: 'Pasadena, California',
    summary:
      'Developed a stochastic differential equations model to simulate plasmid partitioning in bacterial cells, with collaborator Andy Halleran.',
  },
]

export const education: Education[] = [
  {
    institution: 'California Institute of Technology (Caltech)',
    degree: 'Ph.D.',
    area: 'Computational Biology, Applied & Computational Math minor',
    period: '2019 - 2025',
    location: 'Pasadena, California',
    description:
      'Dissertation: Topology of cellular Ontogeny. Supervisor: Matt Thomson.',
  },
  {
    institution: 'Universidad Autónoma de Yucatán (UADY)',
    degree: "Bachelor's",
    area: 'Bioengineering',
    period: '2013 – 2018',
    location: 'Yucatán, Mexico',
    description:
      'Dissertation: Functional prediction of unknown transcription factors in E. coli K-12 using RNA-seq data. Supervisor: Ernesto Pérez Rueda.',
  },
]

export const tracks: Track[] = [
  {
    url: 'https://soundcloud.com/ton4li/atardecer?in=ton4li/sets/tonali-ep',
    title: 'Atardecer',
  },
  {
    url: 'https://soundcloud.com/ton4li/tecali?in=ton4li/sets/tecali-lp',
    title: 'Tecali',
  },
]
