// Lightweight TV heartbeat endpoint — updates last_seen_at, no auth required
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const code = String(body.display_code ?? '').toUpperCase().trim();

    if (!code) {
      return NextResponse.json({ error: 'display_code required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    await supabase
      .from('attendance_displays')
      .update({ last_seen_at: now, updated_at: now })
      .eq('display_code', code);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
