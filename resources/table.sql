
CREATE TABLE IF NOT EXISTS _config (
    name VARCHAR PRIMARY KEY,
    value_data TEXT
);

-- Create a hash index on the name column
CREATE INDEX ON _config USING HASH (name);