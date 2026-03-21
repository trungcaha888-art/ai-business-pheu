# AI BUSINESS Landing Page - Skill Documentation

## Tổng Quan Dự Án
Landing page dạng **phễu bán hàng (funnel page)** cho khóa học AI Business 3 buổi online miễn phí. Mục tiêu: thu lead (Tên, Email, SĐT) → chuyển hướng vào nhóm Zalo.

## Công Nghệ Sử Dụng
- **HTML5** + **CSS3** (Vanilla, không framework)
- **JavaScript** (Vanilla)
- **Google Fonts**: Montserrat + Be Vietnam Pro
- **Google Apps Script** → lưu data vào Google Sheets
- **Deploy**: Vercel (static site)

## Bảng Màu
| Biến CSS | Giá Trị | Mô Tả |
|----------|---------|-------|
| `--red-dark` | `#8B0000` | Đỏ đậm |
| `--red-mid` | `#B30000` | Đỏ trung |
| `--red-bright` | `#E53935` | Đỏ sáng |
| `--red-bg` | `#2D0000` | Nền đỏ tối |
| `--gold` | `#FFD700` | Vàng gold |
| `--gold-dark` | `#DAA520` | Vàng đậm |
| `--black` | `#0A0A0A` | Đen |
| `--white` | `#FFFFFF` | Trắng |

## Cấu Trúc Sections

### Section 1: Hero (Đầu trang + lặp lại cuối trang)
- **Nền**: Gradient đỏ đậm/đen với glow effects
- **Layout**: Grid 2 cột (1.2fr content | 1fr form)
- **Trái**: Tiêu đề "AI BUSINESS", course box, audience, 3 feature bars (✔)
- **Phải**: Form đăng ký (Tên, Gmail, SĐT) + nút "ĐĂNG KÝ NGAY" vàng gold
- **Dưới**: Event details bar (thời gian, ngày, hình thức)
- **Lặp lại** ở cuối trang với ID riêng (`registrationFormBottom`)

### Section 2: Pain Points (Nỗi đau)
- **Nền**: Xám nhạt `#F5F5F5`
- **Cards**: Viền trái đỏ, icon `!` đỏ tròn
- **4 pain cards** + CTA box đỏ đậm bên dưới
- **Animation**: `fadeInUp`

### Section 3: Learning Outcomes (Kết quả học)
- **Nền**: Gradient đỏ đậm/đen (dark)
- **Grid 2x2**: 4 outcome cards với emoji icon
- **Tiêu đề card**: Vàng gold
- **Hover effect** + `fadeInUp` animation

### Section 4: 3-Day Roadmap (Lộ trình)
- **Nền**: Xám nhạt `#F5F5F5`
- **Timeline dọc**: Đường kẻ gradient đỏ→vàng→đỏ
- **3 ngày**: Badge màu (đỏ → đỏ đậm → gradient vàng)
- **Cards nội dung**: Viền trái đỏ, danh sách bullets

### Section 5: Before/After (Trước/Sau)
- **Nền**: Xám nhạt `#F5F5F5`
- **Grid 2 cột**: Trước (đỏ) | Sau (xanh lá)
- **Header**: Đỏ `#D32F2F` | Xanh `#2E7D32`, chữ trắng
- **List items**: Markers ✗ (đỏ) | ✓ (xanh)

### Section 6: Trainer Profile (Chuyên gia)
- **Nền**: Gradient đỏ đậm/đen (dark)
- **Layout**: Grid (ảnh tròn | thông tin)
- **Ảnh**: Tròn, viền vàng gold 4px, shadow glow
- **Tên**: Vàng gold, role in nghiêng
- **5 credentials**: Icon ⭐, highlight vàng gold

### Section 7: Training Gallery (Hình ảnh đào tạo)
- **Nền**: Vàng nhạt `#FDF6E3`
- **Layout**: Grid (ảnh chính lớn | thumbnails dọc)
- **7 ảnh**: `ảnh 1.jpg` → `ảnh 7.png`
- **Navigation**: Nút ‹ › + click thumbnail
- **JS**: Fade transition khi đổi ảnh, auto-scroll thumbnail

### Section 8: Bonuses (Quà tặng)
- **Nền**: Xám nhạt `#F5F5F5`
- **5 gift cards**: Viền trái vàng gold, badge "MIỄN PHÍ" đỏ
- **Divider**: "CHƯA HẾT... BẠN CÒN NHẬN ĐƯỢC:"
- **Pricing CTA**: Nền đỏ đậm gradient
  - Giá gốc ~~6.789.000 VNĐ~~ gạch ngang
  - "0 ĐỒNG" vàng gold to lớn
  - Nút "GIỮ CHỖ TÔI NGAY" pulse animation

## Popup Zalo
- **Trigger**: Sau khi submit form đăng ký
- **Nội dung**:
  - Tiêu đề đỏ "CÒN 1 BƯỚC NỮA..."
  - Nút xanh dương vào nhóm Zalo
  - Link Zalo hiển thị
  - Cảnh báo vàng (phải vào nhóm)
  - Đếm ngược 01:50 (xanh lá)
- **Đóng**: Nút ✕ hoặc click overlay

## Google Sheets Integration
- **Phương thức**: Fetch POST với FormData
- **Endpoint**: Google Apps Script Web App
- **Data gửi**: `name`, `email`, `phone`, `utm` (full URL)
- **Apps Script code**:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  sheet.appendRow([
    new Date(),
    e.parameter.name,
    e.parameter.email,
    e.parameter.phone,
    e.parameter.utm
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ result: "success" })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

## SEO & Social Media
- **Meta tags**: title, description, viewport
- **Open Graph** (Facebook/Zalo): og:title, og:description, og:image, og:locale
- **Twitter Card**: summary_large_image
- **Thumbnail**: `og-thumbnail.png` (1200x630)
- **Lưu ý**: og:image phải dùng URL tuyệt đối khi deploy

## Responsive Design
| Breakpoint | Thay đổi chính |
|-----------|---------------|
| `≤ 1024px` | Hero → 1 cột, form lên trên |
| `≤ 768px` | Cards → 1 cột, gallery thumbnails → ngang, trainer card → 1 cột |
| `≤ 480px` | Font sizes giảm, padding compact |

## Animations
- `fadeInUp`: Cards, sections mới xuất hiện
- `fadeInLeft` / `fadeInRight`: Hero content
- `ctaPulse`: Nút CTA pulse glow
- `popupSlide`: Popup xuất hiện
- Gallery: Fade opacity khi đổi ảnh

## Cấu Trúc Files
```
AI BUSINESS LỚP PHỄU/
├── index.html          # Trang chính
├── style.css           # Toàn bộ CSS
├── script.js           # JavaScript (form, gallery, popup, countdown)
├── og-thumbnail.png    # Thumbnail cho social media
├── ảnh thầy.png        # Ảnh trainer
├── ảnh 1.jpg → ảnh 7   # Ảnh gallery đào tạo
├── s2.txt              # Nội dung section 2
├── s3.txt              # Nội dung section 3-6
├── s4.txt              # Nội dung section 8
└── skill.md            # File này
```

## Quy Trình Làm Việc
1. Nhận nội dung từ file `.txt` → phân tích cấu trúc
2. Tạo HTML với semantic structure + class names rõ ràng
3. Tạo CSS theo design system (biến màu, font, spacing)
4. Thêm responsive cho 3 breakpoints
5. Thêm JavaScript cho tương tác (form, gallery, popup)
6. Kết nối Google Sheets qua Apps Script
7. Tối ưu SEO + Open Graph meta tags
