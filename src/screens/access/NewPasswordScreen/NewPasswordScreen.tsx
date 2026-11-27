import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { PasswordField } from '../../../components/fields/PasswordField/PasswordField';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { AuthHeading, ScreenBody, ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Crea una contraseña nueva',
    subtitle: 'Úsala la próxima vez que inicies sesión. Debe ser distinta a la anterior.',
    password: 'Contraseña nueva',
    confirm: 'Confirmar contraseña',
    rulesLabel: 'Tu contraseña debe tener',
    rules: ['Al menos 8 caracteres', 'Una letra', 'Un número'],
    met: 'cumplido',
    pending: 'pendiente',
    mismatch: 'Las contraseñas no coinciden.',
    submit: 'Guardar contraseña',
  },
  en: {
    title: 'Create a new password',
    subtitle: 'Use it the next time you sign in. It must be different from the previous one.',
    password: 'New password',
    confirm: 'Confirm password',
    rulesLabel: 'Your password must have',
    rules: ['At least 8 characters', 'A letter', 'A number'],
    met: 'met',
    pending: 'pending',
    mismatch: "The passwords don't match.",
    submit: 'Save password',
  },
};

const checks = [(v: string) => v.length >= 8, (v: string) => /[A-Za-z]/.test(v), (v: string) => /\d/.test(v)];

export interface NewPasswordScreenProps {
  defaultPassword?: string;
  defaultConfirm?: string;
  initialSubmitted?: boolean;
  loading?: boolean;
  onBack?: () => void;
}

/** New password: two fields, live requirement list (icon + text), disabled until valid. */
export function NewPasswordScreen({ defaultPassword = '', defaultConfirm = '', initialSubmitted = false, loading = false, onBack }: NewPasswordScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const [password, setPassword] = useState(defaultPassword);
  const [confirm, setConfirm] = useState(defaultConfirm);
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [busy, setBusy] = useState(loading);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const results = checks.map((c) => c(password));
  const valid = results.every(Boolean);
  const mismatch = confirm.length > 0 && confirm !== password;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!valid || confirm !== password) return;
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      nav.reset('sign-in');
    }, 1200);
  };

  return (
    <ScreenRoot>
      <TopBar onBack={onBack ?? nav.back} />
      <ScreenBody sx={{ gap: 7 }}>
        <AuthHeading title={t.title} subtitle={t.subtitle} />
        <Box component="form" noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
          <PasswordField label={t.password} purpose="new" value={password} onChange={(e) => setPassword(e.target.value)} />
          <PasswordField label={t.confirm} purpose="new" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={(mismatch || (submitted && confirm !== password)) && t.mismatch} />
          <Box component="ul" aria-label={t.rulesLabel} sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {t.rules.map((rule, i) => (
              <Box component="li" key={rule} sx={{ display: 'flex', alignItems: 'center', gap: 2, color: results[i] ? bs.text.primary : bs.text.secondary }}>
                {results[i] ? <CheckCircleRounded aria-hidden sx={{ fontSize: 20, color: bs.status.success.fg }} /> : <RadioButtonUncheckedRounded aria-hidden sx={{ fontSize: 20 }} />}
                <Typography variant="body2">
                  {rule}
                  <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                    {' '}
                    ({results[i] ? t.met : t.pending})
                  </Box>
                </Typography>
              </Box>
            ))}
          </Box>
          <Button type="submit" fullWidth disabled={!valid || confirm.length === 0} loading={busy} sx={{ mt: 'auto' }}>
            {t.submit}
          </Button>
        </Box>
      </ScreenBody>
    </ScreenRoot>
  );
}
