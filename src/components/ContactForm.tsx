import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import GlassCard from "./GlassCard";

interface ContactFormProps {
  variant?: "full" | "short";
}

const ContactForm = ({ variant = "full" }: ContactFormProps) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const nombre = formData.get("nombre") || "";
    const email = formData.get("email") || "";
    const empresa = formData.get("empresa") || "";
    const cargo = formData.get("cargo") || "";
    const tamano = formData.get("tamano") || "";
    const area = formData.get("area") || "";
    const objetivo = formData.get("objetivo") || "";
    const presupuesto = formData.get("presupuesto") || "";
    const mensaje = formData.get("mensaje") || "";

    const subject = encodeURIComponent(`Consulta de ${nombre} - ${empresa}`);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa}\nCargo: ${cargo}\nTamaño: ${tamano}\nÁrea: ${area}\nObjetivo: ${objetivo}\nPresupuesto: ${presupuesto}\n\nMensaje:\n${mensaje}`
    );
    window.location.href = `mailto:info@hat3x.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <GlassCard className="text-center py-12">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Gracias por contactarnos</h3>
        <p className="text-muted-foreground">Te responderemos en 24–48h laborables.</p>
      </GlassCard>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-muted/40 border border-border/60 rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Nombre *</label>
          <input required className={inputClass} placeholder="Tu nombre" />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input required type="email" className={inputClass} placeholder="email@empresa.com" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Empresa *</label>
          <input required className={inputClass} placeholder="Nombre de tu empresa" />
        </div>
        <div>
          <label className={labelClass}>Cargo</label>
          <input className={inputClass} placeholder="Tu puesto" />
        </div>
      </div>
      {variant === "full" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Tamaño de empresa</label>
              <select className={inputClass}>
                <option value="">Seleccionar</option>
                <option>1–10 empleados</option>
                <option>11–50 empleados</option>
                <option>51–200 empleados</option>
                <option>+200 empleados</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Área de interés</label>
              <select className={inputClass}>
                <option value="">Seleccionar</option>
                <option>Productividad</option>
                <option>Atención al cliente</option>
                <option>Ventas</option>
                <option>Automatización</option>
                <option>App con IA</option>
                <option>Analítica</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Objetivo principal</label>
              <select className={inputClass}>
                <option value="">Seleccionar</option>
                <option>Reducir costes</option>
                <option>Mejorar productividad</option>
                <option>Automatizar procesos</option>
                <option>Crear producto con IA</option>
                <option>Mejorar atención al cliente</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Presupuesto estimado (opcional)</label>
              <select className={inputClass}>
                <option value="">Seleccionar</option>
                <option>&lt; 5.000 €</option>
                <option>5.000 – 15.000 €</option>
                <option>15.000 – 50.000 €</option>
                <option>+50.000 €</option>
              </select>
            </div>
          </div>
        </>
      )}
      <div>
        <label className={labelClass}>Mensaje</label>
        <textarea className={`${inputClass} min-h-[100px]`} placeholder="Cuéntanos brevemente qué necesitas…" />
      </div>
      <p className="text-xs text-muted-foreground">No spam. Solo información sobre tu consulta.</p>
      <Button
        type="submit"
        className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90 btn-primary-glow rounded-xl text-sm font-semibold px-8 py-3 h-auto"
      >
        Solicitar auditoría
      </Button>
    </form>
  );
};

export default ContactForm;
