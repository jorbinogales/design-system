import Box from '@mui/material/Box';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useNav } from '../../../app/nav';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { PasswordField } from '../../../components/fields/PasswordField/PasswordField';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useT } from '../../../i18n/locale';
import { ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Gestor de contraseñas',
    current: 'Contraseña actual',
    next: 'Nueva contraseña',
    confirm: 'Confirmar nueva contraseña',
    rules: 'Mínimo 8 caracteres, con al menos una letra y un número.',
    update: 'Actualizar contraseña',
    saved: 'Contraseña actualizada',
    errCurrent: 'Escribe tu contraseña actual.',
    errNext: 'Usa al menos 8 caracteres, con una letra y un número.',
    errSame: 'La nueva contraseña debe ser distinta de la actual.',
    errConfirm: 'Las contraseñas no coinciden.',
  },
  en: {
    title: 'Password manager',
    current: 'Current password',
    next: 'New password',
    confirm: 'Confirm new password',
    rules: 'At least 8 characters, with at least one letter and one number.',
    update: 'Update password',
    saved: 'Password updated',
    errCurrent: 'Enter your current password.',
    errNext: 'Use at least 8 characters, with a letter and a number.',
    errSame: 'The new password must be different from the current one.',
    errConfirm: 'The passwords do not match.',
  },
};

interface Values {
  current: string;
  next: string;
  confirm: string;
}

export interface PasswordManagerScreenProps {
  initial?: Partial<Values>;
  /** Show validation from the start (story "Con error"). */
  submitted?: boolean;
}

function Content({ initial, submitted: startSubmitted = false }: PasswordManagerScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const toast = useToast();
  const formId = useId();
  const [v, setV] = useState<Values>({ current: '', next: '', confirm: '', ...initial });
  const [submitted, setSubmitted] = useState(startSubmitted);
  const [saving, setSaving] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const strong = v.next.length >= 8 && /[A-Za-z]/.test(v.next) && /\d/.test(v.next);
  const errors = {
    current: v.current ? undefined : t.errCurrent,
    next: !strong ? t.errNext : v.next === v.current ? t.errSame : undefined,
    confirm: v.confirm !== v.next || !v.confirm ? t.errConfirm : undefined,
  };
  const set = (key: keyof Values) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [key]: e.target.value }));
  // The confirm field is also checked live once the user typed in it, so a mismatch shows before submitting.
  const showConfirm = submitted || (v.confirm.length > 0 && v.confirm !== v.next);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.current || errors.next || errors.confirm) return;
    setSaving(true);
    timer.current = window.setTimeout(() => {
      setSaving(false);
      setSubmitted(false);
      setV({ current: '', next: '', confirm: '' });
      toast.show({ message: t.saved, severity: 'success' });
    }, 900);
  };

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        <Box component="form" id={formId} noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <PasswordField label={t.current} purpose="current" value={v.current} onChange={set('current')} error={submitted ? errors.current : undefined} required />
          <PasswordField label={t.next} purpose="new" value={v.next} onChange={set('next')} error={submitted ? errors.next : undefined} helperText={t.rules} required />
          <PasswordField label={t.confirm} purpose="new" value={v.confirm} onChange={set('confirm')} error={showConfirm ? errors.confirm : undefined} required />
        </Box>
      </ScreenBody>
      <BottomActionBar>
        <Button type="submit" form={formId} fullWidth loading={saving}>
          {t.update}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}

/** Gestor de contraseñas (s78): current, new and confirm fields with validation on submit. */
export function PasswordManagerScreen(props: PasswordManagerScreenProps) {
  return (
    <ToastProvider offsetBottom={88}>
      <Content {...props} />
    </ToastProvider>
  );
}
