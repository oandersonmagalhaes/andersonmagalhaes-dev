export interface Experience {
  company: string;
  role: { en: string; ptBr: string };
  period: string;
  current: boolean;
  description: { en: string; ptBr: string };
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    company: "Serasa Experian",
    role: {
      en: "Software Engineer / Tech Lead",
      ptBr: "Desenvolvedor de Software / Tech Lead",
    },
    period: "2023 - Present",
    current: true,
    description: {
      en: "Leading development teams, architecting scalable solutions, and driving quality practices across the organization. Focus on backend systems, observability, and security.",
      ptBr: "Liderei o time de parceiros, reestruturei toda a parte de integração e processos, tornando o fluxo mais robusto e simples para integrar, reduzindo o tempo de integração e garantindo a escalabilidade e manutenabilidade do ecossistema.",
    },
    technologies: ["Go", "Python", "NodeJS", "AWS", "Kubernetes", "Terraform"],
  },
  {
    company: "Stone Co.",
    role: {
      en: "Software Engineer",
      ptBr: "Desenvolvedor de Software",
    },
    period: "2020 - 2023",
    current: false,
    description: {
      en: "Developed and maintained full-stack applications, implemented CI/CD pipelines, and contributed to infrastructure automation and monitoring solutions. Actively participated in the re-engineering of billing, payment, and customer pricing systems, creating a viable ecosystem for companies entering or being acquired by the group.",
      ptBr: "Desenvolveu e manteve aplicacoes full-stack, implementou pipelines CI/CD e contribuiu para automacao de infraestrutura e solucoes de monitoramento. Participei ativamente de uma re-engenharia da parte faturamento, cobrança e precificação de clientes, criando um ecossistema viável para empresas que estavam entrando para o grupo/sendo adquiridas.",
    },
    technologies: ["Python", "C#", "NodeJS", "Docker", "PostgreSQL"],
  },
  {
    company: "Gestão DS",
    role: {
      en: "Software Engineer",
      ptBr: "Desenvolvedor de Software",
    },
    period: "2019 - 2020",
    current: false,
    description: {
      en: "Built solutions for small and medium medical clinics, developed backend services and APIs, worked with relational databases, and participated in agile development processes. Grew from junior to senior engineer.",
      ptBr: "Criei soluções para pequenos e médios consultórios médicos, construiu servicos backend e APIs, trabalhou com bancos de dados relacionais e participou de processos ageis de desenvolvimento. Cresceu de junior a engenheiro senior.",
    },
    technologies: ["Python", "MySQL", "REST APIs", "Git"],
  },
  {
    company: "CNSA",
    role: {
      en: "Software Engineer",
      ptBr: "Desenvolvedor de Software",
    },
    period: "2010 - 2019",
    current: false,
    description: {
      en: "Built multiple educational applications and backend services, worked with relational databases, and participated in agile development processes. Grew from junior to senior engineer.",
      ptBr: "Desenvolveu várias aplicações para o ramo educacional e serviços backend, trabalhou com bancos de dados relacionais e participou de processos ágeis de desenvolvimento. Cresceu de junior a engenheiro senior.",
    },
    technologies: ["Java", "Python", "MySQL", "REST APIs", "Git"],
  },
];
