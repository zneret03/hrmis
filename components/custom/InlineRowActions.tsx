'use client';

import { JSX, ReactNode } from 'react';
import { Check, Pencil, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InlineRowActionsProps {
  /** view: ✎ / 🗑 · editing: ✕ / ✓ · confirm-delete: "Delete?" ✓ / ✕ */
  state: 'view' | 'editing' | 'confirm-delete';
  isPending?: boolean;
  /** Disables the view actions while another row is being edited. */
  disabled?: boolean;
  isDirty?: boolean;
  canSave?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onConfirmDelete?: () => void;
  onCancel?: () => void;
}

function IconButton({
  label,
  className,
  disabled,
  onClick,
  children,
}: {
  label: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}): JSX.Element {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={cn('h-6 w-6', className)}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

// Row actions for tables edited in place (see useInlineRowEditor).
export function InlineRowActions({
  state,
  isPending = false,
  disabled = false,
  isDirty = false,
  canSave = true,
  onEdit,
  onDelete,
  onSave,
  onConfirmDelete,
  onCancel,
}: InlineRowActionsProps): JSX.Element {
  const cancel = (
    <IconButton
      label="Cancel"
      className="text-muted-foreground hover:text-destructive"
      disabled={isPending}
      onClick={onCancel}
    >
      <X className="h-3.5 w-3.5" />
    </IconButton>
  );

  return (
    <div className="flex items-center justify-center gap-1">
      {state === 'view' && (
        <>
          <IconButton
            label="Edit entry"
            className="text-muted-foreground hover:text-primary"
            disabled={disabled}
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            label="Delete entry"
            className="text-muted-foreground hover:text-destructive"
            disabled={disabled}
            onClick={onDelete}
          >
            <Trash className="h-3.5 w-3.5" />
          </IconButton>
        </>
      )}

      {state === 'editing' && (
        <>
          {cancel}
          {isDirty && (
            <IconButton
              label="Save entry"
              className="text-green-600 hover:bg-green-50 hover:text-green-700"
              disabled={isPending || !canSave}
              onClick={onSave}
            >
              <Check className="h-3.5 w-3.5" />
            </IconButton>
          )}
        </>
      )}

      {state === 'confirm-delete' && (
        <>
          <span className="text-destructive text-xs font-medium">Delete?</span>
          <IconButton
            label="Confirm delete"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isPending}
            onClick={onConfirmDelete}
          >
            <Check className="h-3.5 w-3.5" />
          </IconButton>
          {cancel}
        </>
      )}
    </div>
  );
}
