import CameraAltOutlined from '@mui/icons-material/CameraAltOutlined';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { initialsOf } from '../../../components/data-display/InitialsAvatar/InitialsAvatar';
import { EmailField } from '../../../components/fields/EmailField/EmailField';
import { PhoneField } from '../../../components/fields/PhoneField/PhoneField';
import { TextField } from '../../../components/fields/TextField/TextField';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { Media } from '../../../components/layout/Media/Media';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { BottomSheet } from '../../../components/overlays/BottomSheet/BottomSheet';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { demoUser } from '../data';
import { AuthHeading, ScreenBody, ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Completa tu perfil',
    subtitle: 'Solo lo usamos para tus reservas y para que el equipo te reconozca. Nadie más ve tus datos.',
    changePhoto: 'Cambiar foto de perfil',
    photoAlt: 'Tu foto de perfil',
    name: 'Nombre completo',
    phone: 'Teléfono móvil',
    phoneHint: 'Te escribimos aquí cuando el equipo va hacia ti.',
    email: 'Correo electrónico',
    emailHint: 'Es el correo con el que creaste tu cuenta.',
    save: 'Guardar perfil',
    nameRequired: 'Escribe tu nombre.',
    phoneInvalid: 'Escribe un teléfono de 10 dígitos.',
    sheetTitle: 'Foto de perfil',
    take: 'Tomar foto',
    choose: 'Elegir de la galería',
    remove: 'Quitar foto',
  },
  en: {
    title: 'Complete your profile',
    subtitle: 'We only use it for your bookings and so the team can recognize you. No one else sees your data.',
    changePhoto: 'Change profile photo',
    photoAlt: 'Your profile photo',
    name: 'Full name',
    phone: 'Mobile phone',
    phoneHint: 'We text you here when the team is on the way.',
    email: 'Email',
    emailHint: 'The email you created your account with.',
    save: 'Save profile',
    nameRequired: 'Enter your name.',
    phoneInvalid: 'Enter a 10-digit phone number.',
    sheetTitle: 'Profile photo',
    take: 'Take photo',
    choose: 'Choose from library',
    remove: 'Remove photo',
  },
};

export interface CompleteProfileScreenProps {
  defaultName?: string;
  defaultPhone?: string;
  initialSubmitted?: boolean;
  loading?: boolean;
  /** Open the photo sheet on mount. */
  initialSheetOpen?: boolean;
  onBack?: () => void;
}

/** Complete profile: photo (with source sheet), name, phone, read-only email. */
export function CompleteProfileScreen({ defaultName = '', defaultPhone = '', initialSubmitted = false, loading = false, initialSheetOpen = false, onBack }: CompleteProfileScreenProps) {
  const t = useT(messages);
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [photo, setPhoto] = useState(false);
  const [sheet, setSheet] = useState(initialSheetOpen);
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [busy, setBusy] = useState(loading);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const digits = phone.replace(/\D/g, '');
  const nameError = submitted && !name.trim() ? t.nameRequired : undefined;
  const phoneError = submitted && digits.length !== 10 ? t.phoneInvalid : undefined;

  const save = () => {
    setSubmitted(true);
    if (!name.trim() || digits.length !== 10) return;
    setBusy(true);
    timer.current = window.setTimeout(() => setBusy(false), 1200);
  };

  const pick = () => {
    setPhoto(true);
    setSheet(false);
  };

  return (
    <ScreenRoot>
      <TopBar onBack={onBack} />
      <ScreenBody sx={{ gap: 7, pb: 6 }}>
        <AuthHeading title={t.title} subtitle={t.subtitle} />
        <Box sx={{ alignSelf: 'center', position: 'relative', width: 112, height: 112 }}>
          <Box sx={{ width: 112, height: 112, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', backgroundColor: bs.surface.subtle, border: `1px solid ${bs.border.subtle}`, color: bs.text.secondary, fontSize: 36, fontWeight: 700 }}>
            {photo ? (
              <Box sx={{ width: '100%', height: '100%', '& > *': { aspectRatio: 'auto !important', height: '100%' } }}>
                <Media alt={t.photoAlt} radius="none" fallbackIcon={PersonOutlineRounded} />
              </Box>
            ) : name.trim() ? (
              <span aria-hidden>{initialsOf(name)}</span>
            ) : (
              <PersonOutlineRounded aria-hidden sx={{ fontSize: 52 }} />
            )}
          </Box>
          <Box sx={{ position: 'absolute', right: -4, bottom: -4 }}>
            <IconButton label={t.changePhoto} icon={<CameraAltOutlined />} variant="raised" size="md" onClick={() => setSheet(true)} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <TextField label={t.name} value={name} onChange={(e) => setName(e.target.value)} error={nameError} placeholder={demoUser.name} autoComplete="name" />
          <PhoneField label={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} error={phoneError} helperText={t.phoneHint} />
          <EmailField label={t.email} value={demoUser.email} readOnly helperText={t.emailHint} />
        </Box>
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth loading={busy} onClick={save}>
          {t.save}
        </Button>
      </BottomActionBar>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={t.sheetTitle} disablePortal>
        <ListGroup>
          <ListRow as="li" title={t.take} leading={<CameraAltOutlined />} onClick={pick} inset="none" />
          <ListRow as="li" title={t.choose} leading={<PhotoLibraryOutlined />} onClick={pick} inset="none" divider={photo} />
          {photo && (
            <ListRow
              as="li"
              title={t.remove}
              leading={<DeleteOutlineRounded />}
              destructive
              divider={false}
              inset="none"
              onClick={() => {
                setPhoto(false);
                setSheet(false);
              }}
            />
          )}
        </ListGroup>
      </BottomSheet>
    </ScreenRoot>
  );
}
