import type { Job } from './content'

export function CompanyLogo({ job, large }: { job: Job; large?: boolean }) {
  return (
    <span className={large ? 'logo logo--large' : 'logo'}>
      {job.logo ? <img src={job.logo} alt={`${job.company} logo`} /> : <span className="logo__mark">{job.company[0]}</span>}
    </span>
  )
}
