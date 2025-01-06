\c blog_db

CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- blogs table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blogs_user_id ON blogs(user_id);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);

-- Create server connection to user_db
CREATE SERVER user_db_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'database', dbname 'user_db');

-- Create user mapping
CREATE USER MAPPING FOR admin
SERVER user_db_server
OPTIONS (user 'admin', password 'abc@123');

-- Create foreign table for users
CREATE FOREIGN TABLE users_reference (
    id INTEGER,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
SERVER user_db_server
OPTIONS (schema_name 'public', table_name 'users');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin;