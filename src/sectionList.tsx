import type { ReactNode } from 'react'
import type { Job } from './content'
import { AboutBody, CertificationsBody, ContactBody, EducationBody, ExperienceBody, ProjectsBody, ResumeBody, SkillsBody } from './sections'

export type SectionActions = {
  openJob: (job: Job) => void
  openResume: () => void
}

export type SectionDef = {
  id: string
  title?: string
  render: (actions: SectionActions) => ReactNode
}

export const sections: SectionDef[] = [
  { id: 'about', title: 'About', render: () => <AboutBody /> },
  { id: 'experience', title: 'Experience', render: ({ openJob }) => <ExperienceBody onOpenJob={openJob} /> },
  { id: 'projects', title: 'Projects', render: () => <ProjectsBody /> },
  { id: 'skills', title: 'Skills', render: () => <SkillsBody /> },
  { id: 'education', title: 'Education', render: () => <EducationBody /> },
  { id: 'certifications', title: 'Certifications', render: () => <CertificationsBody /> },
  { id: 'resume', title: 'Resume', render: ({ openResume }) => <ResumeBody onOpenResume={openResume} /> },
  { id: 'contact', render: () => <ContactBody /> },
]
