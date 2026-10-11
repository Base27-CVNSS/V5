/* SPDX-License-Identifier: Apache-2.0 */
/* V5 Research Reference 1.0.0 · Long Ngo 2026 · Vietflexmap Copyright (c) 2025
   50 research use cases are PROPOSALS, not deployed DGGS capabilities. */
export const categories = Object.freeze([
  {
    "id": "GIS",
    "label": "GIS & phân tích không gian",
    "count": 10
  },
  {
    "id": "WebGIS",
    "label": "WebGIS & SDI",
    "count": 5
  },
  {
    "id": "GeoAI",
    "label": "GeoAI & Machine Learning",
    "count": 10
  },
  {
    "id": "LLM",
    "label": "Spatial LLM & Reasoning",
    "count": 7
  },
  {
    "id": "SLAM",
    "label": "SLAM & Robotics",
    "count": 6
  },
  {
    "id": "LiDAR",
    "label": "LiDAR & Point Cloud",
    "count": 6
  },
  {
    "id": "BIM",
    "label": "BIM & Digital Twin",
    "count": 6
  }
]);
export const useCases = Object.freeze([
  {
    "id": 1,
    "category": "GIS",
    "title": "Mật độ dân số toàn cầu",
    "input": "Raster dân số + địa giới",
    "method": "Gán dân số theo giao diện tích với ô; mật độ = người/km².",
    "hypothesis": "Cây đa tỷ lệ hỗ trợ tổng hợp; không cần equal-area nếu chia đúng diện tích.",
    "gate": "Cần V5 lat/lon→cell, diện tích ô và polygon overlay.",
    "metric": "Sai lệch mật độ theo vĩ độ; MAE so với GIS chuẩn.",
    "status": "geo"
  },
  {
    "id": 2,
    "category": "GIS",
    "title": "Tỷ lệ thất nghiệp theo tỉnh",
    "input": "Số thất nghiệp, lực lượng lao động, ranh giới",
    "method": "Tính tỷ lệ từ tổng tử số/tổng mẫu số trên các ô giao vùng.",
    "hypothesis": "Chỉ mục phân cấp hỗ trợ roll-up, không được trung bình tỷ lệ ô trực tiếp.",
    "gate": "Cần thống kê ranh giới và mẫu số; equal-area không giải quyết thiên lệch mẫu.",
    "metric": "Sai lệch tỷ lệ, bảo toàn mẫu số.",
    "status": "geo"
  },
  {
    "id": 3,
    "category": "GIS",
    "title": "Biến đổi khí hậu theo ô",
    "input": "ERA5/CMIP, nhiệt độ, mưa, thời gian",
    "method": "Resample có trọng số diện tích; cộng lượng và trung bình biến cường độ.",
    "hypothesis": "Địa chỉ cây dùng làm khóa dữ liệu đa độ phân giải.",
    "gate": "Cần diện tích trắc địa và bộ xử lý thời gian; mô hình hình học chưa có.",
    "metric": "RMSE khí hậu; bảo toàn tích phân mưa.",
    "status": "geo"
  },
  {
    "id": 4,
    "category": "GIS",
    "title": "Biến động rừng theo thời gian",
    "input": "Sentinel/Landsat, lớp rừng, ngày",
    "method": "Cắt raster theo footprint ô, tính ha rừng mất/rừng phục hồi.",
    "hypothesis": "Khóa không gian-thời gian và roll-up parent.",
    "gate": "Cần overlay raster/vector; nhãn pixel và cloud mask chuẩn.",
    "metric": "IoU; sai lệch ha rừng; uncertainty.",
    "status": "geo"
  },
  {
    "id": 5,
    "category": "GIS",
    "title": "Năng suất nông nghiệp",
    "input": "Ranh giới ruộng, sản lượng, diện tích",
    "method": "Phân bổ sản lượng theo thửa và tính tấn/ha.",
    "hypothesis": "Tập hợp đa cấp dùng chung đường dẫn CellID.",
    "gate": "Cần area-weighting; ruộng không khớp biên ô.",
    "metric": "RMSE tấn/ha so với diện tích thửa.",
    "status": "geo"
  },
  {
    "id": 6,
    "category": "GIS",
    "title": "Dịch tễ học theo không gian",
    "input": "Ca bệnh đã ẩn danh, dân số, thời gian",
    "method": "Tính ca/100.000 người; smoothing theo dân số và thời gian.",
    "hypothesis": "Chia cấp giúp phân tích nhiều quy mô.",
    "gate": "Cần bảo mật vị trí và tránh suy luận từ ô quá nhỏ; equal-area không đủ.",
    "metric": "Sai lệch ước lượng, k-anonymity theo vùng.",
    "status": "geo"
  },
  {
    "id": 7,
    "category": "GIS",
    "title": "Quy hoạch đô thị đa tỷ lệ",
    "input": "Quy hoạch, thửa đất, mạng đường, dân cư",
    "method": "Gắn nhãn chức năng ô và tổng hợp theo các cấp.",
    "hypothesis": "Path base-32 hỗ trợ mô hình dữ liệu phân cấp.",
    "gate": "Cần biên pháp lý chính xác, địa chỉ ô không thay polygon gốc.",
    "metric": "Consistency cross-level; diện tích overlay.",
    "status": "geo"
  },
  {
    "id": 8,
    "category": "GIS",
    "title": "Rủi ro thiên tai",
    "input": "Mưa, DEM, ngập, dân số, công trình",
    "method": "Kết hợp hazard × exposure × vulnerability theo ô.",
    "hypothesis": "Theo dõi nhiều tỷ lệ trên cùng key.",
    "gate": "Cần DEM/hydrology; diện tích địa hình và biên ô phải xác minh.",
    "metric": "F1 điểm ngập; thiệt hại kỳ vọng.",
    "status": "geo"
  },
  {
    "id": 9,
    "category": "GIS",
    "title": "Mạng giao thông",
    "input": "Đồ thị đường, tốc độ, hành trình",
    "method": "Dùng ô làm index các cạnh đường; routing vẫn dựa trên road graph.",
    "hypothesis": "Khóa ô hỗ trợ partition dữ liệu đường.",
    "gate": "Không routing bằng 5 ô hàng xóm nếu chưa có graph thật.",
    "metric": "Thời gian truy vấn và độ sai lệch route.",
    "status": "topology"
  },
  {
    "id": 10,
    "category": "GIS",
    "title": "Vị trí hạ tầng tối ưu",
    "input": "POI, phục vụ, nhu cầu, đường",
    "method": "Tạo ứng viên điểm phục vụ và tối ưu facility location.",
    "hypothesis": "Ô đa cấp có thể giảm tập ứng viên khi đã định vị chính xác.",
    "gate": "Cần road-time matrix và WGS84 lookup.",
    "metric": "Tỷ lệ phủ, thời gian tiếp cận p95.",
    "status": "geo"
  },
  {
    "id": 11,
    "category": "WebGIS",
    "title": "Vector tile đa phân giải",
    "input": "GeoJSON, vector tiles, zoom",
    "method": "Dùng CellID làm khóa phụ hoặc partition, vẫn dùng MVT/PMTiles để render.",
    "hypothesis": "Parent path hỗ trợ chọn dữ liệu tổng quát.",
    "gate": "CellID không thay MVT/PMTiles; cần atlas địa lý.",
    "metric": "FPS, bytes/tile, lỗi ranh giới.",
    "status": "codec"
  },
  {
    "id": 12,
    "category": "WebGIS",
    "title": "Truy vấn vùng hành chính",
    "input": "Polygon hành chính, cell covers",
    "method": "Lọc prefix trước rồi kiểm hình học thật với polygon.",
    "hypothesis": "Tăng hiệu quả candidate scan nếu dữ liệu đã được cell-indexed.",
    "gate": "Cần canonical area coverage; prefix không trả ranh giới pháp lý.",
    "metric": "Recall=100%; false-positive rate.",
    "status": "geo"
  },
  {
    "id": 13,
    "category": "WebGIS",
    "title": "Spatial join nhiều lớp",
    "input": "Điểm/công trình/sensor, polygon",
    "method": "Cùng ô tạo ứng viên; kiểm tra ST_Intersects/ST_Within chính xác.",
    "hypothesis": "Key join đơn giản ở tầng lọc thô.",
    "gate": "Cần phép gán đối tượng và xử lý vật thể cắt nhiều ô.",
    "metric": "Recall, join throughput, false positives.",
    "status": "geo"
  },
  {
    "id": 14,
    "category": "WebGIS",
    "title": "Chỉ mục database UInt64",
    "input": "Bản ghi địa lý và V5 ID đã gán",
    "method": "Lưu uint64/hex, phân vùng theo root, dùng prefix cho parent.",
    "hypothesis": "Codec v1 hiện có thể thử trên synthetic IDs.",
    "gate": "Chưa tạo ID từ lat/lon; cần benchmark với GiST/H3/S2.",
    "metric": "GiB RAM, index size, query p95.",
    "status": "codec"
  },
  {
    "id": 15,
    "category": "WebGIS",
    "title": "IoT streaming đa cấp",
    "input": "Sự kiện cảm biến + thời gian + key",
    "method": "Stream-group theo CellID × time-bin, roll-up sum/count/mean.",
    "hypothesis": "8 byte/ID và parent path thích hợp pipeline tổng hợp.",
    "gate": "Thiết bị chưa có WGS84→V5; không suy ra chính xác từ key.",
    "metric": "End-to-end latency, throughput, loss.",
    "status": "codec"
  },
  {
    "id": 16,
    "category": "GeoAI",
    "title": "Foundation model ảnh vệ tinh",
    "input": "Ảnh vệ tinh, footprint, nhãn",
    "method": "Tạo token region có diện tích/footprint, attention theo cấp.",
    "hypothesis": "Root/path là mã vị trí phân cấp độc lập embedding.",
    "gate": "Cần geolocation và area-weighted loss, benchmark H3/S2.",
    "metric": "mIoU, accuracy, tokens/s.",
    "status": "model"
  },
  {
    "id": 17,
    "category": "GeoAI",
    "title": "Segmentation đa tỷ lệ",
    "input": "Orthoimagery, mask chuẩn",
    "method": "Học coarse-to-fine, ánh xạ mask qua overlay ô.",
    "hypothesis": "32-way giúp tổ chức cây token theo từng cấp.",
    "gate": "10 cấp ID tối đa; mô hình segmentation chưa triển khai.",
    "metric": "mIoU, boundary F1, memory.",
    "status": "model"
  },
  {
    "id": 18,
    "category": "GeoAI",
    "title": "Object detection theo vùng",
    "input": "Ảnh độ phân giải cao + bounding box",
    "method": "Ưu tiên proposal theo cell, box theo hệ tọa độ ảnh.",
    "hypothesis": "CellID tạo index candidate, không là kernel convolution.",
    "gate": "Cần bounding boxes và xử lý đối tượng qua ranh giới ô.",
    "metric": "mAP và false negatives biên ô.",
    "status": "model"
  },
  {
    "id": 19,
    "category": "GeoAI",
    "title": "GNN không gian",
    "input": "Đồ thị ô có edge trọng số",
    "method": "Message passing qua graph adjacency được xác thực.",
    "hypothesis": "Tôpô ngũ giác có thể là graph prior mới.",
    "gate": "5 cạnh ≠ 5 node neighbor trong weak grid; phải có graph chuẩn.",
    "metric": "AUROC, runtime sparse graph.",
    "status": "topology"
  },
  {
    "id": 20,
    "category": "GeoAI",
    "title": "Curriculum learning đa phân giải",
    "input": "Labeled samples, time series",
    "method": "Học lần lượt từ cha đến con; aggregate đúng biến cộng/trung bình.",
    "hypothesis": "Tính đường dẫn parent/children có sẵn ở codec.",
    "gate": "Cần footprint, quy tắc roll-up và đo leakage.",
    "metric": "Convergence, F1 per resolution.",
    "status": "codec"
  },
  {
    "id": 21,
    "category": "GeoAI",
    "title": "Hierarchical spatial attention",
    "input": "Tập token, parent path",
    "method": "Restrict attention theo ancestors/descendants và graph địa lý.",
    "hypothesis": "Đường dẫn base-32 cho phép xác định cấp bằng bitwise.",
    "gate": "Chỉ prefix không thay thế kNN; test attention quality.",
    "metric": "Accuracy, GPU memory, complexity.",
    "status": "codec"
  },
  {
    "id": 22,
    "category": "GeoAI",
    "title": "Dự báo khí tượng",
    "input": "Mưa, áp suất, gió, địa hình, thời gian",
    "method": "Encode không-thời gian, đánh giá bảo toàn thông lượng/diện tích.",
    "hypothesis": "Ô có thể làm đơn vị discretization nếu metric được chứng minh.",
    "gate": "Chưa có equal-area, hướng gió và phép tính thông lượng mặt cầu.",
    "metric": "RMSE, conservation residual.",
    "status": "geo"
  },
  {
    "id": 23,
    "category": "GeoAI",
    "title": "Phân loại sử dụng đất",
    "input": "Raster đa phổ + ground truth",
    "method": "Spatially stratified labels và tổng hợp lớp sử dụng đất.",
    "hypothesis": "Một vùng đa cấp giảm chi phí truy hồi.",
    "gate": "Cần polygon clipping và tránh spatial leakage.",
    "metric": "Kappa, F1 theo diện tích.",
    "status": "geo"
  },
  {
    "id": 24,
    "category": "GeoAI",
    "title": "Phát hiện bất thường không gian",
    "input": "Dòng cảm biến, baseline vùng",
    "method": "Dùng residual có mùa vụ, density và diện tích ô thực.",
    "hypothesis": "Hierarchical scan giúp thử ở nhiều cấp.",
    "gate": "Equal-area chưa chứng minh; kiểm soát số mẫu/cell.",
    "metric": "Precision@k, false alarms.",
    "status": "geo"
  },
  {
    "id": 25,
    "category": "GeoAI",
    "title": "World model không gian",
    "input": "Observations, actions, scene states",
    "method": "State graph gồm ID+properties+time; policy chọn transitions.",
    "hypothesis": "Base-32 tree hữu dụng làm prior đa tỷ lệ.",
    "gate": "Cần semantic state, neighbor graph và mô hình động thực.",
    "metric": "Prediction horizon, planning success.",
    "status": "model"
  },
  {
    "id": 26,
    "category": "LLM",
    "title": "Token vị trí cho LLM",
    "input": "Root/path, văn bản, grounding labels",
    "method": "Encode ID thành root/digit token thay vì float lat/lon thô.",
    "hypothesis": "Mã base-32 gọn, dễ versioning và parent attention.",
    "gate": "CellID không chứa semantics; cần embedding training.",
    "metric": "Geolocation QA, hallucination rate.",
    "status": "codec"
  },
  {
    "id": 27,
    "category": "LLM",
    "title": "Suy luận quan hệ lân cận",
    "input": "Câu hỏi topological + graph edge",
    "method": "Retrieve graph neighbor, kèm provenance và geometry.",
    "hypothesis": "Cấu trúc 5 cạnh tạo biểu diễn topological thí nghiệm.",
    "gate": "5-neighbor chưa được xác thực toàn cầu.",
    "metric": "Topological accuracy, contradiction rate.",
    "status": "topology"
  },
  {
    "id": 28,
    "category": "LLM",
    "title": "Natural-language region query",
    "input": "Prompt, boundary polygon, database",
    "method": "Translate query→filter CellID candidates→exact geometry predicate.",
    "hypothesis": "Prefix giúp giảm candidates khi đã lập atlas.",
    "gate": "Cần query authorization, spatial correctness và grounding.",
    "metric": "SQL correctness, spatial recall.",
    "status": "geo"
  },
  {
    "id": 29,
    "category": "LLM",
    "title": "Spatial RAG retrieval",
    "input": "Tài liệu có footprint, CellID index",
    "method": "Spatial filter + temporal filter + vector retrieval.",
    "hypothesis": "Key phân cấp tổ chức context đa tỷ lệ.",
    "gate": "Cần map địa lý và metadata; prefix không bảo đảm trùng polygon.",
    "metric": "Recall@k, grounded citation precision.",
    "status": "codec"
  },
  {
    "id": 30,
    "category": "LLM",
    "title": "Sinh chỉ dẫn đường",
    "input": "GPS trajectory, road graph, traffic",
    "method": "Dùng ô làm coarse partition rồi route trên road graph.",
    "hypothesis": "Hierarchical lookup giảm số vùng ứng viên tiềm năng.",
    "gate": "Không route bằng pentagon neighbor giả định.",
    "metric": "ETA error, routing success.",
    "status": "topology"
  },
  {
    "id": 31,
    "category": "LLM",
    "title": "Tóm tắt dữ liệu theo vùng",
    "input": "Báo cáo sensor, mẫu, khu vực",
    "method": "Aggregate sum/count hoặc weighted mean từ child→parent.",
    "hypothesis": "Codec parent hỗ trợ tổng hợp synthetic records ngay.",
    "gate": "Tránh trung bình trung bình không trọng số.",
    "metric": "Aggregate exactness, latency.",
    "status": "codec"
  },
  {
    "id": 32,
    "category": "LLM",
    "title": "Hỏi đáp đa mức",
    "input": "Quốc gia/tỉnh/xã, prompts",
    "method": "Resolve spatial grain, retrieve vùng, trả số liệu có nguồn.",
    "hypothesis": "Root/path hỗ trợ chuỗi cấp; demo logic cây.",
    "gate": "Chưa mapping V5↔ranh giới hành chính.",
    "metric": "Answer grounding, scale consistency.",
    "status": "codec"
  },
  {
    "id": 33,
    "category": "SLAM",
    "title": "Lưới định vị robot",
    "input": "Odometry, pose, occupancy observations",
    "method": "Overlay 2D cells vào map frame, lưu robot pose riêng.",
    "hypothesis": "Có thể thử partition mới với graph điều hướng.",
    "gate": "SLAM cần SE(2)/SE(3); mặt cầu không thay map phòng kín.",
    "metric": "ATE/RPE, loop closure.",
    "status": "volume"
  },
  {
    "id": 34,
    "category": "SLAM",
    "title": "Định vị và dựng bản đồ",
    "input": "IMU, camera, LiDAR, anchors",
    "method": "Dùng ID làm index các pose/map features.",
    "hypothesis": "Dùng parent keys để chia map cục bộ.",
    "gate": "Equal-area không tự sửa drift; vẫn cần sensor fusion và loop closure.",
    "metric": "Trajectory RMSE, drift.",
    "status": "volume"
  },
  {
    "id": 35,
    "category": "SLAM",
    "title": "Điều hướng đa cấp",
    "input": "Floor plans, route graph, robot constraints",
    "method": "Plan coarse region→fine route theo robot footprint.",
    "hypothesis": "Địa chỉ tree giúp quản lý map chunk.",
    "gate": "10 cấp v1; khoảng cách địa lý cần quy đổi thực.",
    "metric": "Planning time, collision-free rate.",
    "status": "volume"
  },
  {
    "id": 36,
    "category": "SLAM",
    "title": "A* trên lưới ngũ giác",
    "input": "Cost map, actual neighbor graph",
    "method": "A* với cost theo geodesic/robot frame, graph đã xác minh.",
    "hypothesis": "Graph topology có thể thay đổi số bậc để nghiên cứu.",
    "gate": "Weak cells có hanging nodes; heuristic phải admissible.",
    "metric": "Node expansions, path optimality.",
    "status": "topology"
  },
  {
    "id": 37,
    "category": "SLAM",
    "title": "Hợp nhất bản đồ nhiều robot",
    "input": "Multi-robot submaps, TF transforms",
    "method": "Canonical ID map blocks + versioned coordinate frames.",
    "hypothesis": "UInt64 thuận lợi cho index merge.",
    "gate": "Cần registration và transforms; trùng CellID không có nghĩa aligned.",
    "metric": "Map consistency, bandwidth.",
    "status": "volume"
  },
  {
    "id": 38,
    "category": "SLAM",
    "title": "Phát hiện vật cản",
    "input": "Depth sensor, occupancy grid",
    "method": "Cập nhật xác suất occupancy theo ô / chiều cao.",
    "hypothesis": "Có thể dùng ô làm index cho occupancy layers.",
    "gate": "Cần 3D voxels khi vật cản theo độ cao; pixel footprint.",
    "metric": "Precision, miss rate, false obstacles.",
    "status": "volume"
  },
  {
    "id": 39,
    "category": "LiDAR",
    "title": "Downsampling point cloud",
    "input": "Point cloud XYZ/CRS, density",
    "method": "Nhóm points theo projection trên cell và height bin.",
    "hypothesis": "UInt64 phân cấp hỗ trợ chunk partition.",
    "gate": "Chỉ số 2D không đủ cho point cloud 3D; cần Z hoặc voxel.",
    "metric": "Chamfer distance, point retention.",
    "status": "volume"
  },
  {
    "id": 40,
    "category": "LiDAR",
    "title": "Phân loại đám mây điểm",
    "input": "LiDAR intensity, RGB, labels",
    "method": "Feature per (cell,height) kết hợp ML classifier.",
    "hypothesis": "Parent path để aggregate local context.",
    "gate": "Không giả định 5-neighbor ở volumetric space.",
    "metric": "mIoU, class-balanced accuracy.",
    "status": "volume"
  },
  {
    "id": 41,
    "category": "LiDAR",
    "title": "Tái tạo bề mặt",
    "input": "Point cloud, normals, meshes",
    "method": "Dùng ô 2D làm spatial bucket trước mesh reconstruction.",
    "hypothesis": "Có thể thử sampling stratification theo ô.",
    "gate": "Ngũ giác 2D không tự bảo đảm mesh 3D ổn định.",
    "metric": "Hausdorff distance, holes.",
    "status": "volume"
  },
  {
    "id": 42,
    "category": "LiDAR",
    "title": "Đăng ký ICP point clouds",
    "input": "Overlapping scans, poses",
    "method": "Prune nearest-neighbor search bằng coarse ID trước ICP.",
    "hypothesis": "ID phân cấp giảm candidate space tiềm năng.",
    "gate": "ICP chính xác phụ thuộc metric và features, không phụ thuộc equal-area.",
    "metric": "Registration RMSE, convergence.",
    "status": "volume"
  },
  {
    "id": 43,
    "category": "LiDAR",
    "title": "Phân tích bề mặt/cấu trúc",
    "input": "Ground/non-ground points, normals",
    "method": "Tính mật độ theo diện tích thực, vertical profiles.",
    "hypothesis": "Chunk IDs tạo statistics theo vùng và thời gian.",
    "gate": "Cần diện tích geodesic và height interval chuẩn.",
    "metric": "Density error, slope RMSE.",
    "status": "volume"
  },
  {
    "id": 44,
    "category": "LiDAR",
    "title": "Nén LiDAR đa cấp",
    "input": "LAS/LAZ, point positions",
    "method": "Chunk theo cell path và lưu residuals/bitpacking.",
    "hypothesis": "Parent prefixes có thể tạo hierarchy chunk nén.",
    "gate": "64-bit mỗi điểm có thể tăng dung lượng nếu dùng sai; cần codec chuẩn.",
    "metric": "Bits per point, encode/decode speed.",
    "status": "volume"
  },
  {
    "id": 45,
    "category": "BIM",
    "title": "BIM-to-GIS spatial association",
    "input": "IFC GUID, footprint, local CRS",
    "method": "Link IFC entities↔CellID via georeferenced footprints.",
    "hypothesis": "CellID là secondary index, không thay GUID.",
    "gate": "Cần IFC transform, georeferencing và geolocation.",
    "metric": "Entity association recall.",
    "status": "volume"
  },
  {
    "id": 46,
    "category": "BIM",
    "title": "Digital twin thành phố",
    "input": "CityGML, BIM, IoT, time",
    "method": "Joint model EntityID + CellID + time with 3D tiles.",
    "hypothesis": "Hierarchical index có thể partition observed state.",
    "gate": "CellID 2D không mã hóa building floor/volume.",
    "metric": "State latency, digital-twin consistency.",
    "status": "volume"
  },
  {
    "id": 47,
    "category": "BIM",
    "title": "Quản lý tài sản đô thị",
    "input": "Assets, points, maint logs",
    "method": "Gán cell key như truy vấn phụ theo vùng.",
    "hypothesis": "UInt64 hỗ trợ phân nhóm nếu atlas được triển khai.",
    "gate": "Không dùng CellID làm khóa nghiệp vụ bất biến.",
    "metric": "Lookup p95, duplication rate.",
    "status": "geo"
  },
  {
    "id": 48,
    "category": "BIM",
    "title": "Mô phỏng năng lượng công trình",
    "input": "BIM material, HVAC, weather",
    "method": "Aggregate external context by cell; simulate per BIM physics.",
    "hypothesis": "Tạo liên kết vùng khí hậu↔BIM.",
    "gate": "Equal-area không trực tiếp quyết định energy conservation.",
    "metric": "kWh simulation error.",
    "status": "volume"
  },
  {
    "id": 49,
    "category": "BIM",
    "title": "Kiểm tra va chạm 3D",
    "input": "IFC solid geometry, transforms",
    "method": "Broad-phase spatial partition rồi narrow-phase solid intersection.",
    "hypothesis": "ID có thể là broad-phase bucket.",
    "gate": "2D pentagon không tự giảm false collision; cần 3D bounding volumes.",
    "metric": "Collision recall, query p95.",
    "status": "volume"
  },
  {
    "id": 50,
    "category": "BIM",
    "title": "Bảo trì dự đoán theo khu vực",
    "input": "Sensor series, asset graph, history",
    "method": "EntityID→CellID lookup, temporal prediction per asset.",
    "hypothesis": "Phân cấp khóa vùng hỗ trợ dashboard và sampling.",
    "gate": "Không tạo causal improvement chỉ từ ngũ giác.",
    "metric": "Failure PR-AUC, lead time.",
    "status": "model"
  }
]);
export const gates = Object.freeze({
  "codec": {
    "label": "Có thể mô phỏng codec",
    "desc": "Hiện chỉ hỗ trợ bài toán mã hóa ID và quan hệ cây bằng dữ liệu giả lập, chưa chạy toàn bộ luồng nghiệp vụ."
  },
  "geo": {
    "label": "Cần GIS toàn cầu",
    "desc": "Cần lat/lon→CellID, polygon, diện tích và WGS84 được xác minh."
  },
  "topology": {
    "label": "Cần đồ thị láng giềng",
    "desc": "Cần phân chia edge-to-edge hoặc phép giao biên được chứng nhận; không suy từ 5 cạnh."
  },
  "volume": {
    "label": "Cần 3D / local frame",
    "desc": "Lưới cầu 2D không đủ chứa độ cao, tầng và thể tích, cần tọa độ địa phương hay voxel."
  },
  "model": {
    "label": "Cần mô hình AI thực",
    "desc": "Chỉ số có thể là đặc trưng; chưa có mô hình, pipeline huấn luyện hay metric."
  }
});
