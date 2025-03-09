import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Información del sitio */}
          <div className="footer-section about">
            <h3 className="footer-title">FUT4E</h3>
            <p className="footer-description">
              La plataforma para compartir y descubrir los mejores momentos del fútbol.
            </p>
            <div className="footer-contact">
              <p><span className="contact-label">Soporte:</span> fut4ebusiness@gmail.com</p>
            </div>
          </div>

          {/* Enlaces del sitio */}
          <div className="footer-section links">
            <h3 className="footer-title">Enlaces del Sitio</h3>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/trending">Tendencias</Link></li>
              <li><Link to="/categories">Categorías</Link></li>
              <li><Link to="/buscar-usuarios">Usuarios</Link></li>
              <li><Link to="/about">Acerca de</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className="footer-section social">
            <h3 className="footer-title">Síguenos</h3>
            <p className="social-text">Conéctate con nosotros en redes sociales</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
        </div>

        {/* Información legal */}
        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} FUT4E. Todos los derechos reservados.</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Términos de Servicio</Link>
            <Link to="/privacy">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
