// TV display page rendering either the setup screen or live attendance screen based on stored config
'use client';

import { useTvDisplay } from '@/hooks/useTvDisplay';
import { TvSetup } from '@/components/tv/TvSetup';
import { TvScreen } from '@/components/tv/TvScreen';

export default function AttendanceDisplayPage() {
  const {
    config,
    saveConfig,
    clearConfig,
    displayState,
    summary,
    isOnline,
    isConfigLoaded,
  } = useTvDisplay();

  if (!isConfigLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-slate-400 font-sans">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!config) {
    return <TvSetup onActivated={saveConfig} />;
  }

  return (
    <TvScreen
      config={config}
      displayState={displayState}
      summary={summary}
      isOnline={isOnline}
      onClearConfig={clearConfig}
    />
  );
}
