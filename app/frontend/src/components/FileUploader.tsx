import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploaderProps {
  label: string;
  description: string;
  accept?: string;
  fileName?: string | null;
  rowCount?: number;
  loading?: boolean;
  onFile: (file: File) => void;
  onClear?: () => void;
  accentColor?: 'sky' | 'amber';
}

export default function FileUploader({
  label,
  description,
  accept = '.xlsx,.xls',
  fileName,
  rowCount,
  loading = false,
  onFile,
  onClear,
  accentColor = 'sky',
}: FileUploaderProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  const accent = accentColor === 'sky' ? 'sky' : 'amber';

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-xl border-2 border-dashed p-6 transition-all bg-slate-900/40',
        dragging
          ? accent === 'sky'
            ? 'border-sky-400 bg-sky-500/10'
            : 'border-amber-400 bg-amber-500/10'
          : 'border-slate-700 hover:border-slate-500',
      )}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={loading}
      />
      <div className="flex items-start gap-4 pointer-events-none">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg shrink-0',
            accent === 'sky' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400',
          )}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : fileName ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-100">{label}</h3>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
          {fileName ? (
            <div className="mt-3 flex items-center gap-2 text-xs">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200 truncate">{fileName}</span>
              {typeof rowCount === 'number' && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full font-medium',
                    accent === 'sky' ? 'bg-sky-500/20 text-sky-300' : 'bg-amber-500/20 text-amber-300',
                  )}
                >
                  {rowCount.toLocaleString()} filas
                </span>
              )}
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              Arrastra tu archivo Excel aquí o haz clic para seleccionar
            </p>
          )}
        </div>
        {fileName && onClear && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }}
            className="pointer-events-auto text-slate-500 hover:text-slate-200 transition"
            aria-label="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}