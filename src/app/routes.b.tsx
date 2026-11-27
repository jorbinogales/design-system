import { ActiveBookingsScreen } from '../screens/bookings/ActiveBookingsScreen/ActiveBookingsScreen';
import { AddAddressScreen } from '../screens/profile/AddAddressScreen/AddAddressScreen';
import { AddCardScreen } from '../screens/booking/AddCardScreen/AddCardScreen';
import { AddMoneyScreen } from '../screens/profile/AddMoneyScreen/AddMoneyScreen';
import { AddVehicleScreen } from '../screens/booking/AddVehicleScreen/AddVehicleScreen';
import { AddressesScreen } from '../screens/profile/AddressesScreen/AddressesScreen';
import { AuctionPickupScreen } from '../screens/booking/AuctionPickupScreen/AuctionPickupScreen';
import { BookingConfirmedScreen } from '../screens/booking/BookingConfirmedScreen/BookingConfirmedScreen';
import { CancelBookingScreen } from '../screens/bookings/CancelBookingScreen/CancelBookingScreen';
import { CancelledBookingsScreen } from '../screens/bookings/CancelledBookingsScreen/CancelledBookingsScreen';
import { ChatsScreen } from '../screens/messages/ChatsScreen/ChatsScreen';
import { ChoosePackageScreen } from '../screens/booking/ChoosePackageScreen/ChoosePackageScreen';
import { CompletedBookingsScreen } from '../screens/bookings/CompletedBookingsScreen/CompletedBookingsScreen';
import { ConversationScreen } from '../screens/messages/ConversationScreen/ConversationScreen';
import { HelpCenterScreen } from '../screens/profile/HelpCenterScreen/HelpCenterScreen';
import { InviteFriendsScreen } from '../screens/profile/InviteFriendsScreen/InviteFriendsScreen';
import { LiveLocationScreen } from '../screens/bookings/LiveLocationScreen/LiveLocationScreen';
import { PasswordManagerScreen } from '../screens/profile/PasswordManagerScreen/PasswordManagerScreen';
import { PaymentMethodScreen } from '../screens/booking/PaymentMethodScreen/PaymentMethodScreen';
import { PaymentMethodsScreen } from '../screens/profile/PaymentMethodsScreen/PaymentMethodsScreen';
import { PickupAddressScreen } from '../screens/booking/PickupAddressScreen/PickupAddressScreen';
import { PrivacyPolicyScreen } from '../screens/profile/PrivacyPolicyScreen/PrivacyPolicyScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen/ProfileScreen';
import { ReceiptScreen } from '../screens/booking/ReceiptScreen/ReceiptScreen';
import { ReviewSummaryScreen } from '../screens/booking/ReviewSummaryScreen/ReviewSummaryScreen';
import { ScheduleScreen } from '../screens/booking/ScheduleScreen/ScheduleScreen';
import { SelectVehicleScreen } from '../screens/booking/SelectVehicleScreen/SelectVehicleScreen';
import { TopUpSuccessScreen } from '../screens/profile/TopUpSuccessScreen/TopUpSuccessScreen';
import { TopUpWalletScreen } from '../screens/profile/TopUpWalletScreen/TopUpWalletScreen';
import { TrackOrderScreen } from '../screens/bookings/TrackOrderScreen/TrackOrderScreen';
import { VideoCallScreen } from '../screens/messages/VideoCallScreen/VideoCallScreen';
import { VoiceCallScreen } from '../screens/messages/VoiceCallScreen/VoiceCallScreen';
import { WalletScreen } from '../screens/profile/WalletScreen/WalletScreen';
import { YourProfileScreen } from '../screens/profile/YourProfileScreen/YourProfileScreen';
import { findBooking } from '../screens/bookings/data';
import type { ReactNode } from 'react';
import type { Route } from './nav';

export type RouteTable = Record<string, (p: NonNullable<Route['params']>) => ReactNode>;

/** Reserva, mis reservas, perfil y mensajes. */
export const routesB: RouteTable = {
  'add-card': () => <AddCardScreen />,
  'add-vehicle': () => <AddVehicleScreen />,
  'auction-pickup': () => <AuctionPickupScreen />,
  'booking-confirmed': () => <BookingConfirmedScreen />,
  'choose-package': (p) => <ChoosePackageScreen unit={p.unit === 'personal-washing' ? 'personal-washing' : 'detailing'} />,
  'payment-method': () => <PaymentMethodScreen />,
  'pickup-address': () => <PickupAddressScreen />,
  'receipt': (p) => <ReceiptScreen bookingId={p.bookingId} />,
  'review-summary': () => <ReviewSummaryScreen />,
  'schedule': () => <ScheduleScreen />,
  'select-vehicle': () => <SelectVehicleScreen />,
  bookings: () => <ActiveBookingsScreen />,
  'active-bookings': () => <ActiveBookingsScreen />,
  'cancel-booking': (p) => <CancelBookingScreen booking={findBooking(p.bookingId)} />,
  'cancelled-bookings': () => <CancelledBookingsScreen />,
  'completed-bookings': () => <CompletedBookingsScreen />,
  'live-location': (p) => <LiveLocationScreen booking={findBooking(p.bookingId)} />,
  'track-order': (p) => <TrackOrderScreen booking={findBooking(p.bookingId)} />,
  chat: () => <ChatsScreen />,
  'conversation': (p) => <ConversationScreen conversationId={p.conversationId} />,
  'video-call': (p) => <VideoCallScreen conversationId={p.conversationId} />,
  'voice-call': (p) => <VoiceCallScreen conversationId={p.conversationId} />,
  'add-address': () => <AddAddressScreen />,
  'add-money': () => <AddMoneyScreen />,
  'addresses': () => <AddressesScreen />,
  'help-center': () => <HelpCenterScreen />,
  'invite-friends': () => <InviteFriendsScreen />,
  'password-manager': () => <PasswordManagerScreen />,
  'payment-methods': () => <PaymentMethodsScreen />,
  'privacy-policy': () => <PrivacyPolicyScreen />,
  profile: () => <ProfileScreen />,
  'top-up-success': () => <TopUpSuccessScreen />,
  'top-up-wallet': () => <TopUpWalletScreen />,
  'wallet': () => <WalletScreen />,
  'your-profile': () => <YourProfileScreen />,
};
