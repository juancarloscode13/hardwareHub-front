import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useCloudinaryMediaUrls } from '@/features/cloudinary/hooks/useCloudinary';
import { ComponentThumbnail } from '@/components/ui/component-thumbnail';



interface AdminTableProps {
  columns:     { key: string; header: string }[];
  data:        Record<string, unknown>[];
  selectedId:  number | null;
  onRowSelect: (id: number) => void;
  isLoading:   boolean;
}



function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    return value.map((item) => String(item)).join(', ');
  }
  if (typeof value === 'object')             return '[Object]';
  if (typeof value === 'boolean')            return value ? 'Sí' : 'No';
  return String(value);
}



export function AdminTable({
  columns,
  data,
  selectedId,
  onRowSelect,
  isLoading,
}: AdminTableProps) {
  const imagePublicIds = data
    .map((row) => row['imagen'])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
  const { data: imageUrls } = useCloudinaryMediaUrls(imagePublicIds);

  const renderCell = (colKey: string, value: unknown) => {
    if (colKey === 'imagen' && typeof value === 'string' && value.trim().length > 0) {
      const publicId = value.trim();
      const url = imageUrls[publicId];
      return (
        <div className="flex items-center gap-2 min-w-0">
          <ComponentThumbnail src={url} alt={publicId} />
          <span className="truncate">{publicId}</span>
        </div>
      );
    }

    return formatCell(value);
  };


  if (isLoading) {
    return (
      <div className="w-full space-y-[0.5rem]">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[40px] w-full bg-hw-input" />
        ))}
      </div>
    );
  }

  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] rounded-[12px] border border-hw-card-border bg-hw-card transition-colors duration-300">
        <p className="text-[0.875rem] text-hw-subtitle transition-colors duration-300">
          Selecciona una entidad para ver los datos
        </p>
      </div>
    );
  }

  
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
                    {renderCell(col.key, row[col.key])}
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

