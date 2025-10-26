# Playwright Test Automation Project

Dự án test automation sử dụng Playwright để test UI cho hệ thống đăng ký đơn hàng.

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- npm hoặc yarn
- Git

## 🚀 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd playwright
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cài đặt Playwright browsers
```bash
npx playwright install --with-deps
```

## 🧪 Chạy Tests

### Chạy tests cơ bản
```bash
npm test
```

### Chạy tests với UI mode (khuyến nghị)
```bash
npm run test:ui
```

### Chạy tests với browser hiển thị
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

## 📁 Cấu trúc Project

```
playwright/
├── pages/                 # Page Object Models
│   ├── BasePage.ts       # Lớp cơ sở
│   ├── OrderListPage.ts  # Trang danh sách đơn hàng
│   └── OrderRegistPage.ts # Trang đăng ký đơn hàng
├── tests/                # Test files
│   └── OrderRegist.spec.ts # Test đăng ký đơn hàng
├── test-data/            # Test data
│   └── order-data.csv    # Dữ liệu test CSV
├── utils/                # Utilities
│   └── csvReader.ts      # Đọc file CSV
├── playwright.config.ts  # Cấu hình Playwright
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## ⚙️ Cấu hình

### Environment
- **Base URL**: `https://staging-accounting.example.com`
- **Browser**: Chromium
- **Timeout**: 60 giây
- **Workers**: 1 (cho luồng nghiệp vụ tuần tự)

### Test Data
Dữ liệu test được lưu trong file `test-data/order-data.csv`:
```csv
orderName,amount
Order-Alpha,1000
Order-Beta,2500
Order-Gamma,500
```

## 🎯 Test Cases

### Order Registration Flow
- Test đăng ký đơn hàng với 3 test cases từ CSV
- Mở popup window để đăng ký đơn hàng
- Kiểm tra đơn hàng đã được tạo thành công

## 📊 Reports

Sau khi chạy tests, reports sẽ được tạo trong:
- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: Chỉ khi test fail
- **Videos**: Khi test retry
- **Traces**: Khi test retry

## 🛠️ Troubleshooting

### Lỗi thường gặp

1. **Browser không cài đặt**
   ```bash
   npx playwright install --with-deps
   ```

2. **Dependencies thiếu**
   ```bash
   npm install
   ```

3. **TypeScript errors**
   ```bash
   npm install --save-dev @types/node
   ```

### Debug mode
Sử dụng `npm run test:debug` để:
- Chạy tests từng bước
- Inspect elements
- Xem network requests
- Take screenshots

## 📝 Ghi chú

- Tests chạy trên staging environment
- Sử dụng Page Object Model pattern
- Support popup/new window handling
- CSV data-driven testing
- TypeScript với strict mode

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

ISC License
