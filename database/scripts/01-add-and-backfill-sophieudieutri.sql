-- Chạy một lần. File sẽ báo lỗi nếu cột đã tồn tại; khi đó hãy chạy file 00 để kiểm tra.

ALTER TABLE giasuc
    ADD COLUMN sophieudieutri INT UNSIGNED NOT NULL DEFAULT 0;

UPDATE giasuc
LEFT JOIN (
    SELECT
        giasuc_id,
        COUNT(*) AS total
    FROM phieudieutri
    WHERE trangthai = 1
      AND giasuc_id IS NOT NULL
    GROUP BY giasuc_id
) AS active_treatments ON active_treatments.giasuc_id = giasuc.id
SET giasuc.sophieudieutri = COALESCE(active_treatments.total, 0);

SELECT
    COUNT(*) AS total_pets,
    SUM(sophieudieutri > 0) AS pets_with_active_treatments,
    SUM(sophieudieutri) AS active_treatments_recorded
FROM giasuc;
