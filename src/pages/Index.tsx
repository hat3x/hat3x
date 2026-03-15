import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, BrainCircuit, Cog, MessageSquare, LayoutDashboard, Headset, Shield,
  MessageCircle, Repeat, Layers, Clock,
  ArrowRight, Lock, Database, Headphones } from "lucide-react";
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
{ icon: Globe, title: "Páginas web profesionales", desc: "Creamos webs modernas para que tu empresa genere confianza y atraiga nuevos clientes.", detail: "Diseño moderno · Adaptada a móvil · SEO básico" },
{ icon: BrainCircuit, title: "Webs inteligentes con IA", desc: "Páginas web con asistentes que responden a tus clientes de forma automática, 24 horas al día.", detail: "Chat inteligente · Captación automática · Reservas" },
{ icon: Cog, title: "Automatización de tareas", desc: "Automatizamos tareas repetitivas para que tu equipo ahorre tiempo y se centre en lo importante.", detail: "Documentos · Facturas · Correos · Recordatorios" },
{ icon: MessageSquare, title: "Comunicación con clientes", desc: "Gestionamos mensajes y consultas automáticamente en WhatsApp, redes sociales o tu web.", detail: "WhatsApp · Instagram · Formularios" },
{ icon: LayoutDashboard, title: "Apps y plataformas a medida", desc: "Desarrollamos aplicaciones y plataformas digitales adaptadas a las necesidades de tu negocio.", detail: "Apps web y móvil · Paneles de gestión · Integraciones" },
{ icon: Headset, title: "Mantenimiento y soporte", desc: "Supervisión y soporte continuo para que tu tecnología funcione correctamente en todo momento.", detail: "Servicio continuo · Actualizaciones · Soporte técnico" }];


const problems = [
{ icon: MessageCircle, title: "Demasiados mensajes y consultas", desc: "Gran parte del día se va respondiendo WhatsApp o correos con las mismas preguntas de siempre. Con sistemas automáticos, muchas de estas consultas pueden resolverse solas." },
{ icon: Repeat, title: "Tareas repetitivas que consumen horas", desc: "Facturas, presupuestos, correos o gestión de citas son tareas que se repiten constantemente. Automatizar estos procesos puede ahorrar muchas horas de trabajo cada semana." },
{ icon: Layers, title: "Todo repartido en distintas herramientas", desc: "Clientes, documentos y mensajes en distintas herramientas o archivos. Una app o plataforma que centralice todo puede facilitar mucho la gestión diaria." },
{ icon: Clock, title: "Clientes esperando respuesta", desc: "Muchas consultas llegan cuando estás ocupado o fuera del horario laboral. Con herramientas adecuadas, los clientes pueden recibir respuesta en cualquier momento." }];


const casosVentas = ["Calificación automática de leads", "Resúmenes de llamadas con IA", "Propuestas asistidas por contexto"];
const casosAtencion = ["Respuesta sugerida para agentes", "Clasificación inteligente de tickets", "Base de conocimiento auto-actualizable"];
const casosOps = ["Procesamiento inteligente de documentos", "Alertas por anomalías operativas", "Checklists y flujos adaptativos"];
const casosFinanzas = ["Detección de fraude y anomalías", "Conciliación automática", "Proyecciones con ML"];
const casosRRHH = ["Screening automático de candidatos", "Onboarding asistido por IA", "Análisis de clima y rotación"];

const pasos = [
{ n: "01", title: "Entendemos tu empresa", desc: "Analizamos cómo funciona tu negocio, qué tareas te quitan más tiempo y dónde la tecnología puede ayudarte realmente.", entregables: ["Identificamos oportunidades claras de mejora"] },
{ n: "02", title: "Diseñamos la solución", desc: "Proponemos una solución adaptada a tu empresa: automatizaciones, herramientas digitales o nuevas funcionalidades.", entregables: ["Tienes claro qué se va a implementar y cómo funcionará"] },
{ n: "03", title: "Implementamos las herramientas", desc: "Desarrollamos e integramos las soluciones necesarias para que todo funcione correctamente dentro de tu negocio.", entregables: ["Empiezas a ahorrar tiempo y mejorar tus procesos"] },
{ n: "04", title: "Mejoramos y ampliamos", desc: "A medida que tu empresa crece, podemos seguir mejorando las herramientas e implementar nuevas funcionalidades.", entregables: ["La tecnología evoluciona junto a tu negocio"] }];


const faqs = [
{ q: "¿Qué tipo de empresas pueden beneficiarse de estos servicios?", a: "Cualquier empresa que quiera ahorrar tiempo en tareas repetitivas, mejorar la organización de su negocio o ofrecer una mejor atención a sus clientes." },
{ q: "¿Cuánto tiempo tarda en implementarse una solución?", a: "Depende del proyecto, pero muchas soluciones pueden empezar a funcionar en pocas semanas." },
{ q: "¿Necesito conocimientos técnicos para usar estas herramientas?", a: "No. Diseñamos las soluciones para que sean fáciles de usar en el día a día." },
{ q: "¿Se puede adaptar a las herramientas que ya usamos?", a: "Sí. Siempre que sea posible, integramos las soluciones con las herramientas que ya utiliza tu empresa." },
{ q: "¿La información de mi empresa estará segura?", a: "Sí. Aplicamos buenas prácticas de seguridad y trabajamos con herramientas fiables para proteger los datos." },
{ q: "¿Podéis crear una app o plataforma para mi empresa?", a: "Sí. Desarrollamos aplicaciones y herramientas digitales adaptadas a cada negocio." },
{ q: "¿Las soluciones se pueden ampliar en el futuro?", a: "Sí. Las herramientas pueden evolucionar con tu empresa y añadir nuevas funcionalidades cuando sea necesario." }];


const testimonials = [
{ name: "Gerente", role: "Empresa de servicios", text: "Nos ayudaron a automatizar varias tareas que hacíamos manualmente. Ahora ahorramos bastante tiempo cada semana." },
{ name: "Responsable de atención al cliente", role: "", text: "El sistema para responder consultas de clientes nos ha quitado mucho trabajo diario. Funciona muy bien." },
{ name: "Director", role: "Empresa local", text: "La app que desarrollaron nos ha ayudado a tener todo mucho más organizado." },
{ name: "CEO", role: "Empresa de consultoría", text: "Se nota que entienden cómo funcionan las empresas. Las soluciones que propusieron encajaban muy bien con lo que necesitábamos." }];


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
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 text-primary-foreground">
              Haz que tu empresa trabaje mejor, más rápido{" "}
              <span className="text-gradient">y de forma más inteligente.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-4 leading-relaxed">
              Ayudamos a empresas a modernizar su negocio con soluciones tecnológicas que automatizan tareas, mejoran la organización y facilitan el crecimiento.
            </p>
            <p className="text-sm text-muted-foreground mb-8">Sin complicaciones. Soluciones claras. Resultados reales.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contacto">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 btn-primary-glow rounded-xl text-base font-semibold px-8 py-3 h-auto">
                  Cuéntanos tu proyecto
                </Button>
              </Link>
              <Link to="/casos-de-uso">
                <Button variant="outline" className="glass border-border/50 text-foreground hover:bg-muted/50 rounded-xl text-base px-8 py-3 h-auto">
                  Ver casos de uso
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* PROBLEMAS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="¿Te suena?"
            title="¿Te suena alguna de estas situaciones en tu empresa?"
            subtitle="Muchas empresas pierden tiempo cada día en tareas que podrían hacerse de forma más simple, automática o mejor organizadas."
          />
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
            <h3 className="text-lg font-semibold text-foreground mb-3">Cómo podemos ayudarte</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✔ Automatizamos tareas repetitivas para ahorrar tiempo</li>
              <li>✔ Creamos sistemas que responden automáticamente a clientes</li>
              <li>✔ Desarrollamos apps y herramientas que organizan tu negocio en un solo lugar</li>
              <li>✔ Implementamos soluciones tecnológicas adaptadas a cada empresa</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge="Servicios" title="Soluciones tecnológicas para hacer crecer tu empresa" subtitle="Páginas web, automatizaciones, herramientas inteligentes y apps a medida para que tu negocio trabaje mejor." />
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

      {/* PROCESO */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge="Proceso" title="Cómo trabajamos contigo para mejorar tu empresa" subtitle="Un proceso claro y sencillo para implementar soluciones tecnológicas que realmente ayuden a tu negocio." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((p, i) =>
            <motion.div key={i} {...fade} transition={{ delay: i * 0.12 }}>
                <GlassCard highlight={i === 1} className="h-full">
                  <span className="text-3xl font-black text-gradient">{p.n}</span>
                  <h3 className="text-lg font-semibold text-foreground mt-3 mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium text-xs">Resultado:</span>
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
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Seguridad y confianza en cada proyecto</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto">Trabajamos con herramientas seguras y buenas prácticas para proteger la información de tu empresa y garantizar un funcionamiento fiable.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="flex flex-col gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground text-sm">Control de accesos</span>
                <p className="text-xs text-muted-foreground">Solo las personas autorizadas pueden acceder a la información y herramientas de la empresa.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Database className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground text-sm">Protección de datos</span>
                <p className="text-xs text-muted-foreground">Aplicamos medidas para proteger la información sensible de tu negocio y tus clientes.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground text-sm">Sistemas fiables</span>
                <p className="text-xs text-muted-foreground">Trabajamos con tecnologías estables y probadas para asegurar que todo funcione correctamente.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Headphones className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground text-sm">Soporte cercano</span>
                <p className="text-xs text-muted-foreground">Estamos disponibles para resolver dudas o problemas y asegurar que todo siga funcionando.</p>
              </div>
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
                    {t.role && <span className="text-muted-foreground"> · {t.role}</span>}
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

    </Layout>);

};

export default Index;