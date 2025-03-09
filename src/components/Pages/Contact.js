import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Contact.css';
import { API_BASE_URL } from '../../utils/apiConfig';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Por favor, ingresa tu nombre';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, ingresa tu email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor, ingresa un email válido';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Por favor, ingresa el asunto';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Por favor, escribe tu mensaje';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Tu mensaje debe tener al menos 20 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetear estado de envío
    setStatus({ type: '', message: '' });
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Enviar datos al backend
      const response = await fetch(`${API_BASE_URL}/api/support/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el formulario');
      }
      
      // Mostrar mensaje de éxito
      setStatus({
        type: 'success',
        message: data.message || '¡Tu mensaje ha sido enviado con éxito! Te responderemos a la brevedad.'
      });
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      // Mostrar mensaje de error
      console.error('Error al enviar el formulario:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Lo sentimos, ha ocurrido un error al enviar tu mensaje. Por favor intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contacto</h1>
      <p className="contact-subtitle">
        Estamos aquí para ayudarte. Completa el formulario o utiliza nuestro email de contacto.
      </p>
      
      <div className="contact-content">
        <div className="contact-form-container">
          <h2 className="section-title">Envíanos un mensaje</h2>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            {status.message && (
              <div className={`form-status ${status.type}`}>
                {status.message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name">Nombre <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Asunto <span className="required">*</span></label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={errors.subject ? 'error' : ''}
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mensaje <span className="required">*</span></label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
              ></textarea>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
            
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              <FontAwesomeIcon icon={faPaperPlane} className="submit-icon" />
            </button>
          </form>
        </div>
        
        <div className="contact-info-container">
          <h2 className="section-title">Información de contacto</h2>
          
          <div className="contact-info">
            <div className="info-item">
              <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
              <div>
                <h3>Email</h3>
                <p><a href="mailto:fut4ebusiness@gmail.com">fut4ebusiness@gmail.com</a></p>
              </div>
            </div>
          </div>
          
          <div className="social-contact">
            <h3>Síguenos</h3>
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
            </div>
          </div>
          
          <div className="contact-hours">
            <h3>Horario de atención</h3>
            <p>Lunes a Viernes: 9:00 - 18:00</p>
            <p>Sábado y Domingo: Cerrado</p>
          </div>
        </div>
      </div>
      
      <div className="faq-section">
        <h2 className="section-title">Preguntas frecuentes</h2>
        <div className="faq-content">
          <div className="faq-item">
            <h3>¿Cómo puedo subir un video?</h3>
            <p>Para subir un video debes iniciar sesión en tu cuenta y hacer clic en el botón "Subir Vídeo" en el menú principal.</p>
          </div>
          <div className="faq-item">
            <h3>¿Qué formatos de video son compatibles?</h3>
            <p>Aceptamos los formatos más comunes como MP4, MOV, AVI y WebM. El tamaño máximo permitido es de 500MB.</p>
          </div>
          <div className="faq-item">
            <h3>¿Cómo puedo recuperar mi contraseña?</h3>
            <p>En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones que te enviaremos a tu email.</p>
          </div>
          <div className="faq-item">
            <h3>¿Cómo puedo reportar contenido inapropiado?</h3>
            <p>Cada video tiene un botón de "Reportar" que puedes usar para informarnos sobre contenido que infringe nuestras normas comunitarias.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
