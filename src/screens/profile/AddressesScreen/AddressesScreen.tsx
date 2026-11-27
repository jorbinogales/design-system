import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import BusinessOutlined from '@mui/icons-material/BusinessOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, type ReactNode } from 'react';
import { useNav } from '../../../app/nav';
import { Button } from '../../../components/actions/Button/Button';
import { formatAddress } from '../../../components/address/LocationCard/LocationCard';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { SkeletonCard, SkeletonGroup } from '../../../components/feedback/Skeleton/Skeleton';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { Card } from '../../../components/layout/Card/Card';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { ActionMenu } from '../../../components/overlays/ActionMenu/ActionMenu';
import { ConfirmDialog } from '../../../components/overlays/ConfirmDialog/ConfirmDialog';
import { NoItemsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { savedAddresses, type SavedAddress } from '../data';
import { AddRow, IconBubble, ScreenBody, ScreenRoot, pick } from '../ui';

const messages = {
  es: {
    title: 'Direcciones',
    add: 'Agregar nueva dirección',
    isDefault: 'Predeterminada',
    reference: 'Referencia',
    menu: (n: string) => `Opciones de ${n}`,
    edit: 'Editar',
    remove: 'Eliminar',
    confirmTitle: (n: string) => `¿Eliminar “${n}”?`,
    confirmBody: 'Dejará de aparecer al reservar. Tus reservas anteriores no cambian.',
    confirmLabel: 'Eliminar dirección',
    cancel: 'Conservar',
    removed: 'Dirección eliminada',
    emptyTitle: 'Aún no tienes direcciones',
    emptyBody: 'Guarda tu casa u oficina para reservar Personal Washing y Towing en segundos.',
    loading: 'Cargando direcciones',
    editing: (n: string) => `Editar ${n}`,
  },
  en: {
    title: 'Addresses',
    add: 'Add new address',
    isDefault: 'Default',
    reference: 'Reference',
    menu: (n: string) => `Options for ${n}`,
    edit: 'Edit',
    remove: 'Delete',
    confirmTitle: (n: string) => `Delete “${n}”?`,
    confirmBody: 'It will stop appearing when you book. Your past bookings do not change.',
    confirmLabel: 'Delete address',
    cancel: 'Keep it',
    removed: 'Address deleted',
    emptyTitle: 'You have no addresses yet',
    emptyBody: 'Save your home or office to book Personal Washing and Towing in seconds.',
    loading: 'Loading addresses',
    editing: (n: string) => `Edit ${n}`,
  },
};

const labelIcon: Record<string, ReactNode> = { home: <HomeOutlined />, office: <BusinessOutlined /> };

export interface AddressesScreenProps {
  state?: 'default' | 'empty' | 'loading';
}

function Content({ state = 'default' }: AddressesScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const toast = useToast();
  const [items, setItems] = useState<SavedAddress[]>(state === 'empty' ? [] : savedAddresses);
  const [pending, setPending] = useState<SavedAddress | null>(null);
  const addNew = () => nav.go('add-address');

  const remove = () => {
    if (!pending) return;
    setItems((list) => list.filter((a) => a.id !== pending.id));
    setPending(null);
    toast.show({ message: t.removed, severity: 'success' });
  };

  let body: ReactNode;
  if (state === 'loading') {
    body = (
      <SkeletonGroup label={t.loading}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </Box>
      </SkeletonGroup>
    );
  } else if (items.length === 0) {
    body = (
      <Box sx={{ flex: 1, display: 'flex' }}>
        <NoItemsState
          title={t.emptyTitle}
          description={t.emptyBody}
          primaryAction={
            <Button size="md" fullWidth onClick={addNew}>
              {t.add}
            </Button>
          }
        />
      </Box>
    );
  } else {
    body = (
      <>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((a) => {
            const name = pick(a.label, locale);
            return (
              <Box component="li" key={a.id}>
                <Card component="article">
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <IconBubble>{labelIcon[a.id] ?? <PlaceOutlined />}</IconBubble>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="h4" component="h2">
                          {name}
                        </Typography>
                        {a.isDefault && <Tag label={t.isDefault} size="sm" />}
                      </Box>
                      <Typography variant="body1" sx={{ mt: 1, overflowWrap: 'anywhere' }}>
                        {formatAddress(a.address)}
                      </Typography>
                      {a.address.reference && (
                        <Typography variant="body2" sx={{ mt: 1, color: bs.text.secondary, overflowWrap: 'anywhere' }}>
                          {t.reference}: {a.address.reference}
                        </Typography>
                      )}
                    </Box>
                    <ActionMenu
                      label={t.menu(name)}
                      align="end"
                      items={[
                        { value: 'edit', label: t.edit, icon: <EditOutlined />, onSelect: () => toast.show({ message: t.editing(name), severity: 'info' }) },
                        { value: 'delete', label: t.remove, icon: <DeleteOutlineRounded />, destructive: true, onSelect: () => setPending(a) },
                      ]}
                    />
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
        <AddRow label={t.add} onClick={addNew} />
      </>
    );
  }

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <ScreenBody gap={4} sx={{ flex: 1 }}>
        {body}
      </ScreenBody>
      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={remove}
        title={t.confirmTitle(pending ? pick(pending.label, locale) : '')}
        description={t.confirmBody}
        confirmLabel={t.confirmLabel}
        cancelLabel={t.cancel}
        variant="destructive"
        disablePortal
      />
    </ScreenRoot>
  );
}

/** Direcciones (s72): saved addresses with the full address text, edit/delete menu and a dashed add row. */
export function AddressesScreen(props: AddressesScreenProps) {
  return (
    <ToastProvider>
      <Content {...props} />
    </ToastProvider>
  );
}
