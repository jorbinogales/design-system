import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { AddressSearch, type AddressSuggestion } from '../../../components/address/AddressSearch/AddressSearch';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { searchAddresses } from '../data';
import { ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Ingresa tu ubicación',
    selected: 'Ubicación elegida',
    confirm: 'Confirmar ubicación',
  },
  en: {
    title: 'Enter your location',
    selected: 'Selected location',
    confirm: 'Confirm location',
  },
};

export interface EnterLocationScreenProps {
  defaultQuery?: string;
  /** Results are being fetched. */
  loading?: boolean;
  onBack?: () => void;
  onManualEntry?: () => void;
}

/** Enter location: AddressSearch with current-location row, results, no-results and manual entry. */
export function EnterLocationScreen({ defaultQuery = '', loading = false, onBack, onManualEntry }: EnterLocationScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const [query, setQuery] = useState(defaultQuery);
  const [selected, setSelected] = useState<AddressSuggestion | null>(null);
  const [locating, setLocating] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const locate = () => {
    setLocating(true);
    timer.current = window.setTimeout(() => {
      setLocating(false);
      setSelected({ id: 'here', primary: '1450 Brickell Ave', secondary: 'Miami, FL 33131' });
    }, 1200);
  };

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={onBack ?? nav.back} />
      <Box sx={{ flex: 1, px: `${layout.gutter.mobile}px`, pt: 2, pb: 6 }}>
        <AddressSearch
          value={query}
          onChange={(q) => {
            setQuery(q);
            setSelected(null);
          }}
          suggestions={searchAddresses(query)}
          onSelect={(s) => {
            setSelected(s);
            setQuery(s.primary);
          }}
          onUseCurrentLocation={locate}
          locating={locating}
          onManualEntry={onManualEntry}
          loading={loading}
        />
      </Box>
      {selected && (
        <BottomActionBar>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
            <Box>
              <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                {t.selected}
              </Typography>
              <Typography variant="h4" component="p" sx={{ overflowWrap: 'anywhere' }}>
                {selected.primary}, {selected.secondary}
              </Typography>
            </Box>
            <Button fullWidth onClick={() => (nav.route.params?.from === 'home' ? nav.back() : nav.go('notification-permission'))}>
              {t.confirm}
            </Button>
          </Box>
        </BottomActionBar>
      )}
    </ScreenRoot>
  );
}
