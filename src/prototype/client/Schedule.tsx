import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import WorkspacePremiumRounded from '@mui/icons-material/WorkspacePremiumRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { AppointmentPicker } from '../../blacksix/AppointmentPicker/AppointmentPicker';
import { formatDuration } from '../../blacksix/shared/format';
import { BottomActionBar } from '../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../components/actions/Button/Button';
import { Price } from '../../components/data-display/Price/Price';
import { InlineAlert } from '../../components/feedback/InlineAlert/InlineAlert';
import { Card } from '../../components/layout/Card/Card';
import { unitMeta } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { getDayState, getSlots } from '../../mocks/availability';
import { bs } from '../../theme/theme';
import { getPackage, TODAY, totalOf } from '../data';
import { draftLines, useProto } from '../store';
import { BlockTitle, FlowTopBar, ScreenBody, ScreenRoot, TotalSummary } from './shared';

const messages = {
  es: {
    title: 'Fecha y hora',
    duration: 'Duración estimada',
    when: '¿Cuándo te viene bien?',
    reschedule: 'Puedes reprogramar sin costo hasta 24 horas antes.',
    vip: 'Como VIP puedes reservar también los días llenos.',
    vipNo: 'Los días llenos se abren para miembros VIP.',
    vipLink: 'Conocer VIP',
    total: 'Total',
    next: 'Continuar',
    pick: 'Elige día y hora',
  },
  en: {
    title: 'Date and time',
    duration: 'Estimated duration',
    when: 'When works for you?',
    reschedule: 'You can reschedule for free up to 24 hours before.',
    vip: 'As a VIP you can also book full days.',
    vipNo: 'Full days open up for VIP members.',
    vipLink: 'About VIP',
    total: 'Total',
    next: 'Continue',
    pick: 'Pick a day and time',
  },
};

/** Fecha y hora: package recap, day strip + calendar + time slots. VIP members can book "full" days. */
export function ScheduleScreen() {
  const t = useT(messages);
  const locale = useLocale();
  const { draft, setDraft, go, isVip } = useProto();
  const pkg = getPackage(draft.packageId);
  const unit = draft.unit;
  const dayState = (d: Dayjs) => {
    const s = getDayState(d, unit);
    return isVip && s === 'full' ? 'available' : s;
  };
  const slots = useMemo(() => {
    if (!draft.day) return [];
    const raw = getDayState(draft.day, unit) === 'full' && isVip ? getSlots(draft.day.add(1, 'day'), unit) : getSlots(draft.day, unit);
    return isVip ? raw.map((s) => ({ ...s, status: 'available' as const })) : raw;
  }, [draft.day, unit, isVip]);
  const ready = Boolean(draft.day && draft.time);
  const total = totalOf(draftLines(draft, isVip, locale));

  return (
    <ScreenRoot>
      <FlowTopBar title={t.title} step={1} />
      <ScreenBody gap={6}>
        <Card variant="filled">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="label" component="p">
                {unitMeta[unit].name} · {pkg.name[locale]}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: bs.text.secondary }}>
                <ScheduleOutlined aria-hidden sx={{ fontSize: 18 }} />
                <Typography variant="body2" component="p">
                  {t.duration}: {formatDuration(pkg.durationMin)}
                </Typography>
              </Box>
            </Box>
            <Price amount={pkg.price} size="lg" from={pkg.priceFrom} />
          </Box>
        </Card>

        <Box component="section" aria-labelledby="h-when" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <BlockTitle id="h-when">{t.when}</BlockTitle>
          <AppointmentPicker
            value={{ day: draft.day, time: draft.time }}
            onChange={(v) => setDraft({ day: v.day, time: v.time })}
            start={TODAY}
            today={TODAY}
            getDayState={dayState}
            slots={slots}
            durationMin={pkg.durationMin}
            showCalendar
          />
        </Box>

        <InlineAlert severity="info">{t.reschedule}</InlineAlert>
        {isVip ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: bs.text.secondary }}>
            <WorkspacePremiumRounded aria-hidden sx={{ color: bs.brand.primary, fontSize: 20 }} />
            <Typography variant="body2">{t.vip}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.vipNo}{' '}
            <Box component="a" href="#/c/vip" sx={{ color: bs.text.link, fontWeight: 600 }}>
              {t.vipLink}
            </Box>
          </Typography>
        )}
      </ScreenBody>

      <BottomActionBar summary={<TotalSummary label={t.total} amount={total} from={pkg.priceFrom} />}>
        <Button disabled={!ready} onClick={() => go({ name: unit === 'detailing' ? 'checkout' : 'address' })}>
          {ready ? t.next : t.pick}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
