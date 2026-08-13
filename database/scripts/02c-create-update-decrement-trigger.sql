DROP TRIGGER IF EXISTS trg_pdt_au_sophieudieutri_decrement;

CREATE TRIGGER trg_pdt_au_sophieudieutri_decrement
AFTER UPDATE ON phieudieutri
FOR EACH ROW
UPDATE giasuc
SET sophieudieutri = GREATEST(
    sophieudieutri - IF(OLD.trangthai = 1, 1, 0),
    0
)
WHERE id = OLD.giasuc_id;
