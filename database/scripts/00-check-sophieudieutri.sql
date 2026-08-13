-- Chỉ đọc: kiểm tra hiện trạng trước migration.

SELECT VERSION() AS mysql_version, DATABASE() AS database_name;

SELECT
    COUNT(*) AS total_treatments,
    SUM(trangthai = 1) AS active_treatments,
    SUM(trangthai = 0) AS inactive_treatments
FROM phieudieutri;

SELECT
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'giasuc'
  AND COLUMN_NAME = 'sophieudieutri';

SELECT
    TRIGGER_NAME,
    EVENT_MANIPULATION,
    ACTION_TIMING
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = DATABASE()
  AND TRIGGER_NAME IN (
      'trg_pdt_ai_sophieudieutri',
      'trg_pdt_ad_sophieudieutri',
      'trg_pdt_au_sophieudieutri_decrement',
      'trg_pdt_au_sophieudieutri_increment'
  );
