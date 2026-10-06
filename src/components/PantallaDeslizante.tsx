// src/components/PantallaDeslizante.tsx
// WKF — Wrapper que anima la entrada y salida de pantallas superpuestas.
// Se usa desde Home para envolver SpotScreen, MapScreen y TutorialScreen.

import React, { useEffect, useState } from 'react';

interface PantallaDeslizanteProps {
  children: React.ReactNode;
  onClose: () => void;
  /** Si es true, la pantalla está en proceso de cierre. El padre debe
   *  mantenerla montada hasta que onClose se dispare de verdad. */
  activa: boolean;
}

export const PantallaDeslizante: React.FC<PantallaDeslizanteProps> = ({
  children,
  onClose,
  activa,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activa) {
      // Fuerza un reflow antes de activar la transición para que
      // el navegador detecte el cambio de estado.
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
    }
  }, [activa]);

  const style: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'var(--bg)',
    zIndex: 200,
    transform: visible ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'transform',
  };

  return (
    <div
      style={style}
      onTransitionEnd={() => {
        if (!visible) onClose();
      }}
    >
      {children}
    </div>
  );
};

export default PantallaDeslizante;
