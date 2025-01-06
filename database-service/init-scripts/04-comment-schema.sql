\c comment_db

-- Enable postgres_fdw
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- comments table 
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    blog_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_blog_id ON comments(blog_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- Create server connection to user_db
CREATE SERVER user_db_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'database', dbname 'user_db');

-- Create server connection to blog_db
CREATE SERVER blog_db_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'database', dbname 'blog_db');

-- Create user mappings
CREATE USER MAPPING FOR admin
SERVER user_db_server
OPTIONS (user 'admin', password 'abc@123');

CREATE USER MAPPING FOR admin
SERVER blog_db_server
OPTIONS (user 'admin', password 'abc@123');

-- Create foreign tables
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

CREATE FOREIGN TABLE blogs_reference (
    id INTEGER,
    title VARCHAR(255),
    content TEXT,
    user_id INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
SERVER blog_db_server
OPTIONS (schema_name 'public', table_name 'blogs');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin;