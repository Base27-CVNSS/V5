# H3 vs S2 vs V5-32 — Ma trận lựa chọn GIS/WebGIS/GeoAI

**Research reference:** V5 1.0.0 · Long Ngo 2026 · Vietflexmap Copyright (c) 2025 · Apache-2.0  
**Bản web:** [Chứng minh dạng yếu và so sánh H3/S2/V5](../mathematical-proof.html#weak)  
**Độ chín:** H3/S2 là công cụ geospatial đang có API; V5 là prototype phân hoạch yếu và codec 64-bit, **không** là DGGS vận hành.

## 1. So sánh các yếu tố nền tảng

| Tiêu chí | H3 | S2 | V5-32 |
| --- | --- | --- | --- |
| Đa giác | Chủ yếu lục giác, 12 ngũ giác/cấp | Tứ giác cầu | Ngũ giác đơn (có thể lõm) |
| Ô gốc | 122 | 6 | 12 |
| Phân nhánh | Aperture 7; ngũ giác H3 có 6 con hợp lệ | 4 | 32 trong prototype |
| Độ sâu | 0–15 | 0–30 | 0–10 theo V5-64 v1 |
| CellID | 64-bit H3Index | 64-bit S2CellId, Hilbert curve | 64-bit phiên bản 1 / 4+4+6+50 |
| Bao hàm cha/con | Chính xác về chỉ mục logic, chỉ xấp xỉ về biên địa lý | Hình học phân cấp | Hình học phân hoạch yếu (chưa edge-to-edge toàn cầu) |
| Hàng xóm | Hex điển hình 6 láng giềng cạnh | Quad điển hình 4 cạnh | 5 cạnh, **không chắc 5 ô lân cận** nếu có nút treo |
| Diện tích tuyệt đối bằng nhau | Không | Không | Chưa chứng minh |
| Chuyển đổi tọa độ, neighbors, covering | Đã triển khai | Đã triển khai | Chưa có API toàn cầu được kiểm chứng |
| Tốc độ / GPU | Có thể benchmark bằng thư viện thực thi | Có thể benchmark bằng thư viện thực thi | Chưa benchmark; không có kết luận vượt trội |

**Chú ý:** Các cấp cùng số (r=5) giữa ba hệ không đồng nghĩa cùng độ phân giải theo diện tích hoặc đường kính, không được so tốc độ trực tiếp khi chưa chuẩn hóa.

## 2. Khi nào chọn công nghệ nào?

| Bài toán | Khuyến nghị trước mắt | Lý do | Chú ý |
| --- | --- | --- | --- |
| Hotspot ngập, AQI, cảm biến, heatmap | **H3** | API ô/lân cận/aggregations trưởng thành | Area-weighting, chọn ô theo kích thước thực |
| Polygon coverage, lọc vùng, truy vấn địa chính | **S2** cùng GIS vector chuẩn | Bao phủ nhiều cấp, containment chặt | Cell cover không thay thế biên pháp lý |
| Dữ liệu quan sát với API web/mobile GIS | **H3/S2** | Có geolocation và geometry thực thi | Map rendering (MapLibre/PMTiles) là tầng khác |
| Cell graph ngũ giác, pentagonal world model | **V5 nghiên cứu** | Cấu trúc 5 cạnh + 32-way là vấn đề hình học mới | Chưa có strong convex conforming grid |
| IoT edge hoặc lưu ID 8 byte | **Chọn theo CPU, RAM, battery benchmark** | Cả ba có 64-bit | 8 byte/ID không chứng minh nhanh hơn |
| GPU, AI spatial tokens | **So benchmark trên cùng workload** | Dữ liệu/memory, sampling và neighbor cost quyết định | Tránh one-hot toàn cầu; model dùng loss có trọng số diện tích |

## 3. Giải thích chuẩn xác vì sao V5 dùng unsigned 64-bit

V5-32 phân chia mỗi ô thành đúng 32 ô con trong mô hình dạng yếu. Do đó để chọn một ô con:

\[
\log_2(32)=5\text{ bit}.
\]

Phiên bản mã hóa hiện hành sử dụng:

\[
\underbrace{4}_{\rm version}+
\underbrace{4}_{\rm resolution}+
\underbrace{6}_{\rm root}+
\underbrace{50}_{\rm path}
=64\text{ bit}.
\]

- **Version:** chỉ mã wire-format **1** là hợp lệ trong codec hiện hành.
- **Resolution:** 0–10, vì **10 × 5 = 50** bit đường dẫn.
- **Root:** 0–11, 12 mặt ngũ giác gốc hình mười hai mặt.
- **Path:** dãy chữ số 0–31, left-aligned, padding chưa dùng phải bằng **0**.

Công thức:

\[
ID=(1\ll60)\;|\;(r\ll56)\;|\;(root\ll50)\;|\;
\bigvee_{i=1}^{r}\left(d_i\ll(50-5i)\right).
\]

Ví dụ đúng theo codec:

- \`root=0, path=[]\` → \`0x1000000000000000\`
- \`root=7, path=[2,0,4]\` → \`0x131c402000000000\`

**Vì sao không dùng 32-bit?** 12 root cần tối thiểu 4 bit và 10 cấp × 5 bit = 50 bit đường dẫn, tổng ít nhất 54 bit trước khi mã hóa version và resolution; một UInt32 không thể mã hóa duy nhất toàn bộ dãy địa chỉ này.

**Vì sao không tự động dùng 128-bit?** UInt64 là kiểu lưu trữ 8 byte quen thuộc với CPU, database và các hệ xử lý dữ liệu. 128-bit có thể chứa cấp sâu hơn nhưng tăng chi phí truyền tải/bộ nhớ và quản trị schema. Quyết định cần số liệu thực nghiệm.

**Vì sao không mặc nhiên nhanh hơn H3 và S2?** Cả H3 và S2 cũng dùng UInt64. Tốc độ toàn hệ phụ thuộc geodesic lookup, adjacency, geometry decoding, cache behavior, IO, GPU kernel và accuracy. Cần benchmark trên tập bài toán định nghĩa trước.

**Bảo toàn số nguyên:** Python dùng \`int\`, Arrow/Parquet dùng \`UInt64\`, JavaScript dùng \`BigInt\` hoặc hex string cố định. JSON number không thể truyền an toàn mọi số nguyên 64-bit. CellID không thay thế \`EntityID\` bất biến cho công trình/thửa đất/thiết bị, cũng không mã hóa bảo mật.

## 4. Tiêu chuẩn để tuyên bố V5 tốt hơn

Với cùng workload, cùng hệ tọa độ, sai số cho phép, cùng phần cứng và ngân sách bộ nhớ, chọn hàm chi phí chuẩn hóa \`J(system)\`. V5 chỉ thắng nếu đạt toàn bộ điều kiện đúng đắn và \`J(V5)<J(H3)\`, \`J(V5)<J(S2)\` đối với các đối thủ khả thi. Đây là **định nghĩa quyết định**, không phải benchmark đã được thực hiện.

## 5. Tài liệu nguồn

- [H3 cell statistics và 12 pentagons per resolution](https://h3geo.org/docs/core-library/restable/)
- [H3 logical vs geometric containment](https://h3geo.org/docs/highlights/indexing/)
- [H3 64-bit index](https://h3geo.org/docs/core-library/h3Indexing/)
- [S2 Cells — 6 root faces, four children, 64-bit, Hilbert](https://s2geometry.io/devguide/s2cell_hierarchy)
- [S2 precise area and approximate area](https://github.com/google/s2geometry/blob/master/src/s2/s2cell.h)
- [V5-64 codec](../src/v5id.py) · [V5 mathematical proof](PROOF.md) · [Full English technical specification](TECHNICAL_SPEC_EN.md)

**Scientific integrity:** V5 Research Reference 1.0.0 không có nghĩa V5 đã là DGGS toàn cầu hoàn chỉnh. Kết quả hình học vững chắc hiện tại là phân chia **yếu** 32 ô/cha và phép chuyển tôpô lên mặt cầu. Các điều kiện lồi cầu, khớp cạnh và tốc độ ưu việt còn nghiên cứu.

## 6. Entropy 77,4% và Spatial DNA: không phải ưu thế độc quyền của V5

Tỷ lệ **77,4% = log₂(5)/3** phát sinh nếu mã hóa một **cây 5 con giả định** trong nhóm 3 bit. Nó **không** áp dụng lên codec **V5-32** hiện có, vì tất cả 32 giá trị trong 5 bit đều có nghĩa. Một đường dẫn 15 cấp của cây 5 con chiếm 45 bit ở dạng từng chữ số nhưng có thể nén thành **35 bit** dạng rank base-5, giúp tiết kiệm **10 bit sau khi mã hóa lại**; không có 15 bit "chữ ký" tự sinh.

V5 đề xuất [Spatial DNA sidecar v0.1](SPATIAL_DNA_V0_1.md) tùy chọn **54 byte**, tách khỏi CellID 8 byte, phục vụ metadata theo cấp, CRC32 phát hiện lỗi và HMAC-SHA256/128 kiểm tra nội dung sidecar. Chưa có mã hóa bí mật, quyền truy cập, chữ ký đa tác giả, ECC sửa lỗi hoặc tự hồi phục. H3 và S2 cũng có thể triển khai sidecar an toàn tương tự.

| Vấn đề | H3 | S2 | V5 v1 + Spatial DNA v0.1 |
| --- | --- | --- | --- |
| Chỉ số 64-bit | Có | Có | Có, path base-32 5 bit/nhánh |
| Có 22,6% bit dư do 5 lựa chọn trong 3 bit? | Không phải cấu trúc mã hóa H3 | Không phải cấu trúc mã hóa S2 | **Không** — chỉ trong **cây 5-way thay thế** |
| Kết hợp metadata/provenance bên ngoài | Có thể | Có thể | Có thể; sidecar thử nghiệm đã được viết |
| CRC32 phát hiện lỗi | Có thể kết hợp | Có thể kết hợp | Có trong sidecar, **không sửa lỗi** |
| Xác thực HMAC | Có thể kết hợp | Có thể kết hợp | Có prototype trên metadata, **không mã hóa dữ liệu** |
| Phục hồi/ECC, ACL, lịch sử đáng tin cậy | Phụ thuộc ứng dụng | Phụ thuộc ứng dụng | **Chưa triển khai** trong bản V5 này |

**Kết luận triển khai:** nếu dùng kho dữ liệu cực lớn chỉ lưu ID, giữ khóa uint64 đơn thuần; chỉ bổ sung sidecar cho các bản ghi cần gắn dấu vết/tính toàn vẹn. Muốn chứng minh V5 có lợi thế cần benchmark tổng dung lượng và chi phí CPU/GPU trên workload cụ thể, không lấy tỷ lệ 22,6% làm benchmark.
