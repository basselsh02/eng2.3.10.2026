import mongoose from 'mongoose';
import { seedContractBudgetStatements, seedFinancialDeductions } from './src/config/seedBudgetOffice.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/engineering-system';

async function runSeed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('Starting Budget Office seeding...');
        
        await seedContractBudgetStatements();
        console.log('✓ Contract Budget Statements seeded');
        
        await seedFinancialDeductions();
        console.log('✓ Financial Deductions seeded');

        console.log('✓ All Budget Office data seeded successfully');
        
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

runSeed();
