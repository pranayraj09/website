export type Link = { label: string; href: string }

export type Project = {
  name: string
  tagline: string
  description: string
  stack: string[]
  links?: Link[]
}

export type Job = {
  role: string
  company: string
  location: string
  start: string
  end: string
  logo?: string
  note?: string
  summary: string
  highlights: string[]
  stack: string[]
}

export type Education = {
  degree: string
  school: string
  location: string
  years: string
  note?: string
}

export type Certification = {
  name: string
  issuer: string
  year: string
  badge?: string
}

export const profile = {
  name: 'Pranay Raj Kyatham',
  title: 'Staff Software Engineer',
  location: 'San Jose, CA',
  summary:
    '12+ years architecting high-performance web applications and component libraries at ServiceNow, Intel, and Apple. Lately building AI agent platforms at work and AI-powered trading tools on my own time.',
  email: 'kyatham.pranay@gmail.com',
  resume: './Pranay_Kyatham-Resume.pdf',
  links: [
    { label: 'GitHub', href: 'https://github.com/pranayraj09' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pranayraj09' },
  ] satisfies Link[],
}

export const about = [
  'I am a Staff Software Engineer at ServiceNow with 12+ years of experience in React, TypeScript, Node.js, and modern JavaScript. I build scalable front-end platforms, CMS integrations, and component-driven architectures that serve millions of users, and I have cut page load times by 40% along the way.',
  'I care about technical excellence beyond my own code: I mentor engineers, run code reviews, and set up the testing and quality standards that let teams ship with confidence.',
  'On my own time I build AI-driven trading tools: bots that trade through broker APIs, and a trade-history view with charts and detailed P&L breakdowns for Robinhood and other brokers. I also hold the Anthropic Claude Certified Architect certification, covering agentic systems, prompt engineering, MCP, and enterprise AI applications.',
]

export const featuredProjects: Project[] = [
  {
    name: 'P&L History Tracker',
    tagline: 'Chrome extension for traders',
    description:
      'A Manifest V3 extension that pulls order history from Robinhood, Tradier, Interactive Brokers, and Fidelity and turns it into a clear breakdown of realized options and stock P&L.',
    stack: ['JavaScript', 'Chrome Extensions', 'Node.js'],
  },
]

export const earlierProjects: Project[] = [
  {
    name: 'Ads Dashboard',
    tagline: 'Campaign analytics dashboard',
    description: 'React dashboard layout with sidebar navigation and quick-view charts for ad campaigns.',
    stack: ['React'],
    links: [
      { label: 'Live', href: 'https://pranayraj09.github.io/AdsDashboard/' },
      { label: 'Code', href: 'https://github.com/pranayraj09/AdsDashboard' },
    ],
  },
  {
    name: 'Bar Stock',
    tagline: 'Bar inventory app',
    description: 'React app with routed list and card views for a bar\'s stock.',
    stack: ['React'],
    links: [
      { label: 'Live', href: 'https://pranayraj09.github.io/Bar-Stock/' },
      { label: 'Code', href: 'https://github.com/pranayraj09/Bar-Stock' },
    ],
  },
  {
    name: 'Coupong',
    tagline: 'Coupon list',
    description: 'React and Bootstrap front-end for browsing a list of coupons.',
    stack: ['React', 'Bootstrap'],
    links: [
      { label: 'Live', href: 'https://pranayraj09.github.io/coupong/' },
      { label: 'Code', href: 'https://github.com/pranayraj09/coupong' },
    ],
  },
  {
    name: 'Deck of Cards',
    tagline: 'Card shuffling demo',
    description: 'Shuffle and deal a deck of cards with plain HTML, CSS, and JavaScript.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    links: [
      { label: 'Live', href: 'https://pranayraj09.github.io/deck-of-cards/' },
      { label: 'Code', href: 'https://github.com/pranayraj09/deck-of-cards' },
    ],
  },
  {
    name: 'To-Do App',
    tagline: 'Task list',
    description: 'A lightweight to-do list built with React components.',
    stack: ['React'],
    links: [
      { label: 'Live', href: 'https://pranayraj09.github.io/To-Do-App/' },
      { label: 'Code', href: 'https://github.com/pranayraj09/To-Do-App' },
    ],
  },
]

export const experience: Job[] = [
  {
    role: 'Staff Software Engineer, Full Stack',
    company: 'ServiceNow',
    location: 'Santa Clara, CA',
    start: 'Oct 2018',
    end: 'Present',
    logo: './logos/servicenow.svg',
    summary:
      'Enterprise component library, AI Agent platform UI, and engineering standards for ServiceNow digital properties.',
    highlights: [
      'Architected and delivered an enterprise-scale component library serving 20+ ServiceNow applications, letting marketing teams launch customer events, campaigns, and products 60% faster.',
      'Built the ServiceNow AI Agent platform UI, including an orchestrator framework for multi-agent coordination, an intelligent model-selection system, and RAG tools for context-aware AI responses.',
      'Led technical onboarding and mentored 8+ mid-level engineers, cutting ramp-up time by 50% through structured training and code review.',
      'Engineered 50+ reusable React components documented in Storybook, raising development velocity by 40% and keeping UI consistent across AEM digital properties.',
      'Wrote custom React hooks for local storage and API integration, reducing boilerplate by 35% and lifting test coverage to 85%.',
      'Implemented mobile-first responsive design in SCSS with 100% cross-browser compatibility.',
      'Integrated RESTful APIs for real-time data in internal tools used by 500+ employees and in customer-facing applications.',
      'Set code-quality standards and ran 200+ code reviews, reducing production bugs by 30% while keeping coverage above 85%.',
      'Led upgrades to React 18, TypeScript 5.0, and Webpack 5 to modernize the stack.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Storybook', 'SCSS', 'Adobe AEM', 'AI Agents', 'RAG'],
  },
  {
    role: 'Full Stack Developer',
    company: 'Intel',
    location: 'San Jose, CA',
    start: 'Feb 2018',
    end: 'Sep 2018',
    logo: './logos/intel.svg',
    summary: 'Altera–Intel web integration and custom AEM components for intel.com.',
    highlights: [
      'Delivered the Altera–Intel web integration, migrating 30+ pages and localizing content for 12 international markets.',
      'Built 15+ custom AEM components so business users could create and manage content on their own, reducing developer dependency by 70%.',
      'Engineered responsive web solutions with Node.js, JavaScript, and SASS, reaching 98% cross-browser compatibility across desktop and mobile.',
      'Partnered with UX designers and backend teams on pixel-perfect implementations that meet WCAG 2.0 accessibility standards.',
    ],
    stack: ['Adobe AEM', 'Node.js', 'JavaScript', 'SASS', 'WCAG 2.0'],
  },
  {
    role: 'UI Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    start: 'Jun 2016',
    end: 'Jan 2018',
    logo: './logos/apple.svg',
    summary: 'Localized product pages and a reusable React component library for internal applications.',
    highlights: [
      'Developed and localized Apple product pages for 20+ product lines across 15 international markets, supporting millions of customer interactions.',
      'Architected a reusable React component library with 25+ components, speeding up feature development by 50% for internal applications.',
      'Resolved 40+ AEM rendering issues for a consistent experience across platforms.',
    ],
    stack: ['React', 'Adobe AEM', 'JavaScript', 'Localization'],
  },
  {
    role: 'Web UI Developer',
    company: 'Goji',
    location: 'Boston, MA',
    start: 'Feb 2016',
    end: 'May 2016',
    note: 'Consumer United · start-up',
    summary: 'Auto insurance shopping platform and real-time analytics for insurance agents.',
    highlights: [
      'Delivered a complete auto insurance shopping platform as an AngularJS single-page app with a 2-second average page load on mobile and desktop.',
      'Built a real-time analytics dashboard tracking performance for 50+ insurance agents across multiple time periods with live data visualization.',
    ],
    stack: ['AngularJS', 'JavaScript', 'Data visualization'],
  },
  {
    role: 'Full Stack Web Developer',
    company: 'AT&T',
    location: 'Arlington Heights, IL',
    start: 'Jul 2015',
    end: 'Nov 2015',
    logo: './logos/att.svg',
    note: 'Internship',
    summary: 'Modernized a legacy JavaScript application and its templates.',
    highlights: [
      'Modernized a legacy JavaScript application by migrating it to Handlebars.js and AngularJS, improving maintainability by 60%.',
      'Integrated RESTful API calls for dynamic data fetching, reducing page refreshes and improving the user experience.',
      'Designed and built responsive HTML5/CSS3 templates with rich internet application features, resolving 25+ cross-browser issues.',
    ],
    stack: ['Handlebars.js', 'AngularJS', 'REST', 'HTML5', 'CSS3'],
  },
  {
    role: 'Web UI/UX Developer',
    company: 'Nielsen',
    location: 'Chicago, IL',
    start: 'Mar 2015',
    end: 'Jun 2015',
    logo: './logos/nielsen.svg',
    note: 'Internship',
    summary: 'Data-visualization single-page app for complex analytics datasets.',
    highlights: [
      'Engineered a data-visualization SPA in Ext JS with interactive charts and graphs for complex analytics datasets.',
      'Implemented an MVC architecture and fixed 30+ browser compatibility issues across Internet Explorer, Firefox, and Chrome for 100% cross-browser support.',
    ],
    stack: ['Ext JS', 'JavaScript', 'MVC'],
  },
]

export const stats: { value: string; label: string }[] = [
  { value: '12+', label: 'years building for the web' },
  { value: '20+', label: 'ServiceNow apps on my component library' },
  { value: '40%', label: 'faster page loads delivered' },
  { value: '200+', label: 'code reviews to raise the bar' },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages & Frameworks', items: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Redux', 'Node.js', 'Express'] },
  { group: 'Web', items: ['HTML5', 'CSS3', 'SASS / LESS', 'Bootstrap', 'REST APIs', 'webpack', 'Storybook', 'Adobe AEM'] },
  { group: 'AI', items: ['Claude Code', 'Prompt engineering', 'MCP', 'Agents', 'RAG', 'AI workflows'] },
  { group: 'Mobile & Data', items: ['Swift', 'SwiftUI', 'Kotlin', 'Jetpack Compose', 'MongoDB', 'Socket.IO'] },
]

export const education: Education[] = [
  {
    degree: 'M.S., Information Technology and Management',
    school: 'Illinois Institute of Technology',
    location: 'Chicago, IL',
    years: '2014 – Dec 2015',
    note: 'GPA 3.6 / 4.0',
  },
  {
    degree: 'B.Tech., Computer Science and Engineering',
    school: 'Jawaharlal Nehru Technological University',
    location: 'Hyderabad, India',
    years: '2009 – 2013',
  },
]

export const certifications: Certification[] = [
  { name: 'Claude Certified Architect – Foundations', issuer: 'Anthropic', year: '2026', badge: '/logos/claude.svg' },
  { name: 'Programming in HTML5 with JavaScript and CSS3', issuer: 'Microsoft Specialist', year: '2014', badge: '/logos/javascript.svg' },
]

export type BasementSpot = { id: string; title: string }

export const basementSpots: BasementSpot[] = [
  {
    id: 'gym',
    title: 'The gym',
  },
  {
    id: 'game',
    title: 'We got the speed',
  },
  {
    id: 'us',
    title: 'Player 1 & Player 2',
  },
  {
    id: 'toys',
    title: 'Toy corner',
  },
  {
    id: 'ai',
    title: 'The AI crew',
  },
]
