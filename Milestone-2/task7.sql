\echo 'Dropping report_user if it exists'

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'report_user'
  ) THEN
    -- Drop all objects the user owns first
    REASSIGN OWNED BY report_user TO CURRENT_USER;
    DROP OWNED BY report_user;
    EXECUTE 'DROP ROLE report_user';
    RAISE NOTICE 'report_user dropped.';
  ELSE
    RAISE NOTICE 'report_user does not exist.';
  END IF;
END
$$;

\echo 'Creating report_user'

DO $$
BEGIN
  CREATE ROLE report_user WITH LOGIN PASSWORD 'StrongP@ssw0rd!';
  RAISE NOTICE 'report_user created.';
END
$$;

\echo 'Granting privileges on users table'
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO report_user;

\echo '=================================================='
