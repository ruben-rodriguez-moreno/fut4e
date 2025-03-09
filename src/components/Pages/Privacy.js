import React from 'react';
import './Legal.css';

function Privacy() {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Política de Privacidad</h1>
      <p className="legal-updated">Última actualización: {new Date().toLocaleDateString()}</p>
      
      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Introducción</h2>
          <p>
            En FUT4E, nos tomamos muy en serio la privacidad de nuestros usuarios. 
            Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos 
            y protegemos tu información cuando utilizas nuestra plataforma.
          </p>
          <p>
            Al utilizar FUT4E, aceptas las prácticas descritas en esta Política de Privacidad. 
            Si no estás de acuerdo con esta política, por favor, no utilices nuestra plataforma.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Información que Recopilamos</h2>
          <h3>2.1. Información que nos proporcionas:</h3>
          <ul>
            <li><strong>Información de registro:</strong> nombre de usuario, dirección de correo electrónico y contraseña.</li>
            <li><strong>Información de perfil:</strong> foto de perfil, descripción y otros datos que decidas compartir.</li>
            <li><strong>Contenido:</strong> videos, comentarios y cualquier otro material que publiques en la plataforma.</li>
            <li><strong>Comunicaciones:</strong> información que proporciones cuando contactes con nuestro equipo de soporte.</li>
          </ul>
          
          <h3>2.2. Información que recopilamos automáticamente:</h3>
          <ul>
            <li><strong>Datos de uso:</strong> información sobre cómo interactúas con nuestra plataforma, incluyendo las páginas que visitas y las funciones que utilizas.</li>
            <li><strong>Información del dispositivo:</strong> tipo de dispositivo, sistema operativo, navegador y configuración de idioma.</li>
            <li><strong>Datos de registro:</strong> dirección IP, fecha y hora de acceso, y patrones de uso.</li>
            <li><strong>Cookies y tecnologías similares:</strong> utilizamos cookies y otras tecnologías de seguimiento para recopilar información sobre tu actividad en nuestra plataforma.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Cómo Utilizamos tu Información</h2>
          <p>Utilizamos la información que recopilamos para:</p>
          <ul>
            <li>Proporcionar, mantener y mejorar nuestra plataforma.</li>
            <li>Procesar y gestionar tu cuenta y tus preferencias.</li>
            <li>Comunicarnos contigo sobre actualizaciones, nuevas funciones y promociones.</li>
            <li>Personalizar tu experiencia en FUT4E.</li>
            <li>Analizar el uso de nuestra plataforma y mejorar nuestros servicios.</li>
            <li>Detectar, investigar y prevenir actividades fraudulentas o ilegales.</li>
            <li>Proteger los derechos, la propiedad y la seguridad de FUT4E y nuestros usuarios.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Compartición de Información</h2>
          <p>Podemos compartir tu información con:</p>
          <ul>
            <li><strong>Otros usuarios:</strong> el contenido que publiques en FUT4E (videos, comentarios, perfil público) será visible para otros usuarios según la configuración de privacidad que elijas.</li>
            <li><strong>Proveedores de servicios:</strong> empresas que nos ayudan a proporcionar servicios (alojamiento, análisis, pagos, atención al cliente).</li>
            <li><strong>Socios comerciales:</strong> podemos compartir información agregada y anónima con socios comerciales para análisis y mejora de servicios.</li>
            <li><strong>Cumplimiento legal:</strong> cuando sea necesario para cumplir con obligaciones legales, proteger nuestros derechos o responder a solicitudes de autoridades públicas.</li>
          </ul>
          <p>No vendemos tu información personal a terceros.</p>
        </section>

        <section className="legal-section">
          <h2>5. Tus Derechos y Opciones</h2>
          <p>Dependiendo de tu ubicación, puedes tener derechos relacionados con tu información personal, incluyendo:</p>
          <ul>
            <li>Acceder a tu información personal.</li>
            <li>Corregir datos inexactos.</li>
            <li>Eliminar tu información en determinadas circunstancias.</li>
            <li>Restringir u objetar el procesamiento de tu información.</li>
            <li>Solicitar la portabilidad de tus datos.</li>
            <li>Retirar tu consentimiento en cualquier momento.</li>
          </ul>
          <p>Para ejercer estos derechos, contacta con nosotros a través de fut4ebusiness@gmail.com.</p>
        </section>

        <section className="legal-section">
          <h2>6. Seguridad de Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra 
            acceso no autorizado, pérdida o alteración. Sin embargo, ningún sistema es completamente seguro, 
            por lo que no podemos garantizar la seguridad absoluta de tu información.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Transferencias Internacionales de Datos</h2>
          <p>
            Tu información puede ser transferida y procesada en países distintos a tu país de residencia, 
            donde pueden existir diferentes leyes de protección de datos. Al utilizar nuestra plataforma, 
            aceptas estas transferencias de información.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Retención de Datos</h2>
          <p>
            Conservamos tu información mientras mantengas una cuenta en FUT4E o mientras sea necesario 
            para proporcionarte nuestros servicios. Si solicitas la eliminación de tu cuenta, eliminaremos 
            o anonimizaremos tu información, a menos que tengamos la obligación legal de conservarla.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Menores</h2>
          <p>
            FUT4E está destinado a usuarios mayores de 13 años. No recopilamos intencionadamente información 
            de niños menores de 13 años. Si descubrimos que hemos recopilado información de un niño menor de 
            13 años, tomaremos medidas para eliminar esa información lo antes posible.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Cambios en esta Política de Privacidad</h2>
          <p>
            Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras 
            prácticas o por otros motivos operativos, legales o normativos. Te notificaremos cualquier cambio 
            sustancial mediante un aviso en nuestra plataforma o por otros medios.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Contacto</h2>
          <p>
            Si tienes preguntas, comentarios o inquietudes sobre esta Política de Privacidad o nuestras 
            prácticas de datos, contáctanos en:
            <br />
            <a href="mailto:fut4ebusiness@gmail.com">fut4ebusiness@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
