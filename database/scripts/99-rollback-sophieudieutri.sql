-- CẢNH BÁO: xóa trigger và toàn bộ dữ liệu trong cột sophieudieutri.

DROP TRIGGER IF EXISTS trg_pdt_ai_sophieudieutri;
DROP TRIGGER IF EXISTS trg_pdt_ad_sophieudieutri;
DROP TRIGGER IF EXISTS trg_pdt_au_sophieudieutri;
DROP TRIGGER IF EXISTS trg_pdt_au_sophieudieutri_decrement;
DROP TRIGGER IF EXISTS trg_pdt_au_sophieudieutri_increment;

ALTER TABLE giasuc
    DROP COLUMN sophieudieutri;
