import sequelize from './src/config/db.js';
import { up as seedTerms } from './seeders/terms-seeder.js';
import { up as seedProducts } from './seeders/products-seeder.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Override DATABASE_URL with Supabase URL
process.env.DATABASE_URL = 'postgresql://postgres.szmivmrxzrgldfzelcyj:NhanNG21082004@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const seedToSupabase = async () => {
  try {
    console.log('🌱 Starting database seeding to Supabase...');
    console.log('📡 Connecting to:', process.env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@'));
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync database schema
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized');
    
    // Seed terms
    console.log('📄 Seeding terms...');
    await seedTerms();
    console.log('✅ Terms seeded successfully');
    
    // Seed products
    console.log('📦 Seeding products...');
    await seedProducts();
    console.log('✅ Products seeded successfully');
    
    console.log('🎉 Database seeding to Supabase completed successfully!');
    console.log('🔗 Your data is now available at:');
    console.log('   - Terms: https://123fakturera-backend.onrender.com/api/terms?language=en');
    console.log('   - Terms: https://123fakturera-backend.onrender.com/api/terms?language=sv');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
seedToSupabase();
