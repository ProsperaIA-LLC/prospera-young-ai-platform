-- ============================================================
-- Migration: competency_scores table
-- Mentors set the 4 competency scores (0–4 scale) per student
-- per cohort. Also records the other 2 completion conditions
-- (attendance and Demo Day) in one place.
-- ============================================================

CREATE TABLE IF NOT EXISTS competency_scores (
  id                     uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id             uuid         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cohort_id              uuid         NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,

  -- 4 continuous competencies (CONTEXT.md §9), scale 0–4
  validation_score       numeric(3,1) NOT NULL DEFAULT 0 CHECK (validation_score    BETWEEN 0 AND 4),
  creation_score         numeric(3,1) NOT NULL DEFAULT 0 CHECK (creation_score      BETWEEN 0 AND 4),
  communication_score    numeric(3,1) NOT NULL DEFAULT 0 CHECK (communication_score BETWEEN 0 AND 4),
  growth_score           numeric(3,1) NOT NULL DEFAULT 0 CHECK (growth_score        BETWEEN 0 AND 4),

  -- Other 2 completion conditions
  attendance_percent     integer      NOT NULL DEFAULT 0 CHECK (attendance_percent BETWEEN 0 AND 100),
  presented_at_demo_day  boolean      NOT NULL DEFAULT false,

  -- Audit
  scored_by              uuid         REFERENCES users(id),   -- mentor who set the scores
  scored_at              timestamptz,
  notes                  text,
  created_at             timestamptz  NOT NULL DEFAULT now(),
  updated_at             timestamptz  NOT NULL DEFAULT now(),

  UNIQUE(student_id, cohort_id)
);

-- Students can read their own scores; mentors can read/write all
ALTER TABLE competency_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own scores"
  ON competency_scores FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Mentors can read all scores"
  ON competency_scores FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('mentor', 'admin'))
  );

CREATE POLICY "Mentors can insert scores"
  ON competency_scores FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('mentor', 'admin'))
  );

CREATE POLICY "Mentors can update scores"
  ON competency_scores FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('mentor', 'admin'))
  );
