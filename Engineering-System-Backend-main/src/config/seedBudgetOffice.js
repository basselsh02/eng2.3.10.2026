import ContractBudgetStatement from "../modules/budgetOffice/models/contractBudgetStatement.model.js";
import FinancialDeduction from "../modules/budgetOffice/models/financialDeduction.model.js";
import projectModel from "../modules/project/models/project.model.js";
import userModel from "../modules/User/models/user.model.js";
import logger from "../utils/logger.js";

export const seedContractBudgetStatements = async () => {
    try {
        // Force clear and re-seed
        await ContractBudgetStatement.deleteMany({});
        logger.info('Cleared existing Contract Budget Statements');

        // Get sample projects and users
        const projects = await projectModel.find().limit(3);
        const users = await userModel.find({ role: { $ne: "SUPER_ADMIN" } }).limit(2);
        
        if (projects.length === 0) {
            logger.warn("No projects found for Contract Budget Statement seeding.");
            return;
        }
        
        if (users.length === 0) {
            logger.warn("No users found for Contract Budget Statement seeding.");
            return;
        }
        
        const createdByUser = users[0];
        const approvedByUser = users.length > 1 ? users[1] : users[0];

        const sampleStatements = [
            {
                projectCode: projects[0].projectCode,
                financialYear: "2025",
                project: projects[0]._id,
                projectData: {
                    projectNumber: projects[0].projectCode,
                    projectTypeCode: "PT-001",
                    financialYear: "2025",
                    projectName: projects[0].projectName,
                    projectStartDate: new Date("2025-03-01"),
                    projectEndDate: new Date("2025-12-31"),
                    agreementContract: "عقد رقم CTR-2025-001",
                    fundingSource: "وزارة المالية",
                    beneficiaryEntity: "الهيئة العامة للإسكان",
                    responsibleBranch: "فرع الإنشاءات الهندسية",
                    mainProject: "مشروع البنية التحتية الرئيسي",
                    companyCode: "COMP-001"
                },
                contractualData: {
                    projectNumber: projects[0].projectCode,
                    serialNumber: "SER-2025-001",
                    projectDescription: "تطوير البنية التحتية للصرف الصحي في المدينة الشرقية",
                    budget: 15000000,
                    financialYear: "2025",
                    item: "بند أعمال البنية التحتية",
                    disbursement: 5800000,
                    deductionItem: "بند خصم التأمينات والضمانات",
                    contractualValue: 14500000,
                    companyCode: "COMP-001",
                    estimatedValue: 15500000
                },
                disbursementData: {
                    companyCode: "COMP-001",
                    companyName: "شركة البناء الحديثة",
                    totalBudget: 14500000,
                    totalDisbursed: 5800000,
                    remainingBudget: 8700000,
                    disbursementPercentage: 40,
                    disbursementItems: [
                        {
                            itemNumber: "1",
                            itemDescription: "أعمال الحفر والردم",
                            budgetedAmount: 4500000,
                            disbursedAmount: 4500000,
                            remainingAmount: 0,
                            disbursementDate: new Date("2025-04-15"),
                            invoiceNumber: "INV-2025-001",
                            notes: "مكتمل"
                        },
                        {
                            itemNumber: "2",
                            itemDescription: "تركيب مواسير الصرف",
                            budgetedAmount: 6000000,
                            disbursedAmount: 1300000,
                            remainingAmount: 4700000,
                            disbursementDate: new Date("2025-05-20"),
                            invoiceNumber: "INV-2025-002",
                            notes: "جاري التنفيذ"
                        },
                        {
                            itemNumber: "3",
                            itemDescription: "محطات الضخ",
                            budgetedAmount: 4000000,
                            disbursedAmount: 0,
                            remainingAmount: 4000000,
                            disbursementDate: null,
                            invoiceNumber: "",
                            notes: "لم يبدأ بعد"
                        }
                    ]
                },
                materialsDisbursement: {
                    totalMaterialsBudget: 3500000,
                    totalMaterialsDisbursed: 1400000,
                    remainingMaterialsBudget: 2100000,
                    materials: [
                        {
                            code: "MAT-001",
                            materialsDescription: "أسمنت مسلح عالي الجودة",
                            quantity: 500,
                            unit: "طن",
                            unitDescription: "طن متري",
                            unitPrice: 2000,
                            total: 1000000
                        },
                        {
                            code: "MAT-002",
                            materialsDescription: "حديد تسليح قطر 16 ملم",
                            quantity: 300,
                            unit: "طن",
                            unitDescription: "طن متري",
                            unitPrice: 5000,
                            total: 1500000
                        },
                        {
                            code: "MAT-003",
                            materialsDescription: "مواسير PVC قطر 300 ملم",
                            quantity: 1000,
                            unit: "متر",
                            unitDescription: "متر طولي",
                            unitPrice: 150,
                            total: 150000
                        }
                    ]
                },
                status: "approved",
                createdBy: createdByUser._id,
                organizationalUnit: createdByUser.organizationalUnit
            },
            {
                projectCode: projects[1].projectCode,
                financialYear: "2024",
                project: projects[1]._id,
                projectData: {
                    projectNumber: projects[1].projectCode,
                    projectTypeCode: "PT-002",
                    financialYear: "2024",
                    projectName: projects[1].projectName,
                    projectStartDate: new Date("2024-04-15"),
                    projectEndDate: new Date("2024-10-30"),
                    agreementContract: "عقد رقم CTR-2024-002",
                    fundingSource: "وزارة الكهرباء والطاقة",
                    beneficiaryEntity: "الهيئة العامة للكهرباء",
                    responsibleBranch: "فرع الأحياء الشرقية",
                    mainProject: "مشروع تجديد شبكة الكهرباء",
                    companyCode: "COMP-002"
                },
                contractualData: {
                    projectNumber: projects[1].projectCode,
                    serialNumber: "SER-2024-002",
                    projectDescription: "صيانة وتجديد شبكة الكهرباء في الأحياء الشرقية",
                    budget: 8500000,
                    financialYear: "2024",
                    item: "بند أعمال الكهرباء",
                    disbursement: 7380000,
                    deductionItem: "بند خصم المواد الموردة",
                    contractualValue: 8200000,
                    companyCode: "COMP-002",
                    estimatedValue: 8800000
                },
                disbursementData: {
                    companyCode: "COMP-002",
                    companyName: "شركة الكهرباء الوطنية",
                    totalBudget: 8200000,
                    totalDisbursed: 7380000,
                    remainingBudget: 820000,
                    disbursementPercentage: 90,
                    disbursementItems: [
                        {
                            itemNumber: "1",
                            itemDescription: "أعمال كابلات كهرباء",
                            budgetedAmount: 3400000,
                            disbursedAmount: 3400000,
                            remainingAmount: 0,
                            disbursementDate: new Date("2024-06-20"),
                            invoiceNumber: "INV-2024-010",
                            notes: "مكتمل"
                        },
                        {
                            itemNumber: "2",
                            itemDescription: "أعمدة إنارة",
                            budgetedAmount: 2550000,
                            disbursedAmount: 2550000,
                            remainingAmount: 0,
                            disbursementDate: new Date("2024-07-15"),
                            invoiceNumber: "INV-2024-011",
                            notes: "مكتمل"
                        },
                        {
                            itemNumber: "3",
                            itemDescription: "محطات تحويل",
                            budgetedAmount: 2250000,
                            disbursedAmount: 1430000,
                            remainingAmount: 820000,
                            disbursementDate: new Date("2024-08-30"),
                            invoiceNumber: "INV-2024-012",
                            notes: "الدفعة الأخيرة قيد المراجعة"
                        }
                    ]
                },
                materialsDisbursement: {
                    totalMaterialsBudget: 2000000,
                    totalMaterialsDisbursed: 1800000,
                    remainingMaterialsBudget: 200000,
                    materials: [
                        {
                            code: "MAT-101",
                            materialsDescription: "كابلات كهربائية 3 فاز",
                            quantity: 5000,
                            unit: "متر",
                            unitDescription: "متر طولي",
                            unitPrice: 200,
                            total: 1000000
                        },
                        {
                            code: "MAT-102",
                            materialsDescription: "أعمدة إنارة LED موفرة للطاقة",
                            quantity: 100,
                            unit: "عمود",
                            unitDescription: "عمود كامل مع التجهيزات",
                            unitPrice: 10000,
                            total: 1000000
                        }
                    ]
                },
                status: "completed",
                approvedBy: approvedByUser._id,
                approvalDate: new Date("2024-09-15"),
                createdBy: createdByUser._id,
                organizationalUnit: createdByUser.organizationalUnit
            }
        ];

        const createdStatements = await ContractBudgetStatement.insertMany(sampleStatements);
        
        logger.info(`Successfully created ${createdStatements.length} Contract Budget Statements`);

    } catch (error) {
        logger.error("Error seeding Contract Budget Statements:", error.message || error);
        throw error;
    }
};

export const seedFinancialDeductions = async () => {
    try {
        // Force clear and re-seed
        await FinancialDeduction.deleteMany({});
        logger.info('Cleared existing Financial Deductions');

        // Get sample projects and users
        const projects = await projectModel.find().limit(3);
        const users = await userModel.find({ role: { $ne: "SUPER_ADMIN" } }).limit(2);
        
        if (projects.length === 0) {
            logger.warn("No projects found for Financial Deduction seeding.");
            return;
        }
        
        if (users.length === 0) {
            logger.warn("No users found for Financial Deduction seeding.");
            return;
        }
        
        const createdByUser = users[0];
        const approvedByUser = users.length > 1 ? users[1] : users[0];

        const sampleDeductions = [
            {
                projectCode: projects[0].projectCode,
                project: projects[0]._id,
                budgetCode: "BUD-2025-001",
                financialYear: "2025",
                itemCode: "ITEM-001",
                disbursementCode: "DISB-2025-001",
                beneficiaryEntity: "الهيئة العامة للإسكان",
                deductionItem: "بند خصم التأمينات والضمانات",
                allocatedValue: 725000,
                notes: "خصم التأمينات القانونية 5% من قيمة العقد",
                reviewedBy: approvedByUser._id,
                reviewDate: new Date("2025-06-16"),
                reviewNotes: "تم التحقق من الخصم",
                approvedBy: approvedByUser._id,
                approvalDate: new Date("2025-06-17"),
                approvalNotes: "موافق على الخصم",
                createdBy: createdByUser._id,
                organizationalUnit: createdByUser.organizationalUnit
            },
            {
                projectCode: projects[0].projectCode,
                project: projects[0]._id,
                budgetCode: "BUD-2025-002",
                financialYear: "2025",
                itemCode: "ITEM-002",
                disbursementCode: "DISB-2025-002",
                beneficiaryEntity: "الهيئة العامة للإسكان",
                deductionItem: "بند خصم غرامة التأخير",
                allocatedValue: 420000,
                notes: "غرامة تأخير 1% عن كل أسبوع تأخير",
                reviewedBy: approvedByUser._id,
                reviewDate: new Date("2025-07-11"),
                reviewNotes: "قيد المراجعة",
                createdBy: createdByUser._id,
                organizationalUnit: createdByUser.organizationalUnit
            },
            {
                projectCode: projects[1].projectCode,
                project: projects[1]._id,
                budgetCode: "BUD-2024-001",
                financialYear: "2024",
                itemCode: "ITEM-003",
                disbursementCode: "DISB-2024-001",
                beneficiaryEntity: "الهيئة العامة للكهرباء",
                deductionItem: "بند خصم المواد الموردة",
                allocatedValue: 143000,
                notes: "خصم 10% قيمة المواد المستلمة من المخازن",
                reviewedBy: approvedByUser._id,
                reviewDate: new Date("2024-09-11"),
                reviewNotes: "مواد تم توريدها من المخازن",
                approvedBy: approvedByUser._id,
                approvalDate: new Date("2024-09-12"),
                approvalNotes: "موافق على الخصم",
                createdBy: createdByUser._id,
                organizationalUnit: createdByUser.organizationalUnit
            },
            {
                projectCode: projects[1].projectCode,
                project: projects[1]._id,
                budgetCode: "BUD-2024-002",
                financialYear: "2024",
                itemCode: "ITEM-004",
                disbursementCode: "DISB-2024-002",
                beneficiaryEntity: "الهيئة العامة للكهرباء",
                deductionItem: "بند التأمينات القانونية",
                allocatedValue: 127500,
                notes: "خصم 5% تأمينات حسب القانون",
                reviewedBy: approvedByUser._id,
                reviewDate: new Date("2024-08-21"),
                reviewNotes: "خصم التأمينات القانونية",
                approvedBy: approvedByUser._id,
                approvalDate: new Date("2024-08-22"),
                approvalNotes: "موافق - خصم قانوني",
                paidDate: new Date("2024-08-25"),
                paymentMethod: "تحويل بنكي",
                paymentReference: "TRF-2024-350",
                createdBy: createdByUser._id,
                organizationalUnit: createdByUser.organizationalUnit
            },
            {
                projectCode: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                project: projects[2] ? projects[2]._id : projects[0]._id,
                budgetCode: "BUD-2026-001",
                financialYear: "2026",
                itemCode: "ITEM-005",
                disbursementCode: "DISB-2026-001",
                beneficiaryEntity: "الهيئة العامة للأشغال",
                deductionItem: "بند غرامة التأخير في البدء",
                allocatedValue: 352000,
                notes: "غرامة تأخير 4% من القيمة عن التأخر في بدء الأعمال",
                createdBy: createdByUser._id,
                organizationalUnit: createdByUser.organizationalUnit
            }
        ];

        const createdDeductions = await FinancialDeduction.insertMany(sampleDeductions);
        
        logger.info(`Successfully created ${createdDeductions.length} Financial Deductions`);

    } catch (error) {
        logger.error("Error seeding Financial Deductions:", error.message || error);
        throw error;
    }
};
