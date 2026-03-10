import userModel from "../modules/User/models/user.model.js";
import projectModel from "../modules/project/models/project.model.js";
import BillOfQuantities from "../modules/billOfQuantities/models/billOfQuantities.model.js";
import organizationalUnitModel from "../modules/organizationalUnit/models/organizationalUnit.model.js";
import Procedure from "../modules/procedures/models/procedure.model.js";
import FinancialProcedure from "../modules/financialProcedures/models/financialProcedure.model.js";
import FinancialStatus from "../modules/financialStatus/models/financialStatus.model.js";
import logger from "../utils/logger.js";
import { seedFieldPermissions } from "./seedFieldPermissions.js";





export const seedOrganizationalUnit = async () => {
    try {
        const existingUnit = await organizationalUnitModel.findOne({ code: "ORG-001" });
        if (existingUnit) {
            logger.info("Organizational unit already exists. Skipping seeding.");
            return existingUnit;
        }

        const organizationalUnit = new organizationalUnitModel({
            name: "Default Organizational Unit",
            code: "ORG-001",
        });

        await organizationalUnit.save();
        logger.info("Successfully created organizational unit.");
        return organizationalUnit;
    } catch (error) {
        logger.error("Error seeding organizational unit:", error.message || error);
        throw error;
    }
};

export const seedUser = async (organizationalUnit) => {
    try {
        const existingUser = await userModel.findOne({ username: "testuser" });
        if (existingUser) {
            logger.info("User already exists. Skipping seeding.");
            return existingUser;
        }

        const user = new userModel({
            fullNameArabic: "Test User",
            fullNameEnglish: "Test User",
            specialization: "CIVILIAN",
            phones: ["1234567890"],
            username: "testuser",
            password: "password",
            role: "مكتب",
            organizationalUnit: organizationalUnit._id,
            createdBy: (await userModel.findOne({ role: "SUPER_ADMIN" }))._id,
        });

        await user.save();
        logger.info("Successfully created user.");
        return user;
    } catch (error) {
        logger.error("Error seeding user:", error.message || error);
        throw error;
    }
};

export const seedBillOfQuantities = async (user, project) => {
    try {
        const existingBillOfQuantities = await BillOfQuantities.countDocuments();
        if (existingBillOfQuantities > 0) {
            logger.info(`${existingBillOfQuantities} Bill of Quantities already exist. Skipping seeding.`);
            return;
        }

        const sampleBillOfQuantities = [
            {
                project: project._id,
                itemNumber: "BQ-001",
                description: "Excavation and earthwork",
                unit: "Cubic Meter",
                quantity: 1500,
                unitPrice: 50,
                totalPrice: 75000,
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit,
            },
            {
                project: project._id,
                itemNumber: "BQ-002",
                description: "Concrete works",
                unit: "Cubic Meter",
                quantity: 800,
                unitPrice: 400,
                totalPrice: 320000,
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit,
            },
            {
                project: project._id,
                itemNumber: "BQ-003",
                description: "Steel structure",
                unit: "Ton",
                quantity: 120,
                unitPrice: 2000,
                totalPrice: 240000,
                createdBy: user._id,
                organizationalUnit: user.organizationalUnit,
            },
        ];

        await BillOfQuantities.insertMany(sampleBillOfQuantities);
        logger.info("Successfully created sample Bill of Quantities.");

    } catch (error) {
        logger.error("Error seeding Bill of Quantities:", error.message || error);
        throw error;
    }
};

export const seedSuperAdmin = async () => {
    try {
        const existingAdmin = await userModel
            .findOne({ role: "SUPER_ADMIN" })
            .select("+password"); // لو عايز تتأكد من شيء إضافي

        if (existingAdmin) {
            logger.info("Super Admin already exists. Skipping seeding.");
            return;
        }

        // جلب البيانات من environment variables (أفضل ممارسة)
        const superAdminData = {
            fullNameArabic: process.env.SUPER_ADMIN_ARABIC_NAME || "سوبر أدمن",
            fullNameEnglish: process.env.SUPER_ADMIN_ENGLISH_NAME || "Super Admin",
            phones: (process.env.SUPER_ADMIN_PHONES || "01234567890").split(",").map(p => p.trim()),
            username: (process.env.SUPER_ADMIN_USERNAME || "superadmin").toLowerCase(),
            password: process.env.SUPER_ADMIN_PASSWORD || "12345678", // كلمة سر قوية افتراضية
            role: "SUPER_ADMIN",
        };

        // تحقق بسيط من قوة كلمة السر (اختياري)
        if (superAdminData.password.length < 8) {
            throw new Error("Super Admin password must be at least 8 characters long.");
        }

        const superAdmin = new userModel(superAdminData);

        await superAdmin.save();

        logger.info(`Super Admin created successfully with username: ${superAdmin.username}`);
        logger.warn("RECOMMENDATION: Change the Super Admin password immediately after first login!");

    } catch (error) {
        logger.error("Error seeding Super Admin:", error.message || error);
        throw error; // عشان الـ caller يعرف إن فيه مشكلة
    }
};

export const seedProjects = async () => {
    try {
        const existingProjects = await projectModel.countDocuments();
        
        if (existingProjects > 0) {
            logger.info(`${existingProjects} project(s) already exist. Skipping project seeding.`);
            return;
        }

        // إنشاء بيانات مشاريع تجريبية واقعية
        const sampleProjects = [
            {
                projectCode: "TRDD_UF_001",
                financialYear: "2025",
                projectType: "تطوير بنية تحتية",
                projectName: "تطوير شبكة الصرف الصحي في منطقة وسط المدينة",
                contractingMethod: "مناقصة عامة",
                issueDate: new Date("2025-01-15"),
                siteExitDate: new Date("2025-02-15"),
                actualStartDate: new Date("2025-03-01"),
                actualEndDate: new Date("2025-12-31"),
                ownerEntity: "الإدارة العامة للمرافق",
                estimatedCost: 15000000,
                costPercentage: 85,
                treasuryCode: "TRE-2025-001",
                responsibleBranch: "فرع المدينة",
                company: "شركة البناء الحديثة",
                responsibleEmployee: "أحمد محمد عبد الله",
                openingDate: new Date("2025-02-20"),
                publicationDate: new Date("2025-01-20"),
                mainProject: "مشروع تطوير البنية التحتية 2025",
                conditions: [
                    {
                        order: "1",
                        value: "100000",
                        desc: "ضمان تنفيذ أولي",
                        serial: "COND-001",
                        name: "ضمان تنفيذ",
                        code: "C001"
                    },
                    {
                        order: "2", 
                        value: "50000",
                        desc: "ضمان جودة",
                        serial: "COND-002",
                        name: "ضمان جودة",
                        code: "C002"
                    },
                    {
                        order: "3",
                        value: "25000", 
                        desc: "ضمان سلامة العمل",
                        serial: "COND-003",
                        name: "ضمان سلامة",
                        code: "C003"
                    }
                ],
                workItems: [
                    {
                        total: "4500000",
                        value: "1500000",
                        quantity: "3000",
                        unit: "متر",
                        code: "W001",
                        desc: "أعمال حفر وردم",
                        serial: "ITEM-001"
                    },
                    {
                        total: "6000000",
                        value: "2000000", 
                        quantity: "1500",
                        unit: "متر",
                        code: "W002",
                        desc: "تركيب مواسير الصرف",
                        serial: "ITEM-002"
                    },
                    {
                        total: "4500000",
                        value: "1500000",
                        quantity: "3",
                        unit: "محطة",
                        code: "W003", 
                        desc: "محطات ضخ",
                        serial: "ITEM-003"
                    }
                ],
                candidateCompanies: [
                    "شركة البناء الحديثة",
                    "شركة المهندسين للإنشاءات",
                    "شركة الطرق والكباري",
                    "شركة المقاولون العرب"
                ],
                registeredCompanies: [
                    {
                        recordNameNumber: "سجل تجاري رقم 12345",
                        recordNumber: "RC-2025-001",
                        companyName: "شركة البناء الحديثة"
                    },
                    {
                        recordNameNumber: "سجل تجاري رقم 67890",
                        recordNumber: "RC-2025-002", 
                        companyName: "شركة المهندسين للإنشاءات"
                    }
                ]
            },
            {
                projectCode: "TRDD_UF_002",
                financialYear: "2024",
                projectType: "صيانة وتصليح",
                projectName: "صيانة شبكة الكهرباء في الأحياء الشرقية",
                contractingMethod: "مفاوضات مباشرة",
                issueDate: new Date("2024-03-10"),
                siteExitDate: new Date("2024-04-01"),
                actualStartDate: new Date("2024-04-15"),
                actualEndDate: new Date("2024-10-30"),
                ownerEntity: "الإدارة العامة للكهرباء",
                estimatedCost: 8500000,
                costPercentage: 92,
                treasuryCode: "TRE-2024-002",
                responsibleBranch: "فرع الأحياء الشرقية",
                company: "شركة الكهرباء الوطنية",
                responsibleEmployee: "محمد سعيد حسن",
                openingDate: new Date("2024-03-25"),
                publicationDate: new Date("2024-03-15"),
                mainProject: "مشروع صيانة الشبكات 2024",
                conditions: [
                    {
                        order: "1",
                        value: "500000",
                        desc: "ضمان تنفيذ",
                        serial: "COND-004",
                        name: "ضمان تنفيذ",
                        code: "C004"
                    },
                    {
                        order: "2",
                        value: "100000",
                        desc: "ضمان سلامة",
                        serial: "COND-005",
                        name: "ضمان سلامة",
                        code: "C005"
                    }
                ],
                workItems: [
                    {
                        total: "3400000",
                        value: "850000",
                        quantity: "40",
                        unit: "كيلومتر",
                        code: "W004",
                        desc: "أعمال كابلات كهرباء",
                        serial: "ITEM-004"
                    },
                    {
                        total: "2550000",
                        value: "637500",
                        quantity: "120",
                        unit: "عمود",
                        code: "W005",
                        desc: "أعمدة إنارة",
                        serial: "ITEM-005"
                    },
                    {
                        total: "2550000",
                        value: "637500",
                        quantity: "15",
                        unit: "محطة",
                        code: "W006",
                        desc: "محطات تحويل",
                        serial: "ITEM-006"
                    }
                ],
                candidateCompanies: [
                    "شركة الكهرباء الوطنية",
                    "شركة الطاقة الحديثة",
                    "شركة التوزيع الكهربائي"
                ],
                registeredCompanies: [
                    {
                        recordNameNumber: "سجل تجاري رقم 54321",
                        recordNumber: "RC-2024-003",
                        companyName: "شركة الكهرباء الوطنية"
                    }
                ]
            },
            {
                projectCode: "TRDD_UF_003",
                financialYear: "2026",
                projectType: "إنشاء مباني",
                projectName: "إنشاء مدرسة ثانوية متكاملة في حي النخيل",
                contractingMethod: "مناقصة محدودة",
                issueDate: new Date("2026-01-05"),
                siteExitDate: new Date("2026-02-05"),
                actualStartDate: new Date("2026-03-10"),
                actualEndDate: new Date("2026-12-20"),
                ownerEntity: "الإدارة التعليمية",
                estimatedCost: 22000000,
                costPercentage: 78,
                treasuryCode: "TRE-2026-003",
                responsibleBranch: "فرع التعليم",
                company: "شركة الإنشاءات العامة",
                responsibleEmployee: "سارة عبد الرحمن",
                openingDate: new Date("2026-01-25"),
                publicationDate: new Date("2026-01-10"),
                mainProject: "مشروع التعليم 2026",
                conditions: [
                    {
                        order: "1",
                        value: "1100000",
                        desc: "ضمان تنفيذ أولي",
                        serial: "COND-006",
                        name: "ضمان تنفيذ",
                        code: "C006"
                    },
                    {
                        order: "2",
                        value: "220000",
                        desc: "ضمان جودة",
                        serial: "COND-007",
                        name: "ضمان جودة",
                        code: "C007"
                    },
                    {
                        order: "3",
                        value: "110000",
                        desc: "ضمان سلامة",
                        serial: "COND-008",
                        name: "ضمان سلامة",
                        code: "C008"
                    }
                ],
                workItems: [
                    {
                        total: "8800000",
                        value: "2200000",
                        quantity: "1",
                        unit: "مبنى",
                        code: "W007",
                        desc: "هيكل المبنى الرئيسي",
                        serial: "ITEM-007"
                    },
                    {
                        total: "5500000",
                        value: "1375000",
                        quantity: "12",
                        unit: "فصل",
                        code: "W008",
                        desc: "فصول دراسية",
                        serial: "ITEM-008"
                    },
                    {
                        total: "3300000",
                        value: "825000",
                        quantity: "3",
                        unit: "مختبر",
                        code: "W009",
                        desc: "مختبرات علمية",
                        serial: "ITEM-009"
                    },
                    {
                        total: "4400000",
                        value: "1100000",
                        quantity: "1",
                        unit: "مكتبة",
                        code: "W010",
                        desc: "مكتبة مركزية",
                        serial: "ITEM-010"
                    }
                ],
                candidateCompanies: [
                    "شركة الإنشاءات العامة",
                    "شركة المباني الحديثة",
                    "شركة التعليم للإنشاءات",
                    "شركة المهندسين العرب"
                ],
                registeredCompanies: [
                    {
                        recordNameNumber: "سجل تجاري رقم 98765",
                        recordNumber: "RC-2026-004",
                        companyName: "شركة الإنشاءات العامة"
                    },
                    {
                        recordNameNumber: "سجل تجاري رقم 13579",
                        recordNumber: "RC-2026-005",
                        companyName: "شركة المباني الحديثة"
                    }
                ]
            }
        ];

        const createdProjects = await projectModel.insertMany(sampleProjects);
        
        logger.info(`Successfully created ${createdProjects.length} sample projects:`);
        createdProjects.forEach(project => {
            logger.info(`  - ${project.projectCode}: ${project.projectName}`);
        });

    } catch (error) {
        logger.error("Error seeding projects:", error.message || error);
        throw error;
    }
};
