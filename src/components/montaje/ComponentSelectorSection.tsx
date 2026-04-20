import { useState, useMemo } from 'react';
import { Search, Check, X } from 'lucide-react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';



export interface ColumnDef<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  filterOptions?: { value: string; label: string }[];
}

interface ComponentSelectorSectionProps<T extends { id: number; modelo: string; precio: number }> {
  
  accordionValue: string;
  
  title: string;
  
  icon: React.ElementType;
  
  items: T[];
  
  isLoading: boolean;
  
  columns: ColumnDef<T>[];
  
  selectedId: number | null;
  
  selectedItem?: T;
  
  onSelect: (item: T) => void;
  
  onDeselect: () => void;
}



export default function ComponentSelectorSection<
  T extends { id: number; modelo: string; precio: number },
>({
  accordionValue,
  title,
  icon: Icon,
  items,
  isLoading,
  columns,
  selectedId,
  selectedItem,
  onSelect,
  onDeselect,
}: ComponentSelectorSectionProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [filterValue, setFilterValue] = useState('');

  
  const filteredItems = useMemo(() => {
    let result = items;

    
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        item.modelo.toLowerCase().includes(lower),
      );
    }

    
    if (filterKey && filterValue) {
      result = result.filter((item) => {
        const val = String((item as Record<string, unknown>)[filterKey] ?? '');
        return val === filterValue;
      });
    }

    return result;
  }, [items, searchTerm, filterKey, filterValue]);

  
  const filterableColumns = columns.filter((c) => c.filterOptions && c.filterOptions.length > 0);

  const handleClearFilter = () => {
    setFilterKey('');
    setFilterValue('');
  };

  
  const triggerLabel = selectedItem
    ? `${title}: ${selectedItem.modelo}`
    : title;

  return (
    <AccordionItem
      value={accordionValue}
      className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl overflow-hidden"
      style={{ border: 'none' }}
    >
      <AccordionTrigger
        className="hover:no-underline px-5 py-4"
        style={{ alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <Icon className="h-4 w-4 text-hw-accent shrink-0" />
          <span className="text-hw-title font-heading font-semibold text-sm truncate">
            {triggerLabel}
          </span>
          {selectedItem && (
            <span className="text-xs text-muted-foreground shrink-0">
              {selectedItem.precio.toFixed(2)} €
            </span>
          )}
          {selectedId && (
            <Check className="h-4 w-4 text-green-500 shrink-0" />
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 pb-5">
        {/* Selected preview */}
        {selectedItem && (
          <div
            className="bg-green-500/10 rounded-lg"
            style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="text-sm text-hw-title font-semibold">
                ✓ {selectedItem.modelo}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedItem.precio.toFixed(2)} €
              </span>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onDeselect}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Search + Filter bar */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <Search
              className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar ${title.toLowerCase()}…`}
              style={{ paddingLeft: 36 }}
            />
          </div>

          {/* Filter selectors */}
          {filterableColumns.length > 0 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm text-hw-title"
                value={filterKey}
                onChange={(e) => {
                  setFilterKey(e.target.value);
                  setFilterValue('');
                }}
              >
                <option value="">Filtrar por…</option>
                {filterableColumns.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>

              {filterKey && (
                <>
                  <select
                    className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm text-hw-title"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {filterableColumns
                      .find((c) => c.key === filterKey)
                      ?.filterOptions?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                  <Button variant="ghost" size="icon-sm" onClick={handleClearFilter}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Results table */}
        {isLoading ? (
          <div className="text-muted-foreground text-sm text-center py-8">
            Cargando componentes…
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-muted-foreground text-sm text-center py-8">
            No se encontraron resultados.
          </div>
        ) : (
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    data-state={selectedId === item.id ? 'selected' : undefined}
                    className="cursor-pointer"
                    onClick={() => onSelect(item)}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>{col.render(item)}</TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant={selectedId === item.id ? 'default' : 'outline'}
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(item);
                        }}
                      >
                        {selectedId === item.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          'Elegir'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

