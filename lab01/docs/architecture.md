# Architecture and source trace

```text
App
├── NavBar
├── OrchidList
│   ├── OrchidCard × N
│   └── OrchidDetailModal
└── Footer
```

OrchidList import static array từ shared/OrchidsData.js. Mỗi object được truyền qua prop `orchid`, không bị child sửa. `key=orchid.id` định danh phần tử, không dùng index. `selected` thuộc list để chỉ mở một modal; callback `onDetail` đi từ child về owner. Grid xs12/sm6/lg4 tương ứng 1/2/3 cột.

## Trace một record

`id="1"` → prop `orchid` → `OrchidCard` → orchidName/image/category → click View detail → `onDetail(orchid)` → selected state → Modal render tên, origin, color, rating, description. Close/X/Escape → callback → selected=null.

## Ranh giới

Props đi xuống, event đi lên, owner cập nhật state bằng giá trị/reference mới. JSX dùng text interpolation; không dùng dangerouslySetInnerHTML. Bootstrap CSS được import tại main.jsx trước app.css. Ảnh public được truy cập bằng URL root, không chứa `/public` trong đường dẫn.
