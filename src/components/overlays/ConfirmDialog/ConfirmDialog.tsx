import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useId, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { Button } from '../../actions/Button/Button';

export interface ConfirmDialogProps {
  open: boolean;
  /** Called by Cancelar, Esc and scrim tap (never confirms). */
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  /** Say what happens and, if destructive, that it cannot be undone. */
  description: ReactNode;
  /** Verb that names the outcome: "Cancelar reserva", not "Sí" or "Aceptar". */
  confirmLabel?: string;
  cancelLabel?: string;
  /** `destructive`: red confirm, `alertdialog` role and initial focus on the safe option. */
  variant?: 'default' | 'destructive';
  /** Confirm in progress: the confirm button shows a spinner and the dialog stops closing. */
  loading?: boolean;
  /** Mount inside the nearest positioned ancestor (device frames). */
  disablePortal?: boolean;
}

const messages = { es: { confirm: 'Confirmar', cancel: 'Cancelar' }, en: { confirm: 'Confirm', cancel: 'Cancel' } };

/** Confirmation dialog, default or destructive. The safe option (Cancelar) takes the initial focus when destructive. */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, cancelLabel, variant = 'default', loading = false, disablePortal = false }: ConfirmDialogProps) {
  const t = useT(messages);
  const id = useId();
  const destructive = variant === 'destructive';
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-desc`}
      disablePortal={disablePortal}
      maxWidth="xs"
      slotProps={{
        paper: { role: destructive ? 'alertdialog' : 'dialog' },
        root: disablePortal ? { sx: { position: 'absolute' } } : undefined,
        backdrop: disablePortal ? { sx: { position: 'absolute' } } : undefined,
      }}
    >
      <DialogTitle id={`${id}-title`} component="h2">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={`${id}-desc`} component="div">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' }, alignItems: 'stretch', '& > *': { flex: { sm: '1 1 0' } } }}>
        <Button variant="secondary" size="md" onClick={onClose} disabled={loading} autoFocus={destructive}>
          {cancelLabel ?? t.cancel}
        </Button>
        <Button variant={destructive ? 'destructive' : 'primary'} size="md" onClick={onConfirm} loading={loading} autoFocus={!destructive}>
          {confirmLabel ?? t.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const discardMessages = {
  es: { title: '¿Descartar los cambios?', description: 'Si sales ahora, perderás lo que editaste y no se guardará.', confirm: 'Descartar cambios', cancel: 'Seguir editando' },
  en: { title: 'Discard changes?', description: 'If you leave now, your edits will be lost and will not be saved.', confirm: 'Discard changes', cancel: 'Keep editing' },
};

export interface DiscardChangesDialogProps extends Pick<ConfirmDialogProps, 'open' | 'onClose' | 'disablePortal'> {
  /** The user chose to leave and lose the edits. */
  onDiscard: () => void;
}

/**
 * "Discard changes?" pattern. Show it when leaving a form with unsaved edits.
 * Esc and scrim mean "keep editing"; discarding always needs the explicit destructive button.
 */
export function DiscardChangesDialog({ open, onClose, onDiscard, disablePortal }: DiscardChangesDialogProps) {
  const t = useT(discardMessages);
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onDiscard}
      title={t.title}
      description={t.description}
      confirmLabel={t.confirm}
      cancelLabel={t.cancel}
      variant="destructive"
      disablePortal={disablePortal}
    />
  );
}
