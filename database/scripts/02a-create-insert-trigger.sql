DROP TRIGGER IF EXISTS trg_pdt_ai_sophieudieutri;

CREATE TRIGGER trg_pdt_ai_sophieudieutri
AFTER INSERT ON phieudieutri
FOR EACH ROW
UPDATE giasuc
SET sophieudieutri = sophieudieutri + IF(
    NEW.trangthai = 1 AND NEW.giasuc_id IS NOT NULL,
    1,
    0
)
WHERE id = NEW.giasuc_id;
