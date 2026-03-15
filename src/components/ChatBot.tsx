import { useState, useRef, useEffect, useMemo } from "react";
import { Bot, X, Send, Phone, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "bot" | "user";
  text: string;
  suggestions?: string[];
}

type IntentKey =
  | "servicios"
  | "web"
  | "automatizacion"
  | "app"
  | "clientes"
  | "whatsapp"
  | "citas"
  | "precio"
  | "plazos"
  | "contacto"
  | "proceso"
  | "mantenimiento"
  | "integraciones"
  | "saludo"
  | "gracias"
  | "despedida"
  | "default";

const CONTACT_EMAIL = "info@hat3x.com";
const CONTACT_PHONE = "+34 614 205 537";

const INTENT_KEYWORDS: Record<Exclude<IntentKey, "default">, string[]> = {
  servicios: [
    "servicio",
    "servicios",
    "que haceis",
    "qué hacéis",
    "que ofrecéis",
    "qué ofrecéis",
    "ofreceis",
    "ofrecéis",
    "que hacéis",
    "soluciones",
    "ayudais",
    "ayudáis",
  ],
  web: [
    "web",
    "pagina",
    "página",
    "pagina web",
    "página web",
    "sitio web",
    "rediseño web",
    "rediseño",
    "mejorar web",
    "crear web",
    "landing",
  ],
  automatizacion: [
    "automatizacion",
    "automatización",
    "automatizar",
    "automtizar",
    "automatiza",
    "procesos",
    "tareas repetitivas",
    "ahorrar tiempo",
    "flujo",
    "workflow",
  ],
  app: [
    "app",
    "aplicacion",
    "aplicación",
    "plataforma",
    "herramienta",
    "software",
    "programa",
    "portal",
    "area privada",
    "área privada",
  ],
  clientes: [
    "clientes",
    "atencion",
    "atención",
    "responder clientes",
    "consultas",
    "mensajes",
    "leads",
    "captar clientes",
  ],
  whatsapp: ["whatsapp", "wsp", "wasap", "wasap", "instagram", "redes", "mensajes automaticos", "mensajes automáticos"],
  citas: ["citas", "reservas", "agenda", "agendar", "recordatorios", "turnos", "booking"],
  precio: [
    "precio",
    "precios",
    "coste",
    "costo",
    "cuanto cuesta",
    "cuánto cuesta",
    "presupuesto",
    "presupeusto",
    "tarifa",
    "cuanto vale",
    "cuánto vale",
  ],
  plazos: [
    "tiempo",
    "plazo",
    "plazos",
    "cuanto tarda",
    "cuánto tarda",
    "cuanto tiempo",
    "cuánto tiempo",
    "semanas",
    "meses",
  ],
  contacto: [
    "contacto",
    "email",
    "correo",
    "telefono",
    "teléfono",
    "llamar",
    "hablar con alguien",
    "hablar con vosotros",
    "whatsapp contacto",
  ],
  proceso: [
    "proceso",
    "como trabajais",
    "cómo trabajáis",
    "como funciona",
    "cómo funciona",
    "pasos",
    "trabajais",
    "trabajáis",
  ],
  mantenimiento: ["mantenimiento", "soporte", "incidencias", "mejoras", "actualizaciones", "seguimiento"],
  integraciones: ["integraciones", "integrar", "crm", "erp", "api", "sistemas", "google workspace", "microsoft 365"],
  saludo: ["hola", "buenas", "buenos dias", "buenos días", "hey", "hello"],
  gracias: ["gracias", "muchas gracias", "perfecto gracias", "genial gracias"],
  despedida: ["adios", "adiós", "hasta luego", "nos vemos", "bye"],
};

const QUICK_SUGGESTIONS = [
  "Quiero mejorar mi web",
  "Quiero automatizar tareas",
  "Necesito una app o plataforma",
  "¿Cómo puedo contactar?",
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, () => new Array(a.length + 1).fill(0));

  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }

  return matrix[b.length][a.length];
}

function includesApprox(input: string, keyword: string): boolean {
  if (input.includes(keyword)) return true;

  const inputWords = input.split(" ");
  const keywordWords = keyword.split(" ");

  // Para frases completas, si hay mucha diferencia no intentamos fuzzy agresivo
  if (keywordWords.length > 1) {
    return input.includes(keywordWords[0]) || input.includes(keywordWords[keywordWords.length - 1]);
  }

  return inputWords.some((word) => {
    if (Math.abs(word.length - keyword.length) > 2) return false;
    return levenshtein(word, keyword) <= 2;
  });
}

function detectIntent(rawInput: string): IntentKey {
  const input = normalizeText(rawInput);

  const orderedIntents: Exclude<IntentKey, "default">[] = [
    "saludo",
    "gracias",
    "despedida",
    "contacto",
    "precio",
    "plazos",
    "web",
    "automatizacion",
    "app",
    "whatsapp",
    "citas",
    "clientes",
    "mantenimiento",
    "integraciones",
    "proceso",
    "servicios",
  ];

  for (const intent of orderedIntents) {
    for (const keyword of INTENT_KEYWORDS[intent]) {
      const normalizedKeyword = normalizeText(keyword);
      if (includesApprox(input, normalizedKeyword)) return intent;
    }
  }

  return "default";
}

function getHelpfulFallback(input: string): { text: string; suggestions: string[] } {
  const normalized = normalizeText(input);

  const possibleMatches: { intent: IntentKey; keyword: string; distance: number }[] = [];

  Object.entries(INTENT_KEYWORDS).forEach(([intent, keywords]) => {
    keywords.forEach((keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      const words = normalized.split(" ");
      words.forEach((word) => {
        if (word.length >= 4 && normalizedKeyword.length >= 4) {
          const distance = levenshtein(word, normalizedKeyword);
          if (distance <= 2) {
            possibleMatches.push({
              intent: intent as IntentKey,
              keyword,
              distance,
            });
          }
        }
      });
    });
  });

  possibleMatches.sort((a, b) => a.distance - b.distance);

  const best = possibleMatches[0];

  if (best) {
    const suggestedMap: Record<IntentKey, string> = {
      servicios: "servicios",
      web: "mejorar o crear una web",
      automatizacion: "automatizar tareas o procesos",
      app: "crear una app o plataforma",
      clientes: "mejorar la atención a clientes",
      whatsapp: "automatizar WhatsApp o mensajes",
      citas: "reservas, citas o recordatorios",
      precio: "presupuesto o precio",
      plazos: "plazos de implementación",
      contacto: "contactar con el equipo",
      proceso: "cómo trabajamos",
      mantenimiento: "mantenimiento y soporte",
      integraciones: "integrar herramientas o sistemas",
      saludo: "saludar",
      gracias: "agradecer",
      despedida: "despedirte",
      default: "algo relacionado con nuestros servicios",
    };

    return {
      text: `No estoy del todo seguro, pero quizá querías preguntar por ${suggestedMap[best.intent]}. Si quieres, también puedes elegir una de estas opciones:`,
      suggestions: QUICK_SUGGESTIONS,
    };
  }

  return {
    text: `No he entendido del todo tu mensaje, pero puedo ayudarte con webs, automatización, apps, atención a clientes, integraciones, precios o plazos. Elige una opción o cuéntamelo con otras palabras.`,
    suggestions: QUICK_SUGGESTIONS,
  };
}

function buildResponse(intent: IntentKey): { text: string; suggestions?: string[] } {
  switch (intent) {
    case "saludo":
      return {
        text: "¡Hola! Encantado de ayudarte. En HAT3X podemos ayudarte con páginas web, automatización de tareas, apps, plataformas e integraciones para empresas. ¿Qué necesitas exactamente?",
        suggestions: QUICK_SUGGESTIONS,
      };

    case "gracias":
      return {
        text: "¡De nada! Si quieres, también puedo orientarte sobre webs, automatización, apps, precios, plazos o formas de contacto.",
        suggestions: QUICK_SUGGESTIONS,
      };

    case "despedida":
      return {
        text: `¡Gracias por escribirnos! Si necesitas hablar con el equipo, puedes contactarnos en ${CONTACT_EMAIL} o en el ${CONTACT_PHONE}.`,
      };

    case "servicios":
      return {
        text: "Podemos ayudarte a crear o mejorar páginas web, automatizar tareas y procesos, desarrollar apps o plataformas personalizadas, integrar herramientas y mejorar la atención a tus clientes. ¿Qué te interesa más?",
        suggestions: [
          "Quiero mejorar mi web",
          "Quiero automatizar tareas",
          "Necesito una app o plataforma",
          "Quiero integrar herramientas",
        ],
      };

    case "web":
      return {
        text: "Podemos crear una web nueva o mejorar la que ya tienes. Por ejemplo, hacerla más moderna, más clara, más profesional, optimizada para captar clientes o incluso añadir asistentes inteligentes y formularios más útiles.",
        suggestions: [
          "Quiero una web nueva",
          "Quiero mejorar mi web actual",
          "Quiero una web con asistente",
          "Quiero captar más clientes",
        ],
      };

    case "automatizacion":
      return {
        text: "Podemos automatizar tareas repetitivas como respuestas a consultas, presupuestos, formularios, recordatorios, organización interna o procesos entre herramientas. El objetivo es ahorrarte tiempo y reducir trabajo manual.",
        suggestions: [
          "Quiero automatizar WhatsApp",
          "Quiero automatizar formularios",
          "Quiero ahorrar tiempo",
          "Quiero automatizar presupuestos",
        ],
      };

    case "app":
      return {
        text: "Podemos desarrollar apps o plataformas a medida para tu empresa o para tus clientes. Por ejemplo, apps de reservas, paneles de gestión, áreas privadas, herramientas internas o plataformas para organizar información en un solo lugar.",
        suggestions: [
          "Quiero una app para clientes",
          "Quiero una plataforma interna",
          "Quiero un área privada",
          "Quiero centralizar información",
        ],
      };

    case "clientes":
      return {
        text: "Si quieres mejorar la atención a clientes, podemos ayudarte con asistentes automáticos, respuestas frecuentes, formularios más inteligentes, sistemas para recoger solicitudes y herramientas para no perder consultas importantes.",
        suggestions: [
          "Quiero responder más rápido",
          "Quiero atender clientes 24/7",
          "Quiero automatizar consultas",
          "Quiero mejorar mi formulario",
        ],
      };

    case "whatsapp":
      return {
        text: "Sí, podemos ayudarte a automatizar mensajes y consultas desde WhatsApp, Instagram u otros canales. Por ejemplo, responder preguntas frecuentes, recoger datos del cliente, filtrar consultas o derivarlas correctamente.",
        suggestions: [
          "Quiero automatizar WhatsApp",
          "Quiero automatizar Instagram",
          "Quiero respuestas automáticas",
          "Quiero captar clientes por mensajes",
        ],
      };

    case "citas":
      return {
        text: "Podemos crear sistemas para gestionar citas, reservas y recordatorios automáticos. Esto ayuda a reducir olvidos, organizar mejor la agenda y dar una mejor experiencia al cliente.",
        suggestions: [
          "Quiero gestionar citas",
          "Quiero recordatorios automáticos",
          "Quiero reservas online",
          "Quiero mejorar mi agenda",
        ],
      };

    case "precio":
      return {
        text: "El precio depende del tipo de proyecto y de lo que necesites. No es lo mismo mejorar una web que desarrollar una app o automatizar varios procesos. Si quieres, cuéntame brevemente qué necesitas y te orientamos mejor.",
        suggestions: [
          "Quiero mejorar mi web",
          "Quiero automatizar tareas",
          "Quiero una app",
          "Quiero hablar con el equipo",
        ],
      };

    case "plazos":
      return {
        text: "Los plazos dependen del proyecto. Algunas mejoras o automatizaciones pueden empezar a estar listas en pocas semanas, mientras que desarrollos más amplios como apps o plataformas pueden llevar más tiempo. Siempre intentamos proponer una solución clara y realista.",
        suggestions: [
          "Quiero algo rápido",
          "Quiero una mejora concreta",
          "Quiero una app completa",
          "Quiero hablar del proyecto",
        ],
      };

    case "contacto":
      return {
        text: `Puedes escribirnos a ${CONTACT_EMAIL}, llamarnos al ${CONTACT_PHONE} o usar el formulario de contacto de la web. Si quieres, también puedes contarme por aquí qué necesitas y te orientaré antes de contactar.`,
        suggestions: [
          "Quiero enviar un email",
          "Quiero llamar",
          "Quiero contar mi proyecto",
          "Quiero saber qué servicio necesito",
        ],
      };

    case "proceso":
      return {
        text: "Normalmente trabajamos en 4 pasos: entendemos tu empresa, diseñamos la solución, la implementamos y después seguimos mejorando si hace falta. La idea es que el proceso sea claro, práctico y adaptado a tu negocio.",
        suggestions: [
          "Quiero saber los plazos",
          "Quiero contar mi proyecto",
          "Quiero una propuesta",
          "Quiero saber qué podéis hacer",
        ],
      };

    case "mantenimiento":
      return {
        text: "Sí, también ofrecemos mantenimiento y soporte. Podemos ayudarte con mejoras, incidencias, ajustes, optimización y seguimiento de las herramientas o soluciones que se hayan implementado.",
        suggestions: [
          "Quiero soporte técnico",
          "Quiero mejorar una herramienta",
          "Quiero mantenimiento web",
          "Quiero seguimiento",
        ],
      };

    case "integraciones":
      return {
        text: "Podemos integrar herramientas y sistemas que ya uses en tu empresa, como CRM, formularios, correo, bases de datos u otras plataformas. La idea es conectar procesos para trabajar de forma más simple y eficiente.",
        suggestions: [
          "Quiero integrar mi CRM",
          "Quiero conectar formularios",
          "Quiero unir varias herramientas",
          "Quiero automatizar procesos",
        ],
      };

    default:
      return {
        text: "Gracias por tu mensaje. Puedo ayudarte a orientarte sobre páginas web, automatización, apps, integraciones, atención a clientes, plazos, precios o contacto con el equipo.",
        suggestions: QUICK_SUGGESTIONS,
      };
  }
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "¡Hola! Soy el asistente de HAT3X. Puedo ayudarte con webs, automatización, apps, integraciones, precios, plazos o contacto. ¿Qué necesitas?",
      suggestions: QUICK_SUGGESTIONS,
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const quickOptions = useMemo(() => QUICK_SUGGESTIONS, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushBotResponse = (text: string) => {
    const intent = detectIntent(text);
    const response = intent === "default" ? getHelpfulFallback(text) : buildResponse(intent);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: response.text,
          suggestions: response.suggestions,
        },
      ]);
    }, 450);
  };

  const send = (forcedText?: string) => {
    const text = (forcedText ?? input).trim();
    if (!text) return;

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    pushBotResponse(text);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Abrir chat"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card border border-border/40 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ maxHeight: "72vh" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-foreground">Asistente HAT3X</div>
                <div className="text-[11px] text-muted-foreground">Respuestas rápidas sobre nuestros servicios</div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-primary/80" />
          </div>

          {/* Quick actions top */}
          <div className="px-3 pt-3 flex flex-wrap gap-2 border-b border-border/20 pb-3">
            {quickOptions.map((option) => (
              <button
                key={option}
                onClick={() => send(option)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors"
              >
                {option}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 240 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-accent text-accent-foreground" : "bg-muted/50 text-foreground"
                  }`}
                >
                  {m.text}
                </div>

                {m.role === "bot" && m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                    {m.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => send(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-background/30 hover:bg-background/60 text-foreground transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Contact strip */}
          <div className="px-3 py-2 border-t border-border/20 text-xs text-muted-foreground flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {CONTACT_EMAIL}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {CONTACT_PHONE}
            </span>
          </div>

          {/* Input */}
          <div className="border-t border-border/30 p-3 flex gap-2">
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
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-9 w-9"
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
