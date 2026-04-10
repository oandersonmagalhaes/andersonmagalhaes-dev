export interface Skill {
  name: string;
  category: string;
}

export const skillCategories = [
  {
    key: "languages",
    skills: [
      "Go",
      "Python",
      "TypeScript",
      "JavaScript",
      "Java",
      "SQL",
      "Bash",
    ],
  },
  {
    key: "frameworks",
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "FastAPI",
      "Spring Boot",
      "Gin",
      "Django",
    ],
  },
  {
    key: "infrastructure",
    skills: [
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "Terraform",
      "CI/CD",
      "Linux",
    ],
  },
  {
    key: "tools",
    skills: [
      "Git",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "RabbitMQ",
      "Kafka",
      "Grafana",
    ],
  },
  {
    key: "security",
    skills: ["SAST", "DAST", "OWASP", "SonarQube", "Snyk", "Vault"],
  },
] as const;
