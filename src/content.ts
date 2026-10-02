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
  summary?: string
}

export type Education = {
  degree: string
  school: string
  location: string
  years: string
}

export const profile = {
  name: 'Pranay Raj Kyatham',
  title: 'Staff Web Developer',
  location: 'San Jose, CA',
  summary:
    'Front-end engineer with a decade of building web experiences at ServiceNow, Intel, and Apple. On my own time I ship products end to end — native iOS and Android apps, real-time Node.js backends, and tools for traders.',
  email: 'kyatham.pranay@gmail.com',
  resume: './Pranay_Kyatham-Resume.pdf',
  links: [
    { label: 'GitHub', href: 'https://github.com/pranayraj09' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pranayraj09' },
  ] satisfies Link[],
}

export const about = [
  'I started out teaching myself HTML, CSS, and JavaScript, building sites for university events and startups, and grew into front-end work on large marketing and product sites. Today I am a Staff Web Developer at ServiceNow.',
  'Outside work I enjoy owning a product across every layer: designing the API, modelling the data, and shipping the native clients that sit on top of it.',
  'Lately I have been building Linkd, a cross-platform dating app with server-driven UI and real-time chat, and a set of trading tools that automate signal execution and make P&L across brokers easy to understand.',
]

export const featuredProjects: Project[] = [
  {
    name: 'Linkd',
    tagline: 'Cross-platform dating app',
    description:
      'Native iOS and Android clients backed by a single Express API. Onboarding and profile forms are server-driven JSON schemas rendered natively on each platform, chat runs over Socket.IO with typing indicators and push notifications, and a multi-tier recommendation service scores compatibility between candidates.',
    stack: ['Swift', 'SwiftUI', 'Kotlin', 'Jetpack Compose', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'FCM'],
  },
  {
    name: 'Bot Trader',
    tagline: 'Automated options trading dashboard',
    description:
      'Monitors trade signals from Discord and TradingView webhooks, parses them with an AI model, executes on Tradier, and tracks positions and stop losses live. A React dashboard streams quotes and P&L over Server-Sent Events, and signals fan out to Telegram.',
    stack: ['React', 'Node.js', 'Playwright', 'Gemini', 'SSE', 'Tradier API', 'Telegram'],
  },
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
    role: 'Staff Web Developer',
    company: 'ServiceNow',
    location: 'Santa Clara, CA',
    start: 'Mar 2022',
    end: 'Present',
  },
  {
    role: 'Senior Front End Developer',
    company: 'ServiceNow',
    location: 'Santa Clara, CA',
    start: 'Oct 2018',
    end: 'Feb 2022',
    summary:
      'Marketing technology group: built web interfaces and single-page apps for ServiceNow global marketing events and managed the .com website with React, ES6, and SCSS.',
  },
  {
    role: 'Front End Developer',
    company: 'Intel',
    location: 'San Jose, CA',
    start: 'Feb 2018',
    end: 'Oct 2018',
    summary:
      'Integration team: built and customized Adobe AEM components to match intel.com styles using ES6, Node.js, and SCSS.',
  },
  {
    role: 'UI Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    start: 'Jun 2016',
    end: 'Jan 2018',
    summary:
      'AppleCare: front-end development on AEM components and web and Node.js applications for test automation.',
  },
  {
    role: 'Web UI Developer',
    company: 'Goji',
    location: 'Boston, MA',
    start: 'Mar 2016',
    end: 'May 2016',
    summary:
      'Responsive company website, internal sales-analytics tools, and a Swagger-based documentation site for public REST APIs.',
  },
  {
    role: 'Full Stack Web Developer',
    company: 'AT&T',
    location: 'Arlington Heights, IL',
    start: 'Jul 2015',
    end: 'Nov 2015',
    summary: 'Refactored internal applications from Perl to Handlebars.js and shipped features and fixes across AT&T repositories.',
  },
  {
    role: 'Web UI/UX Developer',
    company: 'Nielsen',
    location: 'Chicago, IL',
    start: 'Apr 2015',
    end: 'Jun 2015',
    summary:
      'Built Nielsen Market Analytics, an interactive Ext JS app with rich tables and charts, and an appointment-booking app for Nielsen agents.',
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Mobile', items: ['Swift', 'SwiftUI', 'Kotlin', 'Jetpack Compose', 'Retrofit'] },
  { group: 'Frontend', items: ['React', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3 / SCSS', 'Adobe AEM'] },
  { group: 'Backend', items: ['Node.js', 'Express', 'Socket.IO', 'REST APIs', 'Server-Sent Events'] },
  { group: 'Data & Infra', items: ['MongoDB', 'Mongoose', 'Redis', 'Firebase Cloud Messaging', 'Playwright'] },
]

export const education: Education[] = [
  {
    degree: 'M.S., Information Technology and Management',
    school: 'Illinois Institute of Technology',
    location: 'Chicago, IL',
    years: '2014 – 2016',
  },
  {
    degree: 'B.Tech., Computer Science and Engineering',
    school: 'Jawaharlal Nehru Technological University',
    location: 'Hyderabad, India',
    years: '2009 – 2013',
  },
]
