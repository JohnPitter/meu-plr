import { useState } from "react";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Code2,
  Building2,
  Search,
  ChevronDown,
  ExternalLink,
  Globe,
  Star,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { cn } from "../lib/utils.ts";

// ─── Data ────────────────────────────────────────────────────────────────────

const MARKET_OVERVIEW = [
  { platform: "LinkedIn Brasil", count: "+10.000", region: "Brasil", href: "https://br.linkedin.com/jobs/programador-java-senior-vagas" },
  { platform: "Indeed Brasil", count: "294", region: "Brasil", href: "https://br.indeed.com/q-desenvolvedor-java-s%C3%AAnior-vagas.html" },
  { platform: "Glassdoor Brasil", count: "581", region: "Brasil", href: "https://www.glassdoor.com.br/Vaga/java-spring-vagas-SRCH_KO0,11.htm" },
  { platform: "Glassdoor Global", count: "1.802", region: "Global (remoto)", href: "https://www.glassdoor.com/Job/remote-senior-java-developer-jobs-SRCH_IL.0,6_IS11047_KO7,28.htm" },
  { platform: "LinkedIn Global", count: "+3.000", region: "EUA/Global", href: "https://www.linkedin.com/jobs/remote-senior-java-developer-jobs" },
  { platform: "FlexJobs", count: "+103.000", region: "Global (remoto)", href: "https://www.flexjobs.com/remote-jobs/senior-java-developer" },
];

const SALARY_BRAZIL = [
  { label: "25º — Base", value: "R$ 6.749/mês" },
  { label: "50º — Mediana", value: "R$ 9.250/mês", highlight: true },
  { label: "75º — Acima da média", value: "R$ 12.024/mês" },
  { label: "90º — Top performers", value: "R$ 17.503/mês" },
];

const SALARY_USA = [
  { label: "25º — Base", value: "$114.500 – $129.339/ano" },
  { label: "50º — Mediana", value: "$130.681 – $166.001/ano", highlight: true },
  { label: "75º — Acima da média", value: "$146.000 – $215.633/ano" },
  { label: "Freelancer", value: "$49 – $80/hr" },
];

const SALARY_EUROPE = [
  { label: "Europa Ocidental", value: "$77.000 – $96.000/ano" },
  { label: "Europa Oriental", value: "$27.600 – $73.200/ano" },
];

const TECH_MANDATORY = [
  "Java 8+ / Java 17+ (LTS)",
  "Spring Boot / Spring MVC / Spring Security",
  "API RESTful (design e implementação)",
  "SQL (PostgreSQL, MySQL, Oracle)",
  "Git (versionamento)",
];

const TECH_DESIRABLE = [
  "Microservices Architecture",
  "Docker & Kubernetes",
  "Apache Kafka / RabbitMQ",
  "Hibernate / JPA (ORM)",
  "CI/CD (Jenkins, GitHub Actions, GitLab CI)",
  "Cloud (AWS, Azure ou GCP)",
];

const TECH_DIFFERENTIAL = [
  "Inteligência Artificial / LLMs",
  "Observabilidade (Prometheus, Grafana, ELK Stack)",
  "Event-Driven Architecture",
  "Design Patterns & Clean Architecture",
  "Testes automatizados (JUnit, Mockito, Testcontainers)",
  "WebServices SOAP (legado)",
];

const COMPANIES_BRAZIL = [
  "Accenture", "Sensedia", "CI&T", "Compass UOL",
  "Invillia", "Grupo Data", "Senior Sistemas",
];

const COMPANIES_INTERNATIONAL = [
  "CareCentrix", "Optum", "NTT DATA", "Peraton",
  "AmeriSave Mortgage Corp.", "MEMIC",
];

const JOB_PLATFORMS = [
  { name: "LinkedIn", description: "Maior volume de vagas", href: "https://br.linkedin.com/jobs/programador-java-senior-vagas" },
  { name: "Indeed", description: "Filtros avançados, vagas PJ/remoto", href: "https://br.indeed.com/q-desenvolvedor-java-s%C3%AAnior-vagas.html" },
  { name: "Glassdoor", description: "Salários + avaliações de empresas", href: "https://www.glassdoor.com.br/Sal%C3%A1rios/desenvolvedor-java-senior-sal%C3%A1rio-SRCH_KO0,25.htm" },
  { name: "ProgramaThor", description: "Vagas tech Brasil", href: "https://programathor.com.br/jobs-java" },
  { name: "Revelo", description: "Vagas remotas curadas", href: "https://careers.revelo.com/oportunidades/java" },
  { name: "FlexJobs", description: "Remoto internacional", href: "https://www.flexjobs.com/remote-jobs/senior-java-developer" },
  { name: "Turing", description: "Remoto p/ LATAM (USD)", href: "https://www.turing.com/jobs/remote-senior-java-developer" },
  { name: "Wellfound", description: "Startups", href: "https://wellfound.com/role/r/java-developer" },
];

const TRENDS = [
  { icon: "⚡", title: "Microservices continua dominante", description: "246+ vagas mencionam explicitamente microservices no Glassdoor Brasil." },
  { icon: "☁️", title: "Cloud-native é o novo padrão", description: "Kubernetes, Docker e cloud providers são esperados, não diferencial." },
  { icon: "🤖", title: "IA como competência transversal", description: "68% do mercado já considera conhecimento em IA como requisito básico." },
  { icon: "📨", title: "Event-Driven Architecture em crescimento", description: "Kafka aparece cada vez mais como requisito obrigatório." },
  { icon: "🌐", title: "Vagas remotas em abundância", description: "Modelo remoto/híbrido continua forte tanto no Brasil quanto internacionalmente." },
  { icon: "💰", title: "Salários internacionais acessíveis", description: "Brasileiros remoto para EUA podem acessar $49–$80/hr (R$ 17.000–28.000/mês)." },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionToggle({
  icon: Icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {title}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </CardTitle>
      </CardHeader>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

function SalaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
        highlight
          ? "bg-primary/10 font-semibold text-primary"
          : "text-foreground",
      )}
    >
      <span className="text-muted-foreground font-normal">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function TechList({ items, color }: { items: string[]; color: "red" | "yellow" | "green" }) {
  const dot: Record<string, string> = {
    red: "bg-destructive",
    yellow: "bg-yellow-500",
    green: "bg-success",
  };

  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm">
          <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot[color])} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function JavaJobsReport() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border bg-primary/5 p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-lg tracking-tight">
            Mercado Java Senior — Fevereiro 2026
          </h2>
          <Badge variant="secondary" className="ml-auto text-xs">
            Atualizado fev/2026
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Panorama completo de vagas, salários e tecnologias requisitadas para
          Desenvolvedor Java Sênior no Brasil e no exterior.
        </p>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
          {[
            { label: "Vagas no Brasil", value: "+10.000" },
            { label: "Vagas global", value: "+103.000" },
            { label: "Mediana BR", value: "R$ 9.250" },
            { label: "Mediana EUA", value: "$148K/ano" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-card border px-3 py-2 text-center">
              <p className="text-base font-bold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 1 - Market Overview */}
      <SectionToggle icon={Globe} title="Panorama Geral do Mercado" defaultOpen>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                <th className="text-left py-2 pr-4 font-medium">Plataforma</th>
                <th className="text-right py-2 pr-4 font-medium">Vagas</th>
                <th className="text-right py-2 font-medium">Região</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MARKET_OVERVIEW.map(({ platform, count, region, href }) => (
                <tr key={platform} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 pr-4">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      {platform}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-semibold">{count}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionToggle>

      {/* 2 - Salary Ranges */}
      <SectionToggle icon={DollarSign} title="Faixas Salariais">
        <div className="space-y-6">
          {/* Brazil */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              🇧🇷 Brasil (CLT / PJ)
            </h4>
            <div className="space-y-1">
              {SALARY_BRAZIL.map((row) => (
                <SalaryRow key={row.label} {...row} />
              ))}
            </div>
          </div>

          {/* USA */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              🇺🇸 EUA / Remoto Internacional (USD/ano)
            </h4>
            <div className="space-y-1">
              {SALARY_USA.map((row) => (
                <SalaryRow key={row.label} {...row} />
              ))}
            </div>
          </div>

          {/* Europe */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              🇪🇺 Europa (USD/ano)
            </h4>
            <div className="space-y-1">
              {SALARY_EUROPE.map((row) => (
                <SalaryRow key={row.label} {...row} />
              ))}
            </div>
          </div>
        </div>
      </SectionToggle>

      {/* 3 - Tech Stack */}
      <SectionToggle icon={Code2} title="Stack Tecnológico Requisitado">
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Obrigatório — 80%+ das vagas
              </h4>
            </div>
            <TechList items={TECH_MANDATORY} color="red" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Altamente desejável — 50–80% das vagas
              </h4>
            </div>
            <TechList items={TECH_DESIRABLE} color="yellow" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Diferenciais competitivos — 20–50% das vagas
              </h4>
            </div>
            <TechList items={TECH_DIFFERENTIAL} color="green" />
          </div>
        </div>
      </SectionToggle>

      {/* 4 - Companies */}
      <SectionToggle icon={Building2} title="Principais Empresas Contratando">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              🇧🇷 Brasil
            </h4>
            <div className="flex flex-wrap gap-2">
              {COMPANIES_BRAZIL.map((company) => (
                <Badge key={company} variant="secondary">
                  {company}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cidades com mais vagas:{" "}
              <span className="font-medium">
                São Paulo, Campinas, Curitiba, Blumenau, Brasília, Joinville
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              🌐 Internacional (Remoto)
            </h4>
            <div className="flex flex-wrap gap-2">
              {COMPANIES_INTERNATIONAL.map((company) => (
                <Badge key={company} variant="outline">
                  {company}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SectionToggle>

      {/* 5 - Platforms */}
      <SectionToggle icon={Search} title="Melhores Plataformas para Busca">
        <div className="grid gap-2 sm:grid-cols-2">
          {JOB_PLATFORMS.map(({ name, description, href }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors group"
            >
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">{name}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </SectionToggle>

      {/* 6 - Trends */}
      <SectionToggle icon={TrendingUp} title="Tendências do Mercado">
        <div className="space-y-3">
          {TRENDS.map(({ icon, title, description }) => (
            <div key={title} className="flex gap-3 text-sm">
              <span className="text-base shrink-0 mt-0.5">{icon}</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionToggle>

      {/* Executive Summary */}
      <div className="rounded-xl border bg-primary/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Resumo Executivo</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O mercado para <strong className="text-foreground">Desenvolvedor Senior Java</strong> em fevereiro de 2026 é{" "}
          <strong className="text-foreground">robusto e com alta demanda</strong>. Com mais de{" "}
          <strong className="text-foreground">10.000 vagas</strong> só no Brasil e{" "}
          <strong className="text-foreground">103.000+ globalmente</strong>, profissionais com domínio de{" "}
          Java + Spring Boot + Microservices + Cloud têm excelentes oportunidades.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Os salários variam de <strong className="text-foreground">R$ 9.250/mês</strong> (mediana Brasil) a{" "}
          <strong className="text-foreground">$166K USD/ano</strong> (mediana EUA remoto), com forte tendência
          de valorização para quem domina <strong className="text-foreground">IA</strong> e{" "}
          <strong className="text-foreground">arquiteturas event-driven</strong>.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {["Java 17+", "Spring Boot", "Microservices", "Cloud", "Kafka", "IA/LLMs"].map((tech) => (
            <Badge key={tech} className="text-xs">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {tech}
            </Badge>
          ))}
        </div>

        <div className="rounded-lg bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <Zap className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
            <span>
              Pesquisa realizada em fevereiro de 2026. Dados baseados em
              LinkedIn, Indeed, Glassdoor, FlexJobs, ZipRecruiter e Qubit Labs.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
