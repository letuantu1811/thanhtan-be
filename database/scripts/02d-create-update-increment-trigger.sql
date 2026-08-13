DROP TRIGGER IF EXISTS trg_pdt_au_sophieudieutri_increment;

CREATE TRIGGER trg_pdt_au_sophieudieutri_increment
AFTER UPDATE ON phieudieutri
FOR EACH ROW
UPDATE giasuc
SET sophieudieutri = sophieudieutri + IF(NEW.trangthai = 1, 1, 0)
WHERE id = NEW.giasuc_id;
