import React from 'react';
import './Legal.css';

function Terms() {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Términos de Servicio</h1>
      <p className="legal-updated">Última actualización: {new Date().toLocaleDateString()}</p>
      
      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Introducción</h2>
          <p>
            Bienvenido a FUT4E. Al acceder a nuestro sitio web y utilizar nuestros servicios, 
            aceptas estar sujeto a estos Términos de Servicio. Te recomendamos que los leas 
            detenidamente y los consultes regularmente para estar al día de posibles cambios.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Definiciones</h2>
          <p>
            <strong>"FUT4E"</strong>, <strong>"nosotros"</strong>, <strong>"nos"</strong> o <strong>"nuestro"</strong> se refiere a la plataforma FUT4E.
          </p>
          <p>
            <strong>"Usuario"</strong>, <strong>"tú"</strong> o <strong>"tu"</strong> se refiere a cualquier persona que acceda o utilice nuestros servicios.
          </p>
          <p>
            <strong>"Contenido"</strong> se refiere a todos los videos, comentarios, perfiles y cualquier otro material publicado en la plataforma.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Registro y Cuentas</h2>
          <p>
            Para acceder a ciertas funciones de nuestra plataforma, deberás crear una cuenta. Al registrarte:
          </p>
          <ul>
            <li>Debes proporcionar información precisa y completa.</li>
            <li>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
            <li>Aceptas notificarnos de inmediato sobre cualquier uso no autorizado de tu cuenta.</li>
            <li>Debes tener al menos 13 años para registrarte sin el consentimiento de un tutor legal.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Contenido del Usuario</h2>
          <p>
            Al publicar contenido en FUT4E:
          </p>
          <ul>
            <li>Mantienes todos los derechos de propiedad sobre tu contenido.</li>
            <li>Nos otorgas una licencia mundial, no exclusiva, libre de regalías para usar, 
                reproducir, adaptar, publicar, traducir y distribuir tu contenido en cualquier 
                medio existente o por existir.</li>
            <li>Declaras y garantizas que tienes el derecho de publicar dicho contenido y que 
                no infringe derechos de terceros.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Conducta Prohibida</h2>
          <p>
            Al utilizar FUT4E, te comprometes a no:
          </p>
          <ul>
            <li>Publicar contenido ilegal, ofensivo, difamatorio, obsceno o que viole derechos de terceros.</li>
            <li>Hacerte pasar por otra persona o entidad.</li>
            <li>Utilizar la plataforma para enviar spam o material publicitario no solicitado.</li>
            <li>Intentar acceder a áreas restringidas o interferir con la infraestructura técnica de FUT4E.</li>
            <li>Utilizar bots, scrapers u otros métodos automatizados para acceder a la plataforma.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Derechos de Propiedad Intelectual</h2>
          <p>
            La plataforma FUT4E, incluyendo su diseño, logotipos, software y código fuente, está protegida 
            por derechos de autor y otras leyes de propiedad intelectual. Está prohibida la reproducción o 
            distribución no autorizada de cualquier parte de la plataforma.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Modificaciones del Servicio</h2>
          <p>
            Nos reservamos el derecho de modificar, suspender o interrumpir cualquier aspecto del servicio 
            en cualquier momento sin previo aviso. No seremos responsables ante ti ni ante terceros por 
            cualquier modificación, suspensión o interrupción del servicio.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Limitación de Responsabilidad</h2>
          <p>
            FUT4E proporciona la plataforma "tal cual" y "según disponibilidad", sin garantías de ningún 
            tipo. No seremos responsables por daños indirectos, incidentales, especiales o consecuentes 
            que surjan del uso o la imposibilidad de usar nuestra plataforma.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Indemnización</h2>
          <p>
            Aceptas indemnizar y mantener indemne a FUT4E, sus empleados, directores y agentes de cualquier 
            reclamación, demanda o daño, incluyendo honorarios legales razonables, que surjan de tu uso de 
            la plataforma o de cualquier violación de estos Términos de Servicio.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Ley Aplicable</h2>
          <p>
            Estos Términos de Servicio se rigen por las leyes de España, sin tener en cuenta sus disposiciones 
            sobre conflictos de leyes. Cualquier disputa relacionada con estos términos se someterá a la 
            jurisdicción exclusiva de los tribunales de Madrid, España.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Cambios en los Términos</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Las 
            modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. 
            Tu uso continuado de FUT4E después de cualquier cambio constituye tu aceptación de los nuevos términos.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre estos Términos de Servicio, puedes contactarnos en:
            <br />
            <a href="mailto:fut4ebusiness@gmail.com">fut4ebusiness@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Terms;
