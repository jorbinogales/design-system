import CameraAltOutlined from '@mui/icons-material/CameraAltOutlined';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { initialsOf } from '../../../components/data-display/InitialsAvatar/InitialsAvatar';
import { PhoneField } from '../../../components/fields/PhoneField/PhoneField';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { Media } from '../../../components/layout/Media/Media';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { BottomSheet } from '../../../components/overlays/BottomSheet/BottomSheet';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { demoUser } from '../data';
import { AuthHeading, ScreenBody, ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Completa tu perfil',
    changePhoto: 'Cambiar foto de perfil',
    photoAlt: 'Tu foto de perfil',
    phone: 'Teléfono móvil',
    phoneHelp: 'Más información sobre el teléfono',
    phoneHint: 'Te escribimos aquí cuando el equipo va hacia ti.',
    phoneNoMarketing: 'No usaremos tu número para fines de marketing.',
    skip: 'Omitir',
    save: 'Guardar perfil',
    phoneInvalid: 'Escribe un teléfono de 10 dígitos.',
    sheetTitle: 'Foto de perfil',
    take: 'Tomar foto',
    choose: 'Elegir de la galería',
    remove: 'Quitar foto',
  },
  en: {
    title: 'Complete your profile',
    changePhoto: 'Change profile photo',
    photoAlt: 'Your profile photo',
    phone: 'Mobile phone',
    phoneHelp: 'More information about the phone number',
    phoneHint: 'We text you here when the team is on the way.',
    phoneNoMarketing: "We won't use your number for marketing purposes.",
    skip: 'Skip',
    save: 'Save profile',
    phoneInvalid: 'Enter a 10-digit phone number.',
    sheetTitle: 'Profile photo',
    take: 'Take photo',
    choose: 'Choose from library',
    remove: 'Remove photo',
  },
};

export interface CompleteProfileScreenProps {
  defaultPhone?: string;
  initialSubmitted?: boolean;
  loading?: boolean;
  /** Open the photo sheet on mount. */
  initialSheetOpen?: boolean;
  onBack?: () => void;
}

/** Complete profile: photo (with source sheet) and phone. Name and email come from sign-up. */
export function CompleteProfileScreen({ defaultPhone = '', initialSubmitted = false, loading = false, initialSheetOpen = false, onBack }: CompleteProfileScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const [phone, setPhone] = useState(defaultPhone);
  const [photo, setPhoto] = useState(false);
  const [help, setHelp] = useState<HTMLElement | null>(null);
  const [sheet, setSheet] = useState(initialSheetOpen);
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [busy, setBusy] = useState(loading);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const digits = phone.replace(/\D/g, '');
  const phoneError = submitted && digits.length !== 10 ? t.phoneInvalid : undefined;

  const save = () => {
    setSubmitted(true);
    if (digits.length !== 10) return;
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      nav.go('location-permission');
    }, 1200);
  };

  const pick = () => {
    setPhoto(true);
    setSheet(false);
  };

  return (
    <ScreenRoot>
      <TopBar onBack={onBack ?? nav.back} />
      <ScreenBody sx={{ gap: 7, pb: 6 }}>
        <AuthHeading title={t.title} />
        <Box sx={{ alignSelf: 'center', position: 'relative', width: 112, height: 112 }}>
          <Box sx={{ width: 112, height: 112, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', backgroundColor: bs.surface.subtle, border: `1px solid ${bs.border.subtle}`, color: bs.text.secondary, fontSize: 36, fontWeight: 700 }}>
            {photo ? (
              <Box sx={{ width: '100%', height: '100%', '& > *': { aspectRatio: 'auto !important', height: '100%' } }}>
                <Media alt={t.photoAlt} radius="none" fallbackIcon={PersonOutlineRounded} />
              </Box>
            ) : (
              <span aria-hidden>{initialsOf(demoUser.name)}</span>
            )}
          </Box>
          <Box sx={{ position: 'absolute', right: -4, bottom: -4 }}>
            <IconButton label={t.changePhoto} icon={<CameraAltOutlined />} variant="raised" size="md" onClick={() => setSheet(true)} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <PhoneField
            label={t.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={phoneError}
            placeholder=""
            endAdornment={<IconButton label={t.phoneHelp} icon={<HelpOutlineRounded />} size="sm" aria-haspopup="dialog" onClick={(e) => setHelp(e.currentTarget)} />}
          />
        </Box>
      </ScreenBody>
      <BottomActionBar>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Button fullWidth loading={busy} onClick={save}>
            {t.save}
          </Button>
          <Button variant="quiet" fullWidth onClick={() => nav.go('location-permission')}>
            {t.skip}
          </Button>
        </Box>
      </BottomActionBar>
      <Popover
        open={Boolean(help)}
        anchorEl={help}
        onClose={() => setHelp(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { role: 'dialog', 'aria-label': t.phone, sx: { mt: 1, p: 4, maxWidth: 'min(320px, calc(100vw - 32px))' } } }}
      >
        <Typography variant="body2" sx={{ color: bs.text.secondary }}>
          {t.phoneHint} {t.phoneNoMarketing}
        </Typography>
      </Popover>
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
