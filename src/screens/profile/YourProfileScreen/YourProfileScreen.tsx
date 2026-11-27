import Box from '@mui/material/Box';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useNav } from '../../../app/nav';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { InitialsAvatar } from '../../../components/data-display/InitialsAvatar/InitialsAvatar';
import { EmailField } from '../../../components/fields/EmailField/EmailField';
import { PhoneField } from '../../../components/fields/PhoneField/PhoneField';
import { TextField } from '../../../components/fields/TextField/TextField';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useT } from '../../../i18n/locale';
import { user } from '../data';
import { ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Tu perfil',
    name: 'Nombre completo',
    namePlaceholder: 'Nombre y apellido',
    hint: 'Usaremos este correo y teléfono para confirmaciones y avisos de tus servicios.',
    update: 'Actualizar',
    password: 'Cambiar contraseña',
    saved: 'Perfil actualizado',
    errName: 'Escribe tu nombre y apellido.',
    errEmail: 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    errPhone: 'El teléfono debe tener 10 dígitos.',
  },
  en: {
    title: 'Your profile',
    name: 'Full name',
    namePlaceholder: 'First and last name',
    hint: 'We use this email and phone for confirmations and updates about your services.',
    update: 'Update',
    password: 'Change password',
    saved: 'Profile updated',
    errName: 'Enter your first and last name.',
    errEmail: 'Enter a valid email, for example name@email.com.',
    errPhone: 'The phone number must have 10 digits.',
  },
};

interface Values {
  name: string;
  phone: string;
  email: string;
}

export interface YourProfileScreenProps {
  initial?: Partial<Values>;
  /** Show validation messages from the start (story "Con error"). */
  submitted?: boolean;
}

function Content({ initial, submitted: startSubmitted = false }: YourProfileScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const toast = useToast();
  const formId = useId();
  const base = useRef<Values>({ name: user.name, phone: user.phone, email: user.email });
  const [values, setValues] = useState<Values>({ ...base.current, ...initial });
  const [submitted, setSubmitted] = useState(startSubmitted);
  const [saving, setSaving] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const errors = {
    name: values.name.trim().split(/\s+/).filter(Boolean).length < 2 ? t.errName : undefined,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()) ? undefined : t.errEmail,
    phone: values.phone.replace(/\D/g, '').length === 10 ? undefined : t.errPhone,
  };
  const dirty = (Object.keys(values) as (keyof Values)[]).some((k) => values[k] !== base.current[k]);
  const set = (key: keyof Values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const show = (key: keyof Values) => (submitted ? errors[key] : undefined);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.email || errors.phone) return;
    setSaving(true);
    timer.current = window.setTimeout(() => {
      setSaving(false);
      base.current = values;
      toast.show({ message: t.saved, severity: 'success' });
    }, 900);
  };

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
          <InitialsAvatar name={values.name || user.name} size="xl" />
        </Box>
        <Box component="form" id={formId} noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <TextField label={t.name} placeholder={t.namePlaceholder} value={values.name} onChange={set('name')} error={show('name')} autoComplete="name" required />
          <PhoneField value={values.phone} onChange={set('phone')} error={show('phone')} helperText={t.hint} required />
          <EmailField value={values.email} onChange={set('email')} error={show('email')} required />
        </Box>
        <Button variant="quiet" fullWidth onClick={() => nav.go('password-manager')}>
          {t.password}
        </Button>
      </ScreenBody>
      <BottomActionBar>
        <Button type="submit" form={formId} fullWidth loading={saving} disabled={!dirty && !submitted}>
          {t.update}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}

/** Tu perfil (s68): edit name, phone and email; "Actualizar" enables once something changes. */
export function YourProfileScreen(props: YourProfileScreenProps) {
  return (
    <ToastProvider offsetBottom={80}>
      <Content {...props} />
    </ToastProvider>
  );
}
