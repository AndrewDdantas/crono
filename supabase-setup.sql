-- =============================================
-- Cronoanalise - Supabase Database Setup
-- =============================================
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: operations
-- =============================================
CREATE TABLE operations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  config JSONB DEFAULT '{
    "fatigue": 10,
    "shiftHours": 8,
    "shiftsPerDay": 1,
    "targetPieces": 1000,
    "month": 0,
    "year": 2026,
    "includeSaturday": false,
    "includeSunday": false
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for operations
CREATE POLICY "Users can view own operations"
  ON operations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own operations"
  ON operations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own operations"
  ON operations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own operations"
  ON operations FOR DELETE
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_operations_user_id ON operations(user_id);

-- =============================================
-- TABLE: processes
-- =============================================
CREATE TABLE processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operation_id UUID REFERENCES operations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  measurement_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for processes
CREATE POLICY "Users can view processes in own operations"
  ON processes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM operations
      WHERE operations.id = processes.operation_id
      AND operations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert processes in own operations"
  ON processes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM operations
      WHERE operations.id = processes.operation_id
      AND operations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update processes in own operations"
  ON processes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM operations
      WHERE operations.id = processes.operation_id
      AND operations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete processes in own operations"
  ON processes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM operations
      WHERE operations.id = processes.operation_id
      AND operations.user_id = auth.uid()
    )
  );

-- Index for performance
CREATE INDEX idx_processes_operation_id ON processes(operation_id);

-- =============================================
-- TABLE: measurements
-- =============================================
CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE NOT NULL,
  time_ms BIGINT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for measurements
CREATE POLICY "Users can view measurements in own processes"
  ON measurements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM processes p
      JOIN operations o ON o.id = p.operation_id
      WHERE p.id = measurements.process_id
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert measurements in own processes"
  ON measurements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM processes p
      JOIN operations o ON o.id = p.operation_id
      WHERE p.id = measurements.process_id
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete measurements in own processes"
  ON measurements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM processes p
      JOIN operations o ON o.id = p.operation_id
      WHERE p.id = measurements.process_id
      AND o.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_measurements_process_id ON measurements(process_id);
CREATE INDEX idx_measurements_recorded_at ON measurements(recorded_at);

-- =============================================
-- TRIGGER: Auto-update measurement_count
-- =============================================
CREATE OR REPLACE FUNCTION update_measurement_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE processes
    SET measurement_count = measurement_count + 1,
        updated_at = NOW()
    WHERE id = NEW.process_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE processes
    SET measurement_count = GREATEST(measurement_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.process_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_measurement_count
AFTER INSERT OR DELETE ON measurements
FOR EACH ROW
EXECUTE FUNCTION update_measurement_count();

-- =============================================
-- TRIGGER: Auto-update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_operations_updated_at
BEFORE UPDATE ON operations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processes_updated_at
BEFORE UPDATE ON processes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DONE! 
-- =============================================
-- Agora configure o .env.local com suas credenciais
