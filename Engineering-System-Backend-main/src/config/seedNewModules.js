import Procedure from "../modules/procedures/models/procedure.model.js";
import FinancialProcedure from "../modules/financialProcedures/models/financialProcedure.model.js";
import FinancialStatus from "../modules/financialStatus/models/financialStatus.model.js";
import logger from "../utils/logger.js";

// Seed Procedures
export const seedProcedures = async (user, projects) => {
    try {
        const existingProcedures = await Procedure.countDocuments();
        if (existingProcedures > 0) {
            logger.info(`${existingProcedures} procedure(s) already exist. Skipping procedure seeding.`);
            return;
        }

        const sampleProcedures = [
            // Company Offers Procedures
            {
                project: projects[0]._id,
                procedureType: "company_offers",
                companyOffers: [
                    {
                        company: "شركة البناء الحديثة",
                        offerType: "عرض فني ومالي",
                        offerNumber: "CO-2025-001",
                        offerDate: new Date("2025-01-25"),
                        offerEndDate: new Date("2025-02-25"),
                        conditions: "الالتزام بالمواصفات الفنية والمعايير المطلوبة",
                        offerPurpose: "تقديم عرض شامل لأعمال الصرف الصحي",
                        date: new Date("2025-01-25"),
                        modelNumber: "MOD-001"
                    },
                    {
                        company: "شركة المهندسين للإنشاءات",
                        offerType: "عرض فني ومالي",
                        offerNumber: "CO-2025-002",
                        offerDate: new Date("2025-01-26"),
                        offerEndDate: new Date("2025-02-26"),
                        conditions: "ضمان الجودة والتسليم في الموعد المحدد",
                        offerPurpose: "المشاركة في مناقصة أعمال الصرف",
                        date: new Date("2025-01-26"),
                        modelNumber: "MOD-002"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            {
                project: projects[1]._id,
                procedureType: "company_offers",
                companyOffers: [
                    {
                        company: "شركة الكهرباء الوطنية",
                        offerType: "عرض فني",
                        offerNumber: "CO-2024-001",
                        offerDate: new Date("2024-03-20"),
                        offerEndDate: new Date("2024-04-20"),
                        conditions: "خبرة لا تقل عن 10 سنوات في أعمال الكهرباء",
                        offerPurpose: "صيانة شبكة الكهرباء",
                        date: new Date("2024-03-20"),
                        modelNumber: "MOD-003"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            // Technical Resolution Procedures
            {
                project: projects[0]._id,
                procedureType: "technical_resolution",
                committeeData: [
                    {
                        recordNameNumber: "سجل رقم 001",
                        recordNumber: "REC-001",
                        companyName: "شركة البناء الحديثة"
                    },
                    {
                        recordNameNumber: "سجل رقم 002",
                        recordNumber: "REC-002",
                        companyName: "شركة المهندسين للإنشاءات"
                    }
                ],
                technicalProcedures: [
                    {
                        order: 1,
                        name: "م. أحمد محمود",
                        position: "رئيس اللجنة الفنية",
                        approved: true,
                        printModel: "نموذج A"
                    },
                    {
                        order: 2,
                        name: "م. فاطمة السيد",
                        position: "عضو لجنة فنية",
                        approved: true,
                        printModel: "نموذج A"
                    },
                    {
                        order: 3,
                        name: "م. محمد عبد الله",
                        position: "عضو لجنة فنية",
                        approved: true,
                        printModel: "نموذج A"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            {
                project: projects[2]._id,
                procedureType: "technical_resolution",
                committeeData: [
                    {
                        recordNameNumber: "سجل رقم 003",
                        recordNumber: "REC-003",
                        companyName: "شركة الإنشاءات العامة"
                    }
                ],
                technicalProcedures: [
                    {
                        order: 1,
                        name: "م. سارة أحمد",
                        position: "رئيس اللجنة",
                        approved: true,
                        printModel: "نموذج B"
                    },
                    {
                        order: 2,
                        name: "م. خالد محمد",
                        position: "عضو",
                        approved: true,
                        printModel: "نموذج B"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            // Financial Proposal Procedures
            {
                project: projects[0]._id,
                procedureType: "financial_proposal",
                financialProposal: {
                    offerType: "مقترح مالي شامل",
                    company: "شركة البناء الحديثة",
                    offerNumber: "FP-2025-001",
                    offerDate: new Date("2025-02-01"),
                    items: [
                        {
                            rowCode: "001",
                            description: "أعمال حفر وردم",
                            unit: "متر مكعب",
                            quantity: 3000,
                            unitPrice: 1500,
                            total: 4500000
                        },
                        {
                            rowCode: "002",
                            description: "تركيب مواسير",
                            unit: "متر",
                            quantity: 1500,
                            unitPrice: 4000,
                            total: 6000000
                        },
                        {
                            rowCode: "003",
                            description: "محطات ضخ",
                            unit: "محطة",
                            quantity: 3,
                            unitPrice: 1500000,
                            total: 4500000
                        }
                    ]
                },
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            {
                project: projects[1]._id,
                procedureType: "financial_proposal",
                financialProposal: {
                    offerType: "مقترح مالي",
                    company: "شركة الكهرباء الوطنية",
                    offerNumber: "FP-2024-001",
                    offerDate: new Date("2024-03-28"),
                    items: [
                        {
                            rowCode: "001",
                            description: "كابلات كهرباء",
                            unit: "كيلومتر",
                            quantity: 40,
                            unitPrice: 85000,
                            total: 3400000
                        },
                        {
                            rowCode: "002",
                            description: "أعمدة إنارة",
                            unit: "عمود",
                            quantity: 120,
                            unitPrice: 21250,
                            total: 2550000
                        }
                    ]
                },
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            {
                project: projects[2]._id,
                procedureType: "financial_proposal",
                financialProposal: {
                    offerType: "مقترح مالي للإنشاءات التعليمية",
                    company: "شركة الإنشاءات العامة",
                    offerNumber: "FP-2026-001",
                    offerDate: new Date("2026-02-10"),
                    items: [
                        {
                            rowCode: "001",
                            description: "هيكل المبنى الرئيسي",
                            unit: "مبنى",
                            quantity: 1,
                            unitPrice: 8800000,
                            total: 8800000
                        },
                        {
                            rowCode: "002",
                            description: "فصول دراسية",
                            unit: "فصل",
                            quantity: 12,
                            unitPrice: 458333,
                            total: 5500000
                        },
                        {
                            rowCode: "003",
                            description: "مختبرات علمية",
                            unit: "مختبر",
                            quantity: 3,
                            unitPrice: 1100000,
                            total: 3300000
                        },
                        {
                            rowCode: "004",
                            description: "مكتبة مركزية",
                            unit: "مكتبة",
                            quantity: 1,
                            unitPrice: 4400000,
                            total: 4400000
                        }
                    ]
                },
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            }
        ];

        const createdProcedures = await Procedure.insertMany(sampleProcedures);
        logger.info(`Successfully created ${createdProcedures.length} sample procedures.`);

    } catch (error) {
        logger.error("Error seeding procedures:", error.message || error);
        throw error;
    }
};

// Seed Financial Procedures
export const seedFinancialProcedures = async (user, projects) => {
    try {
        const existingFinancialProcedures = await FinancialProcedure.countDocuments();
        if (existingFinancialProcedures > 0) {
            logger.info(`${existingFinancialProcedures} financial procedure(s) already exist. Skipping seeding.`);
            return;
        }

        const sampleFinancialProcedures = [
            // Financial Offers
            {
                project: projects[0]._id,
                procedureType: "offers",
                financialOffers: {
                    company: "شركة البناء الحديثة",
                    offerType: "عرض مالي شامل",
                    offerNumber: "FO-2025-001",
                    offerStartDate: new Date("2025-02-01"),
                    offerEndDate: new Date("2025-12-31"),
                    items: [
                        {
                            rowCode: "001",
                            description: "أعمال حفر وردم",
                            unit: "متر مكعب",
                            quantity: 3000,
                            unitPrice: 1500,
                            total: 4500000,
                            serialNumber: "SN-001"
                        },
                        {
                            rowCode: "002",
                            description: "تركيب مواسير صرف",
                            unit: "متر",
                            quantity: 1500,
                            unitPrice: 4000,
                            total: 6000000,
                            serialNumber: "SN-002"
                        },
                        {
                            rowCode: "003",
                            description: "محطات ضخ",
                            unit: "محطة",
                            quantity: 3,
                            unitPrice: 1500000,
                            total: 4500000,
                            serialNumber: "SN-003"
                        }
                    ]
                },
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            {
                project: projects[1]._id,
                procedureType: "offers",
                financialOffers: {
                    company: "شركة الكهرباء الوطنية",
                    offerType: "عرض مالي",
                    offerNumber: "FO-2024-001",
                    offerStartDate: new Date("2024-04-01"),
                    offerEndDate: new Date("2024-10-30"),
                    items: [
                        {
                            rowCode: "001",
                            description: "كابلات كهربائية",
                            unit: "كيلومتر",
                            quantity: 40,
                            unitPrice: 85000,
                            total: 3400000,
                            serialNumber: "SN-004"
                        },
                        {
                            rowCode: "002",
                            description: "أعمدة إنارة",
                            unit: "عمود",
                            quantity: 120,
                            unitPrice: 21250,
                            total: 2550000,
                            serialNumber: "SN-005"
                        },
                        {
                            rowCode: "003",
                            description: "محطات تحويل",
                            unit: "محطة",
                            quantity: 15,
                            unitPrice: 170000,
                            total: 2550000,
                            serialNumber: "SN-006"
                        }
                    ]
                },
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            // Financial Proposals
            {
                project: projects[0]._id,
                procedureType: "proposal",
                proposalData: {
                    companyName: "شركة البناء الحديثة",
                    contractor: "أحمد محمد عبد الله",
                    offerType: "مقترح مالي",
                    priceOffer: 15000000,
                    contractType: "عقد مقاولة",
                    guaranteePercentage: 5,
                    advancePercentage: 10,
                    percentageBeforeAdvance: 100,
                    percentageAfterAdvance: 90,
                    businessInsurancePercentage: 10,
                    finalBusinessInsuranceValue: 1350000,
                    percentageAfterInsurance: 80
                },
                committeeApproval: [
                    {
                        order: 1,
                        name: "د. عمر السيد",
                        position: "مدير المالية",
                        approved: true,
                        registration: "REG-001",
                        signature: "موقع"
                    },
                    {
                        order: 2,
                        name: "م. نورا أحمد",
                        position: "مدير المشتريات",
                        approved: true,
                        registration: "REG-002",
                        signature: "موقع"
                    },
                    {
                        order: 3,
                        name: "م. كريم محمد",
                        position: "مدير المشروع",
                        approved: true,
                        registration: "REG-003",
                        signature: "موقع"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            {
                project: projects[2]._id,
                procedureType: "proposal",
                proposalData: {
                    companyName: "شركة الإنشاءات العامة",
                    contractor: "سارة عبد الرحمن",
                    offerType: "مقترح مالي للإنشاءات",
                    priceOffer: 22000000,
                    contractType: "عقد إنشاءات",
                    guaranteePercentage: 5,
                    advancePercentage: 15,
                    percentageBeforeAdvance: 100,
                    percentageAfterAdvance: 85,
                    businessInsurancePercentage: 10,
                    finalBusinessInsuranceValue: 1870000,
                    percentageAfterInsurance: 75
                },
                committeeApproval: [
                    {
                        order: 1,
                        name: "د. مصطفى حسن",
                        position: "مدير الإدارة المالية",
                        approved: true,
                        registration: "REG-004",
                        signature: "موقع"
                    },
                    {
                        order: 2,
                        name: "م. ليلى محمود",
                        position: "مدير التعليم",
                        approved: true,
                        registration: "REG-005",
                        signature: "موقع"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            // Financial Resolutions
            {
                project: projects[1]._id,
                procedureType: "resolution",
                resolutionData: {
                    responsibleParty: "الإدارة العامة للكهرباء",
                    contractType: "عقد صيانة",
                    priceOffer: 8500000,
                    guaranteePercentage: 5,
                    advancePercentage: 10,
                    percentageBeforeAdvance: 100,
                    percentageAfterAdvance: 90,
                    businessInsurancePercentage: 10,
                    finalBusinessInsuranceValue: 765000
                },
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            }
        ];

        const createdFinancialProcedures = await FinancialProcedure.insertMany(sampleFinancialProcedures);
        logger.info(`Successfully created ${createdFinancialProcedures.length} sample financial procedures.`);

    } catch (error) {
        logger.error("Error seeding financial procedures:", error.message || error);
        throw error;
    }
};

// Seed Financial Status
export const seedFinancialStatus = async (user, projects) => {
    try {
        const existingFinancialStatus = await FinancialStatus.countDocuments();
        if (existingFinancialStatus > 0) {
            logger.info(`${existingFinancialStatus} financial status record(s) already exist. Skipping seeding.`);
            return;
        }

        const sampleFinancialStatus = [
            {
                project: projects[0]._id,
                projectNumber: "PRJ-2025-001",
                projectType: "تطوير بنية تحتية",
                financialYear: "2025",
                projectDescription: "مشروع تطوير شبكة الصرف الصحي في منطقة وسط المدينة - يشمل أعمال حفر وتركيب مواسير ومحطات ضخ",
                startDate: new Date("2025-03-01"),
                endDate: new Date("2025-12-31"),
                estimatedAmount: 15000000,
                actualAmount: 14250000,
                responsibleParty: "الإدارة العامة للمرافق",
                responsibleEmployee: "أحمد محمد عبد الله",
                branch: "فرع المدينة",
                status: "in_progress",
                notes: "المشروع يسير وفقاً للجدول الزمني المحدد",
                events: [
                    {
                        code: "EVT-001",
                        description: "بدء أعمال الحفر",
                        eventDate: new Date("2025-03-01"),
                        branch: "فرع المدينة",
                        office: "مكتب المشروعات",
                        division: "قسم البنية التحتية",
                        userName: "م. أحمد محمد",
                        notes: "تم البدء في أعمال الحفر حسب المخطط"
                    },
                    {
                        code: "EVT-002",
                        description: "إنجاز 30% من أعمال المواسير",
                        eventDate: new Date("2025-05-15"),
                        branch: "فرع المدينة",
                        office: "مكتب المشروعات",
                        division: "قسم البنية التحتية",
                        userName: "م. فاطمة السيد",
                        notes: "سير العمل ضمن المعدل المطلوب"
                    },
                    {
                        code: "EVT-003",
                        description: "تركيب المحطة الأولى",
                        eventDate: new Date("2025-07-20"),
                        branch: "فرع المدينة",
                        office: "مكتب المشروعات",
                        division: "قسم البنية التحتية",
                        userName: "م. محمد عبد الله",
                        notes: "تم تركيب وتشغيل المحطة بنجاح"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            {
                project: projects[1]._id,
                projectNumber: "PRJ-2024-002",
                projectType: "صيانة وتصليح",
                financialYear: "2024",
                projectDescription: "صيانة شاملة لشبكة الكهرباء في الأحياء الشرقية تشمل استبدال الكابلات وتجديد الأعمدة",
                startDate: new Date("2024-04-15"),
                endDate: new Date("2024-10-30"),
                estimatedAmount: 8500000,
                actualAmount: 8200000,
                responsibleParty: "الإدارة العامة للكهرباء",
                responsibleEmployee: "محمد سعيد حسن",
                branch: "فرع الأحياء الشرقية",
                status: "completed",
                notes: "تم إنجاز المشروع بنجاح وبتكلفة أقل من المتوقع",
                events: [
                    {
                        code: "EVT-004",
                        description: "بدء أعمال الصيانة",
                        eventDate: new Date("2024-04-15"),
                        branch: "فرع الأحياء الشرقية",
                        office: "مكتب الكهرباء",
                        division: "قسم الصيانة",
                        userName: "م. محمد سعيد",
                        notes: "انطلاق أعمال الصيانة"
                    },
                    {
                        code: "EVT-005",
                        description: "إنجاز 50% من الكابلات",
                        eventDate: new Date("2024-06-30"),
                        branch: "فرع الأحياء الشرقية",
                        office: "مكتب الكهرباء",
                        division: "قسم الصيانة",
                        userName: "م. خالد أحمد",
                        notes: "تقدم ممتاز في العمل"
                    },
                    {
                        code: "EVT-006",
                        description: "اكتمال المشروع",
                        eventDate: new Date("2024-10-30"),
                        branch: "فرع الأحياء الشرقية",
                        office: "مكتب الكهرباء",
                        division: "قسم الصيانة",
                        userName: "م. محمد سعيد",
                        notes: "تم الانتهاء من جميع الأعمال بنجاح"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            },
            {
                project: projects[2]._id,
                projectNumber: "PRJ-2026-003",
                projectType: "إنشاء مباني",
                financialYear: "2026",
                projectDescription: "إنشاء مدرسة ثانوية متكاملة في حي النخيل تضم 12 فصلاً و 3 مختبرات ومكتبة مركزية",
                startDate: new Date("2026-03-10"),
                endDate: new Date("2026-12-20"),
                estimatedAmount: 22000000,
                actualAmount: 21500000,
                responsibleParty: "الإدارة التعليمية",
                responsibleEmployee: "سارة عبد الرحمن",
                branch: "فرع التعليم",
                status: "planned",
                notes: "جاري إعداد المخططات النهائية والحصول على التراخيص",
                events: [
                    {
                        code: "EVT-007",
                        description: "اعتماد التصميم النهائي",
                        eventDate: new Date("2026-01-15"),
                        branch: "فرع التعليم",
                        office: "مكتب المشروعات التعليمية",
                        division: "قسم الإنشاءات",
                        userName: "م. سارة عبد الرحمن",
                        notes: "تم اعتماد التصميم من الجهات المختصة"
                    },
                    {
                        code: "EVT-008",
                        description: "الحصول على رخصة البناء",
                        eventDate: new Date("2026-02-20"),
                        branch: "فرع التعليم",
                        office: "مكتب المشروعات التعليمية",
                        division: "قسم الإنشاءات",
                        userName: "م. ليلى محمود",
                        notes: "تم استخراج جميع التراخيص اللازمة"
                    }
                ],
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit
            }
        ];

        const createdFinancialStatus = await FinancialStatus.insertMany(sampleFinancialStatus);
        logger.info(`Successfully created ${createdFinancialStatus.length} sample financial status records.`);

    } catch (error) {
        logger.error("Error seeding financial status:", error.message || error);
        throw error;
    }
};
