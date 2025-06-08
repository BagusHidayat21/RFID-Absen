// Admin settings page for managing school TV attendance display devices
'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DisplaysTable } from '@/components/displays/DisplaysTable';
import { AddDisplayDialog } from '@/components/displays/AddDisplayDialog';
import { EditDisplayDialog } from '@/components/displays/EditDisplayDialog';
import { useDisplays } from '@/hooks/useDisplays';
import { AttendanceDisplay } from '@/types';
import { Plus, RefreshCw, Tv, ExternalLink } from 'lucide-react';

export default function SettingsDisplaysPage() {
  const {
    displays,
    loading,
    fetchDisplays,
    addDisplay,
    editDisplay,
    removeDisplay,
  } = useDisplays();

  const [addOpen, setAddOpen] = useState(false);
  const [editingDisplay, setEditingDisplay] = useState<AttendanceDisplay | null>(null);

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-10">
      <Breadcrumbs
        items={[
          { label: 'Pengaturan' },
          { label: 'Display TV & Monitor' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Display TV & Monitor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola layar TV dan monitor absensi di gerbang dan lorong sekolah
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDisplays}
            className="h-9 px-3 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Tambah Display
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0 text-blue-600">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-blue-900">
              Cara Menghubungkan Layar TV
            </h4>
            <p className="text-xs text-blue-700 mt-0.5">
              Buka <strong>/attendance/display</strong> di browser TV atau Smart TV, lalu masukkan kode aktivasi display terkait.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold bg-white border-blue-200 text-blue-700 hover:bg-blue-50/80 shrink-0"
          asChild
        >
          <a href="/attendance/display" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3.5 h-3.5 mr-1" />
            Buka TV Display
          </a>
        </Button>
      </Card>

      <DisplaysTable
        displays={displays}
        loading={loading}
        onEdit={(d) => setEditingDisplay(d)}
        onDelete={removeDisplay}
      />

      <AddDisplayDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={addDisplay}
      />

      <EditDisplayDialog
        display={editingDisplay}
        open={editingDisplay !== null}
        onOpenChange={(open) => !open && setEditingDisplay(null)}
        onEdit={editDisplay}
      />
    </div>
  );
}
