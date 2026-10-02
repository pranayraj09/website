import type { ReactNode } from 'react'
import type { Job } from './content'
import { AboutBody, CertificationsBody, ContactBody, EducationBody, ExperienceBody, ProjectsBody, SkillsBody } from './sections'

export type SectionDef = {
  id: string
  title?: string
  render: (onOpenJob: (job: Job) => void) => ReactNode
}

export const sections: SectionDef[] = [
  { id: 'about', title: 'About', render: () => <AboutBody /> },
  { id: 'experience', title: 'Experience', render: (onOpenJob) => <ExperienceBody onOpenJob={onOpenJob} /> },
  { id: 'projects', title: 'Projects', render: () => <ProjectsBody /> },
  { id: 'skills', title: 'Skills', render: () => <SkillsBody /> },
  { id: 'education', title: 'Education', render: () => <EducationBody /> },
  { id: 'certifications', title: 'Certifications', render: () => <CertificationsBody /> },
  { id: 'contact', render: () => <ContactBody /> },
]
