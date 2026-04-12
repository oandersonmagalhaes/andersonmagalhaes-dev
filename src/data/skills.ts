export interface Skill {
  name: string;
  category: string;
}

export const skillCategories = [
  {
    key: "languages",
    skills: ["Go", "Python", "TypeScript", "JavaScript", "C#", "SQL", "Bash"],
  },
  {
    key: "frameworks",
    skills: [
      "Gin",
      "FastAPI",
      "Django",
      "React",
      "Next.js",
      "Node.js",
      ".NET Core",
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
      "Datadog",
      "New Relic",
      "Grafana",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "MySQL",
      "RabbitMQ",
      "Kafka",
      "SNS",
      "SQS",
      "NATS",
    ],
  },
  {
    key: "security",
    skills: ["SAST", "DAST", "OWASP", "SonarQube", "Snyk", "Vault"],
  },
] as const;
