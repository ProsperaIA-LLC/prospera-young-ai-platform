-- ============================================================
-- Migration: create scholarship_applications table
-- ============================================================

CREATE TABLE IF NOT EXISTS scholarship_applications (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name     text        NOT NULL,
  applicant_email    text        NOT NULL,
  applicant_age      integer     NOT NULL CHECK (applicant_age BETWEEN 10 AND 25),
  applicant_country  text        NOT NULL,
  motivation_letter  text        NOT NULL,
  video_url          text,
  reference_contact  text,
  status             text        NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  cohort_id          uuid        REFERENCES cohorts(id),      -- assigned by mentor after approval
  reviewed_by        uuid        REFERENCES users(id),
  reviewed_at        timestamptz,
  admin_notes        text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- Allow anyone (anon) to insert — public scholarship form
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit scholarship application"
  ON scholarship_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Only authenticated mentors/admins can read and update
CREATE POLICY "Mentors can read scholarship applications"
  ON scholarship_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('mentor', 'admin')
    )
  );

CREATE POLICY "Mentors can update scholarship applications"
  ON scholarship_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('mentor', 'admin')
    )
  );
