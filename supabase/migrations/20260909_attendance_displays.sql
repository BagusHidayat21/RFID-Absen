-- Create attendance_displays table for multi-TV display management
CREATE TABLE IF NOT EXISTS jtag.attendance_displays (
  id            SERIAL PRIMARY KEY,
  display_code  VARCHAR(20) NOT NULL UNIQUE,
  display_name  VARCHAR(100) NOT NULL,
  location      VARCHAR(100),
  is_enabled    BOOLEAN NOT NULL DEFAULT true,
  last_seen_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE jtag.attendance_displays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to attendance_displays"
  ON jtag.attendance_displays FOR ALL TO public USING (true) WITH CHECK (true);

-- Enable realtime for absensi INSERT events
ALTER PUBLICATION supabase_realtime ADD TABLE jtag.absensi;
