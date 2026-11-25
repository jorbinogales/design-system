import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { Button } from '../../actions/Button/Button';
import { EmptyState, type EmptyStateProps } from '../EmptyState/EmptyState';
import { EmptyIllustration, ErrorIllustration, NoResultsIllustration, OfflineIllustration, RestrictedIllustration } from '../EmptyState/Illustrations';

type PresetProps = Omit<EmptyStateProps, 'illustration' | 'title'> & { title?: ReactNode };

const messages = {
  es: {
    emptyTitle: 'Aún no hay nada aquí',
    emptyBody: 'Cuando haya algo nuevo aparecerá en esta lista.',
    noResultsTitle: (q?: string): string => (q ? `Sin resultados para “${q}”` : 'Sin resultados'),
    noResultsBody: 'Revisa la ortografía o prueba con menos filtros.',
    clear: 'Limpiar filtros',
    errorTitle: 'No pudimos cargar esto',
    errorBody: 'Fue un problema de nuestro lado. Tus datos están a salvo.',
    retry: 'Reintentar',
    offlineTitle: 'Sin conexión',
    offlineBody: 'Revisa tu Wi-Fi o tus datos móviles. Volveremos a cargar cuando te conectes.',
    restrictedTitle: 'No tienes acceso a esta sección',
    restrictedBody: (role: 'operator' | 'admin'): string => (role === 'admin' ? 'Esta área es solo para administradores.' : 'Esta área es solo para el personal operativo.'),
    restrictedHint: ' Si la necesitas, pide acceso a tu administrador.',
    back: 'Volver al inicio',
    request: 'Solicitar acceso',
  },
  en: {
    emptyTitle: 'Nothing here yet',
    emptyBody: 'When something new arrives it will show up in this list.',
    noResultsTitle: (q?: string): string => (q ? `No results for “${q}”` : 'No results'),
    noResultsBody: 'Check the spelling or try fewer filters.',
    clear: 'Clear filters',
    errorTitle: 'We could not load this',
    errorBody: 'This was a problem on our side. Your data is safe.',
    retry: 'Try again',
    offlineTitle: 'No connection',
    offlineBody: 'Check your Wi-Fi or mobile data. We will reload when you are back online.',
    restrictedTitle: 'You do not have access to this section',
    restrictedBody: (role: 'operator' | 'admin'): string => (role === 'admin' ? 'This area is for administrators only.' : 'This area is for operations staff only.'),
    restrictedHint: ' If you need it, ask your administrator for access.',
    back: 'Back to home',
    request: 'Request access',
  },
};

function Action({ children, onClick, primary = true, loading }: { children: ReactNode; onClick?: () => void; primary?: boolean; loading?: boolean }) {
  return (
    <Button variant={primary ? 'primary' : 'quiet'} size="md" fullWidth onClick={onClick} loading={loading}>
      {children}
    </Button>
  );
}

/**
 * Estado vacío: there is nothing yet and nothing went wrong ("Hoy no tienes trabajos").
 * The way forward is to go somewhere else or create something, never "Reintentar".
 */
export function NoItemsState({ title, description, primaryAction, secondaryAction, ...rest }: PresetProps) {
  const t = useT(messages);
  return <EmptyState illustration={<EmptyIllustration />} title={title ?? t.emptyTitle} description={description ?? t.emptyBody} primaryAction={primaryAction} secondaryAction={secondaryAction} {...rest} />;
}

/** Búsqueda sin resultados: the search worked, nothing matched. Primary action clears filters. */
export function NoResultsState({ query, onClear, title, description, primaryAction, secondaryAction, ...rest }: PresetProps & { query?: string; onClear?: () => void }) {
  const t = useT(messages);
  return (
    <EmptyState
      illustration={<NoResultsIllustration />}
      title={title ?? t.noResultsTitle(query)}
      description={description ?? t.noResultsBody}
      primaryAction={primaryAction ?? (onClear && <Action onClick={onClear}>{t.clear}</Action>)}
      secondaryAction={secondaryAction}
      {...rest}
    />
  );
}

/** Error con reintento: loading failed. Always offers Reintentar and says the data is safe. */
export function ErrorState({ onRetry, retrying, title, description, primaryAction, secondaryAction, ...rest }: PresetProps & { onRetry?: () => void; retrying?: boolean }) {
  const t = useT(messages);
  return (
    <EmptyState
      illustration={<ErrorIllustration />}
      title={title ?? t.errorTitle}
      description={description ?? t.errorBody}
      primaryAction={primaryAction ?? (onRetry && <Action onClick={onRetry} loading={retrying}>{t.retry}</Action>)}
      secondaryAction={secondaryAction}
      role="alert"
      {...rest}
    />
  );
}

/** Sin conexión: the device is offline. Reintentar checks the connection again. */
export function OfflineState({ onRetry, retrying, title, description, primaryAction, secondaryAction, ...rest }: PresetProps & { onRetry?: () => void; retrying?: boolean }) {
  const t = useT(messages);
  return (
    <EmptyState
      illustration={<OfflineIllustration />}
      title={title ?? t.offlineTitle}
      description={description ?? t.offlineBody}
      primaryAction={primaryAction ?? (onRetry && <Action onClick={onRetry} loading={retrying}>{t.retry}</Action>)}
      secondaryAction={secondaryAction}
      role="status"
      {...rest}
    />
  );
}

/** Acceso restringido: the role cannot see this section. `requiredRole` names who can. */
export function RestrictedState({ requiredRole = 'admin', onBack, onRequestAccess, title, description, primaryAction, secondaryAction, ...rest }: PresetProps & { requiredRole?: 'operator' | 'admin'; onBack?: () => void; onRequestAccess?: () => void }) {
  const t = useT(messages);
  return (
    <EmptyState
      illustration={<RestrictedIllustration />}
      title={title ?? t.restrictedTitle}
      description={description ?? `${t.restrictedBody(requiredRole)}${t.restrictedHint}`}
      primaryAction={primaryAction ?? (onBack && <Action onClick={onBack}>{t.back}</Action>)}
      secondaryAction={secondaryAction ?? (onRequestAccess && <Action primary={false} onClick={onRequestAccess}>{t.request}</Action>)}
      {...rest}
    />
  );
}
