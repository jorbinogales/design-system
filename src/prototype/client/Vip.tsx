import BoltOutlined from '@mui/icons-material/BoltOutlined';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EventRepeatOutlined from '@mui/icons-material/EventRepeatOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import WorkspacePremiumRounded from '@mui/icons-material/WorkspacePremiumRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Button } from '../../components/actions/Button/Button';
import { Price } from '../../components/data-display/Price/Price';
import { Tag } from '../../components/data-display/Tag/Tag';
import { useToast } from '../../components/feedback/Toast/Toast';
import { SegmentedControl } from '../../components/navigation/SegmentedControl/SegmentedControl';
import { TopBar } from '../../components/navigation/TopBar/TopBar';
import { AccountMenu } from '../../components/preferences/AccountMenu/AccountMenu';
import { formatMoney } from '../../i18n/format';
import { useLocale, useT } from '../../i18n/locale';
import { InverseSurface } from '../../theme/SchemeScope';
import { bs } from '../../theme/theme';
import { radius } from '../../theme/tokens';
import { me, vipBenefits, vipPlans } from '../data';
import { useProto } from '../store';
import { ClientNav } from './ClientNav';
import { IconBubble, posterType, ScreenBody, ScreenRoot } from './shared';

const icons = { priority: BoltOutlined, discount: LocalOfferOutlined, bins: DeleteOutlineRounded, reschedule: EventRepeatOutlined };

const messages = {
  es: {
    title: 'Black Seat VIP',
    lead: 'Para clientes que no quieren esperar.',
    plan: 'Plan',
    monthly: 'Mensual',
    yearly: 'Anual',
    perMonth: 'al mes',
    perYear: 'al año',
    save: '2 meses gratis',
    benefits: 'Qué incluye',
    join: (p: string) => `Unirme por ${p}`,
    joined: '¡Listo! Ya eres VIP.',
    active: 'Membresía activa',
    leave: 'Cancelar membresía',
    left: 'Membresía cancelada.',
    terms: 'Cancela cuando quieras. Precio de ejemplo, pendiente de definir con Black Seat.',
  },
  en: {
    title: 'Black Seat VIP',
    lead: "For customers who don't want to wait.",
    plan: 'Plan',
    monthly: 'Monthly',
    yearly: 'Yearly',
    perMonth: 'per month',
    perYear: 'per year',
    save: '2 months free',
    benefits: "What's included",
    join: (p: string) => `Join for ${p}`,
    joined: "Done! You're VIP now.",
    active: 'Active membership',
    leave: 'Cancel membership',
    left: 'Membership cancelled.',
    terms: 'Cancel anytime. Sample price, to be defined with Black Seat.',
  },
};

/** VIP: price as the hero, plan toggle, benefits with icon + one line, single orange join action. */
export function VipScreen() {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const { isVip, setVip, go } = useProto();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const amount = vipPlans[plan];

  return (
    <ScreenRoot>
      <TopBar title={t.title} />
      <ScreenBody gap={7} sx={{ flex: 1 }}>
        <InverseSurface sx={{ borderRadius: `${radius.lg}px`, p: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <WorkspacePremiumRounded aria-hidden sx={{ color: bs.brand.primary, fontSize: 32 }} />
            {isVip && <Tag tone="brand" label={t.active} size="sm" />}
          </Box>
          <Typography variant="h2" component="h2" sx={{ ...posterType, fontSize: '2.5rem', '@media (min-width:900px)': { fontSize: '2.5rem' } }}>
            {t.lead}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <Price amount={amount} size="xl" />
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {plan === 'monthly' ? t.perMonth : t.perYear}
            </Typography>
          </Box>
        </InverseSurface>

        {!isVip && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SegmentedControl fullWidth label={t.plan} value={plan} onChange={setPlan} options={[{ value: 'monthly', label: t.monthly }, { value: 'yearly', label: `${t.yearly} · ${t.save}` }]} />
          </Box>
        )}

        <Box component="section" aria-labelledby="h-ben" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h4" component="h2" id="h-ben">
            {t.benefits}
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {vipBenefits.map((b) => {
              const Icon = icons[b.icon];
              return (
                <Box component="li" key={b.icon} sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <IconBubble>
                    <Icon />
                  </IconBubble>
                  <Box>
                    <Typography variant="label" component="p">
                      {b.title[locale]}
                    </Typography>
                    <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                      {b.detail[locale]}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        {isVip ? (
          <Button variant="quiet" size="md" onClick={() => (setVip(false), toast.show({ message: t.left }))} sx={{ alignSelf: 'flex-start' }}>
            {t.leave}
          </Button>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              onClick={() => {
                setVip(true);
                toast.show({ message: t.joined, severity: 'success' });
                go({ name: 'home' });
              }}
            >
              {t.join(`${formatMoney(amount, locale)}${plan === 'monthly' ? (locale === 'es' ? '/mes' : '/mo') : locale === 'es' ? '/año' : '/yr'}`)}
            </Button>
            <Typography variant="caption" sx={{ color: bs.text.secondary, textAlign: 'center' }}>
              {t.terms}
            </Typography>
          </Box>
        )}
      </ScreenBody>
      <ClientNav value="vip" />
    </ScreenRoot>
  );
}

const accountMessages = { es: { title: 'Cuenta' }, en: { title: 'Account' } };

/** Cuenta: language and appearance live here in the real app too. */
export function AccountScreen() {
  const t = useT(accountMessages);
  const { locale, setLocale, appearance, setAppearance, go } = useProto();
  return (
    <ScreenRoot>
      <TopBar title={t.title} />
      <ScreenBody sx={{ flex: 1 }}>
        <AccountMenu
          name={me.name}
          email={me.email}
          language={locale}
          onLanguageChange={setLocale}
          appearance={appearance}
          onAppearanceChange={setAppearance}
          onNavigate={(d) => (d === 'bookings' ? go({ name: 'bookings' }) : undefined)}
          onLogout={() => go({ name: 'home' })}
        />
      </ScreenBody>
      <ClientNav value="account" />
    </ScreenRoot>
  );
}
