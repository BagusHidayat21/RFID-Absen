// Route handler for updating and deleting a specific display (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// PATCH /api/displays/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.display_name !== undefined) patch.display_name = body.display_name;
    if (body.location !== undefined) patch.location = body.location;
    if (body.is_enabled !== undefined) patch.is_enabled = body.is_enabled;

    const { data, error } = await supabase
      .from('attendance_displays')
      .update(patch)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/displays/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { error } = await supabase
      .from('attendance_displays')
      .delete()
      .eq('id', Number(id));

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
