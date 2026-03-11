const mongoose = require('mongoose');
const { 
  CommitteeType, 
  OfferType, 
  DecisionReason, 
  CommitteeRole, 
  FiscalYear,
  Unit,
  CategoryGroup
} = require('./LookupModels');

/**
 * Database seeder for lookup tables
 * Run this once during initial setup or when adding new reference data
 */
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Seed Committee Types
    const committeeTypes = [
      { name: 'لجنة فتح المظاريف الفنية' },
      { name: 'لجنة فتح المظاريف المالية' },
      { name: 'لجنة البت الفني' },
      { name: 'لجنة البت المالي' }
    ];
    
    for (const type of committeeTypes) {
      await CommitteeType.findOneAndUpdate(
        { name: type.name },
        type,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Committee types seeded');
    
    // Seed Offer Types
    const offerTypes = [
      { name: 'عرض أساسي' },
      { name: 'عرض بديل' },
      { name: 'عرض إضافي' }
    ];
    
    for (const type of offerTypes) {
      await OfferType.findOneAndUpdate(
        { name: type.name },
        type,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Offer types seeded');
    
    // Seed Committee Roles
    const committeeRoles = [
      { name: 'رئيس اللجنة' },
      { name: 'عضو' },
      { name: 'أمين سر' },
      { name: 'مقرر' }
    ];
    
    for (const role of committeeRoles) {
      await CommitteeRole.findOneAndUpdate(
        { name: role.name },
        role,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Committee roles seeded');
    
    // Seed Decision Reasons
    const decisionReasons = [
      { reasonText: 'مستوفي المواصفات الفنية', type: 'technical' },
      { reasonText: 'غير مستوفي المواصفات الفنية', type: 'technical' },
      { reasonText: 'عدم تقديم المستندات المطلوبة', type: 'technical' },
      { reasonText: 'عدم اجتياز الموافقة الأمنية', type: 'technical' },
      { reasonText: 'أقل سعر', type: 'financial' },
      { reasonText: 'سعر غير منافس', type: 'financial' },
      { reasonText: 'تجاوز الميزانية المحددة', type: 'financial' },
      { reasonText: 'مقبول فنياً ومالياً', type: 'both' },
      { reasonText: 'مرفوض', type: 'both' }
    ];
    
    for (const reason of decisionReasons) {
      await DecisionReason.findOneAndUpdate(
        { reasonText: reason.reasonText },
        reason,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Decision reasons seeded');
    
    // Seed Units
    const units = [
      { name: 'قطعة', symbol: 'قطعة' },
      { name: 'متر', symbol: 'م' },
      { name: 'كيلوجرام', symbol: 'كجم' },
      { name: 'لتر', symbol: 'لتر' },
      { name: 'طن', symbol: 'طن' },
      { name: 'صندوق', symbol: 'صندوق' },
      { name: 'علبة', symbol: 'علبة' },
      { name: 'كرتونة', symbol: 'كرتونة' }
    ];
    
    for (const unit of units) {
      await Unit.findOneAndUpdate(
        { name: unit.name },
        unit,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Units seeded');
    
    // Seed Fiscal Years
    const currentYear = new Date().getFullYear();
    const fiscalYears = [
      { 
        yearLabel: `${currentYear}/${currentYear - 1}`,
        startDate: new Date(`${currentYear - 1}-01-01`),
        endDate: new Date(`${currentYear - 1}-12-31`)
      },
      { 
        yearLabel: `${currentYear + 1}/${currentYear}`,
        startDate: new Date(`${currentYear}-01-01`),
        endDate: new Date(`${currentYear}-12-31`)
      },
      { 
        yearLabel: `${currentYear + 2}/${currentYear + 1}`,
        startDate: new Date(`${currentYear + 1}-01-01`),
        endDate: new Date(`${currentYear + 1}-12-31`)
      }
    ];
    
    for (const year of fiscalYears) {
      await FiscalYear.findOneAndUpdate(
        { yearLabel: year.yearLabel },
        year,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Fiscal years seeded');
    
    // Seed Category Groups
    const categoryGroups = [
      { code: 'CAT001', name: 'مواد إنشائية' },
      { code: 'CAT002', name: 'معدات وأجهزة' },
      { code: 'CAT003', name: 'خدمات استشارية' },
      { code: 'CAT004', name: 'مستلزمات مكتبية' },
      { code: 'CAT005', name: 'أثاث' }
    ];
    
    for (const group of categoryGroups) {
      await CategoryGroup.findOneAndUpdate(
        { code: group.code },
        group,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Category groups seeded');
    
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Export the seeder function
module.exports = { seedDatabase };

// If running directly from command line
if (require.main === module) {
  // Connect to MongoDB (adjust connection string as needed)
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/procurement_system';
  
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });
}
