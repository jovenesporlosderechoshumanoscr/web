import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type BanUserValues = {
  banReason: string | null;
  banExpires: Date | null;
};

type BanUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  isPending: boolean;
  serverError?: string | null;
  onConfirm: (values: BanUserValues) => void;
  onCancel: () => void;
};

/** Modal para banear a un usuario con motivo y expiración opcionales. */
export function BanUserDialog({
  open,
  onOpenChange,
  userName,
  isPending,
  serverError,
  onConfirm,
  onCancel,
}: BanUserDialogProps) {
  const [banReason, setBanReason] = useState("");
  const [banExpires, setBanExpires] = useState("");

  // Al reabrir el modal para otro usuario, los campos parten en blanco.
  useEffect(() => {
    if (open) {
      setBanReason("");
      setBanExpires("");
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm({
      banReason: banReason.trim() ? banReason.trim() : null,
      banExpires: banExpires ? new Date(banExpires) : null,
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 supports-backdrop-filter:backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 text-card-foreground shadow-xl animate-in fade-in zoom-in-95">
          <Dialog.Title className="text-lg font-semibold">
            Banear a {userName}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            El usuario no podrá iniciar sesión hasta que se quite el baneo o
            expire.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ban-dialog-reason">Motivo (opcional)</Label>
              <Input
                id="ban-dialog-reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Motivo del baneo"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ban-dialog-expires">Expira el (opcional)</Label>
              <Input
                id="ban-dialog-expires"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={banExpires}
                onChange={(e) => setBanExpires(e.target.value)}
              />
            </div>

            {(serverError) && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "Baneando…" : "Banear"}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
