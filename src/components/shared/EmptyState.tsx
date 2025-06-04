import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Accessible empty state fallback with optional reset action button
interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export default function EmptyState({
  title = "Tidak ada data ditemukan",
  description = "Coba sesuaikan kata kunci pencarian atau reset filter yang sedang aktif.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400">
        <SearchX className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-800">{title}</h4>
        <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm">{description}</p>
      </div>
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="mt-2"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          <span>Reset Filter</span>
        </Button>
      )}
    </div>
  );
}
