CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE appointment_type AS ENUM ('online_consultation', 'home_visit');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');

-- Patients
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    date_of_birth DATE,
    gender gender,
    address TEXT,
    pin_code VARCHAR(6),
    city VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Doctors for online consultations
CREATE TABLE vaidyas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    qualification TEXT NOT NULL,
    specializations TEXT[],
    experience_years SMALLINT,
    bio TEXT,
    consultation_fee_paise INT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    profile_photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Therapists for Panchkarma home visits
CREATE TABLE therapists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    qualification TEXT NOT NULL,
    therapies_offered TEXT[] NOT NULL,
    experience_years SMALLINT,
    bio TEXT,
    visit_fee_paise INT NOT NULL,
    service_pin_codes VARCHAR(6)[] NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    profile_photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    appointment_type appointment_type NOT NULL,
    vaidya_id UUID REFERENCES vaidyas(id),
    therapist_id UUID REFERENCES therapists(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes SMALLINT NOT NULL DEFAULT 30,
    status appointment_status NOT NULL DEFAULT 'pending',
    patient_notes TEXT,
    address TEXT,
    pin_code VARCHAR(6),
    amount_paise INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT exactly_one_provider CHECK (
        (appointment_type = 'online_consultation' AND vaidya_id IS NOT NULL AND therapist_id IS NULL)
        OR
        (appointment_type = 'home_visit' AND therapist_id IS NOT NULL AND vaidya_id IS NULL)
    ),
    CONSTRAINT home_visit_needs_address CHECK (
        appointment_type != 'home_visit' OR (address IS NOT NULL AND pin_code IS NOT NULL)
    )
);

CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_vaidya ON appointments(vaidya_id) WHERE vaidya_id IS NOT NULL;
CREATE INDEX idx_appointments_therapist ON appointments(therapist_id) WHERE therapist_id IS NOT NULL;
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_therapists_pin_codes ON therapists USING GIN(service_pin_codes);
