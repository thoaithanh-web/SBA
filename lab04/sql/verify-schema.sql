SELECT TABLE_NAME,COLUMN_NAME,DATA_TYPE,IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME IN ('orchids','orchid_categories');
SELECT name,OBJECT_NAME(parent_object_id) AS source_table,OBJECT_NAME(referenced_object_id) AS target_table FROM sys.foreign_keys WHERE parent_object_id=OBJECT_ID('orchids');
SELECT orchid_id,orchid_name,category_id FROM orchids;
SELECT category_id,category_name FROM orchid_categories;
