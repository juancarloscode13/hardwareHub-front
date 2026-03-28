import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import type { FieldDef } from '@/features/admin/entityConfig';

// ── Types ──────────────────────────────────────────────────────────────────

interface EntityFormDialogProps {
  open:           boolean;
  onOpenChange:   (open: boolean) => void;
  mode:           'create' | 'edit';
  entityLabel:    string;
  fields:         FieldDef[];
  initialValues?: Record<string, unknown>;
  onSubmit:       (values: Record<string, unknown>) => void;
  isPending:      boolean;
}

// ── Helper: inicializar valores del formulario ─────────────────────────────

function buildInitial(
  fields: FieldDef[],
  initialValues?: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const f of fields) {
    const raw = initialValues?.[f.name];

    if (f.type === 'json') {
      result[f.name] =
        raw !== undefined && raw !== null
          ? JSON.stringify(raw, null, 2)
          : '{}';
    } else if (f.type === 'boolean') {
      result[f.name] = raw ?? false;
    } else if (f.type === 'number') {
      result[f.name] = raw ?? '';
    } else {
      // text | select
      result[f.name] = raw ?? '';
    }
  }

  return result;
}

// ── Shared input class ─────────────────────────────────────────────────────

const INPUT_BASE =
  'h-[42px] bg-hw-input rounded-[8px] text-hw-input-text text-[0.875rem] px-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300';

const SELECT_BASE =
  'bg-hw-input border border-hw-input-border text-hw-input-text rounded-[8px] h-[42px] px-[0.75rem] w-full text-[0.875rem] focus:outline-none focus:border-hw-accent transition-colors duration-300';

const TEXTAREA_BASE =
  'bg-hw-input border border-hw-input-border text-hw-input-text rounded-[8px] px-[0.75rem] py-[0.5rem] w-full text-[0.875rem] font-mono focus:outline-none focus:border-hw-accent resize-y min-h-[80px] placeholder:text-hw-placeholder transition-colors duration-300';

// ── Component ──────────────────────────────────────────────────────────────

export function EntityFormDialog({
  open,
  onOpenChange,
  mode,
  entityLabel,
  fields,
  initialValues,
  onSubmit,
  isPending,
}: EntityFormDialogProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    buildInitial(fields, initialValues),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Handlers ────────────────────────────────────────────────────────────

  function setValue(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit() {
    const newErrors: Record<string, string> = {};

    // Validación de obligatorios
    for (const f of fields) {
      if (f.required) {
        const val = values[f.name];
        if (val === '' || val === null || val === undefined) {
          newErrors[f.name] = 'Este campo es obligatorio.';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Parsear campos JSON
    const parsed: Record<string, unknown> = { ...values };
    for (const f of fields) {
      if (f.type === 'json') {
        try {
          parsed[f.name] = JSON.parse(values[f.name] as string);
        } catch {
          setErrors((prev) => ({ ...prev, [f.name]: 'JSON inválido.' }));
          return;
        }
      }
      if (f.type === 'number' && values[f.name] !== '') {
        parsed[f.name] = Number(values[f.name]);
      }
    }

    onSubmit(parsed);
  }

  const title = mode === 'create'
    ? `Añadir ${entityLabel}`
    : `Modificar ${entityLabel}`;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Campos — scrollable */}
        <div className="flex-1 overflow-y-auto pr-[0.25rem] flex flex-col gap-[1rem]">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-[0.4rem]">
              <Label
                htmlFor={f.name}
                className="text-[0.8125rem] text-hw-label transition-colors duration-300"
              >
                {f.label}
                {f.required && (
                  <span className="text-hw-error ml-[0.2rem]">*</span>
                )}
              </Label>

              {/* text */}
              {f.type === 'text' && (
                <Input
                  id={f.name}
                  value={values[f.name] as string}
                  onChange={(e) => setValue(f.name, e.target.value)}
                  placeholder={f.label}
                  className={`${INPUT_BASE} ${errors[f.name] ? 'border-hw-error' : 'border-hw-input-border'}`}
                />
              )}

              {/* number */}
              {f.type === 'number' && (
                <Input
                  id={f.name}
                  type="number"
                  value={values[f.name] as string | number}
                  onChange={(e) => setValue(f.name, e.target.value)}
                  placeholder="0"
                  className={`${INPUT_BASE} ${errors[f.name] ? 'border-hw-error' : 'border-hw-input-border'}`}
                />
              )}

              {/* select */}
              {f.type === 'select' && (
                <select
                  id={f.name}
                  value={values[f.name] as string}
                  onChange={(e) => setValue(f.name, e.target.value)}
                  className={`${SELECT_BASE} ${errors[f.name] ? 'border-hw-error' : ''}`}
                >
                  <option value="" disabled>
                    Seleccionar…
                  </option>
                  {f.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {/* boolean */}
              {f.type === 'boolean' && (
                <label
                  htmlFor={f.name}
                  className="flex items-center gap-[0.5rem] cursor-pointer"
                >
                  <input
                    id={f.name}
                    type="checkbox"
                    checked={values[f.name] as boolean}
                    onChange={(e) => setValue(f.name, e.target.checked)}
                    className="w-[16px] h-[16px] rounded accent-hw-accent"
                  />
                  <span className="text-[0.875rem] text-hw-input-text transition-colors duration-300">
                    {values[f.name] ? 'Sí' : 'No'}
                  </span>
                </label>
              )}

              {/* json */}
              {f.type === 'json' && (
                <textarea
                  id={f.name}
                  value={values[f.name] as string}
                  onChange={(e) => setValue(f.name, e.target.value)}
                  placeholder="{}"
                  rows={4}
                  className={`${TEXTAREA_BASE} ${errors[f.name] ? 'border-hw-error' : ''}`}
                />
              )}

              {/* Error message */}
              {errors[f.name] && (
                <span className="text-hw-error text-[0.75rem]">
                  {errors[f.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <DialogFooter className="mt-[0.5rem]">
          {/* Cancelar */}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-[42px] bg-transparent text-hw-muted border-hw-muted-border rounded-[8px] gap-[0.5rem] transition-colors duration-300 hover:border-hw-accent/40 hover:bg-hw-accent/5 hover:text-hw-title"
          >
            Cancelar
          </Button>

          {/* Guardar / Crear */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="h-[42px] bg-hw-accent text-hw-accent-fg font-semibold rounded-[8px] gap-[0.5rem] transition-colors duration-300 hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-[16px] h-[16px] animate-spin" />
                Guardando…
              </>
            ) : mode === 'create' ? (
              'Crear'
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


