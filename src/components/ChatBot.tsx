import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Phone, Mail, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatAction {
  label: string;
  /** If set, sends this text as user message */
  message?: string;
  /** If set, navigates to this route */
  navigate?: string;
  /** If set, opens this href (mailto/tel/https) */
  href?: string;
}

interface Message {
  role: "bot" | "user";
  text: string;
  actions?: ChatAction[];
}

type Intent =
  | "saludo"
  | "web"
  | "automatizacion"
  | "app"
  | "clientes_whatsapp"
  | "precio"
  | "plazos"
  | "contacto"
  | "proceso"
  | "mantenimiento"
  | "integraciones"
  | "citas"
  | "gracias"
  | "despedida"
  | "default";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL = "info@hat3x.com";
const PHONE = "+34 614 205 537";
const PHONE_RAW = "+34614205537";

const INITIAL_ACTIONS: ChatAction[] = [
  { label: "Quiero mejorar mi web", message: "Quiero mejorar mi web" },
  { label: "Quiero automatizar tareas", message: "Quiero automatizar tareas" },
  { label: "Necesito una app o plataforma", message: "Necesito una app o plataforma" },
  { label: "Quiero contactar con el equipo", message: "Quiero contactar con el equipo" },
];

const FALLBACK_ACTIONS: ChatAction[] = [
  { label: "Mejorar mi web", message: "Quiero mejorar mi web" },
  { label: "Automatizar tareas", message: "Quiero automatizar tareas" },
  { label: "Crear una app", message: "Necesito una app o plataforma" },
  { label: "Hablar con el equipo", message: "Quiero contactar con el equipo" },
];

// ─── Intent keywords ──────────────────────────────────────────────────────────

const INTENT_MAP: Record<Exclude<Intent, "default">, string[]> = {
  saludo: ["hola", "buenas", "buenos dias", "buenos días", "hey", "hello", "ola"],
  web: [
    "web", "pagina", "página", "sitio", "landing", "rediseno", "rediseño",
    "mejorar web", "crear web", "pagina web", "página web", "website",
  ],
  automatizacion: [
    "automatiza", "automatizar", "automatizacion", "automatización",
    "automtizar", "automtizacion", "ahorrar tiempo", "tareas repetitivas",
    "procesos", "flujo", "workflow", "tarea", "tareas",
  ],
  app: [
    "app", "aplicacion", "aplicación", "aplicion", "plataforma", "software",
    "herramienta", "portal", "area privada", "área privada", "sistema",
    "programa", "gestion", "gestión",
  ],
  clientes_whatsapp: [
    "whatsapp", "wasap", "wsp", "instagram", "redes", "mensajes", "clientes",
    "atencion", "atención", "responder clientes", "consultas", "leads",
    "captar", "comunicacion", "comunicación", "chat",
  ],
  citas: ["citas", "reservas", "agenda", "agendar", "turnos", "booking", "recordatorio"],
  precio: [
    "precio", "precios", "coste", "costo", "cuanto cuesta", "cuánto cuesta",
    "presupuesto", "presupeusto", "tarifa", "cuanto vale", "cuánto vale", "pagar",
  ],
  plazos: [
    "tiempo", "plazo", "plazos", "cuanto tarda", "cuánto tarda",
    "cuanto tiempo", "cuánto tiempo", "semanas", "meses", "rapido",
  ],
  contacto: [
    "contacto", "contactar", "email", "correo", "telefono", "teléfono",
    "llamar", "hablar", "escribir", "mensaje", "alguien",
  ],
  proceso: [
    "proceso", "como trabajais", "cómo trabajáis", "como funciona",
    "cómo funciona", "pasos", "metodologia", "metodología",
  ],
  mantenimiento: ["mantenimiento", "soporte", "incidencias", "mejoras", "actualizaciones"],
  integraciones: [
    "integra", "integraciones", "crm", "erp", "api", "sistemas",
    "google workspace", "microsoft", "conectar", "herramientas",
  ],
  gracias: ["gracias", "muchas gracias", "perfecto", "genial", "ok gracias"],
  despedida: ["adios", "adiós", "hasta luego", "nos vemos", "bye", "chao"],
};

// ─── Text utils ───────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let j = 1; j <= a.length; j++) {
    let prev = j;
    for (let i = 1; i <= b.length; i++) {
      const cur = m[i - 1] === 0 || m[i] === 0
        ? 0
        : Math.min(
            m[i] + 1,
            prev + 1,
            m[i - 1] + (a[j - 1] === b[i - 1] ? 0 : 1),
          );
      m[i - 1] = prev;
      prev = cur;
    }
    m[b.length] = prev;
  }
  return m[b.length];
}

function fuzzyIncludes(input: string, keyword: string): boolean {
  if (input.includes(keyword)) return true;
  const kw = keyword.split(" ");
  if (kw.length > 1) {
    return kw.every((w) => input.includes(w)) || input.includes(kw[0]);
  }
  return input.split(" ").some(
    (w) => Math.abs(w.length - keyword.length) <= 2 && levenshtein(w, keyword) <= 2,
  );
}

function detectIntent(raw: string): Intent {
  const input = normalize(raw);
  const order: Exclude<Intent, "default">[] = [
    "saludo", "gracias", "despedida",
    "contacto", "precio", "plazos",
    "web", "automatizacion", "app",
    "clientes_whatsapp", "citas",
    "mantenimiento", "integraciones", "proceso",
  ];
  for (const intent of order) {
    for (const kw of INTENT_MAP[intent]) {
      if (fuzzyIncludes(input, normalize(kw))) return intent;
    }
  }
  return "default";
}

// ─── Response builder ─────────────────────────────────────────────────────────

function buildResponse(intent: Intent): { text: string; actions: ChatAction[] } {
  switch (intent) {
    case "saludo":
      return {
        text: "¡Hola! ¿En qué puedo ayudarte hoy?",
        actions: INITIAL_ACTIONS,
      };

    case "web":
      return {
        text: "Podemos ayudarte a crear una web nueva o mejorar la que ya tienes. Por ejemplo, hacerla más moderna, más clara, más profesional y orientada a captar clientes. También podemos añadir formularios más útiles o asistentes inteligentes.",
        actions: [
          { label: "Quiero una web nueva", message: "Quiero una web nueva" },
          { label: "Quiero mejorar mi web actual", message: "Quiero mejorar mi web actual" },
          { label: "Quiero una web con asistente", message: "Quiero una web con asistente" },
          { label: "Ver servicios web", navigate: "/servicios" },
        ],
      };

    case "automatizacion":
      return {
        text: "Podemos automatizar tareas repetitivas como respuestas a consultas, formularios, presupuestos, recordatorios, organización interna o procesos entre herramientas. El objetivo es ahorrar tiempo y reducir trabajo manual.",
        actions: [
          { label: "Automatizar WhatsApp o mensajes", message: "Quiero automatizar WhatsApp" },
          { label: "Automatizar tareas internas", message: "Quiero automatizar tareas internas" },
          { label: "Automatizar formularios", message: "Quiero automatizar formularios" },
          { label: "Ver servicios de automatización", navigate: "/servicios" },
        ],
      };

    case "app":
      return {
        text: "Podemos desarrollar apps y plataformas a medida para tu empresa o para tus clientes. Por ejemplo, herramientas de gestión, áreas privadas, sistemas de reservas o plataformas para centralizar información.",
        actions: [
          { label: "App para clientes", message: "Quiero una app para clientes" },
          { label: "Plataforma interna", message: "Quiero una plataforma interna" },
          { label: "Centralizar información", message: "Quiero centralizar información en una plataforma" },
          { label: "Ver servicios de apps", navigate: "/servicios" },
        ],
      };

    case "clientes_whatsapp":
      return {
        text: "También podemos ayudarte a automatizar la atención a clientes en canales como WhatsApp, formularios o redes sociales, para responder más rápido y no perder ninguna consulta.",
        actions: [
          { label: "Automatizar WhatsApp", message: "Quiero automatizar WhatsApp" },
          { label: "Responder consultas automáticamente", message: "Quiero responder consultas automáticamente" },
          { label: "Captar más clientes", message: "Quiero captar más clientes" },
          { label: "Ver casos de uso", navigate: "/casos-de-uso" },
        ],
      };

    case "citas":
      return {
        text: "Podemos crear sistemas para gestionar citas, reservas y recordatorios automáticos. Esto ayuda a reducir olvidos, organizar mejor la agenda y mejorar la experiencia de tus clientes.",
        actions: [
          { label: "Gestionar citas online", message: "Quiero gestionar citas online" },
          { label: "Recordatorios automáticos", message: "Quiero recordatorios automáticos" },
          { label: "Ver servicios", navigate: "/servicios" },
        ],
      };

    case "precio":
      return {
        text: "El presupuesto depende del tipo de proyecto y de lo que necesites. No es lo mismo mejorar una web que desarrollar una app o automatizar varios procesos. Si quieres, podemos orientarte mejor si nos cuentas brevemente qué necesitas.",
        actions: [
          { label: "Pedir presupuesto", navigate: "/contacto" },
          { label: "Contar mi proyecto", navigate: "/tu-idea" },
          { label: "Hablar con el equipo", message: "Quiero contactar con el equipo" },
        ],
      };

    case "plazos":
      return {
        text: "Los plazos dependen del proyecto. Algunas mejoras o automatizaciones pueden estar listas en pocas semanas, mientras que desarrollos más amplios como apps o plataformas pueden llevar más tiempo. Siempre proponemos una hoja de ruta clara.",
        actions: [
          { label: "Quiero algo rápido", message: "Quiero una solución rápida" },
          { label: "Quiero una app completa", message: "Necesito una app o plataforma" },
          { label: "Ver cómo trabajamos", navigate: "/proceso" },
        ],
      };

    case "contacto":
      return {
        text: `Puedes escribirnos a ${EMAIL}, llamarnos al ${PHONE} o usar el formulario de contacto de la web.`,
        actions: [
          { label: "Ir a contacto", navigate: "/contacto" },
          { label: "Enviar email", href: `mailto:${EMAIL}` },
          { label: "Llamar ahora", href: `tel:${PHONE_RAW}` },
        ],
      };

    case "proceso":
      return {
        text: "Trabajamos en 4 pasos: entendemos tu negocio, diseñamos la solución, la implementamos y después hacemos seguimiento. El proceso es claro, práctico y adaptado a cada empresa.",
        actions: [
          { label: "Ver cómo trabajamos", navigate: "/proceso" },
          { label: "Contar mi proyecto", navigate: "/tu-idea" },
          { label: "Pedir presupuesto", navigate: "/contacto" },
        ],
      };

    case "mantenimiento":
      return {
        text: "También ofrecemos mantenimiento y soporte. Podemos ayudarte con mejoras, incidencias, ajustes y seguimiento de las soluciones implementadas.",
        actions: [
          { label: "Soporte técnico", message: "Necesito soporte técnico" },
          { label: "Mejorar una herramienta existente", message: "Quiero mejorar una herramienta existente" },
          { label: "Hablar con el equipo", message: "Quiero contactar con el equipo" },
        ],
      };

    case "integraciones":
      return {
        text: "Podemos integrar herramientas que ya usas en tu empresa, como CRM, formularios, correo, bases de datos u otras plataformas, para conectar procesos y trabajar de forma más eficiente.",
        actions: [
          { label: "Integrar mi CRM", message: "Quiero integrar mi CRM" },
          { label: "Conectar herramientas", message: "Quiero conectar varias herramientas" },
          { label: "Ver servicios", navigate: "/servicios" },
        ],
      };

    case "gracias":
      return {
        text: "¡De nada! Si necesitas algo más, aquí estoy.",
        actions: [
          { label: "Ver servicios", navigate: "/servicios" },
          { label: "Ir a contacto", navigate: "/contacto" },
        ],
      };

    case "despedida":
      return {
        text: `¡Hasta luego! Si necesitas hablar con el equipo, puedes escribirnos a ${EMAIL} o llamarnos al ${PHONE}.`,
        actions: [
          { label: "Enviar email", href: `mailto:${EMAIL}` },
          { label: "Llamar ahora", href: `tel:${PHONE_RAW}` },
        ],
      };

    default:
      return {
        text: "No estoy completamente seguro de lo que necesitas, pero puedo ayudarte con páginas web, automatización, apps, atención a clientes o contacto con el equipo.",
        actions: FALLBACK_ACTIONS,
      };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const ChatBot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hola, soy el asistente de HAT3X. Puedo ayudarte a encontrar la mejor solución para tu empresa, ya sea mejorar tu web, automatizar tareas, crear una app o resolver dudas sobre nuestros servicios. ¿Qué necesitas?",
      actions: INITIAL_ACTIONS,
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const pushBotResponse = (userText: string) => {
    const intent = detectIntent(userText);
    const response = buildResponse(intent);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: response.text, actions: response.actions },
      ]);
    }, 380);
  };

  const handleAction = (action: ChatAction) => {
    if (action.href) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (action.navigate) {
      setOpen(false);
      navigate(action.navigate);
      return;
    }
    if (action.message) {
      const userMsg: Message = { role: "user", text: action.message };
      setMessages((prev) => [...prev, userMsg]);
      pushBotResponse(action.message);
    }
  };

  const send = (forcedText?: string) => {
    const text = (forcedText ?? input).trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    pushBotResponse(text);
  };

  const isNavOrHref = (action: ChatAction) => action.navigate || action.href;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Abrir chat"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card border border-border/40 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ maxHeight: "76vh" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-foreground">Asistente HAT3X</div>
                <div className="text-[11px] text-muted-foreground">Respuestas rápidas sobre nuestros servicios</div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-primary/70" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted/60 text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>

                {/* Actions */}
                {m.role === "bot" && m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.actions.map((action, j) => (
                      <button
                        key={j}
                        onClick={() => handleAction(action)}
                        className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          isNavOrHref(action)
                            ? "border-primary/40 bg-primary/8 hover:bg-primary/15 text-primary"
                            : "border-border/50 bg-background/40 hover:bg-background/70 text-foreground"
                        }`}
                      >
                        {action.label}
                        {isNavOrHref(action) && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Contact strip */}
          <div className="px-3 py-2 border-t border-border/20 text-[11px] text-muted-foreground flex flex-wrap gap-3 shrink-0">
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail className="w-3 h-3" />
              {EMAIL}
            </a>
            <a href={`tel:${PHONE_RAW}`} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Phone className="w-3 h-3" />
              {PHONE}
            </a>
          </div>

          {/* Input */}
          <div className="border-t border-border/30 p-3 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <Button
              size="icon"
              onClick={() => send()}
              disabled={!input.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-9 w-9 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
