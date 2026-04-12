export interface Project {
  name: string;
  description: { en: string; ptBr: string };
  technologies: string[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    name: "ABMock",
    description: {
      en: "Mock admin with dark theme, real-time editing via SSE, Monaco Editor, and a mock engine with Handlebars templates.",
      ptBr: "Admin de mocks com tema escuro, edição em tempo real via SSE, Monaco Editor e engine de mocks com templates Handlebars.",
    },
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "SSE"],
    github: "https://github.com/oandersonmagalhaes/ab-mock",
  },
  {
    name: "Golang POC Observability",
    description: {
      en: "Proof of concept implementing observability patterns in Go with structured logging, metrics, and distributed tracing.",
      ptBr: "Prova de conceito implementando padrões de observabilidade em Go com logging estruturado, métricas e tracing distribuído.",
    },
    technologies: ["Go", "OpenTelemetry", "Prometheus", "Grafana"],
    github: "https://github.com/oandersonmagalhaes/golang-poc-observability",
  },
  {
    name: "SimplesAPI",
    description: {
      en: "A lightweight Python API framework focused on simplicity and developer experience.",
      ptBr: "Um framework leve de API Python focado em simplicidade e experiência do desenvolvedor.",
    },
    technologies: ["Python", "REST API"],
    github: "https://github.com/oandersonmagalhaes/simplesapi",
  },
  {
    name: "Base64 Translator",
    description: {
      en: "Browser-based Base64 encoder and decoder with full UTF-8 support. Zero dependencies, runs entirely client-side.",
      ptBr: "Codificador e decodificador Base64 no navegador com suporte completo a UTF-8. Zero dependências, roda inteiramente no client-side.",
    },
    technologies: ["TypeScript", "Web APIs"],
    demo: "/base64-translator",
  },
  {
    name: "UUID4 Generator",
    description: {
      en: "Random UUID v4 generator with bulk generation support, using the native crypto API for secure randomness.",
      ptBr: "Gerador de UUID v4 aleatório com suporte a geração em lote, usando a API nativa de crypto para aleatoriedade segura.",
    },
    technologies: ["TypeScript", "crypto API"],
    demo: "/uuid4",
  },
  {
    name: "UUID from String",
    description: {
      en: "Deterministic UUID v5 generator from any string input using SHA-1 and standard namespaces (DNS, URL, OID, X500).",
      ptBr: "Gerador determinístico de UUID v5 a partir de qualquer string usando SHA-1 e namespaces padrão (DNS, URL, OID, X500).",
    },
    technologies: ["TypeScript", "SubtleCrypto", "SHA-1"],
    demo: "/uuid-from-string",
  },
  {
    name: "Password Generator",
    description: {
      en: "Secure password generator with customizable length, character sets, and a real-time strength indicator.",
      ptBr: "Gerador de senhas seguras com tamanho customizável, conjuntos de caracteres e indicador de força em tempo real.",
    },
    technologies: ["TypeScript", "crypto API"],
    demo: "/password-generator",
  },
  {
    name: "Easy Crontab",
    description: {
      en: "Visual cron expression builder with human-readable descriptions, presets, and next execution times preview.",
      ptBr: "Construtor visual de expressões cron com descrições legíveis, presets e preview das próximas execuções.",
    },
    technologies: ["TypeScript", "Cron"],
    demo: "/easy-crontab",
  },
  {
    name: "JWT Validator",
    description: {
      en: "JWT decoder that inspects header, payload, and signature with expiration checks and detailed claim information.",
      ptBr: "Decodificador JWT que inspeciona header, payload e assinatura com verificação de expiração e informações detalhadas.",
    },
    technologies: ["TypeScript", "jose"],
    demo: "/jwt-validator",
  },
  {
    name: "JSON Validator",
    description: {
      en: "JSON validator with formatting and minification, real-time error detection, and line-level error reporting.",
      ptBr: "Validador JSON com formatação e minificação, detecção de erros em tempo real e relatório de erros por linha.",
    },
    technologies: ["TypeScript"],
    demo: "/json-validator",
  },
  {
    name: "Text Compare",
    description: {
      en: "Side-by-side text diff tool with line-level highlighting of additions and removals using the diff library.",
      ptBr: "Ferramenta de diff de textos lado a lado com destaque de adições e remoções por linha usando a biblioteca diff.",
    },
    technologies: ["TypeScript", "diff"],
    demo: "/text-compare",
  },
];
