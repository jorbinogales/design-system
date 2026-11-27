import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { Link } from '../../../components/actions/Link/Link';
import { CodeField } from '../../../components/fields/CodeField/CodeField';
import { useNav } from '../../../app/nav';
import { useToast, ToastProvider } from '../../../components/feedback/Toast/Toast';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { demoUser } from '../data';
import { AuthHeading, ScreenBody, ScreenRoot } from '../shared/AccessParts';

const VALID_CODE = '4821';

const messages = {
  es: {
    title: 'Verifica tu correo',
    subtitle: 'Enviamos un código de 4 dígitos a',
    label: 'Código de verificación',
    wrong: 'El código no es correcto. Revisa el mensaje e inténtalo de nuevo.',
    noCode: '¿No recibiste el código?',
    resendIn: (s: string) => `Podrás reenviarlo en ${s}`,
    resend: 'Reenviar código',
    resent: 'Te enviamos un código nuevo.',
    verify: 'Verificar',
    wrongEmail: '¿Correo equivocado?',
  },
  en: {
    title: 'Verify your email',
    subtitle: 'We sent a 4-digit code to',
    label: 'Verification code',
    wrong: "That code isn't right. Check the message and try again.",
    noCode: "Didn't get the code?",
    resendIn: (s: string) => `You can resend it in ${s}`,
    resend: 'Resend code',
    resent: "We've sent you a new code.",
    verify: 'Verify',
    wrongEmail: 'Wrong email?',
  },
};

const clock = (s: number) => `0:${String(s).padStart(2, '0')}`;

export interface VerifyCodeScreenProps {
  initialCode?: string;
  /** Start with the "wrong code" error visible. */
  initialInvalid?: boolean;
  /** Seconds before "Reenviar código" unlocks. */
  initialSeconds?: number;
  email?: string;
  onBack?: () => void;
}

function Content({ initialCode = '', initialInvalid = false, initialSeconds = 30, email = demoUser.email, onBack }: VerifyCodeScreenProps) {
  const t = useT(messages);
  const toast = useToast();
  const nav = useNav();
  const [code, setCode] = useState(initialCode);
  const [invalid, setInvalid] = useState(initialInvalid);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);

  const change = (v: string) => {
    setCode(v);
    setInvalid(false);
  };

  const verify = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      if (code !== VALID_CODE) setInvalid(true);
      else nav.go(nav.route.params?.next ?? 'complete-profile');
    }, 800);
  };

  const resend = () => {
    setSeconds(30);
    setCode('');
    setInvalid(false);
    toast.show({ message: t.resent, severity: 'success' });
  };

  return (
    <ScreenRoot>
      <TopBar onBack={onBack ?? nav.back} />
      <ScreenBody sx={{ gap: 7 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AuthHeading
            title={t.title}
            subtitle={
              <>
                {t.subtitle}{' '}
                <Box component="strong" sx={{ color: bs.text.primary, fontWeight: 650, overflowWrap: 'anywhere' }}>
                  {email}
                </Box>
              </>
            }
          />
        </Box>
        <CodeField variant="otp" label={t.label} value={code} onChange={change} error={invalid ? t.wrong : false} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.noCode}
          </Typography>
          {seconds > 0 ? (
            <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {t.resendIn(clock(seconds))}
            </Typography>
          ) : (
            <Link variant="standalone" onClick={resend}>
              {t.resend}
            </Link>
          )}
        </Box>
        <Button fullWidth disabled={code.length < 4} loading={busy} onClick={verify} sx={{ mt: 'auto' }}>
          {t.verify}
        </Button>
      </ScreenBody>
    </ScreenRoot>
  );
}

/** Verify code: 4-digit OTP, resend with countdown, wrong-code error. Valid demo code: 4821. */
export function VerifyCodeScreen(props: VerifyCodeScreenProps) {
  return (
    <ToastProvider>
      <Content {...props} />
    </ToastProvider>
  );
}
