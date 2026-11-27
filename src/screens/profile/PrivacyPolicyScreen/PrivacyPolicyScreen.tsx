import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNav } from '../../../app/nav';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { privacySections, privacyUpdated } from '../data';
import { ScreenBody, ScreenRoot, pick } from '../ui';

const messages = {
  es: {
    title: 'Política de privacidad',
    intro:
      'En Black Seat cuidamos tus datos igual que cuidamos tu vehículo. Esta política explica qué información recopilamos cuando usas la app para reservar Detailing, Towing o Personal Washing, para qué la usamos y qué decisiones puedes tomar.',
  },
  en: {
    title: 'Privacy policy',
    intro:
      'At Black Seat we look after your data the way we look after your vehicle. This policy explains what information we collect when you use the app to book Detailing, Towing or Personal Washing, what we use it for and the choices you have.',
  },
};

/**
 * Política de privacidad: long-form reading screen.
 * SAMPLE CONTENT: the legal text in `../data.ts` is plausible placeholder copy and needs legal review before launch.
 */
export function PrivacyPolicyScreen() {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <ScreenBody gap={6} sx={{ pb: 10 }}>
        <Box>
          <Typography variant="caption" component="p" sx={{ color: bs.text.secondary }}>
            {pick(privacyUpdated, locale)}
          </Typography>
          <Typography variant="body1" sx={{ mt: 3, maxWidth: '62ch' }}>
            {t.intro}
          </Typography>
        </Box>
        {privacySections.map((s, i) => (
          <Box component="section" key={s.id} aria-labelledby={`privacy-${s.id}`} sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '62ch' }}>
            <Typography id={`privacy-${s.id}`} variant="h3" component="h2">
              {`${i + 1}. ${pick(s.title, locale)}`}
            </Typography>
            {s.body.map((p) => (
              <Typography key={p.es} variant="body1" sx={{ color: bs.text.secondary }}>
                {pick(p, locale)}
              </Typography>
            ))}
          </Box>
        ))}
      </ScreenBody>
    </ScreenRoot>
  );
}
