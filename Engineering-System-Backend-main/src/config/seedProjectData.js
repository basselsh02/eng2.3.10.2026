import projectDataModel from "../modules/projectData/models/projectData.model.js";
import logger from "../utils/logger.js";

export const seedProjectData = async () => {
    try {
        const existingData = await projectDataModel.countDocuments();
        
        if (existingData > 0) {
            logger.info(`${existingData} بيانات مشروع موجودة بالفعل. تخطي البذر.`);
            return;
        }

        const sampleProjectData = [
            {
                projectCode: "4585551456",
                financialYear: "2026/2025",
                projectType: "أعمال الصيانة",
                projectName: "أعمال دهانات شاملة الدهانة الداخلية الرئيسية بالمديرية الخاصة بالنجفي الشريفي بالنجفي الشمالية",
                contractingMethod: "أساليب النشر والتعاقد",
                issueDate: new Date("2020-02-08"),
                siteExitDate: new Date("2025-08-10"),
                actualStartDate: new Date("2020-02-15"),
                actualEndDate: null,
                ownerEntity: "من الهيئة",
                estimatedCost: 125252500,
                costPercentage: 0.25,
                treasuryCode: "500",
                responsibleBranch: "مركز الدريب المتقدم المرشد والتطوير والمهندسي للمشروعات والأهلي",
                company: null,
                responsibleEmployee: "الموظف المسئول",
                openingDate: new Date("2025-05-20"),
                publicationDate: new Date("2025-10-2"),
                mainProject: "المشروع الرئيسي",
                workItems: [
                    {
                        serial: "1",
                        desc: "أم التعاقد بالمقاييسة المحدودة",
                        code: "3",
                        unit: "152",
                        quantity: "100.222.222",
                        value: "25555",
                        total: "565112.120000"
                    },
                    {
                        serial: "1",
                        desc: "أم التعاقد بالمقاييسة المحدودة",
                        code: "3",
                        unit: "152",
                        quantity: "100.222.222",
                        value: "25555",
                        total: "255455"
                    },
                    {
                        serial: "1",
                        desc: "أم التعاقد بالمقاييسة المحدودة",
                        code: "3",
                        unit: "152",
                        quantity: "100.222.222",
                        value: "25555",
                        total: "255455"
                    }
                ],
                candidateCompanies: [
                    {
                        registrationNumber: "20026",
                        companies: "المقاولون العرب",
                        recordNumber: "5454",
                        recordNameNumber: "الدرجة المقاولون العرب"
                    },
                    {
                        registrationNumber: "454",
                        companies: "اطلس العامة للمقاولات",
                        recordNumber: "7878",
                        recordNameNumber: "الدرجة اطلس العامة للمقاولات"
                    },
                    {
                        registrationNumber: "1456",
                        companies: "خيان المقاولات",
                        recordNumber: "44",
                        recordNameNumber: "الدرجة خيان المقاولات"
                    }
                ],
                projectConditions: [
                    {
                        conditionTypeCode: "455",
                        conditionTypeName: "الضمانة التبعيرية",
                        serialCode: "9",
                        conditionDesc: "اختبار من 500 الف دينة",
                        value: null,
                        order: "2"
                    },
                    {
                        conditionTypeCode: "787",
                        conditionTypeName: "طريقة التعاقد",
                        serialCode: "99",
                        conditionDesc: "المنافسة المحدودة",
                        value: "500",
                        order: "3"
                    },
                    {
                        conditionTypeCode: "325",
                        conditionTypeName: "قيمة التأمين المؤقت",
                        serialCode: "3",
                        conditionDesc: "دينية",
                        value: "700",
                        order: "4"
                    }
                ],
                registerNewRound: true,
                downloadTerms: "تنزيل الشروط",
                downloadConditional: "الاستقادة/بدون",
                approvalCommittee: "طباعة العقد"
            },
            {
                projectCode: "4154545101254",
                financialYear: "2025/2024",
                projectType: "البناء والتشييد",
                projectName: "توريد اسمنت توب ميكس جديد لمباني جديد شامل النقل الاستلاميية (ابو فولا)",
                contractingMethod: "مناقصة عامة",
                issueDate: new Date("2020-02-08"),
                siteExitDate: new Date("2024-04-15"),
                actualStartDate: new Date("2024-05-01"),
                actualEndDate: new Date("2024-12-31"),
                ownerEntity: "من الاتحاد",
                estimatedCost: 878784000,
                costPercentage: 0.25,
                treasuryCode: "222",
                responsibleBranch: "الفرع 152 الشمال",
                company: "شركة البناء الحديثة",
                responsibleEmployee: "محمد أحمد",
                openingDate: new Date("2024-04-20"),
                publicationDate: new Date("2024-03-15"),
                mainProject: "مشروع البناء الكبير",
                workItems: [
                    {
                        serial: "1",
                        desc: "توريد الاسمنت",
                        code: "B001",
                        unit: "طن",
                        quantity: "5000",
                        value: "150",
                        total: "750000"
                    },
                    {
                        serial: "2",
                        desc: "النقل والتوريد",
                        code: "B002",
                        unit: "طن",
                        quantity: "5000",
                        value: "25",
                        total: "125000"
                    }
                ],
                candidateCompanies: [
                    {
                        registrationNumber: "65",
                        companies: "المقاولون العرب",
                        recordNumber: "MC-001",
                        recordNameNumber: "سجل المقاولون العرب"
                    },
                    {
                        registrationNumber: "12",
                        companies: "من الهيئة",
                        recordNumber: "MC-002",
                        recordNameNumber: "سجل من الهيئة"
                    }
                ],
                projectConditions: [
                    {
                        conditionTypeCode: "877",
                        conditionTypeName: "الفترة 150 الشمال",
                        serialCode: "587",
                        conditionDesc: "توريد خلفات جديس توم المباء مشروع ماليراس (دارا) أعمال صيانة عربود (10) وصلدة (5) للمدونة (10) والصدفة (10)",
                        value: null,
                        order: "1"
                    }
                ],
                registerNewRound: false,
                downloadTerms: "",
                downloadConditional: "",
                approvalCommittee: ""
            },
            {
                projectCode: "781122000",
                financialYear: "2024/2023",
                projectType: "الصيانة والإصلاح",
                projectName: "أعمال التحصيلات والفوح جامعة مستنشفي روشوفاني المستشفى",
                contractingMethod: "ممارسة",
                issueDate: new Date("2023-03-10"),
                siteExitDate: new Date("2023-04-01"),
                actualStartDate: new Date("2023-04-15"),
                actualEndDate: new Date("2023-10-30"),
                ownerEntity: "الفرع 152 الشمالات",
                estimatedCost: 487754000,
                costPercentage: 0.35,
                treasuryCode: "587",
                responsibleBranch: "الفرع 152 الشمالات",
                company: "شركة الصيانة المتخصصة",
                responsibleEmployee: "علي حسن",
                openingDate: new Date("2023-03-25"),
                publicationDate: new Date("2023-03-15"),
                mainProject: "مشروع الصيانة السنوية",
                workItems: [
                    {
                        serial: "1",
                        desc: "أعمال الصيانة العامة",
                        code: "M001",
                        unit: "متر مربع",
                        quantity: "2000",
                        value: "200",
                        total: "400000"
                    }
                ],
                candidateCompanies: [
                    {
                        registrationNumber: "877",
                        companies: "الفترة 150 الشمال",
                        recordNumber: "SC-001",
                        recordNameNumber: "سجل الصيانة"
                    }
                ],
                projectConditions: [
                    {
                        conditionTypeCode: "222",
                        conditionTypeName: "الفترة الوطنية الدولية البوابة المهنية الصناعية المناهمين الأهمية",
                        serialCode: "877",
                        conditionDesc: "الفناء الوطني رقم 9 لمناسبة رقم 2 لمباني المهنة الدولية الصفاء الصينية المهنين المحددين",
                        value: null,
                        order: "1"
                    }
                ],
                registerNewRound: true,
                downloadTerms: "تحميل المستند",
                downloadConditional: "الاستقادة",
                approvalCommittee: "لجنة الموافقة"
            },
            {
                projectCode: "100000000",
                financialYear: "2026/2025",
                projectType: "بنية تحتية",
                projectName: "الفناء الوطني رقم 9 لمناسبة رقم 2 لمباني المهنة الدولية الصفاء الصينية المهنين المحددين الحديدة",
                contractingMethod: "مناقصة عامة",
                issueDate: new Date("2025-01-05"),
                siteExitDate: new Date("2025-02-05"),
                actualStartDate: new Date("2025-03-10"),
                actualEndDate: null,
                ownerEntity: "الفرع 152 الشمالات",
                estimatedCost: 100000000,
                costPercentage: 0.50,
                treasuryCode: "7",
                responsibleBranch: "الفرع 152 الشمالات",
                company: null,
                responsibleEmployee: "سارة محمود",
                openingDate: new Date("2025-01-25"),
                publicationDate: new Date("2025-01-10"),
                mainProject: "المشروع الوطني الكبير",
                workItems: [
                    {
                        serial: "1",
                        desc: "البنية التحتية الأساسية",
                        code: "I001",
                        unit: "كيلومتر",
                        quantity: "50",
                        value: "2000000",
                        total: "100000000"
                    }
                ],
                candidateCompanies: [
                    {
                        registrationNumber: "222",
                        companies: "الفترة الوطنية الدولية البوابة المهنية الصناعية المناهمين الأهمية",
                        recordNumber: "IN-001",
                        recordNameNumber: "سجل البنية التحتية"
                    }
                ],
                projectConditions: [
                    {
                        conditionTypeCode: "877",
                        conditionTypeName: "الفترة 150 الشمال",
                        serialCode: "93",
                        conditionDesc: "النور",
                        value: "12",
                        order: "10"
                    }
                ],
                registerNewRound: false,
                downloadTerms: "",
                downloadConditional: "",
                approvalCommittee: ""
            }
        ];

        const createdData = await projectDataModel.insertMany(sampleProjectData);
        
        logger.info(`تم إنشاء ${createdData.length} بيانات مشروع بنجاح`);
        createdData.forEach(data => {
            logger.info(`  - ${data.projectCode}: ${data.projectName}`);
        });

    } catch (error) {
        logger.error("خطأ في بذر بيانات المشروع:", error.message || error);
        throw error;
    }
};
