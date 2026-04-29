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
import { useCloudinaryMediaUrls } from '@/features/cloudinary/hooks/useCloudinary';
import { ComponentThumbnail } from '@/components/ui/component-thumbnail';



export interface ColumnDef<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  filterOptions?: { value: string; label: string }[];
}

interface ComponentSelectorSectionProps<T extends { id: number; modelo: string; precio: number; imagen?: string | null }> {

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

  getItemIssues?: (item: T) => string[];
}



export default function ComponentSelectorSection<
  T extends { id: number; modelo: string; precio: number; imagen?: string | null },
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
  getItemIssues,
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
        const raw = (item as Record<string, unknown>)[filterKey];
        if (Array.isArray(raw)) {
          return raw.includes(filterValue);
        }
        const val = String(raw ?? '');
        return val === filterValue;
      });
    }

    return result;
  }, [items, searchTerm, filterKey, filterValue]);

  
  const filterableColumns = columns.filter((c) => c.filterOptions && c.filterOptions.length > 0);

  const { data: imageUrls } = useCloudinaryMediaUrls([
    ...filteredItems.map((item) => item.imagen),
    selectedItem?.imagen,
  ]);

  const handleClearFilter = () => {
    setFilterKey('');
    setFilterValue('');
  };

  
  const triggerLabel = selectedItem
    ? `${title}: ${selectedItem.modelo}`
    : title;

  const selectedImageUrl = selectedItem?.imagen
    ? imageUrls[selectedItem.imagen.trim()]
    : undefined;

  const truncateModel = accordionValue === 'cpu';

  return (
    <AccordionItem
      value={accordionValue}
      className="hw-selector-card bg-hw-card ring-1 ring-hw-card-border rounded-2xl overflow-hidden"
    >
      <AccordionTrigger
        className="hw-selector-trigger hw-selector-trigger-folded hover:no-underline px-5 py-4"
      >
        <div className="hw-selector-trigger-main">
          {selectedItem && (
            <ComponentThumbnail src={selectedImageUrl} alt={selectedItem.modelo} />
          )}
          <Icon className="hw-selector-type-icon h-4 w-4 text-hw-accent shrink-0" />
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

      <AccordionContent className="hw-selector-content px-5 pb-5">
        {/* Selected preview */}
        {selectedItem && (
          <div className="hw-selector-selected bg-green-500/10 rounded-lg">
            <div className="hw-selector-selected-copy">
              <div className="hw-selector-selected-row">
                <ComponentThumbnail src={selectedImageUrl} alt={selectedItem.modelo} size="lg" />
                <span className="text-sm text-hw-title font-semibold">
                  ✓ {selectedItem.modelo}
                </span>
              </div>
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
        <div className="hw-selector-toolbar">
          <div className="hw-selector-search-wrap">
            <Search
              className="hw-selector-search-icon h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <Input
              className="hw-selector-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar ${title.toLowerCase()}…`}
            />
          </div>

          {/* Filter selectors */}
          {filterableColumns.length > 0 && (
            <div className="hw-selector-filters">
              <select
                className="hw-selector-filter-select"
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
                    className="hw-selector-filter-select"
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
          <div className="hw-selector-results">
            <Table className="hw-selector-table">
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const itemIssues = getItemIssues?.(item) ?? [];
                  const isIncompatible = itemIssues.length > 0;

                  return (
                    <TableRow
                      key={item.id}
                      data-state={selectedId === item.id ? 'selected' : undefined}
                      className={isIncompatible ? 'hw-selector-row-incompatible' : 'cursor-pointer'}
                      title={isIncompatible ? itemIssues.join(' | ') : undefined}
                      onClick={() => {
                        if (!isIncompatible) {
                          onSelect(item);
                        }
                      }}
                    >
                      {columns.map((col) => {
                      if (col.key === 'modelo') {
                        const imageUrl = item.imagen
                          ? imageUrls[item.imagen.trim()]
                          : undefined;

                        return (
                          <TableCell key={col.key} className="hw-selector-model-cell">
                            <div className="hw-selector-model-wrap">
                              <ComponentThumbnail src={imageUrl} alt={item.modelo} />
                              <div className="hw-selector-model-copy">
                                <span className={truncateModel ? 'hw-selector-model-text hw-selector-model-text-cpu' : 'hw-selector-model-text hw-selector-model-text-wrap'}>
                                  {col.render(item)}
                                </span>
                                {isIncompatible && (
                                  <span className="hw-selector-model-issue">{itemIssues[0]}</span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        );
                      }

                      return <TableCell key={col.key}>{col.render(item)}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

