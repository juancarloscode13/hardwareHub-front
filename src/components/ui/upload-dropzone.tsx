import { cn } from '@/lib/utils.ts';
import type { UploadHookControl } from '@better-upload/client';
import { Loader2, Upload } from 'lucide-react';
import { useId } from 'react';
import { useDropzone } from 'react-dropzone';

type UploadDropzoneProps = {
  control: UploadHookControl<true>;
  id?: string;
  accept?: string;
  metadata?: Record<string, unknown>;
  description?:
    | {
        fileTypes?: string;
        maxFileSize?: string;
        maxFiles?: number;
      }
    | string;
  uploadOverride?: (
    ...args: Parameters<UploadHookControl<true>['upload']>
  ) => void;
};

export function UploadDropzone({
  control: { upload, isPending },
  id: _id,
  accept,
  metadata,
  description,
  uploadOverride,
}: UploadDropzoneProps) {
  const id = useId();

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop: (files) => {
      if (files.length > 0 && !isPending) {
        if (uploadOverride) {
          uploadOverride(files, { metadata });
        } else {
          upload(files, { metadata });
        }
      }
      inputRef.current.value = '';
    },
    noClick: true,
  });

  return (
    <div
      className={cn(
        'border-hw-input-border text-hw-title rounded-lg border border-dashed transition-colors duration-200',
        { 'border-hw-accent': isDragActive }
      )}
      style={{ position: 'relative' }}
    >
      <label
        {...getRootProps()}
        className={cn(
          'bg-hw-input flex w-full cursor-pointer flex-col items-center justify-center rounded-lg transition-colors duration-200',
          {
            'text-hw-placeholder cursor-not-allowed': isPending,
            'hover:bg-hw-accent/5': !isPending,
          }
        )}
        style={{
          padding: '2rem 1.5rem',
          opacity: isDragActive ? 0 : 1,
        }}
        htmlFor={_id || id}
      >
        <div className="my-2">
          {isPending ? (
            <Loader2 className="size-6 text-hw-accent animate-spin" />
          ) : (
            <Upload className="size-6 text-hw-accent" />
          )}
        </div>

        <div className="mt-3 space-y-1 text-center">
          <p className="text-sm font-semibold text-hw-title">Arrastra tu archivo aquí</p>

          <p className="text-hw-subtitle max-w-64 text-xs">
            {typeof description === 'string' ? (
              description
            ) : (
              <>
                {description?.maxFiles &&
                  `Puedes subir ${description.maxFiles} archivo${description.maxFiles !== 1 ? 's' : ''}.`}{' '}
                {description?.maxFileSize &&
                  `${description.maxFiles !== 1 ? 'Cada u' : 'H'}asta ${description.maxFileSize}.`}{' '}
                {description?.fileTypes && `Formatos: ${description.fileTypes}.`}
              </>
            )}
          </p>
        </div>

        <input
          {...getInputProps()}
          type="file"
          multiple
          id={_id || id}
          accept={accept}
          disabled={isPending}
        />
      </label>

      {isDragActive && (
        <div
          className="pointer-events-none rounded-lg"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--hw-accent, rgba(0,255,255,0.1))',
            opacity: 0.12,
          }}
        />
      )}
      {isDragActive && (
        <div
          className="pointer-events-none rounded-lg flex flex-col items-center justify-center"
          style={{ position: 'absolute', inset: 0 }}
        >
          <Upload className="size-6 text-hw-accent" />
          <p className="mt-3 text-sm font-semibold text-hw-title">Suelta el archivo aquí</p>
        </div>
      )}
    </div>
  );
}
