import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Phone, Mail, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatAction {
  label: string;
  message?: string;   // send as user message
  navigate?: string;  // navigate to route
  href?: string;      // open external link
}

interface Message {
  role: "bot" | "user";
  text: string;
  actions?: ChatAction[];
}

type Intent =
  | "saludo" | "gracias" | "despedida"
  | "web" | "web_nueva" | "web_mejorar" | "web_asistente"
  | "automatizacion" | "auto_whatsapp" | "auto_formularios" | "auto_interno"
  | "app" | "app_clientes" | "app_interna" | "app_centralizar"
  | "clientes_whatsapp" | "citas"
  | "precio" | "plazos" | "contacto"
  | "proceso" | "mantenimiento" | "integraciones"
  | "default";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL     = "info@hat3x.com";
const PHONE     = "+34 614 205 537";
const PHONE_RAW = "+34614205537";

const INITIAL_ACTIONS: ChatAction[] = [
  { label: "Quiero mejorar mi web",          message: "web" },
  { label: "Quiero automatizar tareas",       message: "automatizacion" },
  { label: "Necesito una app o plataforma",   message: "app" },
  { label: "Quiero contactar con el equipo",  message: "contacto" },
];

const FALLBACK_ACTIONS: ChatAction[] = [
  { label: "Mejorar mi web",        message: "web" },
  { label: "Automatizar tareas",    message: "automatizacion" },
  { label: "Crear una app",         message: "app" },
  { label: "Hablar con el equipo",  message: "contacto" },
];

// ─── Intent map  (keyword → intent, ordered from specific to generic) ─────────
// Each entry: [keyword, intent]
// The FIRST match wins, so more specific phrases come first.

const KEYWORD_INTENT_PAIRS: [string, Intent][] = [
  // saludo
  ["hola",              "saludo"],
  ["buenas",            "saludo"],
  ["buenos dias",       "saludo"],
  ["hey",               "saludo"],
  ["ola",               "saludo"],

  // gracias
  ["gracias",           "gracias"],
  ["muchas gracias",    "gracias"],
  ["perfecto gracias",  "gracias"],

  // despedida
  ["adios",             "despedida"],
  ["hasta luego",       "despedida"],
  ["nos vemos",         "despedida"],
  ["bye",               "despedida"],

  // contacto
  ["contacto",          "contacto"],
  ["contactar",         "contacto"],
  ["email",             "contacto"],
  ["correo",            "contacto"],
  ["telefono",          "contacto"],
  ["llamar",            "contacto"],
  ["hablar con",        "contacto"],
  ["escribirnos",       "contacto"],

  // precio
  ["precio",            "precio"],
  ["presupuesto",       "precio"],
  ["presupeusto",       "precio"],  // typo
  ["coste",             "precio"],
  ["costo",             "precio"],
  ["cuanto cuesta",     "precio"],
  ["cuanto vale",       "precio"],
  ["tarifa",            "precio"],

  // plazos
  ["plazo",             "plazos"],
  ["cuanto tarda",      "plazos"],
  ["cuanto tiempo",     "plazos"],
  ["semanas",           "plazos"],
  ["meses",             "plazos"],

  // ── web sub-intents (específicos antes que el genérico) ──
  ["web nueva",         "web_nueva"],
  ["nueva web",         "web_nueva"],
  ["crear web",         "web_nueva"],
  ["quiero una web",    "web_nueva"],
  ["mejorar mi web",    "web_mejorar"],
  ["mejorar web",       "web_mejorar"],
  ["rediseno",          "web_mejorar"],
  ["rediseño",          "web_mejorar"],
  ["web actual",        "web_mejorar"],
  ["web con asistente", "web_asistente"],
  ["asistente web",     "web_asistente"],
  ["asistente inteligente", "web_asistente"],

  // web genérico
  ["web",               "web"],
  ["pagina web",        "web"],
  ["pagina",            "web"],
  ["sitio web",         "web"],
  ["sitio",             "web"],
  ["landing",           "web"],
  ["website",           "web"],

  // ── automatizacion sub-intents ──
  ["automatizar whatsapp",       "auto_whatsapp"],
  ["automatizar mensajes",       "auto_whatsapp"],
  ["automatizar formularios",    "auto_formularios"],
  ["formularios automaticos",    "auto_formularios"],
  ["tareas internas",            "auto_interno"],
  ["procesos internos",          "auto_interno"],
  ["ahorrar tiempo en",          "auto_interno"],

  // automatizacion genérico
  ["automatizar",       "automatizacion"],
  ["automatizacion",    "automatizacion"],
  ["automtizar",        "automatizacion"],  // typo
  ["ahorrar tiempo",    "automatizacion"],
  ["tareas repetitivas","automatizacion"],
  ["workflow",          "automatizacion"],
  ["flujo",             "automatizacion"],

  // clientes / whatsapp
  ["whatsapp",          "clientes_whatsapp"],
  ["wasap",             "clientes_whatsapp"],
  ["wsp",               "clientes_whatsapp"],
  ["instagram",         "clientes_whatsapp"],
  ["atencion al cliente","clientes_whatsapp"],
  ["responder clientes","clientes_whatsapp"],
  ["consultas",         "clientes_whatsapp"],
  ["captar clientes",   "clientes_whatsapp"],
  ["leads",             "clientes_whatsapp"],

  // citas
  ["cita",              "citas"],
  ["reserva",           "citas"],
  ["agenda",            "citas"],
  ["agendar",           "citas"],
  ["turnos",            "citas"],
  ["booking",           "citas"],
  ["recordatorio",      "citas"],

  // ── app sub-intents ──
  ["app para clientes",    "app_clientes"],
  ["aplicacion para clientes", "app_clientes"],
  ["plataforma interna",   "app_interna"],
  ["herramienta interna",  "app_interna"],
  ["centralizar informacion", "app_centralizar"],
  ["centralizar información", "app_centralizar"],

  // app genérico
  ["app",               "app"],
  ["aplicacion",        "app"],
  ["aplicion",          "app"],  // typo
  ["plataforma",        "app"],
  ["software",          "app"],
  ["portal",            "app"],
  ["area privada",      "app"],
  ["herramienta",       "app"],

  // proceso
  ["proceso",           "proceso"],
  ["como trabajais",    "proceso"],
  ["como funciona",     "proceso"],
  ["pasos",             "proceso"],
  ["metodologia",       "proceso"],

  // mantenimiento
  ["mantenimiento",     "mantenimiento"],
  ["soporte",           "mantenimiento"],
  ["incidencias",       "mantenimiento"],
  ["actualizaciones",   "mantenimiento"],

  // integraciones
  ["integracion",       "integraciones"],
  ["integrar",          "integraciones"],
  ["crm",               "integraciones"],
  ["erp",               "integraciones"],
  ["api",               "integraciones"],
  ["conectar herramientas","integraciones"],
];

// ─── Text helpers ─────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Classic Levenshtein distance. */
function levenshtein(a: string, b: string): number {
  const la = a.length, lb = b.length;
  const dp: number[][] = Array.from({ length: la + 1 }, (_, i) =>
    Array.from({ length: lb + 1 }, (__, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= la; i++)
    for (let j = 1; j <= lb; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[la][lb];
}

/**
 * Returns true if `input` contains the `keyword` — either exactly (substring)
 * or via fuzzy word-level match (only for single keywords ≥ 5 chars, max 1 typo).
 */
function matchesKeyword(input: string, keyword: string): boolean {
  // Exact substring match (fast path)
  if (input.includes(keyword)) return true;

  // Multi-word keyword: all words must appear in the input
  const kWords = keyword.split(" ");
  if (kWords.length > 1) {
    return kWords.every((w) => input.includes(w));
  }

  // Single keyword fuzzy match — only for longer words to avoid false positives
  if (keyword.length < 5) return false;

  return input.split(" ").some((word) => {
    if (Math.abs(word.length - keyword.length) > 2) return false;
    return levenshtein(word, keyword) <= 1;
  });
}

function detectIntent(raw: string): Intent {
  const input = normalize(raw);

  // Special: if input is a bare intent key (sent by initial buttons)
  const bareIntents: Intent[] = [
    "web", "automatizacion", "app", "contacto",
    "precio", "plazos", "proceso", "citas",
    "mantenimiento", "integraciones", "clientes_whatsapp",
    "saludo", "gracias", "despedida",
  ];
  if (bareIntents.includes(input as Intent)) return input as Intent;

  for (const [keyword, intent] of KEYWORD_INTENT_PAIRS) {
    if (matchesKeyword(input, normalize(keyword))) return intent;
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

    case "gracias":
      return {
        text: "¡De nada! Si necesitas algo más, estoy aquí.",
        actions: [
          { label: "Ver servicios",  navigate: "/servicios" },
          { label: "Ir a contacto", navigate: "/contacto" },
        ],
      };

    case "despedida":
      return {
        text: `¡Hasta luego! Si necesitas algo, escríbenos a ${EMAIL} o llámanos al ${PHONE}.`,
        actions: [
          { label: "Enviar email", href: `mailto:${EMAIL}` },
          { label: "Llamar ahora", href: `tel:${PHONE_RAW}` },
        ],
      };

    case "web":
      return {
        text: "Podemos ayudarte a crear una web nueva o mejorar la que ya tienes: más moderna, más clara, más profesional y enfocada a captar clientes. También podemos añadir formularios más útiles o asistentes inteligentes.",
        actions: [
          { label: "Quiero una web nueva",          message: "Quiero una web nueva" },
          { label: "Mejorar mi web actual",          message: "Quiero mejorar mi web actual" },
          { label: "Web con asistente inteligente",  message: "Quiero una web con asistente" },
          { label: "Ver servicios web",              navigate: "/servicios" },
        ],
      };

    case "automatizacion":
      return {
        text: "Podemos automatizar tareas repetitivas como formularios, respuestas a clientes, presupuestos, recordatorios o procesos internos. El objetivo es ahorrar tiempo y reducir trabajo manual.",
        actions: [
          { label: "Automatizar WhatsApp o mensajes",   message: "Quiero automatizar WhatsApp" },
          { label: "Automatizar formularios",           message: "Quiero automatizar formularios" },
          { label: "Ahorrar tiempo en tareas internas", message: "Quiero ahorrar tiempo en tareas internas" },
          { label: "Ver casos de uso",                  navigate: "/casos-de-uso" },
        ],
      };

    case "app":
      return {
        text: "Podemos desarrollar apps y plataformas a medida para tu empresa o para tus clientes: áreas privadas, herramientas de gestión, sistemas de reservas o plataformas para centralizar toda la información en un solo lugar.",
        actions: [
          { label: "App para clientes",       message: "Quiero una app para clientes" },
          { label: "Plataforma interna",       message: "Quiero una plataforma interna" },
          { label: "Centralizar información",  message: "Quiero centralizar información" },
          { label: "Ver servicios de apps",    navigate: "/servicios" },
        ],
      };

    case "clientes_whatsapp":
      return {
        text: "Podemos ayudarte a automatizar la atención a clientes en canales como WhatsApp, formularios o redes sociales, para responder más rápido y no perder ninguna consulta.",
        actions: [
          { label: "Automatizar WhatsApp",             message: "Quiero automatizar WhatsApp" },
          { label: "Responder consultas automáticamente", message: "Quiero responder consultas automáticamente" },
          { label: "Captar más clientes",              message: "Quiero captar más clientes" },
          { label: "Ver casos de uso",                 navigate: "/casos-de-uso" },
        ],
      };

    case "citas":
      return {
        text: "Podemos crear sistemas para gestionar citas, reservas y recordatorios automáticos. Reduce olvidos, organiza mejor la agenda y mejora la experiencia de tus clientes.",
        actions: [
          { label: "Gestionar citas online",    message: "Quiero gestionar citas online" },
          { label: "Recordatorios automáticos", message: "Quiero recordatorios automáticos" },
          { label: "Ver servicios",             navigate: "/servicios" },
        ],
      };

    case "precio":
      return {
        text: "El presupuesto depende del tipo de proyecto. No es lo mismo mejorar una web que desarrollar una app o automatizar varios procesos. Cuéntanos brevemente qué necesitas y te orientamos.",
        actions: [
          { label: "Pedir presupuesto",        navigate: "/contacto" },
          { label: "Contar mi proyecto",       navigate: "/tu-idea" },
          { label: "Hablar con el equipo",     message: "contacto" },
        ],
      };

    case "plazos":
      return {
        text: "Los plazos dependen del proyecto. Algunas mejoras o automatizaciones pueden estar listas en pocas semanas, mientras que apps o plataformas completas pueden llevar más tiempo. Siempre proponemos una hoja de ruta clara.",
        actions: [
          { label: "Quiero algo rápido",        message: "web" },
          { label: "Quiero una app completa",   message: "app" },
          { label: "Ver cómo trabajamos",       navigate: "/proceso" },
        ],
      };

    case "contacto":
      return {
        text: `Puedes escribirnos a ${EMAIL}, llamarnos al ${PHONE} o ir directamente a la página de contacto.`,
        actions: [
          { label: "Ir a contacto", navigate: "/contacto" },
          { label: "Enviar email",  href: `mailto:${EMAIL}` },
          { label: "Llamar ahora", href: `tel:${PHONE_RAW}` },
        ],
      };

    case "proceso":
      return {
        text: "Trabajamos en 4 pasos: entendemos tu negocio, diseñamos la solución, la implementamos y hacemos seguimiento. El proceso es claro, práctico y adaptado a cada empresa.",
        actions: [
          { label: "Ver cómo trabajamos", navigate: "/proceso" },
          { label: "Contar mi proyecto",  navigate: "/tu-idea" },
          { label: "Pedir presupuesto",   navigate: "/contacto" },
        ],
      };

    case "mantenimiento":
      return {
        text: "También ofrecemos mantenimiento y soporte. Te ayudamos con mejoras, incidencias, ajustes y seguimiento de las soluciones implementadas.",
        actions: [
          { label: "Necesito soporte",           message: "Necesito soporte técnico" },
          { label: "Mejorar herramienta actual",  message: "Quiero mejorar una herramienta existente" },
          { label: "Hablar con el equipo",        message: "contacto" },
        ],
      };

    case "integraciones":
      return {
        text: "Podemos integrar herramientas que ya usas en tu empresa, como CRM, formularios, correo o bases de datos, para conectar procesos y trabajar de forma más eficiente.",
        actions: [
          { label: "Integrar mi CRM",        message: "Quiero integrar mi CRM" },
          { label: "Conectar herramientas",  message: "Quiero conectar varias herramientas" },
          { label: "Ver servicios",          navigate: "/servicios" },
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
    if (open) setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages, open]);

  const pushBotMessage = (userText: string) => {
    const intent = detectIntent(userText);
    const response = buildResponse(intent);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", ...response }]);
    }, 360);
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
      // Show user bubble with human-readable label, detect intent from message key
      const userMsg: Message = { role: "user", text: action.label };
      setMessages((prev) => [...prev, userMsg]);
      pushBotMessage(action.message);
    }
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    pushBotMessage(text);
  };

  const isLink = (a: ChatAction) => !!(a.navigate || a.href);

  return (
    <>
      {/* Floating toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
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
          <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">Asistente HAT3X</p>
                <p className="text-[11px] text-muted-foreground">Respuestas rápidas sobre nuestros servicios</p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-primary/60" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col gap-1.5 ${m.role === "user" ? "items-end" : "items-start"}`}>
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

                {/* Action buttons */}
                {m.role === "bot" && m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-w-[96%]">
                    {m.actions.map((action, j) => (
                      <button
                        key={j}
                        onClick={() => handleAction(action)}
                        className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          isLink(action)
                            ? "border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-medium"
                            : "border-border/50 bg-background/40 hover:bg-background/70 text-foreground"
                        }`}
                      >
                        {action.label}
                        {isLink(action) && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
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
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <Mail className="w-3 h-3" />{EMAIL}
            </a>
            <a href={`tel:${PHONE_RAW}`} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <Phone className="w-3 h-3" />{PHONE}
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
              onClick={send}
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
