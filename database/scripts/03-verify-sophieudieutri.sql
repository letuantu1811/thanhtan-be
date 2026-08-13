-- mismatched_rows phải bằng 0.

SELECT COUNT(*) AS mismatched_rows
FROM (
    SELECT
        giasuc.id,
        giasuc.sophieudieutri,
        COUNT(phieudieutri.id) AS actual_total
    FROM giasuc
    LEFT JOIN phieudieutri
        ON phieudieutri.giasuc_id = giasuc.id
       AND phieudieutri.trangthai = 1
    GROUP BY giasuc.id, giasuc.sophieudieutri
    HAVING giasuc.sophieudieutri <> actual_total
) AS mismatches;

SELECT
    giasuc.id,
    giasuc.ten,
    giasuc.sophieudieutri,
    COUNT(phieudieutri.id) AS actual_total
FROM giasuc
LEFT JOIN phieudieutri
    ON phieudieutri.giasuc_id = giasuc.id
   AND phieudieutri.trangthai = 1
GROUP BY giasuc.id, giasuc.ten, giasuc.sophieudieutri
HAVING giasuc.sophieudieutri <> actual_total
LIMIT 100;

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
  )
ORDER BY EVENT_MANIPULATION;
