import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";

type DeleteUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  isPending: boolean;
  serverError?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Modal de confirmación para eliminar a un usuario. */
export function DeleteUserDialog({
  open,
  onOpenChange,
  userName,
  isPending,
  serverError,
  onConfirm,
  onCancel,
}: DeleteUserDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 supports-backdrop-filter:backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 text-card-foreground shadow-xl animate-in fade-in zoom-in-95">
          <Dialog.Title className="text-lg font-semibold">
            Eliminar a {userName}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Esta acción es permanente: se borrará la cuenta y no podrá
            recuperarse.
          </Dialog.Description>

          {serverError && (
            <p className="mt-4 text-sm text-destructive">{serverError}</p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={onConfirm}
            >
              {isPending ? "Eliminando…" : "Eliminar"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
