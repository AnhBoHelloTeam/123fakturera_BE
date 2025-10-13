# Database Seeding Guide

## 🚀 Quick Start

### 1. Run Seeders Locally
```bash
# Make sure you have .env file with DATABASE_URL
npm run seed
```

### 2. Run Seeders on Render (Production)
1. Go to your Render backend service
2. Open "Shell" tab
3. Run: `npm run seed`

## 📊 What Gets Seeded

### Terms Data
- **English**: Complete Terms and Conditions
- **Swedish**: Complete Villkor (Swedish terms)

### Products Data
- **20 sample products** for testing
- Includes: Laptop, Mouse, Keyboard, Monitor, etc.
- Realistic pricing and descriptions

### Test User
- **Email**: john@storford.no
- **Password**: password123
- **Company**: Storford AS

## 🔧 Troubleshooting

### Error: "Cannot connect to database"
1. Check DATABASE_URL in environment variables
2. Make sure database is running
3. Verify network connectivity

### Error: "Terms already exist"
- The seeder will clear existing data and re-seed
- This is normal behavior

### Error: "No user found for products"
- Make sure to create a user first
- Or the seeder will create products for the first user

## 📝 Manual Seeding Commands

### Seed Everything
```bash
npm run seed
```

### Seed Only Terms
```bash
node -e "
import('./seeders/terms-seeder.js').then(module => {
  module.up().then(() => console.log('Terms seeded')).catch(console.error);
});
"
```

### Seed Only Products
```bash
node -e "
import('./seeders/products-seeder.js').then(module => {
  module.up().then(() => console.log('Products seeded')).catch(console.error);
});
"
```

## 🎯 Expected Results

After successful seeding:
- Terms page should load without errors
- 20 products should appear in pricelist
- Login should work with test credentials

## 🔍 Verify Seeding

### Check Terms
Visit: `http://localhost:3001/api/terms?language=en`

### Check Products
1. Login with test credentials
2. Go to pricelist
3. Should see 20 products

### Check Database
```sql
SELECT COUNT(*) FROM terms;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
```

Expected results:
- terms: 2 (en, sv)
- products: 20
- users: 1 (test user)
