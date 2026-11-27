import AddPhotoAlternateOutlined from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { TextArea } from '../../../components/fields/TextArea/TextArea';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { Card } from '../../../components/layout/Card/Card';
import { Media } from '../../../components/layout/Media/Media';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { unitMeta } from '../../../domain/units';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { getCenter } from '../../../mocks/catalog';
import { reviewPhotos, unitPhoto } from '../../../mocks/photos';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';
import { serviceCenterId, serviceUnit } from '../data';
import { Stars } from '../shared/Stars';

const messages = {
  es: {
    title: 'Escribir reseña',
    question: '¿Cómo fue tu experiencia?',
    hint: 'Toca las estrellas para calificar.',
    levels: ['Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'],
    stars: (n: number) => `${n} de 5 estrellas`,
    field: 'Tu reseña',
    placeholder: 'Cuenta qué te gustó o qué podemos mejorar.',
    helper: 'Opcional. Otras personas lo verán junto a tu nombre.',
    photos: 'Fotos',
    addPhoto: 'Agregar foto',
    photosHint: (n: number, max: number) => `${n} de ${max}`,
    removePhoto: (n: number) => `Quitar la foto ${n}`,
    photoAlt: (n: number) => `Foto ${n} de tu reseña`,
    send: 'Enviar',
    sending: 'Enviando…',
    sent: 'Reseña enviada',
    thanks: 'Gracias, tu reseña ya está publicada.',
    visit: 'Tu visita',
  },
  en: {
    title: 'Write a review',
    question: 'How was your experience?',
    hint: 'Tap the stars to rate.',
    levels: ['Very bad', 'Bad', 'Okay', 'Good', 'Excellent'],
    stars: (n: number) => `${n} out of 5 stars`,
    field: 'Your review',
    placeholder: 'Tell us what you liked or what we can improve.',
    helper: 'Optional. Other people will see it next to your name.',
    photos: 'Photos',
    addPhoto: 'Add photo',
    photosHint: (n: number, max: number) => `${n} of ${max}`,
    removePhoto: (n: number) => `Remove photo ${n}`,
    photoAlt: (n: number) => `Photo ${n} of your review`,
    send: 'Send',
    sending: 'Sending…',
    sent: 'Review sent',
    thanks: 'Thank you, your review is now published.',
    visit: 'Your visit',
  },
};

const MAX_PHOTOS = 4;

export interface WriteReviewScreenProps {
  defaultRating?: number;
  defaultText?: string;
  defaultPhotos?: number;
}

function Content({ defaultRating = 0, defaultText = '', defaultPhotos = 0 }: WriteReviewScreenProps) {
  const t = useT(messages);
  const toast = useToast();
  const nav = useNav();
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const center = getCenter(serviceCenterId)!;
  const [rating, setRating] = useState(defaultRating);
  const [text, setText] = useState(defaultText);
  const [photos, setPhotos] = useState(defaultPhotos);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const gutter = `${layout.gutter.mobile}px`;

  const send = () => {
    setStatus('sending');
    timer.current = window.setTimeout(() => {
      setStatus('sent');
      toast.show({ message: t.thanks, severity: 'success' });
      timer.current = window.setTimeout(nav.back, 1200);
    }, 900);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={nav.back} />

      <Box sx={{ flex: 1, px: gutter, pt: 4, pb: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Card variant="filled">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ width: 64, flexShrink: 0 }}>
              <Media src={unitPhoto[serviceUnit]} alt="" ratio="1:1" radius="md" unit={serviceUnit} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                {t.visit}
              </Typography>
              <Typography variant="h4" component="p">
                {unitMeta[serviceUnit].name} · {center.name}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" id="review-rating-label">
            {t.question}
          </Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.hint}
          </Typography>
          <Stars name="review-rating" starSize={48} value={rating} onChange={(_, v) => setRating(v ?? 0)} disabled={status !== 'idle'} sx={{ mt: 2 }} />
          <Typography variant="h4" component="p" aria-live="polite" sx={{ minHeight: 28, fontVariantNumeric: 'tabular-nums' }}>
            {rating > 0 ? `${t.levels[rating - 1]} · ${t.stars(rating)}` : ''}
          </Typography>
        </Box>

        <TextArea label={t.field} placeholder={t.placeholder} helperText={t.helper} value={text} onChange={(e) => setText(e.target.value)} maxLength={500} minRows={4} disabled={status !== 'idle'} />

        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="h4" component="h2">
              {t.photos}
            </Typography>
            <Typography variant="caption" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
              {t.photosHint(photos, MAX_PHOTOS)}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 3 }}>
            {Array.from({ length: photos }, (_, i) => (
              <Box key={i} sx={{ position: 'relative' }}>
                <Media src={reviewPhotos[i % reviewPhotos.length]} alt={t.photoAlt(i + 1)} ratio="1:1" radius="md" unit={serviceUnit} />
                <Box sx={{ position: 'absolute', top: -10, right: -10 }}>
                  <IconButton variant="raised" size="sm" label={t.removePhoto(i + 1)} icon={<CloseRounded fontSize="small" />} onClick={() => setPhotos((n) => n - 1)} sx={{ width: 28, height: 28 }} />
                </Box>
              </Box>
            ))}
            {photos < MAX_PHOTOS && (
              <ButtonBase
                onClick={() => setPhotos((n) => n + 1)}
                disabled={status !== 'idle'}
                aria-label={t.addPhoto}
                sx={{
                  aspectRatio: '1 / 1',
                  borderRadius: `${radius.md}px`,
                  border: `1.5px dashed ${bs.border.strong}`,
                  color: bs.text.secondary,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  transition: transition('background-color'),
                  '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
                  '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 },
                }}
              >
                <AddPhotoAlternateOutlined />
                <Typography variant="caption" component="span" sx={{ fontWeight: 600, lineHeight: 1.1, textAlign: 'center' }}>
                  {t.addPhoto}
                </Typography>
              </ButtonBase>
            )}
          </Box>
        </Box>
      </Box>

      <BottomActionBar>
        <Button variant="primary" size="lg" fullWidth disabled={rating === 0 || status === 'sent'} loading={status === 'sending'} onClick={send}>
          {status === 'sent' ? t.sent : status === 'sending' ? t.sending : t.send}
        </Button>
      </BottomActionBar>
    </Box>
  );
}

/** Escribir reseña: orange star rating (value also written out), text area with counter, add photos and "Enviar". */
export function WriteReviewScreen(props: WriteReviewScreenProps) {
  return (
    <ToastProvider>
      <Content {...props} />
    </ToastProvider>
  );
}
