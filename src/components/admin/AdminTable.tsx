import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

// ── Types ──────────────────────────────────────────────────────────────────

interface AdminTableProps {
  columns:     { key: string; header: string }[];
  data:        Record<string, unknown>[];
  selectedId:  number | null;
  onRowSelect: (id: number) => void;
  isLoading:   boolean;
}

// ── Helper ─────────────────────────────────────────────────────────────────

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value))                  return '[Array]';
  if (typeof value === 'object')             return '[Object]';
  if (typeof value === 'boolean')            return value ? 'Sí' : 'No';
  return String(value);
}

// ── Component ──────────────────────────────────────────────────────────────

export function AdminTable({
  columns,
  data,
  selectedId,
  onRowSelect,
  isLoading,
}: AdminTableProps) {
  // ── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full space-y-[0.5rem]">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[40px] w-full bg-hw-input" />
        ))}
      </div>
    );
  }

  // ── Empty / no entity selected ─────────────────────────────────────────
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] rounded-[12px] border border-hw-card-border bg-hw-card transition-colors duration-300">
        <p className="text-[0.875rem] text-hw-subtitle transition-colors duration-300">
          Selecciona una entidad para ver los datos
        </p>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────────────────
  return (
    <div className="rounded-[12px] border border-hw-card-border bg-hw-card overflow-hidden transition-colors duration-300">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-hw-divider hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="text-hw-label text-[0.75rem] uppercase tracking-wider border-b border-hw-divider py-[0.75rem] px-[1rem] font-semibold bg-hw-card transition-colors duration-300"
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => {
            const rowId = row['id'] as number;
            const isSelected = rowId === selectedId;

            return (
              <TableRow
                key={rowId}
                onClick={() => onRowSelect(rowId)}
                className={`
                  cursor-pointer border-b border-hw-divider transition-colors duration-150
                  hover:bg-hw-accent/5
                  ${isSelected ? 'bg-hw-accent/10 border-l-2 border-l-hw-accent' : ''}
                `}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className="text-hw-input-text text-[0.875rem] py-[0.75rem] px-[1rem] transition-colors duration-300"
                  >
                    {formatCell(row[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

