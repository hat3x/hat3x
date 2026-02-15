import { useState, useRef, useEffect } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "bot" | "user";
  text: string;
}

const defaultResponses: Record<string, string> = {
  servicios: "Ofrecemos auditoría de IA, automatización, desarrollo de apps con IA, integraciones con tus sistemas, analítica y gobernanza. ¿Te interesa alguno en particular?",
  precio: "Nuestros servicios se adaptan a cada proyecto. Contacta con nosotros para una propuesta personalizada.",
  contacto: "Puedes escribirnos a vjc@hat3x.com o rellenar el formulario en nuestra página de contacto.",
  demo: "Agenda una auditoría gratuita de 30 minutos donde analizaremos tus procesos y oportunidades de IA.",
  default: "Gracias por tu mensaje. Un miembro de nuestro equipo te responderá pronto. ¿Puedo ayudarte con algo más sobre nuestros servicios de IA?",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("servicio") || lower.includes("qué hacéis") || lower.includes("que haceis")) return defaultResponses.servicios;
  if (lower.includes("precio") || lower.includes("coste") || lower.includes("cuesta")) return defaultResponses.precio;
  if (lower.includes("contacto") || lower.includes("email") || lower.includes("teléfono")) return defaultResponses.contacto;
  if (lower.includes("demo") || lower.includes("auditoría") || lower.includes("reunión")) return defaultResponses.demo;
  return defaultResponses.default;
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "¡Hola! Soy el asistente de HAT3X. ¿En qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getResponse(text) }]);
    }, 600);
  };

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Abrir chat"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card border border-border/40 rounded-2xl flex flex-col overflow-hidden shadow-2xl" style={{ maxHeight: "70vh" }}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Asistente HAT3X</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted/50 text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
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
            <Button size="icon" onClick={send} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-8 w-8">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
