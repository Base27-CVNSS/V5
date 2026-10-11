# V5-32 · 50 bài toán nghiên cứu GIS, WebGIS, GeoAI, LLM Spatial, SLAM, LiDAR, BIM

**V5 Research Reference 1.0.0 · Long Ngo 2026 · Vietflexmap Copyright (c) 2025 · Apache-2.0**

**Website:** [50 bài toán tương tác](../use-cases.html) · **Lý thuyết:** [Chứng minh V5-32](../mathematical-proof.html#weak) · **Đặc tả:** [Technical Specification EN](TECHNICAL_SPEC_EN.md)

> **Phạm vi:** 50 kịch bản sau là đề xuất nghiên cứu và ví dụ thử nghiệm, không phải 50 ứng dụng đang hoạt động. V5-64 phiên bản 1 chỉ triển khai khóa phân cấp và phân hoạch ngũ giác *dạng yếu* (có thể lõm, chưa khớp cạnh). Mọi kết luận về ưu thế so với H3/S2 đều cần cùng dữ liệu, độ chính xác và benchmark.

## Điều chỉnh bốn giả định ban đầu

| Giả định | Trạng thái khoa học đúng trong V5-32 v1 |
| --- | --- |
| “Đồng nhất diện tích tuyệt đối, sai lệch 0%” | **Chưa chứng minh.** Cần có hàm diện tích thực, error budget và kiểm thử; [OGC Equal-Area Earth DGGS](https://docs.ogc.org/as/20-040r3/20-040r3.html) định nghĩa ngân sách sai số cho ô, không phải lời hứa kết quả số 0 tuyệt đối. |
| “Tất cả ô đều có đúng năm láng giềng” | **Sai với phân hoạch yếu có hanging nodes.** Chỉ kỳ vọng khi có lưới toàn ngũ giác thực sự edge-to-edge, không suy được từ năm cạnh đơn thuần. |
| “32 cấp, chia thành 5 con” | **Không phù hợp mã nguồn hiện tại.** V5-32 chia **32 con/cha**, chữ số đường dẫn **5 bit**, CellID v1 lưu **tối đa 10 cấp**. |
| “UInt64 làm V5 tự động nhanh hơn H3/S2” | **Chưa chứng minh.** H3 và S2 cũng có UInt64; phải đo đúng workload sau khi có engine địa lý. |

**Đối chiếu prior art quan trọng:** [A5](https://a5geo.org/docs) đã triển khai lưới ngũ giác toàn cầu với mô tả equal-area theo OGC, 31 resolution levels và số nguyên 64-bit. Do đó các ý tưởng này không phải phát minh riêng của V5; bài toán V5 cần phát triển khác biệt bằng thuật toán 32-child có chứng nhận toán học và benchmark rõ ràng.

### Chú giải cổng triển khai

- **Codec demo:** có thể minh họa quan hệ cây và số nguyên 64-bit bằng dữ liệu giả lập; luồng GIS hoàn chỉnh vẫn chưa có.
- **GIS toàn cầu:** cần geodetic atlas, WGS84 lookup, polygon geometry và/hoặc diện tích ô.
- **Đồ thị lân cận:** cần chuẩn topology, edge-to-edge hoặc phép tính shared-boundary thật.
- **3D/local frame:** cần Z, voxel/mesh, transforms và frames cho SLAM, LiDAR, BIM.
- **Mô hình AI:** cần huấn luyện, dữ liệu, đánh giá, uncertainty và pipeline thực.

## I. GIS & Phân tích không gian (1–10)

| # / Bài toán | Dữ liệu cần | Cách V5 tham gia / giả thuyết | Điều kiện và phép đo bắt buộc |
| --- | --- | --- | --- |
| **1. Mật độ dân số toàn cầu** | Raster dân số + địa giới | Gán dân số theo giao diện tích với ô; mật độ = người/km². **Giả thuyết:** Cây đa tỷ lệ hỗ trợ tổng hợp; không cần equal-area nếu chia đúng diện tích. | Cần V5 lat/lon→cell, diện tích ô và polygon overlay. **Đánh giá:** Sai lệch mật độ theo vĩ độ; MAE so với GIS chuẩn. |
| **2. Tỷ lệ thất nghiệp theo tỉnh** | Số thất nghiệp, lực lượng lao động, ranh giới | Tính tỷ lệ từ tổng tử số/tổng mẫu số trên các ô giao vùng. **Giả thuyết:** Chỉ mục phân cấp hỗ trợ roll-up, không được trung bình tỷ lệ ô trực tiếp. | Cần thống kê ranh giới và mẫu số; equal-area không giải quyết thiên lệch mẫu. **Đánh giá:** Sai lệch tỷ lệ, bảo toàn mẫu số. |
| **3. Biến đổi khí hậu theo ô** | ERA5/CMIP, nhiệt độ, mưa, thời gian | Resample có trọng số diện tích; cộng lượng và trung bình biến cường độ. **Giả thuyết:** Địa chỉ cây dùng làm khóa dữ liệu đa độ phân giải. | Cần diện tích trắc địa và bộ xử lý thời gian; mô hình hình học chưa có. **Đánh giá:** RMSE khí hậu; bảo toàn tích phân mưa. |
| **4. Biến động rừng theo thời gian** | Sentinel/Landsat, lớp rừng, ngày | Cắt raster theo footprint ô, tính ha rừng mất/rừng phục hồi. **Giả thuyết:** Khóa không gian-thời gian và roll-up parent. | Cần overlay raster/vector; nhãn pixel và cloud mask chuẩn. **Đánh giá:** IoU; sai lệch ha rừng; uncertainty. |
| **5. Năng suất nông nghiệp** | Ranh giới ruộng, sản lượng, diện tích | Phân bổ sản lượng theo thửa và tính tấn/ha. **Giả thuyết:** Tập hợp đa cấp dùng chung đường dẫn CellID. | Cần area-weighting; ruộng không khớp biên ô. **Đánh giá:** RMSE tấn/ha so với diện tích thửa. |
| **6. Dịch tễ học theo không gian** | Ca bệnh đã ẩn danh, dân số, thời gian | Tính ca/100.000 người; smoothing theo dân số và thời gian. **Giả thuyết:** Chia cấp giúp phân tích nhiều quy mô. | Cần bảo mật vị trí và tránh suy luận từ ô quá nhỏ; equal-area không đủ. **Đánh giá:** Sai lệch ước lượng, k-anonymity theo vùng. |
| **7. Quy hoạch đô thị đa tỷ lệ** | Quy hoạch, thửa đất, mạng đường, dân cư | Gắn nhãn chức năng ô và tổng hợp theo các cấp. **Giả thuyết:** Path base-32 hỗ trợ mô hình dữ liệu phân cấp. | Cần biên pháp lý chính xác, địa chỉ ô không thay polygon gốc. **Đánh giá:** Consistency cross-level; diện tích overlay. |
| **8. Rủi ro thiên tai** | Mưa, DEM, ngập, dân số, công trình | Kết hợp hazard × exposure × vulnerability theo ô. **Giả thuyết:** Theo dõi nhiều tỷ lệ trên cùng key. | Cần DEM/hydrology; diện tích địa hình và biên ô phải xác minh. **Đánh giá:** F1 điểm ngập; thiệt hại kỳ vọng. |
| **9. Mạng giao thông** | Đồ thị đường, tốc độ, hành trình | Dùng ô làm index các cạnh đường; routing vẫn dựa trên road graph. **Giả thuyết:** Khóa ô hỗ trợ partition dữ liệu đường. | Không routing bằng 5 ô hàng xóm nếu chưa có graph thật. **Đánh giá:** Thời gian truy vấn và độ sai lệch route. |
| **10. Vị trí hạ tầng tối ưu** | POI, phục vụ, nhu cầu, đường | Tạo ứng viên điểm phục vụ và tối ưu facility location. **Giả thuyết:** Ô đa cấp có thể giảm tập ứng viên khi đã định vị chính xác. | Cần road-time matrix và WGS84 lookup. **Đánh giá:** Tỷ lệ phủ, thời gian tiếp cận p95. |

## II. WebGIS & SDI (11–15)

| # / Bài toán | Dữ liệu cần | Cách V5 tham gia / giả thuyết | Điều kiện và phép đo bắt buộc |
| --- | --- | --- | --- |
| **11. Vector tile đa phân giải** | GeoJSON, vector tiles, zoom | Dùng CellID làm khóa phụ hoặc partition, vẫn dùng MVT/PMTiles để render. **Giả thuyết:** Parent path hỗ trợ chọn dữ liệu tổng quát. | CellID không thay MVT/PMTiles; cần atlas địa lý. **Đánh giá:** FPS, bytes/tile, lỗi ranh giới. |
| **12. Truy vấn vùng hành chính** | Polygon hành chính, cell covers | Lọc prefix trước rồi kiểm hình học thật với polygon. **Giả thuyết:** Tăng hiệu quả candidate scan nếu dữ liệu đã được cell-indexed. | Cần canonical area coverage; prefix không trả ranh giới pháp lý. **Đánh giá:** Recall=100%; false-positive rate. |
| **13. Spatial join nhiều lớp** | Điểm/công trình/sensor, polygon | Cùng ô tạo ứng viên; kiểm tra ST_Intersects/ST_Within chính xác. **Giả thuyết:** Key join đơn giản ở tầng lọc thô. | Cần phép gán đối tượng và xử lý vật thể cắt nhiều ô. **Đánh giá:** Recall, join throughput, false positives. |
| **14. Chỉ mục database UInt64** | Bản ghi địa lý và V5 ID đã gán | Lưu uint64/hex, phân vùng theo root, dùng prefix cho parent. **Giả thuyết:** Codec v1 hiện có thể thử trên synthetic IDs. | Chưa tạo ID từ lat/lon; cần benchmark với GiST/H3/S2. **Đánh giá:** GiB RAM, index size, query p95. |
| **15. IoT streaming đa cấp** | Sự kiện cảm biến + thời gian + key | Stream-group theo CellID × time-bin, roll-up sum/count/mean. **Giả thuyết:** 8 byte/ID và parent path thích hợp pipeline tổng hợp. | Thiết bị chưa có WGS84→V5; không suy ra chính xác từ key. **Đánh giá:** End-to-end latency, throughput, loss. |

## III. GeoAI & Machine Learning (16–25)

| # / Bài toán | Dữ liệu cần | Cách V5 tham gia / giả thuyết | Điều kiện và phép đo bắt buộc |
| --- | --- | --- | --- |
| **16. Foundation model ảnh vệ tinh** | Ảnh vệ tinh, footprint, nhãn | Tạo token region có diện tích/footprint, attention theo cấp. **Giả thuyết:** Root/path là mã vị trí phân cấp độc lập embedding. | Cần geolocation và area-weighted loss, benchmark H3/S2. **Đánh giá:** mIoU, accuracy, tokens/s. |
| **17. Segmentation đa tỷ lệ** | Orthoimagery, mask chuẩn | Học coarse-to-fine, ánh xạ mask qua overlay ô. **Giả thuyết:** 32-way giúp tổ chức cây token theo từng cấp. | 10 cấp ID tối đa; mô hình segmentation chưa triển khai. **Đánh giá:** mIoU, boundary F1, memory. |
| **18. Object detection theo vùng** | Ảnh độ phân giải cao + bounding box | Ưu tiên proposal theo cell, box theo hệ tọa độ ảnh. **Giả thuyết:** CellID tạo index candidate, không là kernel convolution. | Cần bounding boxes và xử lý đối tượng qua ranh giới ô. **Đánh giá:** mAP và false negatives biên ô. |
| **19. GNN không gian** | Đồ thị ô có edge trọng số | Message passing qua graph adjacency được xác thực. **Giả thuyết:** Tôpô ngũ giác có thể là graph prior mới. | 5 cạnh ≠ 5 node neighbor trong weak grid; phải có graph chuẩn. **Đánh giá:** AUROC, runtime sparse graph. |
| **20. Curriculum learning đa phân giải** | Labeled samples, time series | Học lần lượt từ cha đến con; aggregate đúng biến cộng/trung bình. **Giả thuyết:** Tính đường dẫn parent/children có sẵn ở codec. | Cần footprint, quy tắc roll-up và đo leakage. **Đánh giá:** Convergence, F1 per resolution. |
| **21. Hierarchical spatial attention** | Tập token, parent path | Restrict attention theo ancestors/descendants và graph địa lý. **Giả thuyết:** Đường dẫn base-32 cho phép xác định cấp bằng bitwise. | Chỉ prefix không thay thế kNN; test attention quality. **Đánh giá:** Accuracy, GPU memory, complexity. |
| **22. Dự báo khí tượng** | Mưa, áp suất, gió, địa hình, thời gian | Encode không-thời gian, đánh giá bảo toàn thông lượng/diện tích. **Giả thuyết:** Ô có thể làm đơn vị discretization nếu metric được chứng minh. | Chưa có equal-area, hướng gió và phép tính thông lượng mặt cầu. **Đánh giá:** RMSE, conservation residual. |
| **23. Phân loại sử dụng đất** | Raster đa phổ + ground truth | Spatially stratified labels và tổng hợp lớp sử dụng đất. **Giả thuyết:** Một vùng đa cấp giảm chi phí truy hồi. | Cần polygon clipping và tránh spatial leakage. **Đánh giá:** Kappa, F1 theo diện tích. |
| **24. Phát hiện bất thường không gian** | Dòng cảm biến, baseline vùng | Dùng residual có mùa vụ, density và diện tích ô thực. **Giả thuyết:** Hierarchical scan giúp thử ở nhiều cấp. | Equal-area chưa chứng minh; kiểm soát số mẫu/cell. **Đánh giá:** Precision@k, false alarms. |
| **25. World model không gian** | Observations, actions, scene states | State graph gồm ID+properties+time; policy chọn transitions. **Giả thuyết:** Base-32 tree hữu dụng làm prior đa tỷ lệ. | Cần semantic state, neighbor graph và mô hình động thực. **Đánh giá:** Prediction horizon, planning success. |

## IV. Spatial LLM & Spatial Reasoning (26–32)

| # / Bài toán | Dữ liệu cần | Cách V5 tham gia / giả thuyết | Điều kiện và phép đo bắt buộc |
| --- | --- | --- | --- |
| **26. Token vị trí cho LLM** | Root/path, văn bản, grounding labels | Encode ID thành root/digit token thay vì float lat/lon thô. **Giả thuyết:** Mã base-32 gọn, dễ versioning và parent attention. | CellID không chứa semantics; cần embedding training. **Đánh giá:** Geolocation QA, hallucination rate. |
| **27. Suy luận quan hệ lân cận** | Câu hỏi topological + graph edge | Retrieve graph neighbor, kèm provenance và geometry. **Giả thuyết:** Cấu trúc 5 cạnh tạo biểu diễn topological thí nghiệm. | 5-neighbor chưa được xác thực toàn cầu. **Đánh giá:** Topological accuracy, contradiction rate. |
| **28. Natural-language region query** | Prompt, boundary polygon, database | Translate query→filter CellID candidates→exact geometry predicate. **Giả thuyết:** Prefix giúp giảm candidates khi đã lập atlas. | Cần query authorization, spatial correctness và grounding. **Đánh giá:** SQL correctness, spatial recall. |
| **29. Spatial RAG retrieval** | Tài liệu có footprint, CellID index | Spatial filter + temporal filter + vector retrieval. **Giả thuyết:** Key phân cấp tổ chức context đa tỷ lệ. | Cần map địa lý và metadata; prefix không bảo đảm trùng polygon. **Đánh giá:** Recall@k, grounded citation precision. |
| **30. Sinh chỉ dẫn đường** | GPS trajectory, road graph, traffic | Dùng ô làm coarse partition rồi route trên road graph. **Giả thuyết:** Hierarchical lookup giảm số vùng ứng viên tiềm năng. | Không route bằng pentagon neighbor giả định. **Đánh giá:** ETA error, routing success. |
| **31. Tóm tắt dữ liệu theo vùng** | Báo cáo sensor, mẫu, khu vực | Aggregate sum/count hoặc weighted mean từ child→parent. **Giả thuyết:** Codec parent hỗ trợ tổng hợp synthetic records ngay. | Tránh trung bình trung bình không trọng số. **Đánh giá:** Aggregate exactness, latency. |
| **32. Hỏi đáp đa mức** | Quốc gia/tỉnh/xã, prompts | Resolve spatial grain, retrieve vùng, trả số liệu có nguồn. **Giả thuyết:** Root/path hỗ trợ chuỗi cấp; demo logic cây. | Chưa mapping V5↔ranh giới hành chính. **Đánh giá:** Answer grounding, scale consistency. |

## V. SLAM & Robotics (33–38)

| # / Bài toán | Dữ liệu cần | Cách V5 tham gia / giả thuyết | Điều kiện và phép đo bắt buộc |
| --- | --- | --- | --- |
| **33. Lưới định vị robot** | Odometry, pose, occupancy observations | Overlay 2D cells vào map frame, lưu robot pose riêng. **Giả thuyết:** Có thể thử partition mới với graph điều hướng. | SLAM cần SE(2)/SE(3); mặt cầu không thay map phòng kín. **Đánh giá:** ATE/RPE, loop closure. |
| **34. Định vị và dựng bản đồ** | IMU, camera, LiDAR, anchors | Dùng ID làm index các pose/map features. **Giả thuyết:** Dùng parent keys để chia map cục bộ. | Equal-area không tự sửa drift; vẫn cần sensor fusion và loop closure. **Đánh giá:** Trajectory RMSE, drift. |
| **35. Điều hướng đa cấp** | Floor plans, route graph, robot constraints | Plan coarse region→fine route theo robot footprint. **Giả thuyết:** Địa chỉ tree giúp quản lý map chunk. | 10 cấp v1; khoảng cách địa lý cần quy đổi thực. **Đánh giá:** Planning time, collision-free rate. |
| **36. A* trên lưới ngũ giác** | Cost map, actual neighbor graph | A* với cost theo geodesic/robot frame, graph đã xác minh. **Giả thuyết:** Graph topology có thể thay đổi số bậc để nghiên cứu. | Weak cells có hanging nodes; heuristic phải admissible. **Đánh giá:** Node expansions, path optimality. |
| **37. Hợp nhất bản đồ nhiều robot** | Multi-robot submaps, TF transforms | Canonical ID map blocks + versioned coordinate frames. **Giả thuyết:** UInt64 thuận lợi cho index merge. | Cần registration và transforms; trùng CellID không có nghĩa aligned. **Đánh giá:** Map consistency, bandwidth. |
| **38. Phát hiện vật cản** | Depth sensor, occupancy grid | Cập nhật xác suất occupancy theo ô / chiều cao. **Giả thuyết:** Có thể dùng ô làm index cho occupancy layers. | Cần 3D voxels khi vật cản theo độ cao; pixel footprint. **Đánh giá:** Precision, miss rate, false obstacles. |

## VI. LiDAR & Point Cloud (39–44)

| # / Bài toán | Dữ liệu cần | Cách V5 tham gia / giả thuyết | Điều kiện và phép đo bắt buộc |
| --- | --- | --- | --- |
| **39. Downsampling point cloud** | Point cloud XYZ/CRS, density | Nhóm points theo projection trên cell và height bin. **Giả thuyết:** UInt64 phân cấp hỗ trợ chunk partition. | Chỉ số 2D không đủ cho point cloud 3D; cần Z hoặc voxel. **Đánh giá:** Chamfer distance, point retention. |
| **40. Phân loại đám mây điểm** | LiDAR intensity, RGB, labels | Feature per (cell,height) kết hợp ML classifier. **Giả thuyết:** Parent path để aggregate local context. | Không giả định 5-neighbor ở volumetric space. **Đánh giá:** mIoU, class-balanced accuracy. |
| **41. Tái tạo bề mặt** | Point cloud, normals, meshes | Dùng ô 2D làm spatial bucket trước mesh reconstruction. **Giả thuyết:** Có thể thử sampling stratification theo ô. | Ngũ giác 2D không tự bảo đảm mesh 3D ổn định. **Đánh giá:** Hausdorff distance, holes. |
| **42. Đăng ký ICP point clouds** | Overlapping scans, poses | Prune nearest-neighbor search bằng coarse ID trước ICP. **Giả thuyết:** ID phân cấp giảm candidate space tiềm năng. | ICP chính xác phụ thuộc metric và features, không phụ thuộc equal-area. **Đánh giá:** Registration RMSE, convergence. |
| **43. Phân tích bề mặt/cấu trúc** | Ground/non-ground points, normals | Tính mật độ theo diện tích thực, vertical profiles. **Giả thuyết:** Chunk IDs tạo statistics theo vùng và thời gian. | Cần diện tích geodesic và height interval chuẩn. **Đánh giá:** Density error, slope RMSE. |
| **44. Nén LiDAR đa cấp** | LAS/LAZ, point positions | Chunk theo cell path và lưu residuals/bitpacking. **Giả thuyết:** Parent prefixes có thể tạo hierarchy chunk nén. | 64-bit mỗi điểm có thể tăng dung lượng nếu dùng sai; cần codec chuẩn. **Đánh giá:** Bits per point, encode/decode speed. |

## VII. BIM & Digital Twin (45–50)

| # / Bài toán | Dữ liệu cần | Cách V5 tham gia / giả thuyết | Điều kiện và phép đo bắt buộc |
| --- | --- | --- | --- |
| **45. BIM-to-GIS spatial association** | IFC GUID, footprint, local CRS | Link IFC entities↔CellID via georeferenced footprints. **Giả thuyết:** CellID là secondary index, không thay GUID. | Cần IFC transform, georeferencing và geolocation. **Đánh giá:** Entity association recall. |
| **46. Digital twin thành phố** | CityGML, BIM, IoT, time | Joint model EntityID + CellID + time with 3D tiles. **Giả thuyết:** Hierarchical index có thể partition observed state. | CellID 2D không mã hóa building floor/volume. **Đánh giá:** State latency, digital-twin consistency. |
| **47. Quản lý tài sản đô thị** | Assets, points, maint logs | Gán cell key như truy vấn phụ theo vùng. **Giả thuyết:** UInt64 hỗ trợ phân nhóm nếu atlas được triển khai. | Không dùng CellID làm khóa nghiệp vụ bất biến. **Đánh giá:** Lookup p95, duplication rate. |
| **48. Mô phỏng năng lượng công trình** | BIM material, HVAC, weather | Aggregate external context by cell; simulate per BIM physics. **Giả thuyết:** Tạo liên kết vùng khí hậu↔BIM. | Equal-area không trực tiếp quyết định energy conservation. **Đánh giá:** kWh simulation error. |
| **49. Kiểm tra va chạm 3D** | IFC solid geometry, transforms | Broad-phase spatial partition rồi narrow-phase solid intersection. **Giả thuyết:** ID có thể là broad-phase bucket. | 2D pentagon không tự giảm false collision; cần 3D bounding volumes. **Đánh giá:** Collision recall, query p95. |
| **50. Bảo trì dự đoán theo khu vực** | Sensor series, asset graph, history | EntityID→CellID lookup, temporal prediction per asset. **Giả thuyết:** Phân cấp khóa vùng hỗ trợ dashboard và sampling. | Không tạo causal improvement chỉ từ ngũ giác. **Đánh giá:** Failure PR-AUC, lead time. |

## Ba ví dụ chạy thử độc lập (dữ liệu giả lập)

### Ví dụ 1 — Đường dẫn 64-bit và 32 ô con

```python
from src.v5id import encode, decode, parent, children, to_hex
root_id = encode(7)
cell = encode(7, (2, 0, 4))
assert to_hex(cell) == "0x131c402000000000"
assert decode(cell).resolution == 3
assert parent(cell) == encode(7, (2, 0))
assert len(children(root_id)) == 32
```

**Ý nghĩa:** xác thực API của mã ID; **không** chuyển lat/lon sang tọa độ V5.

### Ví dụ 2 — Trung bình dữ liệu có trọng số diện tích

Dùng ba ô giả định có `(area_km2, temperature_C)` lần lượt `[(1,20),(2,50),(0.5,80)]`:

[
overline T_{mathrm{area}}=rac{sum_i A_i T_i}{sum_i A_i}
=rac{20+100+40}{3.5}simeq45.714^{circ}C,
qquad
overline T_{mathrm{unweighted}}=50^{circ}C.
]

```python
data = [(1.0, 20.0), (2.0, 50.0), (0.5, 80.0)]
area_weighted_mean = sum(a * t for a, t in data) / sum(a for a, _ in data)
assert round(area_weighted_mean, 3) == 45.714
```

**Ý nghĩa:** khi ô khác diện tích, phép tính bình quân phải chọn trọng số thích hợp cho biến cường độ; đây là ví dụ số học, không phải dữ liệu đo V5 thật. Với **tỷ lệ thất nghiệp/dịch tễ**, phải cộng đúng tử số và mẫu số (người, bệnh nhân, mẫu), không thể thay bằng area-weighted average.

### Ví dụ 3 — Số ô, độ sâu và giới hạn lưu trữ

[
N_r=12cdot32^r,qquad rin{0,1,ldots,10}.
]

```python
for r in (0, 3, 5, 10):
    total = 12 * (32 ** r)
    path_bits = 5 * r
    raw_uint64_bytes = 8 * total
    print(r, total, path_bits, raw_uint64_bytes)
```

**Ý nghĩa:** các con số trên là dung lượng **lý tưởng nếu thật sự vật hóa mọi ID**, không có polygon/metadata. Không cấp phát mảng ô toàn cầu ở độ sâu lớn chỉ để chứng minh công thức.

## Lộ trình xây năng lực cho 50 bài toán

1. **G0 — Duy trì codec chính xác:** UInt64 v1, prefix cha-con, kiểm thử số học nguyên, thông tin phiên bản.
2. **G1 — Tọa độ địa lý:** atlas 12 root, phép chiếu WGS84 và giao thức sở hữu biên duy nhất.
3. **G2 — Hình học:** chứng nhận phân hoạch 32 ô lồi, không chồng lấn, edge-to-edge, sai số diện tích và hệ số co đường kính.
4. **G3 — Cơ sở dữ liệu và API:** spatial joins, polygon covering, neighbor graph, I/O Arrow/Parquet/PostGIS.
5. **G4 — AI, robotics, BIM:** embeddings có chặn, graph thực, 3D local frames, sensor fusion, LiDAR/BIM adapters.
6. **G5 — Đánh giá:** accuracy-matched H3/S2 baseline, p50/p95/p99, RAM, throughput, numerical error và kiểm tra khả năng tương thích OGC.

## Tài liệu tham khảo

- [H3 index hierarchy](https://h3geo.org/docs/highlights/indexing/)
- [S2 Cell hierarchy, 64-bit address](https://s2geometry.io/devguide/s2cell_hierarchy)
- [OGC DGGS Topic 21 — Equal Area Earth DGGS error budget](https://docs.ogc.org/as/20-040r3/20-040r3.html)
- [V5 Mathematical Proof](PROOF.md) · [V5-64 Codec](V5-64.md) · [Release criteria](RELEASE_1.0.0.md)

**V5 Research Reference 1.0.0 không chứng nhận production DGGS. Long Ngo 2026 · Vietflexmap · Apache-2.0.**
