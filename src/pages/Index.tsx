import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Zap, Bot, Code, BarChart3, Shield,
  ClipboardCheck, AlertTriangle, Users, LineChart,
  ArrowRight, Sparkles, Lock, Eye } from
"lucide-react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import SectionHeader from "@/components/SectionHeader";
import Hat3xLogo from "@/components/Hat3xLogo";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const services = [
{ icon: Search, title: "Auditoría y roadmap de IA", desc: "Identificamos oportunidades reales de IA en tu empresa y priorizamos por impacto.", detail: "Entregable: roadmap priorizado" },
{ icon: Zap, title: "Automatización y agentes", desc: "Workflows inteligentes y copilotos que eliminan tareas repetitivas.", detail: "Desde procesos simples a agentes complejos" },
{ icon: Code, title: "Apps y productos con IA", desc: "Desarrollo a medida de apps web y móvil con IA integrada.", detail: "MVP en semanas" },
{ icon: Bot, title: "Integraciones", desc: "Conectamos IA con tu CRM, ERP, bases de datos y herramientas diarias.", detail: "APIs, RPA, conectores nativos" },
{ icon: BarChart3, title: "Analítica y ML", desc: "Modelos predictivos, scoring, alertas y dashboards inteligentes.", detail: "De datos a decisiones" },
{ icon: Shield, title: "Gobernanza y adopción", desc: "Seguridad, permisos, trazabilidad y formación para tu equipo.", detail: "Adopción real, no solo tech" }];


const problems = [
{ icon: ClipboardCheck, title: "Procesos lentos y manuales", desc: "Tu equipo pierde horas en tareas que una IA puede resolver en segundos." },
{ icon: AlertTriangle, title: "Información dispersa", desc: "Datos en 10 herramientas distintas, sin visión unificada." },
{ icon: Users, title: "Soporte y ventas saturados", desc: "Tus equipos no escalan porque dependen de respuestas humanas constantes." },
{ icon: LineChart, title: "Decisiones sin datos", desc: "Actúas por intuición cuando podrías usar predicción e inteligencia." }];


const casosVentas = ["Calificación automática de leads", "Resúmenes de llamadas con IA", "Propuestas asistidas por contexto"];
const casosAtencion = ["Respuesta sugerida para agentes", "Clasificación inteligente de tickets", "Base de conocimiento auto-actualizable"];
const casosOps = ["Procesamiento inteligente de documentos", "Alertas por anomalías operativas", "Checklists y flujos adaptativos"];
const casosFinanzas = ["Detección de fraude y anomalías", "Conciliación automática", "Proyecciones con ML"];
const casosRRHH = ["Screening automático de candidatos", "Onboarding asistido por IA", "Análisis de clima y rotación"];

const pasos = [
{ n: "01", title: "Diagnóstico", desc: "Auditoría de procesos, objetivos y datos disponibles.", entregables: ["Mapa de oportunidades", "Priorización por impacto/esfuerzo", "Roadmap inicial"] },
{ n: "02", title: "Prototipo", desc: "MVP funcional en días o semanas para validar la solución.", entregables: ["Prototipo funcional", "Pruebas con datos reales", "Feedback del equipo"] },
{ n: "03", title: "Integración", desc: "Conexión con tus sistemas, datos y flujos existentes.", entregables: ["Integraciones configuradas", "Documentación técnica", "Formación inicial"] },
{ n: "04", title: "Escalado", desc: "Medición de impacto, mejora continua y expansión.", entregables: ["KPIs definidos", "Informes de impacto", "Plan de expansión"] }];


const faqs = [
{ q: "¿Qué empresas se benefician más?", a: "Empresas con procesos repetitivos, volúmenes de datos o equipos que necesitan escalar sin multiplicar recursos. Desde pymes consolidadas hasta grandes corporaciones." },
{ q: "¿Cuánto tarda una primera entrega?", a: "Depende del alcance, pero un primer prototipo funcional suele estar listo en 2–4 semanas tras el diagnóstico inicial." },
{ q: "¿Necesitamos muchos datos?", a: "No siempre. Muchas soluciones de IA generativa funcionan con pocos datos propios. En diagnóstico evaluamos qué es viable con lo que tienes." },
{ q: "¿Se integra con nuestras herramientas?", a: "Sí. Trabajamos con CRMs, ERPs, bases de datos, Google Workspace, Microsoft 365 y prácticamente cualquier sistema con API." },
{ q: "¿Qué pasa con la seguridad y privacidad?", a: "Aplicamos buenas prácticas de seguridad: permisos por rol, cifrado, trazabilidad. Nos adaptamos a tus políticas internas." },
{ q: "¿Podéis crear una app o web con IA?", a: "Sí. Diseñamos y desarrollamos productos digitales con IA integrada: chatbots, paneles inteligentes, herramientas internas, apps móvil." },
{ q: "¿Cómo medimos el impacto?", a: "Definimos KPIs junto a tu equipo antes de empezar. Medimos tiempo ahorrado, errores reducidos, velocidad de respuesta y adopción." }];


const testimonials = [
{ name: "Director de Operaciones", role: "Empresa logística", text: "En pocas semanas, automatizamos un proceso que nos costaba horas cada día. El equipo lo adoptó sin resistencia." },
{ name: "Responsable de Ventas", role: "SaaS B2B", text: "El copiloto de ventas nos ayuda a priorizar leads y preparar propuestas mucho más rápido. Impacto inmediato." },
{ name: "CTO", role: "Fintech", text: "Nos ayudaron a integrar IA en nuestro producto sin romper nada. Buen proceso, buena comunicación." },
{ name: "CEO", role: "Consultora de servicios", text: "Por fin tenemos visibilidad real de nuestros procesos. Los dashboards inteligentes cambiaron nuestra forma de decidir." }];


const Index = () => {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div {...fade} className="max-w-4xl">
            <Hat3xLogo size="lg" className="mb-8" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 text-primary">
              Implementamos IA que mejora tu negocio{" "}
              <span className="text-gradient">desde el primer mes.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-4 leading-relaxed">
              Diseñamos e integramos soluciones de IA en tu empresa: automatización, agentes, apps y flujos inteligentes para aumentar productividad, reducir costes y acelerar decisiones.
            </p>
            <p className="text-sm text-muted-foreground mb-8">Sin humo. Entregables claros. Medición de impacto.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contacto">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 btn-primary-glow rounded-xl text-base font-semibold px-8 py-3 h-auto">
                  Solicitar auditoría
                </Button>
              </Link>
              <Link to="/casos-de-uso">
                <Button variant="outline" className="glass border-border/50 text-foreground hover:bg-muted/50 rounded-xl text-base px-8 py-3 h-auto">
                  Ver casos de uso
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Abstract mockup */}
          <motion.div {...fade} transition={{ delay: 0.3, duration: 0.6 }} className="mt-16 lg:mt-20">
            <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto glow-purple">
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4">
                  <div className="text-xs text-muted-foreground mb-2">Agentes activos</div>
                  <div className="text-2xl font-bold text-foreground">12</div>
                  <div className="h-1 bg-primary/30 rounded mt-2"><div className="h-1 bg-primary rounded w-3/4" /></div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-xs text-muted-foreground mb-2">Automatizaciones</div>
                  <div className="text-2xl font-bold text-foreground">48</div>
                  <div className="h-1 bg-accent/30 rounded mt-2"><div className="h-1 bg-accent rounded w-4/5" /></div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-xs text-muted-foreground mb-2">KPIs mejorados</div>
                  <div className="text-2xl font-bold text-gradient">↑</div>
                  <div className="h-1 bg-primary/30 rounded mt-2"><div className="h-1 bg-primary rounded w-2/3" /></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRUEBA SOCIAL */}
      <section className="py-16 border-y border-border/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {["Implementación end-to-end", "Integración con tus sistemas", "Seguridad por diseño"].map((b) =>
            <span key={b} className="glass-card px-5 py-2.5 text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> {b}
              </span>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm text-muted-foreground">
            <span>→ Menos tareas manuales</span>
            <span>→ Respuestas más rápidas</span>
            <span>→ Procesos trazables</span>
          </div>
        </div>
      </section>

      {/* PROBLEMAS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge="El problema" title="¿Reconoces alguno de estos retos?" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, i) =>
            <motion.div key={i} {...fade} transition={{ delay: i * 0.1 }}>
                <GlassCard>
                  <p.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </GlassCard>
              </motion.div>
            )}
          </div>
          <motion.div {...fade} className="mt-12 glass-card p-8 max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-foreground mb-3">Lo que hacemos</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Identificamos dónde la IA genera impacto real en tu negocio</li>
              <li>✓ Diseñamos e implementamos soluciones medibles</li>
              <li>✓ Integramos con tus sistemas sin disrupciones</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge="Servicios" title="IA aplicada a procesos, producto y negocio" subtitle="Cada servicio está diseñado para entregar resultados medibles." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) =>
            <motion.div key={i} {...fade} transition={{ delay: i * 0.08 }}>
                <GlassCard className="h-full">
                  <s.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.desc}</p>
                  <span className="text-xs text-primary font-medium">{s.detail}</span>
                </GlassCard>
              </motion.div>
            )}
          </div>
          <div className="text-center mt-10">
            <Link to="/servicios">
              <Button variant="outline" className="glass border-border/50 rounded-xl gap-2">
                Ver servicios <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge="Casos de uso" title="IA en cada área de tu empresa" subtitle="Resultados reales en ventas, soporte, operaciones, finanzas y RRHH." />
          <Tabs defaultValue="ventas" className="max-w-3xl mx-auto">
            <TabsList className="w-full flex flex-wrap glass rounded-xl mb-8 h-auto p-1">
              {[
              { v: "ventas", l: "Ventas" }, { v: "atencion", l: "Atención al cliente" },
              { v: "ops", l: "Operaciones" }, { v: "finanzas", l: "Finanzas" }, { v: "rrhh", l: "RRHH" }].
              map((t) =>
              <TabsTrigger key={t.v} value={t.v} className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-foreground flex-1 text-xs md:text-sm">
                  {t.l}
                </TabsTrigger>
              )}
            </TabsList>
            {[
            { v: "ventas", items: casosVentas }, { v: "atencion", items: casosAtencion },
            { v: "ops", items: casosOps }, { v: "finanzas", items: casosFinanzas }, { v: "rrhh", items: casosRRHH }].
            map((tab) =>
            <TabsContent key={tab.v} value={tab.v}>
                <div className="space-y-4">
                  {tab.items.map((item, i) =>
                <GlassCard key={i} className="flex items-start gap-4">
                      <span className="text-accent font-bold text-lg mt-0.5">{i + 1}</span>
                      <div>
                        <h4 className="font-medium text-foreground">{item}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Resultado esperado: mayor eficiencia y menor tiempo de respuesta.</p>
                      </div>
                    </GlassCard>
                )}
                </div>
              </TabsContent>
            )}
          </Tabs>
          <div className="text-center mt-10">
            <Link to="/casos-de-uso">
              <Button variant="outline" className="glass border-border/50 rounded-xl gap-2">
                Ver todos los casos <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge="Proceso" title="De la idea al impacto en 4 fases" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((p, i) =>
            <motion.div key={i} {...fade} transition={{ delay: i * 0.12 }}>
                <GlassCard highlight={i === 1} className="h-full">
                  <span className="text-3xl font-black text-gradient">{p.n}</span>
                  <h3 className="text-lg font-semibold text-foreground mt-3 mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium text-xs">Entregables:</span>
                    <ul className="mt-1 space-y-1">
                      {p.entregables.map((e, j) => <li key={j}>· {e}</li>)}
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass-card p-8 md:p-12 max-w-3xl mx-auto text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">Seguridad y confianza</h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Permisos por rol</span>
              <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> Trazabilidad y registros</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Protección de datos</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge="Opiniones" title="Lo que dicen nuestros clientes" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) =>
            <motion.div key={i} {...fade} transition={{ delay: i * 0.1 }}>
                <GlassCard className="h-full">
                  <p className="text-sm text-muted-foreground italic mb-4">"{t.text}"</p>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{t.name}</span>
                    <span className="text-muted-foreground"> · {t.role}</span>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <SectionHeader badge="FAQ" title="Preguntas frecuentes" />
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) =>
            <AccordionItem key={i} value={`faq-${i}`} className="glass-card border-0 px-6 overflow-hidden">
                <AccordionTrigger className="text-foreground text-sm font-medium hover:no-underline py-5">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5">{f.a}</AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass-card-highlight p-8 md:p-12 lg:p-16 max-w-3xl mx-auto">
            <SectionHeader
              title="Descubre en 30 minutos dónde la IA puede ahorrarte tiempo esta semana."
              subtitle="Cuéntanos tu proceso y te devolvemos un roadmap priorizado con oportunidades reales."
              align="left" />

            <ContactForm variant="short" />
          </div>
        </div>
      </section>
    </Layout>);

};

export default Index;