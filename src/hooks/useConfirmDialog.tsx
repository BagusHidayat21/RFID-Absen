import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

// Custom hook managing an accessible modal confirmation dialog with Promise-based resolution
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    title: '',
    description: '',
    confirmText: 'Lanjutkan',
    cancelText: 'Batal',
    variant: 'default',
  });

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmDialogOptions): Promise<boolean> => {
    setOptions({
      confirmText: 'Lanjutkan',
      cancelText: 'Batal',
      variant: 'default',
      ...opts,
    });
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleCancel]);

  const ConfirmDialog = useCallback(() => {
    return (
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent
          onOverlayClick={handleCancel}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            handleCancel();
          }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl max-w-md"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900">
              {options.title}
            </AlertDialogTitle>
            {options.description && (
              <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed mt-1">
                {options.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 flex items-center justify-end gap-2.5">
            <AlertDialogCancel
              onClick={handleCancel}
              className="h-9 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              {options.cancelText || 'Batal'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={`h-9 px-4 rounded-xl text-xs font-semibold text-white shadow-xs ${
                options.variant === 'destructive'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {options.confirmText || 'Lanjutkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }, [isOpen, options, handleCancel, handleConfirm]);

  return {
    confirm,
    ConfirmDialog,
  };
}
