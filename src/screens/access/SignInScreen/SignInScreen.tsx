import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Wordmark } from '../../../brand/Wordmark';
import { Button } from '../../../components/actions/Button/Button';
import { Link } from '../../../components/actions/Link/Link';
import { EmailField } from '../../../components/fields/EmailField/EmailField';
import { PasswordField } from '../../../components/fields/PasswordField/PasswordField';
import { InlineAlert } from '../../../components/feedback/InlineAlert/InlineAlert';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { AuthHeading, isEmail, ScreenBody, ScreenRoot, SocialSignIn } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Inicia sesión',
    subtitle: 'Entra para reservar y seguir tus servicios.',
    password: 'Contraseña',
    forgot: '¿Olvidaste tu contraseña?',
    submit: 'Iniciar sesión',
    noAccount: '¿No tienes cuenta?',
    create: 'Crea una',
    emailInvalid: 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    passwordRequired: 'Escribe tu contraseña.',
    credentialsTitle: 'No pudimos iniciar sesión',
    credentials: 'El correo o la contraseña no coinciden. Revisa los datos e inténtalo de nuevo.',
    verb: 'inicia sesión',
  },
  en: {
    title: 'Sign in',
    subtitle: 'Sign in to book and track your services.',
    password: 'Password',
    forgot: 'Forgot your password?',
    submit: 'Sign in',
    noAccount: "Don't have an account?",
    create: 'Create one',
    emailInvalid: 'Enter a valid email, for example name@email.com.',
    passwordRequired: 'Enter your password.',
    credentialsTitle: "We couldn't sign you in",
    credentials: "The email or password doesn't match. Check them and try again.",
    verb: 'sign in',
  },
};

export interface SignInScreenProps {
  defaultEmail?: string;
  defaultPassword?: string;
  /** Show validation as if the form had been submitted once. */
  initialSubmitted?: boolean;
  /** Show the "wrong credentials" alert (server rejection). */
  credentialsError?: boolean;
  /** Submit button in its loading state. */
  loading?: boolean;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
}

/** Sign in: email + password, recovery link, Apple and Google. Validates locally on submit. */
export function SignInScreen({ defaultEmail = '', defaultPassword = '', initialSubmitted = false, credentialsError = false, loading = false, onForgotPassword, onCreateAccount }: SignInScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [busy, setBusy] = useState(loading);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const emailError = submitted && !isEmail(email) ? t.emailInvalid : undefined;
  const passwordError = submitted && !password ? t.passwordRequired : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isEmail(email) || !password) return;
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      nav.reset('home');
    }, 1200);
  };

  return (
    <ScreenRoot>
      <ScreenBody noTopBar sx={{ gap: 8 }}>
        <Wordmark size="sm" withMark />
        <AuthHeading title={t.title} subtitle={t.subtitle} />
        <Box component="form" noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {credentialsError && (
            <InlineAlert severity="error" title={t.credentialsTitle}>
              {t.credentials}
            </InlineAlert>
          )}
          <EmailField value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} placeholder="nombre@correo.com" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PasswordField label={t.password} value={password} onChange={(e) => setPassword(e.target.value)} error={passwordError} />
            <Box sx={{ alignSelf: 'flex-end' }}>
              <Link variant="standalone" size="sm" onClick={onForgotPassword ?? (() => nav.go('verify-code', { next: 'new-password' }))}>
                {t.forgot}
              </Link>
            </Box>
          </Box>
          <Button type="submit" fullWidth loading={busy}>
            {t.submit}
          </Button>
        </Box>
        <SocialSignIn verb={t.verb} onSelect={() => nav.reset('home')} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: bs.text.secondary, mt: 'auto' }}>
          {t.noAccount}{' '}
          <Link size="sm" onClick={onCreateAccount ?? (() => nav.go('sign-up'))}>
            {t.create}
          </Link>
        </Typography>
      </ScreenBody>
    </ScreenRoot>
  );
}
