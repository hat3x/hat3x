import Layout from "@/components/Layout";

const Privacidad = () => (
  <Layout>
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Política de Privacidad</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <p><strong className="text-foreground">Última actualización:</strong> [Fecha]</p>
          <p><strong className="text-foreground">[Nombre legal de la entidad]</strong> (en adelante, "HAT3X") se compromete a proteger la privacidad de los usuarios de este sitio web.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. Responsable del tratamiento</h2>
          <p>[Nombre legal], con domicilio en [dirección], y CIF [número]. Contacto: contacto@hat3x.com.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Datos que recogemos</h2>
          <p>Recogemos los datos que nos facilitas voluntariamente a través de nuestros formularios: nombre, email, empresa, cargo y mensaje. No recogemos datos sensibles.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Finalidad del tratamiento</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Responder a tu consulta o solicitud de auditoría.</li>
            <li>Enviarte información sobre nuestros servicios si lo has solicitado.</li>
            <li>Mejorar nuestros servicios y experiencia de usuario.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Base legal</h2>
          <p>El consentimiento del interesado y el interés legítimo en atender consultas comerciales.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">5. Conservación de datos</h2>
          <p>Los datos se conservan mientras exista una relación comercial o interés mutuo, y durante los plazos legales aplicables.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">6. Derechos</h2>
          <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición escribiendo a contacto@hat3x.com.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">7. Cookies</h2>
          <p>Este sitio puede utilizar cookies técnicas y analíticas. [Ampliar según configuración real].</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">8. Cambios</h2>
          <p>Nos reservamos el derecho de actualizar esta política. La fecha de última actualización se indica al inicio del documento.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Privacidad;
