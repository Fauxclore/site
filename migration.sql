ALTER TABLE clicks ADD COLUMN t INTEGER;
UPDATE clicks SET t = CAST(strftime('%s', created_at) AS INTEGER) * 1000 WHERE t IS NULL;