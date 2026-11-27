import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { Link } from '../../../components/actions/Link/Link';
import { EmailField } from '../../../components/fields/EmailField/EmailField';
import { PasswordField } from '../../../components/fields/PasswordField/PasswordField';
import { TextField } from '../../../components/fields/TextField/TextField';
import { Checkbox } from '../../../components/selection/Checkbox/Checkbox';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { AuthHeading, isEmail, ScreenBody, ScreenRoot, SocialSignIn } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Crea tu cuenta',
    name: 'Nombre completo',
    password: 'Contraseña',
    passwordHint: 'Mínimo 8 caracteres.',
    terms: 'Acepto los',
    termsLink: 'Términos y condiciones',
    and: 'y la',
    privacyLink: 'Política de privacidad',
    submit: 'Crear cuenta',
    haveAccount: '¿Ya tienes cuenta?',
    signIn: 'Inicia sesión',
    nameRequired: 'Escribe tu nombre.',
    emailInvalid: 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    passwordShort: 'La contraseña necesita al menos 8 caracteres.',
    termsRequired: 'Debes aceptar los términos para crear tu cuenta.',
    verb: 'regístrate',
  },
  en: {
    title: 'Create your account',
    name: 'Full name',
    password: 'Password',
    passwordHint: 'At least 8 characters.',
    terms: 'I accept the',
    termsLink: 'Terms and conditions',
    and: 'and the',
    privacyLink: 'Privacy policy',
    submit: 'Create account',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    nameRequired: 'Enter your name.',
    emailInvalid: 'Enter a valid email, for example name@email.com.',
    passwordShort: 'Your password needs at least 8 characters.',
    termsRequired: 'You must accept the terms to create your account.',
    verb: 'sign up',
  },
};

export interface SignUpScreenProps {
  defaultName?: string;
  defaultEmail?: string;
  defaultPassword?: string;
  defaultAccepted?: boolean;
  initialSubmitted?: boolean;
  loading?: boolean;
  onSignIn?: () => void;
}

/** Create account: name, email, password, terms, social sign-up. */
export function SignUpScreen({ defaultName = '', defaultEmail = '', defaultPassword = '', defaultAccepted = false, initialSubmitted = false, loading = false, onSignIn }: SignUpScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [accepted, setAccepted] = useState(defaultAccepted);
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [busy, setBusy] = useState(loading);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const errors = {
    name: submitted && !name.trim() ? t.nameRequired : undefined,
    email: submitted && !isEmail(email) ? t.emailInvalid : undefined,
    password: submitted && password.length < 8 ? t.passwordShort : undefined,
    terms: submitted && !accepted ? t.termsRequired : undefined,
  };

  // No separate terms screen yet: both links open the privacy policy. Stop the click reaching the checkbox label.
  const legal = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    nav.go('privacy-policy');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!name.trim() || !isEmail(email) || password.length < 8 || !accepted) return;
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      nav.go('verify-code');
    }, 1200);
  };

  return (
    <ScreenRoot>
      <ScreenBody noTopBar sx={{ gap: 7 }}>
        <AuthHeading title={t.title} />
        <Box component="form" noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <TextField label={t.name} value={name} onChange={(e) => setName(e.target.value)} error={errors.name} autoComplete="name" />
          <EmailField value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <PasswordField label={t.password} purpose="new" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} helperText={t.passwordHint} />
          <Checkbox
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            error={errors.terms}
            label={
              <>
                {t.terms} <Link size="sm" onClick={legal}>{t.termsLink}</Link> {t.and} <Link size="sm" onClick={legal}>{t.privacyLink}</Link>
              </>
            }
          />
          <Button type="submit" fullWidth loading={busy}>
            {t.submit}
          </Button>
        </Box>
        <SocialSignIn verb={t.verb} onSelect={() => nav.go('complete-profile')} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: bs.text.secondary, mt: 'auto' }}>
          {t.haveAccount}{' '}
          <Link size="sm" onClick={onSignIn ?? (() => nav.go('sign-in'))}>
            {t.signIn}
          </Link>
        </Typography>
      </ScreenBody>
    </ScreenRoot>
  );
}
