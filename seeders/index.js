import { seedTerms } from './terms-seeder.js';
import { seedProducts } from './products-seeder.js';

export const runSeeders = async () => {
  try {
    console.log('Starting database seeding...');
    
    await seedTerms();
    await seedProducts();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};

// Run seeders if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeders().then(() => {
    console.log('Seeding process finished');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding process failed:', error);
    process.exit(1);
  });
}
