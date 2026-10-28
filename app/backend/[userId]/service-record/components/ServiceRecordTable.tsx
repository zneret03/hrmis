'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InlineRowActions } from '@/components/custom/InlineRowActions';
import { cn } from '@/lib/utils';
import { useInlineRowEditor } from '@/hooks/use-inline-row-editor';
import {
  addServiceRecord,
  deleteServiceRecord,
  editServiceRecord,
} from '@/services/service_record/service-record.services';
import { ServiceRecordWithUser } from '@/lib/types/service_record';
import { DATE_RANGE_ERROR, isValidDateRange } from '@/helpers/serviceRecord';
import { withCurrentOption } from '@/helpers/withCurrentOption';

interface ServiceRecordTableProps {
  records: ServiceRecordWithUser[];
  userId: string;
  statuses: string[];
}

type DraftRow = {
  position: string;
  status: string;
  salary: string;
  station: string;
  from_date: string;
  to_date: string;
  remarks: string;
};

const emptyDraft = (): DraftRow => ({
  position: '',
  status: '',
  salary: '',
  station: '',
  from_date: '',
  to_date: '',
  remarks: '',
});

const toDraft = (record: ServiceRecordWithUser): DraftRow => ({
  position: record.position ?? '',
  status: record.status ?? '',
  salary: record.salary ?? '',
  station: record.station ?? '',
  from_date: record.from_date ?? '',
  to_date: record.to_date ?? '',
  remarks: record.remarks ?? '',
});

const COLUMN_COUNT = 8;

const cellInput =
  'w-full min-w-[96px] rounded-sm border border-transparent bg-transparent px-1 py-0.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none';
const invalidInput = 'border-destructive';

export function ServiceRecordTable({
  records,
  userId,
  statuses,
}: ServiceRecordTableProps): React.JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editor = useInlineRowEditor(emptyDraft);
  const { mode, draft, isDirty } = editor;

  const isPositionMissing = isDirty && !draft.position.trim();
  const isDateRangeInvalid = !isValidDateRange(draft.from_date, draft.to_date);
  const canSave = !!draft.position.trim() && !isDateRangeInvalid;
  const errors = [
    isPositionMissing && 'Position is required.',
    isDateRangeInvalid && DATE_RANGE_ERROR,
  ].filter(Boolean);

  // Runs a save/delete, then leaves edit mode and reloads the server data.
  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      try {
        await action();
      } catch {
        // The service already toasted the error; keep the row to fix it.
        return;
      }
      editor.reset();
      router.refresh();
    });
  };

  const handleSave = () => {
    if (!canSave || (mode.kind !== 'add' && mode.kind !== 'edit')) return;

    const fields = {
      user_id: userId,
      position: draft.position.trim(),
      status: draft.status || null,
      salary: draft.salary || null,
      station: draft.station || null,
      from_date: draft.from_date || null,
      to_date: draft.to_date || null,
      remarks: draft.remarks || null,
    };

    run(() =>
      mode.kind === 'edit'
        ? editServiceRecord({ ...fields, id: mode.id })
        : addServiceRecord(fields),
    );
  };

  const handleDraftKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') editor.reset();
    if (e.key === 'Enter' && isDirty) handleSave();
  };

  const textCell = (field: keyof DraftRow, placeholder: string) => (
    <TableCell className="px-1 py-1">
      <input
        type="text"
        value={draft[field]}
        onChange={(e) => editor.setField(field, e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cellInput}
      />
    </TableCell>
  );

  // Editable cells shared by the add row and the row being edited.
  const draftRow = (key: string, statusOptions: string[]) => (
    <React.Fragment key={key}>
      <TableRow className="bg-primary/5" onKeyDown={handleDraftKeyDown}>
        <TableCell className="px-1 py-1">
          <input
            type="text"
            value={draft.position}
            onChange={(e) => editor.setField('position', e.target.value)}
            placeholder="Position *"
            aria-label="Position"
            aria-invalid={isPositionMissing}
            className={cn(cellInput, isPositionMissing && invalidInput)}
            autoFocus
          />
        </TableCell>
        <TableCell className="px-1 py-1">
          <select
            value={draft.status}
            onChange={(e) => editor.setField('status', e.target.value)}
            aria-label="Status"
            className={cellInput}
          >
            <option value="">Select…</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </TableCell>
        {textCell('salary', 'Salary')}
        {textCell('station', 'Station / Office')}
        <TableCell className="px-1 py-1">
          <input
            type="date"
            value={draft.from_date}
            onChange={(e) => editor.setField('from_date', e.target.value)}
            aria-label="From"
            aria-invalid={isDateRangeInvalid}
            className={cn(cellInput, isDateRangeInvalid && invalidInput)}
          />
        </TableCell>
        <TableCell className="px-1 py-1">
          <input
            type="date"
            value={draft.to_date}
            onChange={(e) => editor.setField('to_date', e.target.value)}
            aria-label="To"
            title="Leave empty for Present"
            aria-invalid={isDateRangeInvalid}
            className={cn(cellInput, isDateRangeInvalid && invalidInput)}
          />
        </TableCell>
        {textCell('remarks', 'Remarks')}
        <TableCell className="px-1 py-1">
          <InlineRowActions
            state="editing"
            isPending={isPending}
            isDirty={isDirty}
            canSave={canSave}
            onSave={handleSave}
            onCancel={editor.reset}
          />
        </TableCell>
      </TableRow>

      {errors.length > 0 && (
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={COLUMN_COUNT}
            className="text-destructive py-1 text-xs"
          >
            {errors.join(' ')}
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button onClick={editor.startAdd} disabled={!editor.isIdle}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mode.kind === 'add' && draftRow('new', statuses)}

            {records.map((record) => {
              if (editor.isEditing(record.id)) {
                return draftRow(
                  record.id,
                  withCurrentOption(statuses, record.status),
                );
              }

              const isDeleting = editor.isDeleting(record.id);

              return (
                <TableRow
                  key={record.id}
                  className={cn(isDeleting && 'bg-destructive/5')}
                  onKeyDown={(e) => e.key === 'Escape' && editor.reset()}
                >
                  <TableCell className="font-semibold capitalize">
                    {record.position || 'N/A'}
                  </TableCell>
                  <TableCell className="capitalize">
                    {record.status || 'N/A'}
                  </TableCell>
                  <TableCell>{record.salary || 'N/A'}</TableCell>
                  <TableCell className="capitalize">
                    {record.station || 'N/A'}
                  </TableCell>
                  <TableCell>{record.from_date || 'N/A'}</TableCell>
                  <TableCell>{record.to_date || 'Present'}</TableCell>
                  <TableCell className="max-w-[16rem] truncate">
                    {record.remarks || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <InlineRowActions
                      state={isDeleting ? 'confirm-delete' : 'view'}
                      isPending={isPending}
                      disabled={!editor.isIdle}
                      onEdit={() =>
                        editor.startEdit(record.id, toDraft(record))
                      }
                      onDelete={() => editor.startDelete(record.id)}
                      onConfirmDelete={() =>
                        run(() => deleteServiceRecord(record.id))
                      }
                      onCancel={editor.reset}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {!records.length && mode.kind !== 'add' && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="text-muted-foreground h-24 text-center"
                >
                  No entries yet. Click &quot;Add Entry&quot; to encode data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
