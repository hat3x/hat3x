import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const areas = [
  {
    id: "ventas", label: "Ventas",
    casos: [
      { title: "Calificación automática de leads", problema: "Los comerciales pierden tiempo con leads no cualificados.", solucion: "IA que clasifica leads por probabilidad de cierre usando datos históricos y comportamiento.", integraciones: "CRM, email, formularios web", resultado: "Mayor foco en oportunidades reales, menor tiempo de cualificación." },
      { title: "Resúmenes de llamadas con IA", problema: "Las notas de llamadas se pierden o son incompletas.", solucion: "Transcripción y resumen automático con extracción de próximos pasos.", integraciones: "Telefonía, CRM, calendario", resultado: "Mejor seguimiento y trazabilidad comercial." },
      { title: "Propuestas asistidas por contexto", problema: "Preparar propuestas consume demasiado tiempo.", solucion: "Generación asistida de propuestas a partir de briefs y datos del cliente.", integraciones: "CRM, repositorio de documentos", resultado: "Propuestas más rápidas y personalizadas." },
    ],
  },
  {
    id: "atencion", label: "Atención al cliente",
    casos: [
      { title: "Respuesta sugerida para agentes", problema: "Los agentes tardan en encontrar la respuesta correcta.", solucion: "IA que sugiere respuestas en tiempo real basándose en la base de conocimiento.", integraciones: "Helpdesk, chat, base de conocimiento", resultado: "Respuestas más rápidas y consistentes." },
      { title: "Clasificación inteligente de tickets", problema: "Los tickets se asignan manualmente y a veces al equipo equivocado.", solucion: "Clasificación automática por tema, urgencia y equipo responsable.", integraciones: "Helpdesk, email", resultado: "Mejor distribución de carga y menor tiempo de resolución." },
      { title: "Base de conocimiento auto-actualizable", problema: "La documentación se queda desactualizada.", solucion: "IA que detecta preguntas frecuentes nuevas y sugiere artículos.", integraciones: "Helpdesk, wiki interna", resultado: "Documentación siempre al día y relevante." },
    ],
  },
  {
    id: "ops", label: "Operaciones",
    casos: [
      { title: "Procesamiento inteligente de documentos", problema: "Leer y extraer datos de documentos es lento y propenso a errores.", solucion: "Extracción automática de datos de facturas, albaranes, certificados.", integraciones: "ERP, email, almacenamiento", resultado: "Menos errores y procesamiento más rápido." },
      { title: "Alertas por anomalías operativas", problema: "Los problemas se detectan tarde.", solucion: "Monitorización continua con alertas cuando algo sale de lo esperado.", integraciones: "Bases de datos, sistemas de monitorización", resultado: "Detección temprana de incidencias." },
      { title: "Checklists y flujos adaptativos", problema: "Los procesos estándar no se adaptan al contexto.", solucion: "Checklists inteligentes que se ajustan según el tipo de tarea o proyecto.", integraciones: "Herramientas de gestión, ERP", resultado: "Procesos más ágiles y menos errores." },
    ],
  },
  {
    id: "finanzas", label: "Finanzas",
    casos: [
      { title: "Detección de fraude y anomalías", problema: "Revisar transacciones manualmente no escala.", solucion: "Modelos que detectan patrones inusuales en tiempo real.", integraciones: "ERP, pasarelas de pago", resultado: "Menor riesgo y detección más temprana." },
      { title: "Conciliación automática", problema: "La conciliación manual consume horas cada semana.", solucion: "IA que cruza datos entre sistemas y propone matchings.", integraciones: "ERP, bancos, contabilidad", resultado: "Menos tiempo dedicado y mayor precisión." },
      { title: "Proyecciones con ML", problema: "Las previsiones se basan en hojas de cálculo estáticas.", solucion: "Modelos predictivos que incorporan variables externas y tendencias.", integraciones: "ERP, BI, datos externos", resultado: "Previsiones más fiables para tomar decisiones." },
    ],
  },
  {
    id: "rrhh", label: "RRHH",
    casos: [
      { title: "Screening automático de candidatos", problema: "Revisar cientos de CVs manualmente es inviable.", solucion: "IA que prefiltra candidatos por ajuste al puesto y experiencia.", integraciones: "ATS, email, portales de empleo", resultado: "Proceso de selección más ágil." },
      { title: "Onboarding asistido por IA", problema: "El onboarding es inconsistente y consume recursos.", solucion: "Asistente virtual que guía al nuevo empleado paso a paso.", integraciones: "Wiki, HRIS, calendario", resultado: "Mejor experiencia de incorporación." },
      { title: "Análisis de clima y rotación", problema: "No hay visibilidad sobre satisfacción y riesgo de fuga.", solucion: "Análisis de encuestas, feedback y patrones de rotación.", integraciones: "HRIS, encuestas, comunicación interna", resultado: "Decisiones proactivas sobre retención." },
    ],
  },
];

const CasosDeUso = () => {
  const [activeArea, setActiveArea] = useState("ventas");
  const currentArea = areas.find((a) => a.id === activeArea)!;

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge="Casos de uso" title="IA en cada área de tu empresa" subtitle="Ejemplos concretos de cómo la IA transforma procesos reales." />

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {areas.map((a) => (
              <button
                key={a.id}
                onClick={() => setActiveArea(a.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeArea === a.id
                    ? "bg-primary/20 text-foreground border border-primary/40"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {currentArea.casos.map((c, i) => (
              <motion.div key={`${activeArea}-${i}`} {...fade}>
                <GlassCard>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{c.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-accent mb-1">Problema</h4>
                      <p className="text-sm text-muted-foreground mb-4">{c.problema}</p>
                      <h4 className="text-sm font-semibold text-primary mb-1">Solución</h4>
                      <p className="text-sm text-muted-foreground">{c.solucion}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-primary mb-1">Integraciones típicas</h4>
                      <p className="text-sm text-muted-foreground mb-4">{c.integraciones}</p>
                      <h4 className="text-sm font-semibold text-primary mb-1">Resultado esperado</h4>
                      <p className="text-sm text-muted-foreground">{c.resultado}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">¿No ves tu caso? Cuéntanoslo.</p>
            <Link to="/contacto">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 btn-primary-glow rounded-xl text-base font-semibold px-8 py-3 h-auto gap-2">
                Cuéntanos tu caso <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CasosDeUso;
