// Next.js Route Handler for fetching the most recently scanned RFID UID
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('latest_rfid_scan')
      .select('uid, scanned_at')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return NextResponse.json({ uid: '' }, { status: 200 });
    }

    return NextResponse.json({ uid: data.uid, scanned_at: data.scanned_at }, { status: 200 });
  } catch {
    return NextResponse.json({ uid: '' }, { status: 200 });
  }
}
