// Route handler for listing and creating attendance displays (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/displays — list all displays
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('attendance_displays')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/displays — create new display
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { display_name, location } = body;

    if (!display_name?.trim()) {
      return NextResponse.json({ error: 'display_name is required' }, { status: 400 });
    }

    // Generate a unique code (retry on collision)
    const prefixes = ['GATE', 'HALL', 'LOBBY', 'BLDG', 'TV'];
    let code = '';
    let inserted = null;
    let attempts = 0;

    while (!inserted && attempts < 5) {
      code = `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data, error } = await supabase
        .from('attendance_displays')
        .insert([{ display_code: code, display_name: display_name.trim(), location: location?.trim() || null }])
        .select()
        .single();

      if (!error) {
        inserted = data;
      } else if (error.code !== '23505') {
        throw error;
      }
      attempts++;
    }

    if (!inserted) throw new Error('Failed to generate unique code');
    return NextResponse.json(inserted, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
