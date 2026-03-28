import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2 } from 'lucide-react';

import { Button }           from '@/components/ui/button';
import { AdminTable }       from '@/components/admin/AdminTable';
import { EntityFormDialog } from '@/components/admin/EntityFormDialog';
import { useLogout }        from '@/features/auth/hooks/useAuth';
import { useAdminEntity }   from '@/features/admin/useAdminEntity';
import { entityConfigs }    from '@/features/admin/entityConfig';

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const navigate = useNavigate();
  const logout   = useLogout();

  // ── Estado ──────────────────────────────────────────────────────────────
  const [selectedEntityKey, setSelectedEntityKey] = useState<string | null>(null);
  const [selectedRowId,     setSelectedRowId]     = useState<number | null>(null);
  const [dialogMode,        setDialogMode]        = useState<'create' | 'edit' | null>(null);

  // ── Entidad activa (derivado) ────────────────────────────────────────────
  const selectedEntity = entityConfigs.find((e) => e.key === selectedEntityKey) ?? null;

  // ── Datos y mutaciones ───────────────────────────────────────────────────
  const entity = useAdminEntity(selectedEntity);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleEntityChange = (key: string) => {
    setSelectedEntityKey(key || null);
    setSelectedRowId(null);
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  };

  const handleDelete = () => {
    if (!selectedRowId) return;
    if (!window.confirm('¿Eliminar este elemento? Esta acción no se puede deshacer.')) return;
    entity.remove.mutate(selectedRowId, {
      onSuccess: () => setSelectedRowId(null),
    });
  };

  const handleFormSubmit = (values: Record<string, unknown>) => {
    if (dialogMode === 'create') {
      entity.create.mutate(values, {
        onSuccess: () => setDialogMode(null),
      });
    } else if (dialogMode === 'edit' && selectedRowId !== null) {
      entity.update.mutate(
        { id: selectedRowId, data: values },
        { onSuccess: () => setDialogMode(null) },
      );
    }
  };

  // ── initialValues para el dialog de edición ──────────────────────────────
  const editInitialValues =
    dialogMode === 'edit' && selectedRowId !== null
      ? entity.data?.content.find((row) => (row['id'] as number) === selectedRowId)
      : undefined;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-hw-page transition-colors duration-300">
      {/* Glow decorativo */}
      <div className="fixed w-[600px] h-[600px] rounded-full bg-hw-glow blur-[120px] top-0 right-0 pointer-events-none transition-colors duration-300" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-[2rem] py-[1.25rem] border-b border-hw-divider transition-colors duration-300">
        <span className="font-heading text-[1.125rem] font-bold tracking-[-0.02em] text-hw-title transition-colors duration-300">
          HardwareHub
        </span>

        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="bg-transparent border-hw-muted-border text-hw-muted rounded-[8px] gap-[0.5rem] hover:border-hw-error/40 hover:bg-hw-error-bg hover:text-hw-error transition-colors duration-300 disabled:opacity-50"
        >
          <LogOut className="w-[15px] h-[15px]" />
          {logout.isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </Button>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-[2rem] py-[2.5rem] flex flex-col gap-[1.75rem]">
        {/* Título */}
        <div>
          <h1 className="font-heading text-[1.5rem] font-bold tracking-[-0.02em] text-hw-title transition-colors duration-300">
            Panel de Control
          </h1>
          <p className="mt-[0.25rem] text-[0.875rem] text-hw-subtitle transition-colors duration-300">
            Gestiona el catálogo de hardware desde aquí.
          </p>
        </div>

        {/* Selector de entidad */}
        <div className="flex flex-col gap-[0.5rem]">
          <label
            htmlFor="entity-select"
            className="text-[0.8125rem] text-hw-label transition-colors duration-300"
          >
            Seleccionar tabla
          </label>
          <select
            id="entity-select"
            value={selectedEntityKey ?? ''}
            onChange={(e) => handleEntityChange(e.target.value)}
            className="bg-hw-input border border-hw-input-border text-hw-input-text rounded-[8px] h-[42px] px-[0.75rem] text-[0.875rem] max-w-[280px] focus:outline-none focus:border-hw-accent transition-colors duration-300"
          >
            <option value="" disabled>
              Seleccionar tabla…
            </option>
            {entityConfigs.map((cfg) => (
              <option key={cfg.key} value={cfg.key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        <div className="transition-opacity duration-300">
          <AdminTable
            columns={selectedEntity?.columns ?? []}
            data={entity.data?.content ?? []}
            selectedId={selectedRowId}
            onRowSelect={setSelectedRowId}
            isLoading={entity.isLoading}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-[0.75rem] justify-end">
          {/* Añadir */}
          <Button
            onClick={() => setDialogMode('create')}
            disabled={!selectedEntity}
            className="h-[42px] bg-hw-accent text-hw-accent-fg font-semibold rounded-[8px] gap-[0.5rem] transition-colors duration-300 hover:opacity-80 disabled:opacity-40"
          >
            <Plus className="w-[16px] h-[16px]" />
            Añadir
          </Button>

          {/* Modificar */}
          <Button
            variant="outline"
            onClick={() => setDialogMode('edit')}
            disabled={!selectedRowId}
            className="h-[42px] bg-transparent border-hw-muted-border text-hw-muted rounded-[8px] gap-[0.5rem] transition-colors duration-300 hover:border-hw-accent/40 hover:bg-hw-accent/5 hover:text-hw-title disabled:opacity-40"
          >
            <Pencil className="w-[16px] h-[16px]" />
            Modificar
          </Button>

          {/* Eliminar */}
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={!selectedRowId || entity.remove.isPending}
            className="h-[42px] bg-transparent border-hw-muted-border text-hw-muted rounded-[8px] gap-[0.5rem] transition-colors duration-300 hover:border-hw-error/40 hover:bg-hw-error-bg hover:text-hw-error disabled:opacity-40"
          >
            <Trash2 className="w-[16px] h-[16px]" />
            {entity.remove.isPending ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </div>
      </main>

      {/* Dialog CRUD */}
      {selectedEntity && dialogMode !== null && (
        <EntityFormDialog
          key={`${dialogMode}-${selectedRowId ?? 'new'}`}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDialogMode(null);
          }}
          mode={dialogMode}
          entityLabel={selectedEntity.label}
          fields={selectedEntity.fields}
          initialValues={editInitialValues as Record<string, unknown> | undefined}
          onSubmit={handleFormSubmit}
          isPending={entity.create.isPending || entity.update.isPending}
        />
      )}
    </div>
  );
}


