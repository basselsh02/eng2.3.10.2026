import mongoose from 'mongoose';
import ContractBudgetStatement from './src/modules/budgetOffice/models/contractBudgetStatement.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/engineering-system';

async function testQuery() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Count total documents
        const total = await ContractBudgetStatement.countDocuments();
        console.log('\n=== TOTAL CONTRACT BUDGET STATEMENTS:', total);
        
        // Get all documents
        const all = await ContractBudgetStatement.find().lean();
        console.log('\n=== ALL DOCUMENTS ===');
        all.forEach((doc, index) => {
            console.log(`\n${index + 1}. Project Code: ${doc.projectCode}`);
            console.log(`   Financial Year: ${doc.financialYear}`);
            console.log(`   Status: ${doc.status}`);
            console.log(`   Organizational Unit: ${doc.organizationalUnit}`);
            console.log(`   Project: ${doc.project}`);
        });
        
        // Test query without any filters
        const queryResult = await ContractBudgetStatement.find({}).lean();
        console.log(`\n=== QUERY {} returned ${queryResult.length} documents ===`);
        
        await mongoose.disconnect();
        console.log('\nDisconnected');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testQuery();
