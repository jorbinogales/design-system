import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import EventNoteRounded from '@mui/icons-material/EventNoteRounded';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import HomeRounded from '@mui/icons-material/HomeRounded';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import WorkspacePremiumRounded from '@mui/icons-material/WorkspacePremiumRounded';
import { BottomNav } from '../../components/navigation/BottomNav/BottomNav';
import { useT } from '../../i18n/locale';
import { useProto, type ClientRoute } from '../store';

const messages = {
  es: { home: 'Inicio', bookings: 'Reservas', vip: 'VIP', account: 'Cuenta' },
  en: { home: 'Home', bookings: 'Bookings', vip: 'VIP', account: 'Account' },
};

type Tab = 'home' | 'bookings' | 'vip' | 'account';

/** MVP client navigation: the four destinations the meeting asked for (no chat, no explore map). */
export function ClientNav({ value }: { value: Tab }) {
  const t = useT(messages);
  const { go } = useProto();
  return (
    <BottomNav
      value={value}
      onChange={(v) => go({ name: v } as ClientRoute)}
      destinations={[
        { value: 'home', label: t.home, icon: <HomeOutlined />, activeIcon: <HomeRounded /> },
        { value: 'bookings', label: t.bookings, icon: <EventNoteOutlined />, activeIcon: <EventNoteRounded /> },
        { value: 'vip', label: t.vip, icon: <WorkspacePremiumOutlined />, activeIcon: <WorkspacePremiumRounded /> },
        { value: 'account', label: t.account, icon: <PersonOutlineRounded />, activeIcon: <PersonRounded /> },
      ]}
    />
  );
}
