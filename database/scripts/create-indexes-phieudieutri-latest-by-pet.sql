-- Admin:
-- WHERE giasuc_id = ? AND trangthai = 1
-- ORDER BY ngaytao DESC, id DESC LIMIT 1
CREATE INDEX idx_pdt_pet_status_date
ON phieudieutri (giasuc_id, trangthai, ngaytao, id);

-- Non-admin:
-- WHERE giasuc_id = ? AND trangthai = 1 AND option = 0
-- ORDER BY ngaytao DESC, id DESC LIMIT 1
CREATE INDEX idx_pdt_pet_status_option_date
ON phieudieutri (giasuc_id, trangthai, option, ngaytao, id);

ANALYZE TABLE phieudieutri;

SHOW INDEX FROM phieudieutri
WHERE Key_name IN (
    'idx_pdt_pet_status_date',
    'idx_pdt_pet_status_option_date'
);
