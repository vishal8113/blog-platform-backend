/* 
Future migration for nested comments structure:

-- Add parent_id column
ALTER TABLE comments
ADD COLUMN parent_id INTEGER REFERENCES comments(id);

-- Add index for better performance
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Optional: Add path column for easier tree traversal
ADD COLUMN path INTEGER[];
CREATE INDEX idx_comments_path ON comments USING GIN (path);
*/