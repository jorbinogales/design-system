import { ArrivedScreen } from '../screens/service/ArrivedScreen/ArrivedScreen';
import { CategoriesScreen } from '../screens/home/CategoriesScreen/CategoriesScreen';
import { CategoryScreen } from '../screens/home/CategoryScreen/CategoryScreen';
import { CenterLocationScreen } from '../screens/service/CenterLocationScreen/CenterLocationScreen';
import { CompleteProfileScreen } from '../screens/access/CompleteProfileScreen/CompleteProfileScreen';
import { DemoVideoScreen } from '../screens/service/DemoVideoScreen/DemoVideoScreen';
import { DirectionsScreen } from '../screens/service/DirectionsScreen/DirectionsScreen';
import { EnterLocationScreen } from '../screens/access/EnterLocationScreen/EnterLocationScreen';
import { ExploreScreen } from '../screens/home/ExploreScreen/ExploreScreen';
import { FilterScreen } from '../screens/home/FilterScreen/FilterScreen';
import { ForYouScreen } from '../screens/home/ForYouScreen/ForYouScreen';
import { HomeScreen } from '../screens/home/HomeScreen/HomeScreen';
import { LocationPermissionScreen } from '../screens/access/LocationPermissionScreen/LocationPermissionScreen';
import { NewPasswordScreen } from '../screens/access/NewPasswordScreen/NewPasswordScreen';
import { NotificationPermissionScreen } from '../screens/access/NotificationPermissionScreen/NotificationPermissionScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen/NotificationsScreen';
import { OfferScreen } from '../screens/home/OfferScreen/OfferScreen';
import { OnboardingScreen } from '../screens/access/OnboardingScreen/OnboardingScreen';
import { PhotoViewerScreen } from '../screens/service/PhotoViewerScreen/PhotoViewerScreen';
import { PopularCentersScreen } from '../screens/home/PopularCentersScreen/PopularCentersScreen';
import { ResultsScreen } from '../screens/home/ResultsScreen/ResultsScreen';
import { SavedScreen } from '../screens/home/SavedScreen/SavedScreen';
import { SearchScreen } from '../screens/home/SearchScreen/SearchScreen';
import { ServiceDetailScreen } from '../screens/service/ServiceDetailScreen/ServiceDetailScreen';
import { SignInScreen } from '../screens/access/SignInScreen/SignInScreen';
import { SignUpScreen } from '../screens/access/SignUpScreen/SignUpScreen';
import { SplashScreen } from '../screens/access/SplashScreen/SplashScreen';
import { VerifyCodeScreen } from '../screens/access/VerifyCodeScreen/VerifyCodeScreen';
import { WelcomeScreen } from '../screens/access/WelcomeScreen/WelcomeScreen';
import { WriteReviewScreen } from '../screens/service/WriteReviewScreen/WriteReviewScreen';
import type { ReactNode } from 'react';
import type { Route } from './nav';
import type { ServiceCategoryId } from '../domain/booking';
import type { BusinessUnit } from '../domain/units';

export type RouteTable = Record<string, (p: NonNullable<Route['params']>) => ReactNode>;

/** Acceso, inicio/explorar, ficha de servicio y notificaciones. */
export const routesA: RouteTable = {
  'complete-profile': () => <CompleteProfileScreen />,
  'enter-location': () => <EnterLocationScreen />,
  'location-permission': () => <LocationPermissionScreen />,
  'new-password': () => <NewPasswordScreen />,
  'notification-permission': () => <NotificationPermissionScreen />,
  'onboarding': () => <OnboardingScreen />,
  'sign-in': () => <SignInScreen />,
  'sign-up': () => <SignUpScreen />,
  'splash': () => <SplashScreen />,
  'verify-code': () => <VerifyCodeScreen />,
  'welcome': () => <WelcomeScreen />,
  'categories': () => <CategoriesScreen />,
  'category': (p) => <CategoryScreen categoryId={p.categoryId as ServiceCategoryId | undefined} />,
  explore: () => <ExploreScreen />,
  'filter': () => <FilterScreen />,
  'for-you': () => <ForYouScreen />,
  home: () => <HomeScreen />,
  'offer': (p) => <OfferScreen offerId={p.offerId} />,
  'popular-centers': () => <PopularCentersScreen />,
  'results': (p) => <ResultsScreen defaultQuery={p.query || undefined} />,
  'saved': () => <SavedScreen />,
  'search': () => <SearchScreen />,
  'notifications': () => <NotificationsScreen />,
  'arrived': () => <ArrivedScreen />,
  'center-location': () => <CenterLocationScreen />,
  'demo-video': () => <DemoVideoScreen />,
  'directions': () => <DirectionsScreen />,
  'photo-viewer': () => <PhotoViewerScreen />,
  'service-detail': (p) => <ServiceDetailScreen unit={p.unit as BusinessUnit | undefined} centerId={p.centerId} />,
  'write-review': () => <WriteReviewScreen />,
};
