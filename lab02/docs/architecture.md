# Architecture and source trace

```text
App
├── NavBar
├── Orchids
│   ├── OrchidCard × N
│   └── OrchidDetailModal
└── Footer
```

useOrchids sở hữu orchids/loading/error/source; Orchids sở hữu selected và filter controls. visible là derived data, không cần effect hoặc state riêng. Grid xs12/sm6/lg3 tương ứng 1/2/4 cột. getOrchids kiểm tra cache trước khi HTTP; chỉ snapshot hợp lệ được lưu. apiClient kiểm tra response.ok rồi parse JSON; service kiểm tra schema và ID trùng. Hook AbortController và generation guard xử lý request cũ.

## Trace một record

`id="1"` → prop `orchid` → `OrchidCard` → orchidName/image/category → click View detail → `onDetail(orchid)` → selected state → Modal render tên, origin, color, rating, description. Close/X/Escape → callback → selected=null.

## Ranh giới

Props đi xuống, event đi lên, owner cập nhật state bằng giá trị/reference mới. JSX dùng text interpolation; không dùng dangerouslySetInnerHTML. Bootstrap CSS được import tại main.jsx trước app.css. Ảnh public được truy cập bằng URL root, không chứa `/public` trong đường dẫn.
