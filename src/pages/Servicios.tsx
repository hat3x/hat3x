import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Zap, Code, Bot, BarChart3, Shield, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const servicios = [
{
  icon: Search, title: "Auditoría y roadmap de IA",
  desc: "Analizamos tus procesos, datos y objetivos para identificar dónde la IA genera impacto real.",
  incluye: ["Mapa de procesos y oportunidades", "Priorización impacto/esfuerzo", "Roadmap ejecutable con fases", "Presentación de resultados"],
  para: "Empresas que quieren empezar con IA de forma estratégica.",
  tiempo: "1–3 semanas"
},
{
  icon: Zap, title: "Automatización y agentes",
  desc: "Diseñamos workflows inteligentes y copilotos de IA que eliminan tareas repetitivas.",
  incluye: ["Diseño de workflows automatizados", "Agentes conversacionales (internos o externos)", "Integraciones con herramientas existentes", "Testing y puesta en producción"],
  para: "Equipos con carga operativa alta y procesos repetitivos.",
  tiempo: "2–6 semanas"
},
{
  icon: Code, title: "Apps y productos con IA",
  desc: "Desarrollamos aplicaciones web y móvil con inteligencia artificial integrada.",
  incluye: ["Diseño UX/UI", "Desarrollo frontend y backend", "Integración de modelos de IA", "Deploy y mantenimiento"],
  para: "Empresas que quieren lanzar un producto con IA o añadir IA a un producto existente.",
  tiempo: "4–12 semanas"
},
{
  icon: Bot, title: "Integraciones",
  desc: "Conectamos IA con tu CRM, ERP, bases de datos, Google Workspace, Microsoft 365 y más.",
  incluye: ["Análisis de sistemas y APIs", "Desarrollo de conectores", "Sincronización de datos", "Documentación técnica"],
  para: "Empresas con ecosistema de herramientas consolidado.",
  tiempo: "2–4 semanas"
},
{
  icon: BarChart3, title: "Analítica y ML",
  desc: "Modelos predictivos, scoring, detección de anomalías y dashboards inteligentes.",
  incluye: ["Exploración y preparación de datos", "Entrenamiento de modelos", "Dashboards y alertas", "Documentación y mantenimiento"],
  para: "Empresas con datos que quieren tomar decisiones basadas en evidencia.",
  tiempo: "3–8 semanas"
},
{
  icon: Shield, title: "Gobernanza y adopción",
  desc: "Seguridad, permisos, trazabilidad y formación para que tu equipo adopte la IA.",
  incluye: ["Auditoría de seguridad y permisos", "Políticas de uso de IA", "Formación para equipos", "Plan de adopción y seguimiento"],
  para: "Empresas que priorizan la seguridad y la adopción real por parte de su equipo.",
  tiempo: "2–4 semanas"
}];


const Servicios = () =>
<Layout>
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader badge="Servicios" title="IA aplicada a procesos, producto y negocio." subtitle="Cada servicio entrega resultados medibles. Combinamos lo que necesites." />
      </div>
    </section>

    {servicios.map((s, i) =>
  <section key={i} className="py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fade}>
            <GlassCard highlight={i === 0} className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <s.icon className="w-10 h-10 text-primary shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-accent">Qué incluye</h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    {s.incluye.map((item, j) => <li key={j}>· {item}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-accent">Para quién</h4>
                  <p className="text-sm text-muted-foreground">{s.para}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-accent">Tiempo orientativo</h4>
                  <p className="text-sm text-muted-foreground">{s.tiempo}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
  )}

    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <Link to="/contacto">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 btn-primary-glow rounded-xl text-base font-semibold px-8 py-3 h-auto gap-2">
            Solicitar auditoría <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  </Layout>;


export default Servicios;