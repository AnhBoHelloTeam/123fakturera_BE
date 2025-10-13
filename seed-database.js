import sequelize from './src/config/db.js';
import { up as seedTerms } from './seeders/terms-seeder.js';
import { up as seedProducts } from './seeders/products-seeder.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
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
    
    console.log('🎉 Database seeding completed successfully!');
    
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
seedDatabase();
