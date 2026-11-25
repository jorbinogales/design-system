import type { Preview } from '@storybook/react-vite';
import { withBlackSeat } from '../src/storybook/decorators';
import { DocsContainer } from '../src/storybook/DocsContainer';
import { SIDE_BY_SIDE } from '../src/storybook/globals';
import { sbLight } from '../src/storybook/sbThemes';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Apariencia',
      toolbar: {
        title: 'Apariencia',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Claro', icon: 'sun' },
          { value: 'dark', title: 'Oscuro', icon: 'moon' },
          { value: 'system', title: 'Sistema', icon: 'browser' },
          { value: SIDE_BY_SIDE, title: 'Claro + Oscuro', icon: 'sidebaralt' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Idioma',
      toolbar: {
        title: 'Idioma',
        icon: 'globe',
        items: [
          { value: 'es', title: 'Español', right: 'ES' },
          { value: 'en', title: 'English', right: 'EN' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', locale: 'es' },
  decorators: [withBlackSeat],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    backgrounds: { disable: true },
    docs: { container: DocsContainer, theme: sbLight },
    viewport: {
      options: {
        mobile: { name: 'Móvil · 390×844', styles: { width: '390px', height: '844px' }, type: 'mobile' },
        tablet: { name: 'Tableta · 834×1194', styles: { width: '834px', height: '1194px' }, type: 'tablet' },
        desktop: { name: 'Escritorio · 1440×900', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
      },
    },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: [
          'Introducción',
          'Fundamentos',
          ['Colores', 'Tipografía', 'Espaciado', 'Radios', 'Elevación', 'Movimiento', 'Iconografía', 'Marca'],
          'Componentes',
          [
            'Acciones',
            'Navegación móvil',
            'Navegación de escritorio',
            'Estructura',
            'Campos',
            'Selección',
            'Fecha y hora',
            'Direcciones',
            'Presentación de datos',
            'Capas y menús',
            'Feedback',
            'Estados de pantalla',
            'Tablas y bandejas',
            'Preferencias',
          ],
          'Black Seat',
          'Pantallas',
          ['Acceso', 'Inicio y exploración', 'Servicio', 'Reserva', 'Mis reservas', 'Mensajes', 'Notificaciones', 'Perfil'],
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
