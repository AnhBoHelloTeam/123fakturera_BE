# Local Seeding to Supabase Guide

## 🚀 Quick Start

### 1. Chạy Seeders từ Local
```bash
# Chạy script để seed data lên Supabase
npm run seed:supabase
```

### 2. Verify Data
Sau khi chạy thành công, kiểm tra:
- Terms API: https://123fakturera-backend.onrender.com/api/terms?language=en
- Frontend: https://123fakturera-frontend.onrender.com/terms

## 📊 Database Connection

### Supabase PostgreSQL
- **URL**: postgresql://postgres.szmivmrxzrgldfzelcyj:NhanNG21082004@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
- **Provider**: Supabase
- **Region**: ap-southeast-1 (Singapore)

## 🔧 Scripts Available

### Seed to Supabase
```bash
npm run seed:supabase
```
- Kết nối trực tiếp đến Supabase
- Seed terms và products data
- Tự động sync database schema

### Seed Local Database
```bash
npm run seed
```
- Sử dụng DATABASE_URL từ .env
- Cho development local

## 📝 What Gets Seeded

### Terms Data
- **English**: Complete Terms and Conditions (8 sections)
- **Swedish**: Complete Villkor (8 sections)
- **Format**: HTML với proper headings và paragraphs

### Products Data
- **20 sample products**: Laptop, Mouse, Keyboard, Monitor, etc.
- **Realistic pricing**: In price và selling price
- **Complete details**: Article numbers, units, stock, descriptions

### Test User
- **Email**: john@storford.no
- **Password**: password123
- **Company**: Storford AS
- **Contact**: John Andre

## 🎯 Expected Results

### After Successful Seeding
1. **Terms Page**: Load được nội dung đầy đủ thay vì lỗi
2. **Pricelist**: Hiển thị 20 sản phẩm
3. **Login**: Hoạt động với test credentials
4. **API**: Trả về data thay vì empty

### Database Tables
```sql
-- Check seeded data
SELECT COUNT(*) FROM terms;        -- Should return 2 (en, sv)
SELECT COUNT(*) FROM products;     -- Should return 20
SELECT COUNT(*) FROM users;        -- Should return 1 (test user)
```

## 🔍 Troubleshooting

### Error: "Connection refused"
- Kiểm tra internet connection
- Verify Supabase URL đúng
- Check Supabase service status

### Error: "Authentication failed"
- Verify username/password trong connection string
- Check Supabase project settings

### Error: "Database does not exist"
- Database sẽ được tạo tự động
- Nếu vẫn lỗi, tạo database manual trên Supabase

### Error: "Table doesn't exist"
- Script sẽ tự động tạo tables
- Nếu vẫn lỗi, check database permissions

## 🚀 Deployment Flow

### 1. Local Seeding
```bash
npm run seed:supabase
```

### 2. Deploy Backend
- Push code lên GitHub
- Render sẽ auto-deploy
- Backend sẽ connect đến Supabase

### 3. Deploy Frontend
- Push code lên GitHub
- Render sẽ auto-deploy
- Frontend sẽ connect đến backend

### 4. Test Everything
- Login: john@storford.no / password123
- Terms: Should load full content
- Pricelist: Should show 20 products

## 📞 Support

Nếu gặp lỗi:
1. Check console output
2. Verify Supabase connection
3. Check Render deployment logs
4. Test API endpoints directly

---
**Last Updated**: October 14, 2025
**Status**: Ready for Production
