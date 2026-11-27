/**
 * Real photography of the mock catalog. Files live in `public/photos/` (credits in CREDITS.md) and are
 * referenced by absolute path, so Vite and the Capacitor WebView resolve them the same way.
 * `Media` keeps its designed fallback for any slot that has no entry here.
 */
import type { BusinessUnit } from '../domain/units';

const p = (name: string) => `/photos/${name}.jpg`;

export const unitPhoto: Record<BusinessUnit, string> = {
  detailing: p('detailing-polish'),
  towing: p('tow-black-truck'),
  'personal-washing': p('wash-driveway'),
};

export const centerPhoto: Record<string, string> = {
  'c-doral': p('detailing-foam'),
  'c-brickell': p('detailing-showroom'),
  'c-hialeah': p('detailing-garage'),
  'c-lauderdale': p('tow-flatbed-green'),
};

export const packagePhoto: Record<string, string> = {
  'det-essential': p('detailing-wheel'),
  'det-premium': p('detailing-dashboard'),
  'det-ceramic': p('detailing-headlight'),
  'wash-exterior': p('wash-hand'),
  'wash-interior': p('detailing-interior'),
  'wash-complete': p('wash-blue-foam'),
  'tow-local': p('tow-pickup'),
  'tow-long': p('tow-carrier'),
};

/** Service gallery (`servicePhotos` in screens/service/data.ts), by photo id. */
export const galleryPhoto: Record<string, string> = {
  'gal-1': p('detailing-sedan'),
  'gal-2': p('tow-pickup'),
  'gal-3': p('wash-hand'),
  'gal-4': p('detailing-interior-brown'),
  'gal-5': p('detailing-headlight'),
  'gal-6': p('tow-flatbed-road'),
  'gal-x1': p('detailing-polish'),
  'gal-x2': p('detailing-foam'),
  'gal-x3': p('detailing-interior'),
  'gal-x4': p('detailing-garage'),
  'gal-x5': p('detailing-wheel'),
  'gal-x6': p('detailing-dashboard'),
  'gal-x7': p('detailing-tire'),
  'gal-x8': p('detailing-leather'),
  'gal-x9': p('detailing-showroom'),
  'gal-x10': p('wash-blue-foam'),
};

/** Poster frame of each demo video, by video id. */
export const demoPoster: Record<string, string> = {
  'v-premium': p('detailing-dashboard'),
  'v-correction': p('detailing-polish'),
  'v-bay': p('detailing-garage'),
  'v-interior': p('detailing-leather'),
};

/** Photos a customer attaches to a review. */
export const reviewPhotos = [p('detailing-sedan'), p('detailing-showroom'), p('detailing-headlight'), p('detailing-foam')];

/** Photo the operator sends in the chat. */
export const chatPhoto = p('tow-road-suv');

/** Remote feed of the video call. */
export const callFeedPhoto = p('tow-yard-rig');

/** Demo clips (Mixkit License, see public/photos/CREDITS.md). */
export const demoVideoSrc: Record<string, string> = {
  'v-premium': '/videos/v-premium.mp4',
  'v-correction': '/videos/v-correction.mp4',
  'v-bay': '/videos/v-bay.mp4',
  'v-interior': '/videos/v-interior.mp4',
};

/** Welcome collage: black and gray only: the three photos are desaturated so no color (orange included) shows. */
export const welcomePhoto: Record<BusinessUnit, string> = {
  detailing: '/photos/welcome-detailing.jpg',
  towing: '/photos/welcome-towing.jpg',
  'personal-washing': '/photos/welcome-washing.jpg',
};
