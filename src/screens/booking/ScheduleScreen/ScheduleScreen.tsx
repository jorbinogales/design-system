import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { AppointmentPicker, type AppointmentValue } from '../../../blackseat/AppointmentPicker/AppointmentPicker';
import { formatDuration } from '../../../blackseat/shared/format';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { formatAddress } from '../../../components/address/LocationCard/LocationCard';
import { Price } from '../../../components/data-display/Price/Price';
import { TextArea } from '../../../components/fields/TextArea/TextArea';
import { Card } from '../../../components/layout/Card/Card';
import { SegmentedControl } from '../../../components/navigation/SegmentedControl/SegmentedControl';
import { useLocale, useT } from '../../../i18n/locale';
import { getDayState, getSlots, mockSlotDay } from '../../../mocks/availability';
import { getCenter, getPackage } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { TODAY } from '../data';
import { BookingTopBar, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Agendar',
    type: 'Tipo de servicio',
    center: 'En el centro',
    pickup: 'Recogida y entrega',
    centerHint: 'Llevas tu vehículo a nuestro centro y lo recoges al terminar.',
    pickupHint: 'Pasamos por tu vehículo y lo devolvemos al terminar. En el siguiente paso eliges la dirección.',
    when: 'Fecha y hora',
    duration: 'Duración estimada',
    note: 'Nota para el equipo',
    noteHint: 'Opcional. Por ejemplo: una mancha en el asiento trasero o un rayón que quieras que revisemos.',
    notePlaceholder: 'Escribe aquí',
    next: 'Continuar',
    nextHint: 'Elige un día y un horario para continuar.',
    takenHint: 'Elige otro horario para continuar.',
  },
  en: {
    title: 'Schedule',
    type: 'Service type',
    center: 'At the center',
    pickup: 'Pickup and delivery',
    centerHint: 'You bring your vehicle to our center and collect it when we are done.',
    pickupHint: 'We pick up your vehicle and bring it back when done. You choose the address in the next step.',
    when: 'Date and time',
    duration: 'Estimated duration',
    note: 'Note for the team',
    noteHint: 'Optional. For example: a stain on the back seat or a scratch you want us to check.',
    notePlaceholder: 'Write here',
    next: 'Continue',
    nextHint: 'Pick a day and a time to continue.',
    takenHint: 'Choose another time to continue.',
  },
};

type Mode = 'center' | 'pickup';

export interface ScheduleScreenProps {
  /** Starts with a day and time chosen (default) or empty. */
  empty?: boolean;
  /** The chosen slot was taken by someone else meanwhile: the data stays, the time must be changed. */
  slotTaken?: boolean;
}

/** Agendar (s31): service type, appointment picker with duration, and a note for the team. Step 3 of 5. */
export function ScheduleScreen({ empty = false, slotTaken = false }: ScheduleScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const pkg = getPackage('det-premium')!;
  const center = getCenter('c-doral')!;
  const [mode, setMode] = useState<Mode>('center');
  const [value, setValue] = useState<AppointmentValue>(empty ? { day: null, time: null } : { day: mockSlotDay, time: '10:00' });
  const [takenTime, setTakenTime] = useState<string | null>(slotTaken ? '10:00' : null);
  const [note, setNote] = useState('');

  const slots = useMemo(() => {
    if (!value.day) return [];
    return getSlots(value.day, 'detailing').map((s) => (s.value === takenTime ? { ...s, status: 'taken' as const } : s));
  }, [value.day, takenTime]);

  const lost = Boolean(value.time) && value.time === takenTime;
  const ready = Boolean(value.day && value.time) && !lost;

  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={2} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        <Card variant="filled">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="label" component="p">
                Detailing {pkg.name[locale]}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: bs.text.secondary }}>
                <ScheduleOutlined aria-hidden sx={{ fontSize: 18 }} />
                <Typography variant="body2" component="p">
                  {t.duration}: {formatDuration(pkg.durationMin)}
                </Typography>
              </Box>
            </Box>
            <Price amount={pkg.price} size="lg" />
          </Box>
        </Card>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" component="h2">
            {t.type}
          </Typography>
          <SegmentedControl<Mode>
            fullWidth
            label={t.type}
            value={mode}
            onChange={setMode}
            options={[
              { value: 'center', label: t.center },
              { value: 'pickup', label: t.pickup },
            ]}
          />
          <Box sx={{ display: 'flex', gap: 2, color: bs.text.secondary }}>
            <PlaceOutlined aria-hidden sx={{ fontSize: 20, mt: 0.25 }} />
            <Typography variant="body2" component="p">
              {mode === 'center' ? (
                <>
                  <Box component="span" sx={{ color: bs.text.primary, fontWeight: 600 }}>
                    {center.name}
                  </Box>
                  {' · '}
                  {formatAddress(center.address)}. {t.centerHint}
                </>
              ) : (
                t.pickupHint
              )}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h4" component="h2">
            {t.when}
          </Typography>
          <AppointmentPicker
            value={value}
            onChange={(next) => {
              if (next.day?.format('YYYY-MM-DD') !== value.day?.format('YYYY-MM-DD')) setTakenTime(null);
              setValue(next);
            }}
            start={TODAY}
            today={TODAY}
            getDayState={(d) => getDayState(d, 'detailing')}
            slots={slots}
            durationMin={pkg.durationMin}
            showCalendar
          />
        </Box>

        <TextArea label={t.note} optional value={note} onChange={(e) => setNote(e.target.value)} maxLength={240} helperText={t.noteHint} placeholder={t.notePlaceholder} minRows={3} />
      </ScreenBody>
      <BottomActionBar>
        {!ready && (
          <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, textAlign: 'center', mb: 2 }}>
            {lost ? t.takenHint : t.nextHint}
          </Typography>
        )}
        <Button fullWidth disabled={!ready}>
          {t.next}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
