import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const fases = [
{
  n: "01", title: "Diagnóstico", desc: "Entendemos tu negocio, procesos y objetivos. Identificamos dónde la IA aporta valor real.",
  entregables: ["Mapa de procesos y dolor", "Oportunidades de IA priorizadas", "Roadmap ejecutable", "Presupuesto orientativo"],
  necesitas: ["Acceso a stakeholders clave", "Descripción de procesos actuales", "Objetivos de negocio claros"],
  duracion: "1–2 semanas"
},
{
  n: "02", title: "Prototipo", desc: "Construimos un MVP funcional para validar la solución con datos y usuarios reales.",
  entregables: ["Prototipo funcional", "Testing con datos reales", "Feedback documentado", "Plan de iteración"],
  necesitas: ["Datos de prueba o acceso a datos", "Feedback del equipo usuario", "Disponibilidad para revisar"],
  duracion: "2–4 semanas"
},
{
  n: "03", title: "Integración", desc: "Conectamos la solución con tus sistemas, datos y flujos de trabajo existentes.",
  entregables: ["Integraciones configuradas y testadas", "Documentación técnica", "Formación inicial del equipo", "Protocolo de soporte"],
  necesitas: ["Acceso a sistemas y APIs", "Responsable técnico del cliente", "Plan de comunicación interna"],
  duracion: "2–6 semanas"
},
{
  n: "04", title: "Escalado", desc: "Medimos impacto, iteramos y expandimos la solución a más procesos o equipos.",
  entregables: ["KPIs definidos y medidos", "Informes de impacto", "Plan de expansión", "Sesiones de mejora continua"],
  necesitas: ["Compromiso con métricas", "Feedback continuado", "Visión a medio plazo"],
  duracion: "Continuo"
}];


const Proceso = () =>
<Layout>
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader badge="Proceso" title="Cómo trabajamos" subtitle="Un proceso claro, medible y orientado a resultados. Sin sorpresas." />
      </div>
    </section>

    {fases.map((f, i) =>
  <section key={i} className="py-8 md:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fade} transition={{ delay: i * 0.1 }}>
            <GlassCard highlight={i === 0} className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl font-black text-gradient">{f.n}</span>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground mt-1">{f.desc}</p>
                  <span className="inline-block text-xs font-medium mt-2 glass-card px-3 py-1 text-accent">{f.duracion}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-accent">Entregables</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {f.entregables.map((e, j) =>
                <li key={j} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {e}</li>
                )}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-3">Qué necesitamos de ti</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {f.necesitas.map((n, j) => <li key={j}>· {n}</li>)}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
  )}

    {/* Gobierno del proyecto */}
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <GlassCard>
          <h3 className="text-xl font-semibold text-foreground mb-4">Gobierno del proyecto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium mb-2 text-accent">Comunicación</h4>
              <ul className="space-y-1">
                <li>· Reuniones semanales de seguimiento</li>
                <li>· Canal de comunicación directo</li>
                <li>· Informes de progreso periódicos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-accent">Medición</h4>
              <ul className="space-y-1">
                <li>· KPIs definidos con el cliente</li>
                <li>· Baseline antes de implementar</li>
                <li>· Revisión mensual de impacto</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>

    <section className="py-16 text-center">
      <Link to="/contacto">
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 btn-primary-glow rounded-xl text-base font-semibold px-8 py-3 h-auto gap-2">
          Agendar auditoría <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </section>
  </Layout>;


export default Proceso;