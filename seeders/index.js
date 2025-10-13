import sequelize from '../src/config/db.js';
import { up as seedTerms, down as unseedTerms } from './terms-seeder.js';
import { up as seedProducts, down as unseedProducts } from './products-seeder.js';
import dotenv from 'dotenv';

dotenv.config();

const runSeeders = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Run seeders
    console.log('Running terms seeder...');
    await seedTerms();
    console.log('Terms seeder finished.');

    console.log('Running products seeder...');
    await seedProducts();
    console.log('Products seeder finished.');

    console.log('All seeders executed successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or run seeders:', error);
  } finally {
    await sequelize.close();
  }
};

const revertSeeders = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    console.log('Reverting products seeder...');
    await unseedProducts();
    console.log('Products seeder reverted.');

    console.log('Reverting terms seeder...');
    await unseedTerms();
    console.log('Terms seeder reverted.');

    console.log('All seeders reverted successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or revert seeders:', error);
  } finally {
    await sequelize.close();
  }
};

const command = process.argv[2];

if (command === 'undo') {
  revertSeeders();
} else {
  runSeeders();
}

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
