import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  // Cuando la ruta cambia, hacer scroll al inicio de la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente no renderiza nada
}

export default ScrollToTop;
