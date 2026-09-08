-- ============================================================
-- PalitpurConnect
-- Enterprise-Grade Digital Village Portal
-- PostgreSQL / Neon Database Schema
-- ============================================================

BEGIN;

-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- ENUM TYPES
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'user_role'
    ) THEN
        CREATE TYPE user_role AS ENUM (
            'citizen',
            'admin',
            'staff'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'grievance_status'
    ) THEN
        CREATE TYPE grievance_status AS ENUM (
            'submitted',
            'acknowledged',
            'in_progress',
            'resolved',
            'rejected',
            'closed'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'grievance_priority'
    ) THEN
        CREATE TYPE grievance_priority AS ENUM (
            'low',
            'medium',
            'high',
            'urgent'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'announcement_category'
    ) THEN
        CREATE TYPE announcement_category AS ENUM (
            'general',
            'panchayat',
            'health',
            'education',
            'agriculture',
            'water',
            'electricity',
            'event',
            'emergency'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'otp_purpose'
    ) THEN
        CREATE TYPE otp_purpose AS ENUM (
            'email_verification',
            'password_reset'
        );
    END IF;
END
$$;


-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(255) NOT NULL,

    password_hash TEXT NOT NULL,

    role user_role NOT NULL DEFAULT 'citizen',

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    avatar_url TEXT,

    phone VARCHAR(20),

    address TEXT,

    village VARCHAR(150) DEFAULT 'Palitpur',

    district VARCHAR(150) DEFAULT 'Birbhum',

    state VARCHAR(150) DEFAULT 'West Bengal',

    last_login_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
ON users (LOWER(email));


CREATE INDEX IF NOT EXISTS users_role_idx
ON users (role);

CREATE INDEX IF NOT EXISTS users_active_idx
ON users (is_active);

CREATE INDEX IF NOT EXISTS users_created_at_idx
ON users (created_at DESC);


DROP TRIGGER IF EXISTS users_updated_at_trigger ON users;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- EMAIL OTPs
-- ============================================================

CREATE TABLE IF NOT EXISTS email_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    email VARCHAR(255) NOT NULL,

    otp_hash TEXT NOT NULL,

    purpose otp_purpose NOT NULL DEFAULT 'email_verification',

    expires_at TIMESTAMPTZ NOT NULL,

    verified_at TIMESTAMPTZ,

    attempts INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS email_otps_email_idx
ON email_otps (LOWER(email));

CREATE INDEX IF NOT EXISTS email_otps_user_id_idx
ON email_otps (user_id);

CREATE INDEX IF NOT EXISTS email_otps_expires_at_idx
ON email_otps (expires_at);

CREATE INDEX IF NOT EXISTS email_otps_purpose_idx
ON email_otps (purpose);


-- ============================================================
-- REFRESH TOKENS
-- ============================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    token_hash TEXT NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,

    revoked_at TIMESTAMPTZ,

    user_agent TEXT,

    ip_address INET,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX IF NOT EXISTS refresh_tokens_hash_idx
ON refresh_tokens (token_hash);

CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx
ON refresh_tokens (user_id);

CREATE INDEX IF NOT EXISTS refresh_tokens_expires_at_idx
ON refresh_tokens (expires_at);


-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(250) NOT NULL,

    description TEXT NOT NULL,

    category announcement_category NOT NULL DEFAULT 'general',

    image_url TEXT,

    is_published BOOLEAN NOT NULL DEFAULT TRUE,

    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    created_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS announcements_category_idx
ON announcements (category);

CREATE INDEX IF NOT EXISTS announcements_published_idx
ON announcements (is_published);

CREATE INDEX IF NOT EXISTS announcements_created_at_idx
ON announcements (created_at DESC);


DROP TRIGGER IF EXISTS announcements_updated_at_trigger
ON announcements;

CREATE TRIGGER announcements_updated_at_trigger
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- DIRECTORY ENTRIES
-- ============================================================

CREATE TABLE IF NOT EXISTS directory_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200) NOT NULL,

    category VARCHAR(100) NOT NULL,

    description TEXT,

    phone VARCHAR(30),

    email VARCHAR(255),

    address TEXT,

    image_url TEXT,

    website_url TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS directory_category_idx
ON directory_entries (category);

CREATE INDEX IF NOT EXISTS directory_active_idx
ON directory_entries (is_active);

CREATE INDEX IF NOT EXISTS directory_name_idx
ON directory_entries (LOWER(name));


DROP TRIGGER IF EXISTS directory_updated_at_trigger
ON directory_entries;

CREATE TRIGGER directory_updated_at_trigger
BEFORE UPDATE ON directory_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================

CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200) NOT NULL,

    service VARCHAR(150) NOT NULL,

    phone VARCHAR(30) NOT NULL,

    alternate_phone VARCHAR(30),

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS emergency_active_idx
ON emergency_contacts (is_active);

CREATE INDEX IF NOT EXISTS emergency_display_order_idx
ON emergency_contacts (display_order);


DROP TRIGGER IF EXISTS emergency_updated_at_trigger
ON emergency_contacts;

CREATE TRIGGER emergency_updated_at_trigger
BEFORE UPDATE ON emergency_contacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- GRIEVANCES
-- ============================================================

CREATE TABLE IF NOT EXISTS grievances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_number VARCHAR(30) NOT NULL UNIQUE,

    citizen_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    name VARCHAR(150) NOT NULL,

    mobile VARCHAR(20),

    email VARCHAR(255),

    category VARCHAR(100) NOT NULL,

    subject VARCHAR(250),

    description TEXT NOT NULL,

    location TEXT,

    image_url TEXT,

    status grievance_status NOT NULL DEFAULT 'submitted',

    priority grievance_priority NOT NULL DEFAULT 'medium',

    assigned_to UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    acknowledged_at TIMESTAMPTZ,

    resolved_at TIMESTAMPTZ,

    closed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS grievances_ticket_idx
ON grievances (ticket_number);

CREATE INDEX IF NOT EXISTS grievances_citizen_idx
ON grievances (citizen_id);

CREATE INDEX IF NOT EXISTS grievances_status_idx
ON grievances (status);

CREATE INDEX IF NOT EXISTS grievances_priority_idx
ON grievances (priority);

CREATE INDEX IF NOT EXISTS grievances_assigned_to_idx
ON grievances (assigned_to);

CREATE INDEX IF NOT EXISTS grievances_created_at_idx
ON grievances (created_at DESC);


DROP TRIGGER IF EXISTS grievances_updated_at_trigger
ON grievances;

CREATE TRIGGER grievances_updated_at_trigger
BEFORE UPDATE ON grievances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- GRIEVANCE UPDATES / TIMELINE
-- ============================================================

CREATE TABLE IF NOT EXISTS grievance_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    grievance_id UUID NOT NULL
        REFERENCES grievances(id)
        ON DELETE CASCADE,

    updated_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    status grievance_status,

    comment TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS grievance_updates_grievance_idx
ON grievance_updates (grievance_id);

CREATE INDEX IF NOT EXISTS grievance_updates_created_at_idx
ON grievance_updates (created_at DESC);


-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(100),

    entity_id UUID,

    description TEXT,

    metadata JSONB,

    ip_address INET,

    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS audit_logs_user_idx
ON audit_logs (user_id);

CREATE INDEX IF NOT EXISTS audit_logs_action_idx
ON audit_logs (action);

CREATE INDEX IF NOT EXISTS audit_logs_entity_idx
ON audit_logs (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx
ON audit_logs (created_at DESC);


-- ============================================================
-- USEFUL CLEANUP FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS VOID AS $$
BEGIN

    DELETE FROM email_otps
    WHERE expires_at < CURRENT_TIMESTAMP
      AND verified_at IS NULL;

    DELETE FROM refresh_tokens
    WHERE expires_at < CURRENT_TIMESTAMP
       OR revoked_at IS NOT NULL;

END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- DATABASE VERIFICATION
-- ============================================================

COMMENT ON TABLE users IS
'PalitpurConnect registered citizens, staff and administrators';

COMMENT ON TABLE email_otps IS
'Email verification and password reset OTP records';

COMMENT ON TABLE refresh_tokens IS
'JWT refresh token sessions';

COMMENT ON TABLE announcements IS
'Village and Panchayat announcements';

COMMENT ON TABLE directory_entries IS
'Local village services and useful contacts';

COMMENT ON TABLE emergency_contacts IS
'Emergency and essential service contacts';

COMMENT ON TABLE grievances IS
'Citizen submitted civic grievances';

COMMENT ON TABLE grievance_updates IS
'Grievance status history and administrative updates';

COMMENT ON TABLE audit_logs IS
'Administrative and security audit trail';


COMMIT;


-- ============================================================
-- FINAL CHECK
-- ============================================================

SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;




-- Drop table if you need a clean reset (Optional: remove this line if your table already exists and you just want to update it)
-- DROP TABLE IF EXISTS landing_content;

CREATE TABLE IF NOT EXISTS landing_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'hero_main', 'community_section', 'villages_section', 'culture_section'
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  image_url TEXT, -- stores the path of the uploaded file e.g. '/uploads/172345678-banner.jpg'
  metadata JSONB, -- stores extra structured data if needed for stats or tags
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert initial default records so the landing page displays content immediately before any admin edits
INSERT INTO landing_content (section_key, title, subtitle) 
VALUES 
  ('hero_main', 'Welcome to Palitpur.', 'A connected digital gateway to our villages, people, heritage, culture, and civic services — built to bring Palitpur closer together.'),
  ('community_section', 'A village connected by people', 'Palitpur is more than a collection of villages. It is a community built on relationships, traditions, cooperation, and shared responsibility.'),
  ('villages_section', 'The places we call home', 'Every locality has its own character, stories, traditions, and community spirit. Discover the places that make Palitpur unique.'),
  ('culture_section', 'Stories, traditions & heritage', 'Palitpurs identity lives in its traditions, festivals, everyday community life, places of heritage, and the stories passed from one generation to the next.')
ON CONFLICT (section_key) DO NOTHING;