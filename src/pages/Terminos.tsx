import Layout from "@/components/Layout";

const Terminos = () => (
  <Layout>
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Términos y Condiciones</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <p><strong className="text-foreground">Última actualización:</strong> [Fecha]</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. Identificación</h2>
          <p>Este sitio web es propiedad de <strong className="text-foreground">[Nombre legal de la entidad]</strong>, con domicilio en [dirección] y CIF [número].</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Objeto</h2>
          <p>Estos términos regulan el acceso y uso del sitio web hat3x.com y los servicios de consultoría ofrecidos por HAT3X.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Uso del sitio</h2>
          <p>El usuario se compromete a hacer un uso adecuado del sitio, conforme a la ley y a estos términos. Queda prohibido cualquier uso con fines ilícitos.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Propiedad intelectual</h2>
          <p>Todos los contenidos del sitio (textos, diseños, logotipos, código) son propiedad de HAT3X o de sus licenciantes y están protegidos por las leyes de propiedad intelectual.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">5. Servicios</h2>
          <p>Los servicios de consultoría se formalizan mediante acuerdos específicos entre HAT3X y el cliente. Las condiciones de cada proyecto se detallan en propuestas individuales.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">6. Limitación de responsabilidad</h2>
          <p>HAT3X no garantiza resultados específicos derivados de sus servicios de consultoría. Los resultados dependen de múltiples factores, incluyendo la colaboración del cliente.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">7. Modificaciones</h2>
          <p>HAT3X se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos desde su publicación en el sitio.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">8. Legislación y jurisdicción</h2>
          <p>Estos términos se rigen por la legislación [país]. Para cualquier controversia, las partes se someten a los juzgados y tribunales de [ciudad].</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">9. Contacto</h2>
          <p>Para cualquier consulta sobre estos términos: contacto@hat3x.com.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Terminos;
