# Đồng bộ `giasuc.sophieudieutri`

Mục tiêu: lưu sẵn số phiếu điều trị đang hoạt động (`phieudieutri.trangthai = 1`)
trên mỗi thú cưng để không phải `COUNT/GROUP BY` khi tải danh sách.

## Thứ tự chạy

Chạy trên môi trường thử nghiệm trước, sau đó mới chạy production:

```bash
mysql -h <host> -u <user> -p <database> < database/scripts/00-check-sophieudieutri.sql
mysql -h <host> -u <user> -p <database> < database/scripts/01-add-and-backfill-sophieudieutri.sql
mysql -h <host> -u <user> -p <database> < database/scripts/02a-create-insert-trigger.sql
mysql -h <host> -u <user> -p <database> < database/scripts/02b-create-delete-trigger.sql
mysql -h <host> -u <user> -p <database> < database/scripts/02c-create-update-decrement-trigger.sql
mysql -h <host> -u <user> -p <database> < database/scripts/02d-create-update-increment-trigger.sql
mysql -h <host> -u <user> -p <database> < database/scripts/03-verify-sophieudieutri.sql
```

Không chạy nhiều file song song. File `01` thực hiện `ALTER TABLE` và cập nhật toàn bộ
pet nên nên chạy ngoài giờ cao điểm. Trong khoảng giữa file `01` và `02`, hạn chế tạo,
sửa hoặc xóa phiếu điều trị để bộ đếm không bị lệch.

Nếu dùng DBeaver, hãy mở và chạy từng file theo đúng thứ tự. Mỗi trigger chỉ chứa một
câu lệnh nên không cần `DELIMITER`.

Sau file `03`, kết quả `mismatched_rows` phải bằng `0`.

## Query sử dụng sau migration

Chỉ lấy pet có phiếu đang hoạt động:

```sql
SELECT giasuc.id
FROM giasuc
WHERE giasuc.trangthai = 1
  AND giasuc.sophieudieutri > 0
ORDER BY giasuc.ngaytao DESC, giasuc.id DESC;
```

Hiển thị tất cả pet và đẩy pet có phiếu lên trước:

```sql
SELECT giasuc.id, giasuc.sophieudieutri
FROM giasuc
WHERE giasuc.trangthai = 1
ORDER BY
    CASE WHEN giasuc.sophieudieutri > 0 THEN 0 ELSE 1 END,
    giasuc.ngaytao DESC,
    giasuc.id DESC;
```

## Rollback

`99-rollback-sophieudieutri.sql` xóa bốn trigger và cột vừa thêm. Chỉ chạy khi thật
sự muốn hoàn tác migration; dữ liệu trong cột sẽ bị mất.

```bash
mysql -h <host> -u <user> -p <database> < database/scripts/99-rollback-sophieudieutri.sql
```
