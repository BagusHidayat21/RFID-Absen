// Modal dialog allowing users to customize and toggle operational widgets using shadcn/ui Dialog
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { DashboardWidget } from '../types/dashboard';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: DashboardWidget[];
  onToggleWidget: (id: string) => void;
}

export function WidgetModal({
  isOpen,
  onClose,
  widgets,
  onToggleWidget,
}: WidgetModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-slate-100">
          <DialogTitle className="text-base font-bold text-slate-900">
            Kelola Widget Dashboard
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Pilih komponen analitik dan monitoring yang ingin ditampilkan
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto space-y-3.5">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between gap-4 bg-white"
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {widget.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {widget.desc}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium font-mono">
                    {widget.tag}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant={widget.enabled ? 'outline' : 'default'}
                onClick={() => onToggleWidget(widget.id)}
                className={`h-8 px-3.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-colors cursor-pointer ${
                  widget.enabled
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {widget.enabled ? 'Aktif' : 'Pilih'}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
