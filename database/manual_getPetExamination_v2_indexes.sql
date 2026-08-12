-- Manual DBA script for GET /api/client/examination/getPetExamination_v2
-- Production engine inspected: MariaDB 10.6 / InnoDB
-- IMPORTANT: back up first and execute manually, one ALTER TABLE at a time.
-- This file is never executed by the Node.js application.

-- ---------------------------------------------------------------------------
-- 1. PREFLIGHT (read-only)
-- ---------------------------------------------------------------------------

SELECT VERSION() AS database_version;

SHOW TABLE STATUS WHERE Name IN ('giasuc', 'phieudieutri');

SHOW INDEX FROM phieudieutri;
SHOW INDEX FROM giasuc;

-- Stop here if an existing index already has the same leading columns:
--   phieudieutri: (giasuc_id, trangthai, option)
--   giasuc:        (trangthai, ngaytao, id)

-- ---------------------------------------------------------------------------
-- 2. APPLY (write/DDL) - run in a low-traffic window
-- ---------------------------------------------------------------------------

ALTER TABLE phieudieutri
    ADD INDEX idx_pdt_pet_status_option (giasuc_id, trangthai, option),
    ALGORITHM=INPLACE,
    LOCK=NONE;

-- Verify the first index before continuing.
SHOW INDEX FROM phieudieutri
WHERE Key_name = 'idx_pdt_pet_status_option';

ALTER TABLE giasuc
    ADD INDEX idx_giasuc_status_created_id (trangthai, ngaytao, id),
    ALGORITHM=INPLACE,
    LOCK=NONE;

-- Verify the second index.
SHOW INDEX FROM giasuc
WHERE Key_name = 'idx_giasuc_status_created_id';

-- Refresh optimizer statistics after both indexes exist.
ANALYZE TABLE phieudieutri, giasuc;

-- ---------------------------------------------------------------------------
-- 3. VERIFY QUERY PLANS (read-only; do not use EXPLAIN ANALYZE on production)
-- ---------------------------------------------------------------------------

-- ADMIN / MANAGER pagination query.
EXPLAIN
SELECT giasuc.id, COUNT(*) OVER() AS total
FROM giasuc
INNER JOIN (
    SELECT pdt.giasuc_id
    FROM phieudieutri AS pdt
    WHERE pdt.trangthai = 1
    GROUP BY pdt.giasuc_id
) AS eligible_treatments
    ON eligible_treatments.giasuc_id = giasuc.id
WHERE giasuc.trangthai = 1
ORDER BY giasuc.ngaytao DESC
LIMIT 20 OFFSET 0;

-- USER pagination query.
EXPLAIN
SELECT giasuc.id, COUNT(*) OVER() AS total
FROM giasuc
INNER JOIN (
    SELECT pdt.giasuc_id
    FROM phieudieutri AS pdt
    WHERE pdt.trangthai = 1 AND pdt.option = 0
    GROUP BY pdt.giasuc_id
    HAVING COUNT(pdt.id) > 1
) AS eligible_treatments
    ON eligible_treatments.giasuc_id = giasuc.id
WHERE giasuc.trangthai = 1
ORDER BY giasuc.ngaytao DESC
LIMIT 20 OFFSET 0;

-- Treatment detail query pattern. Replace IDs with a recent page if needed.
EXPLAIN
SELECT *
FROM phieudieutri
WHERE giasuc_id IN (10173, 10172, 10171)
  AND trangthai = 1;

-- ---------------------------------------------------------------------------
-- 4. ROLLBACK (write/DDL) - only run if rollback is required
-- ---------------------------------------------------------------------------

-- Run individually and only when SHOW INDEX confirms that the index exists.
-- ALTER TABLE phieudieutri
--     DROP INDEX idx_pdt_pet_status_option,
--     ALGORITHM=INPLACE,
--     LOCK=NONE;

-- ALTER TABLE giasuc
--     DROP INDEX idx_giasuc_status_created_id,
--     ALGORITHM=INPLACE,
--     LOCK=NONE;
