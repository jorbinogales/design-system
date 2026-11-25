import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Professional } from '../../domain/booking';
import type { BusinessUnit } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { InitialsAvatar } from '../../components/data-display/InitialsAvatar/InitialsAvatar';
import { StatusBadge } from '../../components/data-display/StatusBadge/StatusBadge';
import { Card } from '../../components/layout/Card/Card';
import { bs } from '../../theme/theme';

export interface ProfessionalCardProps {
  /** Omit (or `undefined`) to show the "Pendiente de asignación" variant. */
  professional?: Professional;
  /** Unit of the booking: tailors the "what to expect" text of the awaiting variant. */
  unit?: BusinessUnit;
  /** Center or base of the professional, already localized, shown under the role (optional). */
  baseLabel?: string;
  /** Override of the awaiting explanation (e.g. the exact window). */
  awaitingNote?: string;
}

const messages = {
  es: {
    rating: (v: string) => `Calificación ${v} de 5`,
    awaitingTitle: 'Qué esperar',
    awaiting: {
      detailing: 'Asignamos a tu detailer hasta 24 horas antes de la cita. Te avisamos por la app cuando tenga nombre.',
      towing: 'Asignamos al conductor de la grúa cuando confirmamos la recogida en el patio. Te avisamos por la app cuando salga.',
      'personal-washing': 'Asignamos al profesional que va a tu dirección hasta 24 horas antes. Te avisamos por la app cuando tenga nombre.',
    },
    generic: 'Te avisamos por la app cuando asignemos a tu profesional.',
    assignedAria: (n: string, r: string) => `Profesional asignado: ${n}, ${r}`,
  },
  en: {
    rating: (v: string) => `Rated ${v} out of 5`,
    awaitingTitle: 'What to expect',
    awaiting: {
      detailing: 'We assign your detailer up to 24 hours before the appointment. We notify you in the app once they have a name.',
      towing: 'We assign the tow driver once the yard pickup is confirmed. We notify you in the app when they set off.',
      'personal-washing': 'We assign the professional who comes to your address up to 24 hours ahead. We notify you in the app once they have a name.',
    },
    generic: 'We notify you in the app as soon as your professional is assigned.',
    assignedAria: (n: string, r: string) => `Assigned professional: ${n}, ${r}`,
  },
};

/** Who will do the service. When nobody is assigned yet it says so and tells the customer what to expect. */
export function ProfessionalCard({ professional, unit, baseLabel, awaitingNote }: ProfessionalCardProps) {
  const t = useT(messages);
  const locale = useLocale();

  if (!professional) {
    return (
      <Card variant="filled" component="section">
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          <InitialsAvatar size="lg" />
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StatusBadge dimension="assignment" status="unassigned" long />
            <Typography variant="label" component="p" sx={{ mt: 1 }}>
              {t.awaitingTitle}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <NotificationsNoneRounded aria-hidden sx={{ fontSize: 18, mt: '2px', color: bs.text.secondary, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                {awaitingNote ?? (unit ? t.awaiting[unit] : t.generic)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  }

  const role = professional.role[locale];
  return (
    <Card component="section" variant="outlined">
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }} role="group" aria-label={t.assignedAria(professional.name, role)}>
        <InitialsAvatar name={professional.name} src={professional.photoUrl} size="lg" />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" component="p">
            {professional.name}
          </Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {role}
            {baseLabel ? ` · ${baseLabel}` : ''}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 1.5, flexWrap: 'wrap' }}>
            <StatusBadge dimension="assignment" status="assigned" size="sm" />
            {professional.rating !== undefined && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }} role="img" aria-label={t.rating(professional.rating.toFixed(1))}>
                <StarRounded aria-hidden sx={{ fontSize: 18, color: bs.text.primary }} />
                <Typography variant="label" component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {professional.rating.toFixed(1)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
