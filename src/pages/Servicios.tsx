import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, BrainCircuit, Cog, MessageSquare, LayoutDashboard, Headset, ArrowRight, Zap, Clock, MessageCircle, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const servicios = [
{
  icon: Globe,
  title: "Creación de páginas web profesionales",
  desc: "Creamos páginas web modernas para que tu empresa tenga presencia online, genere confianza y atraiga nuevos clientes.",
  incluye: [
    "Diseño moderno y profesional",
    "Web rápida y adaptada a móvil",
    "Formularios de contacto para captar clientes",
    "Optimización básica para aparecer en Google",
    "Estas son solo algunas posibilidades. Cada proyecto se adapta a las necesidades de la empresa.",
  ],
  para: "Empresas que quieren mejorar su presencia online y atraer nuevos clientes.",
  tiempo: "2–4 semanas"
},
{
  icon: BrainCircuit,
  title: "Webs inteligentes con IA (asistente 24/7)",
  desc: "Creamos páginas web avanzadas con asistentes inteligentes que pueden responder automáticamente a las preguntas de tus clientes y ayudarles a encontrar lo que buscan.",
  incluye: [
    "Chat inteligente en la web",
    "Respuestas automáticas a preguntas frecuentes",
    "Captación automática de contactos o clientes potenciales",
    "Posibilidad de reservar citas o solicitar información",
    "Estas son solo algunas posibilidades. Cada proyecto se adapta a las necesidades de la empresa.",
  ],
  para: "Empresas que reciben muchas consultas y quieren atender a sus clientes incluso fuera del horario laboral.",
  tiempo: "3–6 semanas"
},
{
  icon: Cog,
  title: "Automatización de tareas del negocio",
  desc: "Automatizamos tareas repetitivas para que tu empresa ahorre tiempo y pueda centrarse en lo realmente importante.",
  incluye: [
    "Automatización de documentos",
    "Automatización de facturas o presupuestos",
    "Automatización de correos y formularios",
    "Recordatorios automáticos de citas o tareas",
    "Estas son solo algunas posibilidades. Cada proyecto se adapta a las necesidades de la empresa.",
  ],
  para: "Empresas que quieren reducir trabajo manual y mejorar la eficiencia de sus procesos.",
  tiempo: "2–5 semanas"
},
{
  icon: MessageSquare,
  title: "Automatización de comunicación con clientes",
  desc: "Configuramos sistemas automáticos para gestionar mensajes y consultas de clientes en distintos canales como WhatsApp, redes sociales o formularios de la web.",
  incluye: [
    "Automatización de mensajes en WhatsApp",
    "Automatización en Instagram y redes sociales",
    "Respuestas automáticas a preguntas frecuentes",
    "Integración con formularios o sistemas de reservas",
    "Estas son solo algunas posibilidades. Cada proyecto se adapta a las necesidades de la empresa.",
  ],
  para: "Empresas que reciben muchas consultas de clientes y quieren responder de forma rápida y organizada.",
  tiempo: "2–4 semanas"
},
{
  icon: LayoutDashboard,
  title: "Apps y plataformas personalizadas para empresas",
  desc: "Desarrollamos aplicaciones y plataformas digitales adaptadas a tu negocio, tanto para uso interno como para tus propios clientes.",
  incluye: [
    "Desarrollo de aplicaciones web o móviles",
    "Paneles para gestionar clientes, productos o servicios",
    "Plataformas privadas para clientes o empleados",
    "Integración con sistemas de la empresa",
    "Estas son solo algunas posibilidades. Cada proyecto se adapta a las necesidades de la empresa.",
  ],
  para: "Empresas que quieren digitalizar procesos o ofrecer nuevos servicios digitales a sus clientes.",
  tiempo: "4–10 semanas"
},
{
  icon: Headset,
  title: "Mantenimiento y soporte tecnológico",
  desc: "Ofrecemos mantenimiento y soporte continuo para asegurar que todas las soluciones tecnológicas de tu empresa funcionen correctamente en todo momento.",
  incluye: [
    "Supervisión y mantenimiento de sistemas implementados",
    "Resolución de problemas técnicos",
    "Actualizaciones y mejoras de funcionalidades",
    "Ajustes y optimización de herramientas o automatizaciones",
  ],
  para: "Empresas que quieren garantizar que su tecnología funcione correctamente y contar con soporte cuando lo necesiten.",
  tiempo: "Servicio continuo"
}];


const Servicios = () =>
<Layout>
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Servicios"
          title="Soluciones tecnológicas para hacer crecer tu empresa"
          subtitle="Nuestros servicios están pensados para ayudar a las empresas a trabajar de forma más eficiente, automatizar tareas y ofrecer una experiencia más profesional a sus clientes."
        />
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

    {/* Métricas */}
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Resultados"
          title="Tecnología que mejora la forma de trabajar de las empresas"
          subtitle="Ayudamos a negocios a ahorrar tiempo, mejorar su organización y ofrecer una mejor experiencia a sus clientes mediante herramientas digitales y automatización."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {[
            {
              icon: Zap,
              number: "100+",
              title: "Tareas optimizadas",
              text: "Procesos repetitivos que nuestros clientes han simplificado o automatizado en sus empresas.",
            },
            {
              icon: Clock,
              number: "60%",
              title: "Tiempo recuperado",
              text: "Reducción media del tiempo dedicado a tareas administrativas gracias a automatizaciones.",
            },
            {
              icon: MessageCircle,
              number: "24/7",
              title: "Atención automatizada",
              text: "Sistemas que permiten responder consultas de clientes en cualquier momento del día.",
            },
            {
              icon: TrendingUp,
              number: "3x",
              title: "Procesos más rápidos",
              text: "Empresas que han conseguido agilizar tareas internas mediante herramientas digitales.",
            },
          ].map((item, i) => (
            <motion.div key={i} {...fade}>
              <div className="glass-card p-6 md:p-8 h-full flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <p className="text-4xl font-bold text-foreground">{item.number}</p>
                <p className="text-sm font-semibold text-accent">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <Link to="/contacto">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 btn-primary-glow rounded-xl text-base font-semibold px-8 py-3 h-auto gap-2">
            Cuéntanos tu proyecto <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  </Layout>;


export default Servicios;