import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import MuiSkeleton from '@mui/material/Skeleton';
import { SkeletonCard, SkeletonGroup, SkeletonListRow, SkeletonPhotoCard, SkeletonText } from '../components/feedback/Skeleton';
import { InverseSurface } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { layout, radius } from '../theme/tokens';

type Kind = 'feed' | 'list' | 'detail' | 'form' | 'cards';

/** Which placeholder each route shows while it "loads". Routes not listed render straight away. */
const kinds: Record<string, Kind> = {
  home: 'feed', explore: 'feed', 'for-you': 'feed', 'popular-centers': 'feed', saved: 'feed', results: 'feed', category: 'feed', categories: 'list', offer: 'detail',
  'service-detail': 'detail', 'center-location': 'detail', directions: 'detail', 'write-review': 'form', 'photo-viewer': 'detail',
  notifications: 'list', search: 'list', filter: 'form',
  'select-vehicle': 'cards', 'choose-package': 'cards', schedule: 'form', 'auction-pickup': 'form', 'pickup-address': 'form', 'payment-method': 'list',
  'review-summary': 'detail', receipt: 'detail', 'add-card': 'form', 'add-vehicle': 'form',
  bookings: 'cards', 'active-bookings': 'cards', 'completed-bookings': 'cards', 'cancelled-bookings': 'cards', 'cancel-booking': 'form', 'track-order': 'detail', 'live-location': 'detail',
  chat: 'list', conversation: 'list',
  profile: 'list', 'your-profile': 'form', wallet: 'cards', 'top-up-wallet': 'form', 'add-money': 'form', addresses: 'list', 'add-address': 'form',
  'payment-methods': 'list', 'password-manager': 'form', 'help-center': 'list', 'privacy-policy': 'detail', 'invite-friends': 'list',
  'complete-profile': 'form', 'enter-location': 'form', 'sign-in': 'form', 'sign-up': 'form', 'new-password': 'form', 'verify-code': 'form',
};

export const skeletonFor = (route: string): Kind | undefined => kinds[route];

const gutter = { px: `${layout.gutter.mobile}px` };
const Bar = () => (
  <Box sx={{ ...gutter, pt: `calc(16px + ${layout.safeAreaTop})`, pb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
    <MuiSkeleton variant="circular" width={40} height={40} />
    <MuiSkeleton variant="text" height={24} width="45%" />
  </Box>
);
const Pill = ({ h = layout.controlHeight.lg }: { h?: number }) => <MuiSkeleton variant="rounded" height={h} sx={{ borderRadius: `${radius.pill}px` }} />;
const Field = () => (
  <Box>
    <MuiSkeleton variant="text" height={14} width="30%" />
    <MuiSkeleton variant="rounded" height={layout.fieldHeight} sx={{ borderRadius: `${radius.md}px` }} />
  </Box>
);

const layouts: Record<Kind, () => ReactNode> = {
  feed: () => (
    <>
      <InverseSurface sx={{ ...gutter, pt: `calc(20px + ${layout.safeAreaTop})`, pb: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <MuiSkeleton variant="text" height={28} width="55%" />
        <MuiSkeleton variant="rounded" height={layout.fieldHeight} sx={{ borderRadius: `${radius.md}px` }} />
      </InverseSurface>
      <Box sx={{ ...gutter, py: 5, display: 'flex', gap: 2 }}>
        {[72, 96, 84].map((w) => <MuiSkeleton key={w} variant="rounded" width={w} height={36} sx={{ borderRadius: `${radius.pill}px` }} />)}
      </Box>
      <Box sx={{ ...gutter, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SkeletonPhotoCard />
        <SkeletonPhotoCard />
      </Box>
    </>
  ),
  list: () => (
    <>
      <Bar />
      {Array.from({ length: 7 }, (_, i) => <SkeletonListRow key={i} />)}
    </>
  ),
  detail: () => (
    <>
      <MuiSkeleton variant="rectangular" sx={{ width: '100%', height: 'auto', aspectRatio: '4 / 3' }} />
      <Box sx={{ ...gutter, py: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <MuiSkeleton variant="text" height={14} width="30%" />
        <MuiSkeleton variant="text" height={28} width="70%" />
        <SkeletonText lines={4} />
        <SkeletonCard />
      </Box>
    </>
  ),
  form: () => (
    <>
      <Bar />
      <Box sx={{ ...gutter, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <MuiSkeleton variant="text" height={28} width="60%" />
        <SkeletonText lines={2} />
        <Field />
        <Field />
        <Field />
        <Box sx={{ mt: 3 }}><Pill /></Box>
      </Box>
    </>
  ),
  cards: () => (
    <>
      <Bar />
      <Box sx={{ ...gutter, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Box>
    </>
  ),
};

/** Placeholder shaped like the screen that is about to appear. */
export function ScreenSkeleton({ kind }: { kind: Kind }) {
  return (
    <Box sx={{ flex: 1, backgroundColor: bs.surface.canvas }}>
      <SkeletonGroup>{layouts[kind]()}</SkeletonGroup>
    </Box>
  );
}
