import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faUsers, faChartLine, faTrophy } from '@fortawesome/free-solid-svg-icons';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1 className="about-title">Acerca de FUT4E</h1>
        <p className="about-subtitle">
          La plataforma líder para compartir y descubrir los mejores momentos del fútbol
        </p>
      </header>

      <section className="about-section">
        <h2 className="section-title">Nuestra Historia</h2>
        <div className="section-content">
          <p>
            FUT4E nació en 2025 con una misión clara: crear un espacio donde los amantes del fútbol puedan 
            compartir sus mejores momentos deportivos. Desde jugadas memorables en el parque hasta habilidades 
            impresionantes en la cancha, nuestra plataforma conecta a la comunidad futbolera de todo el mundo.
          </p>
          <p>
            Lo que comenzó como un proyecto pequeño ha crecido hasta convertirse en un ecosistema vibrante 
            donde jugadores amateurs, aficionados y espectadores pueden interactuar, aprender y celebrar la 
            pasión por el deporte rey.
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">¿Por qué FUT4E?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon={faFutbol} />
            </div>
            <h3>Pasión por el Fútbol</h3>
            <p>Creada por amantes del fútbol para amantes del fútbol. Entendemos lo que buscas.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h3>Comunidad Global</h3>
            <p>Conecta con jugadores y aficionados de todo el mundo compartiendo tus momentos.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h3>Mejora Constante</h3>
            <p>Aprende nuevas técnicas y habilidades observando a otros miembros de la comunidad.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon={faTrophy} />
            </div>
            <h3>Reconocimiento</h3>
            <p>Destaca por tu talento y recibe el reconocimiento que mereces de la comunidad.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-title">Nuestra Visión</h2>
        <div className="section-content">
          <p>
            En FUT4E aspiramos a democratizar la exposición del talento futbolístico. Creemos que todos los 
            momentos especiales merecen ser compartidos, independientemente de si ocurren en un mundial o 
            en un partido entre amigos.
          </p>
          <p>
            Trabajamos constantemente para crear la mejor plataforma posible, donde la pasión y el talento 
            sean los verdaderos protagonistas. Nuestro objetivo es que cada usuario pueda encontrar inspiración, 
            compartir su entusiasmo y formar parte de una comunidad global unida por el amor al fútbol.
          </p>
        </div>
      </section>

      <section className="team-section">
        <h2 className="section-title">Equipo FUT4E</h2>
        <p className="team-intro">
          Somos un equipo de desarrolladores y entusiastas del fútbol comprometidos con 
          ofrecer la mejor experiencia para nuestra comunidad.
        </p>
        <div className="contact-info">
          <p>¿Tienes preguntas o sugerencias? No dudes en contactarnos:</p>
          <p className="contact-email">fut4ebusiness@gmail.com</p>
        </div>
      </section>
    </div>
  );
}

export default About;
