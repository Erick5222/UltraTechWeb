export interface TechCarouselRow {
  id: string;
  items: string[];
  duration: number;
}

export const TECH_CAROUSEL_ROWS: TechCarouselRow[] = [
  {
    id: 'frontend',
    items: [
      'Angular',
      'React',
      'Next.js',
      'Vue.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'SCSS',
      'Tailwind CSS',
      'Material UI',
      'Ionic',
      'Flutter',
      'Responsive Design',
      'Web Components'
    ],
    duration: 40,
  },
  {
    id: 'backend',
    items: [
      '.NET',
      'C#',
      'ASP.NET Core',
      'Node.js',
      'Java',
      'Spring Boot',
      'Python',
      'Django',
      'FastAPI',
      'Go',
      'REST APIs',
      'GraphQL',
      'gRPC',
      'Microservices',
      'Event Driven Architecture',
      'RabbitMQ',
      'Background Services'
    ],
    duration: 60,
  },
  {
    id: 'cloud',
    items: [
      'Microsoft Azure',
      'AWS',
      'Google Cloud',
      'Docker',
      'Kubernetes',
      'Terraform',
      'CI/CD',
      'Azure DevOps',
      'GitHub Actions',
      'Cloud Native',
      'Serverless',
      'Infrastructure as Code',
      'Linux',
      'Nginx'
    ],
    duration: 85,
  },
  {
    id: 'database',
    items: [
      'SQL Server',
      'PostgreSQL',
      'MySQL',
      'Oracle Database',
      'MongoDB',
      'Redis',
      'Elasticsearch',
      'Firebase',
      'Entity Framework',
      'Dapper',
      'Database Design',
      'Data Modeling'
    ],
    duration: 50,
  }
]
