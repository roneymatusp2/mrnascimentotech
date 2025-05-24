/*
  # Mistral AI Integration for Math Questions

  1. New Tables
    - `ai_generation_jobs` - Tracks AI generation tasks
    - `ai_generation_history` - Records all AI interactions
    - `question_levels` - Defines academic levels (KS3, pre-IGCSE, IGCSE)
    - `question_topics` - Structured math topics taxonomy
  
  2. Modified Tables
    - Enhanced `questions` table with new fields for academic level
  
  3. Security
    - RLS policies for all new tables
    - Admin-specific access controls
*/

-- Create enum for academic levels
CREATE TYPE academic_level AS ENUM ('KS3', 'pre-IGCSE', 'IGCSE');

-- Create enum for cognitive levels (using Bloom's taxonomy aligned with curriculum standards)
CREATE TYPE cognitive_level_enum AS ENUM ('knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation');

-- Create question_levels table
CREATE TABLE IF NOT EXISTS question_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name academic_level NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Insert default levels
INSERT INTO question_levels (name, description)
VALUES 
  ('KS3', 'Key Stage 3 mathematics for ages 11-14'),
  ('pre-IGCSE', 'Preparatory level before IGCSE mathematics'),
  ('IGCSE', 'International General Certificate of Secondary Education mathematics');

-- Create question_topics table with hierarchical structure
CREATE TABLE IF NOT EXISTS question_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES question_topics(id),
  name text NOT NULL,
  description text,
  level academic_level,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create index on parent_id to optimize hierarchical queries
CREATE INDEX idx_question_topics_parent_id ON question_topics(parent_id);

-- Insert standard math topics
INSERT INTO question_topics (name, description, level)
VALUES 
  ('Number', 'Number systems, operations, and properties', 'KS3'),
  ('Algebra', 'Variables, expressions, equations, and functions', 'KS3'),
  ('Geometry', 'Properties and relationships of points, lines, surfaces, and solids', 'KS3'),
  ('Statistics', 'Collection, analysis, interpretation, and presentation of data', 'KS3');

-- Add subtopics for each main topic
WITH 
  number_id AS (SELECT id FROM question_topics WHERE name = 'Number' LIMIT 1),
  algebra_id AS (SELECT id FROM question_topics WHERE name = 'Algebra' LIMIT 1),
  geometry_id AS (SELECT id FROM question_topics WHERE name = 'Geometry' LIMIT 1),
  statistics_id AS (SELECT id FROM question_topics WHERE name = 'Statistics' LIMIT 1)
INSERT INTO question_topics (parent_id, name, description, level)
VALUES 
  -- Number subtopics
  ((SELECT id FROM number_id), 'Integers', 'Whole numbers and their operations', 'KS3'),
  ((SELECT id FROM number_id), 'Fractions', 'Parts of a whole and their operations', 'KS3'),
  ((SELECT id FROM number_id), 'Decimals', 'Base-10 representation of fractions', 'KS3'),
  ((SELECT id FROM number_id), 'Percentages', 'Numbers expressed as parts per hundred', 'KS3'),
  ((SELECT id FROM number_id), 'Ratio and Proportion', 'Relationships between quantities', 'KS3'),
  
  -- Algebra subtopics
  ((SELECT id FROM algebra_id), 'Expressions', 'Combinations of variables, numbers, and operations', 'KS3'),
  ((SELECT id FROM algebra_id), 'Equations', 'Statements asserting the equality of expressions', 'KS3'),
  ((SELECT id FROM algebra_id), 'Formulas', 'Equations that express a relationship between quantities', 'KS3'),
  ((SELECT id FROM algebra_id), 'Sequences', 'Ordered lists of numbers following a pattern', 'KS3'),
  ((SELECT id FROM algebra_id), 'Functions', 'Relationships between inputs and outputs', 'pre-IGCSE'),
  
  -- Geometry subtopics
  ((SELECT id FROM geometry_id), 'Angles', 'Measures of rotation and their properties', 'KS3'),
  ((SELECT id FROM geometry_id), 'Shapes', 'Two-dimensional figures and their properties', 'KS3'),
  ((SELECT id FROM geometry_id), 'Constructions', 'Creating geometric figures with tools', 'KS3'),
  ((SELECT id FROM geometry_id), 'Transformations', 'Movements of shapes in a plane', 'KS3'),
  ((SELECT id FROM geometry_id), 'Trigonometry', 'Study of triangles and trigonometric functions', 'pre-IGCSE'),
  
  -- Statistics subtopics
  ((SELECT id FROM statistics_id), 'Data Representation', 'Methods of displaying data', 'KS3'),
  ((SELECT id FROM statistics_id), 'Averages', 'Measures of central tendency', 'KS3'),
  ((SELECT id FROM statistics_id), 'Probability', 'Measurement of the likelihood of events', 'KS3'),
  ((SELECT id FROM statistics_id), 'Scatter Diagrams', 'Plots showing relationship between two variables', 'pre-IGCSE');

-- Add second-level subtopics for key areas
WITH 
  equations_id AS (SELECT id FROM question_topics WHERE name = 'Equations' LIMIT 1)
INSERT INTO question_topics (parent_id, name, description, level)
VALUES 
  ((SELECT id FROM equations_id), 'Linear Equations', 'First-degree equations in one variable', 'KS3'),
  ((SELECT id FROM equations_id), 'Simultaneous Equations', 'Systems of multiple equations', 'pre-IGCSE'),
  ((SELECT id FROM equations_id), 'Quadratic Equations', 'Second-degree equations in one variable', 'IGCSE');

-- Create AI generation jobs table
CREATE TABLE IF NOT EXISTS ai_generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES question_topics(id) NOT NULL,
  level_id uuid REFERENCES question_levels(id) NOT NULL,
  cognitive_level cognitive_level_enum NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  prompt text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  questions_generated integer DEFAULT 0,
  error_message text
);

-- Create index on status to quickly find pending jobs
CREATE INDEX idx_ai_generation_jobs_status ON ai_generation_jobs(status);
CREATE INDEX idx_ai_generation_jobs_created_by ON ai_generation_jobs(created_by);

-- Create AI generation history table
CREATE TABLE IF NOT EXISTS ai_generation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES ai_generation_jobs(id),
  prompt text NOT NULL,
  response jsonb NOT NULL,
  tokens_used integer,
  model_used text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

-- Create index for efficient querying
CREATE INDEX idx_ai_generation_history_job_id ON ai_generation_history(job_id);
CREATE INDEX idx_ai_generation_history_created_by ON ai_generation_history(created_by);

-- Add new fields to the questions table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'academic_level'
  ) THEN
    ALTER TABLE questions ADD COLUMN academic_level academic_level;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'cognitive_level'
  ) THEN
    ALTER TABLE questions ADD COLUMN cognitive_level cognitive_level_enum;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'topic_id'
  ) THEN
    ALTER TABLE questions ADD COLUMN topic_id uuid REFERENCES question_topics(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'generated_by_ai'
  ) THEN
    ALTER TABLE questions ADD COLUMN generated_by_ai boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'generation_job_id'
  ) THEN
    ALTER TABLE questions ADD COLUMN generation_job_id uuid REFERENCES ai_generation_jobs(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'reviewed'
  ) THEN
    ALTER TABLE questions ADD COLUMN reviewed boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE questions ADD COLUMN reviewed_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Create view for AI-generated questions with their topics and levels
CREATE OR REPLACE VIEW v_ai_generated_questions AS
SELECT
  q.id,
  q.statement_md,
  q.solution_md,
  q.options,
  q.correct_option,
  q.academic_level,
  q.cognitive_level,
  q.reviewed,
  q.reviewed_by,
  t.name AS topic_name,
  l.name AS level_name,
  u.email AS reviewer_email,
  q.created_at,
  q.updated_at
FROM
  questions q
LEFT JOIN question_topics t ON q.topic_id = t.id
LEFT JOIN question_levels l ON l.name = q.academic_level
LEFT JOIN profiles u ON q.reviewed_by = u.id
WHERE
  q.generated_by_ai = true
ORDER BY
  q.created_at DESC;

-- Enable RLS on new tables
ALTER TABLE question_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_history ENABLE ROW LEVEL SECURITY;

-- Define RLS policies

-- Question levels - everyone can read
CREATE POLICY "Anyone can read question levels" 
ON question_levels FOR SELECT 
TO public
USING (true);

-- Question topics - everyone can read
CREATE POLICY "Anyone can read question topics" 
ON question_topics FOR SELECT 
TO public
USING (true);

-- AI generation jobs - admins and teachers can manage
CREATE POLICY "Admins can manage AI generation jobs" 
ON ai_generation_jobs FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- AI generation history - admins and teachers can read
CREATE POLICY "Admins can read AI generation history" 
ON ai_generation_history FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- AI generation history - admins and creators can insert
CREATE POLICY "Admins can insert AI generation history" 
ON ai_generation_history FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);