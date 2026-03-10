import ProjectPublication from "../modules/projectPublication/models/projectPublication.model.js";
import Collection from "../modules/collections/models/collection.model.js";
import BookletSale from "../modules/bookletSales/models/bookletSale.model.js";
import PublicationMemo from "../modules/publicationMemos/models/publicationMemo.model.js";
import projectModel from "../modules/project/models/project.model.js";
import userModel from "../modules/User/models/user.model.js";
import logger from "../utils/logger.js";

export const seedProjectPublications = async () => {
    try {
        const existingPublications = await ProjectPublication.countDocuments();
        
        if (existingPublications > 0) {
            logger.info(`${existingPublications} Project Publication(s) already exist. Skipping seeding.`);
            return;
        }

        // Get sample projects
        const projects = await projectModel.find().limit(5);
        
        if (projects.length === 0) {
            logger.warn("No projects found for Project Publication seeding.");
            return;
        }

        const samplePublications = projects.map((project, index) => ({
            projectCode: project.projectCode,
            financialYear: project.financialYear,
            projectType: project.projectType,
            projectName: project.projectName,
            contractingMethod: project.contractingMethod || "مناقصة عامة",
            issueDate: project.issueDate || new Date(),
            siteExitDate: project.siteExitDate,
            actualStartDate: project.actualStartDate,
            actualEndDate: project.actualEndDate,
            ownerEntity: project.ownerEntity || "جهة حكومية",
            estimatedCost: project.estimatedCost,
            costPercentage: project.costPercentage,
            treasuryCode: project.treasuryCode,
            responsibleBranch: project.responsibleBranch,
            company: project.company,
            responsibleEmployee: project.responsibleEmployee,
            openingDate: project.openingDate,
            publicationDate: project.publicationDate || new Date(),
            mainProject: project.mainProject,
            candidateCompanies: [
                {
                    companyName: "شركة المقاولون العرب",
                    registrationNumber: "20026",
                    recordNumber: "5454",
                    approvalNumber: "AP-001",
                    purchased: true
                },
                {
                    companyName: "أطلس العامة للمقاولات",
                    registrationNumber: "454",
                    recordNumber: "7878",
                    approvalNumber: "",
                    purchased: false
                },
                {
                    companyName: "حياب المقاولات",
                    registrationNumber: "1456",
                    registrationNumber: "44",
                    approvalNumber: "AP-003",
                    purchased: true
                },
                {
                    companyName: "الشادوة للمقاولات والتوريدات الصحية",
                    registrationNumber: "5554252",
                    recordNumber: "78",
                    approvalNumber: "",
                    purchased: false
                },
                {
                    companyName: "الشركة الدولية للتوريدات الهندسية والمقاولات",
                    registrationNumber: "23233",
                    recordNumber: "8787",
                    approvalNumber: "AP-005",
                    purchased: false
                },
                {
                    companyName: "طيبة الامناسيب للمقاولات العامة",
                    registrationNumber: "2125",
                    recordNumber: "94",
                    approvalNumber: "",
                    purchased: false
                }
            ],
            publicationMemosList: [
                {
                    memoName: "مذكرة النشر الأولى",
                    memoButton: "طباعة"
                },
                {
                    memoName: "مذكرة النشر النهائية",
                    memoButton: "طباعة"
                }
            ]
        }));

        const createdPublications = await ProjectPublication.insertMany(samplePublications);
        
        logger.info(`Successfully created ${createdPublications.length} Project Publications`);

    } catch (error) {
        logger.error("Error seeding Project Publications:", error.message || error);
        throw error;
    }
};

export const seedCollections = async () => {
    try {
        const existingCollections = await Collection.countDocuments();
        
        if (existingCollections > 0) {
            logger.info(`${existingCollections} Collection(s) already exist. Skipping seeding.`);
            return;
        }

        // Get sample projects
        const projects = await projectModel.find().limit(3);
        
        if (projects.length === 0) {
            logger.warn("No projects found for Collections seeding.");
            return;
        }

        const sampleCollections = [
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                collectorName: "محمد سعيد حسن",
                paymentButtons: [
                    { buttonLabel: "الدفعة الأولى", buttonAction: "paid" },
                    { buttonLabel: "الدفعة الثانية", buttonAction: "pending" }
                ]
            },
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                collectorName: "خالد عبد الرحمن",
                paymentButtons: [
                    { buttonLabel: "التأمين الابتدائي", buttonAction: "paid" }
                ]
            },
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                collectorName: "سارة عبد الله",
                paymentButtons: [
                    { buttonLabel: "دفعة التأمين النهائي", buttonAction: "pending" }
                ]
            },
            {
                projectNumber: projects[1].projectCode,
                projectName: projects[1].projectName,
                projectCost: projects[1].estimatedCost || 8500000,
                branchCode: "BR-002",
                executingBranchName: "فرع الأحياء الشرقية",
                collectorName: "فاطمة أحمد",
                paymentButtons: [
                    { buttonLabel: "الدفعة الأولى", buttonAction: "paid" },
                    { buttonLabel: "الدفعة الثانية", buttonAction: "paid" },
                    { buttonLabel: "الدفعة الثالثة", buttonAction: "processing" }
                ]
            },
            {
                projectNumber: projects[1].projectCode,
                projectName: projects[1].projectName,
                projectCost: projects[1].estimatedCost || 8500000,
                branchCode: "BR-002",
                executingBranchName: "فرع الأحياء الشرقية",
                collectorName: "عمر الحسن",
                paymentButtons: [
                    { buttonLabel: "تأمين حسن الأداء", buttonAction: "paid" }
                ]
            },
            {
                projectNumber: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                projectName: projects[2] ? projects[2].projectName : projects[0].projectName,
                projectCost: projects[2] ? projects[2].estimatedCost : 22000000,
                branchCode: "BR-003",
                executingBranchName: "فرع التعليم",
                collectorName: "ليلى محمد",
                paymentButtons: [
                    { buttonLabel: "الدفعة التمهيدية", buttonAction: "paid" },
                    { buttonLabel: "الدفعة الأولى", buttonAction: "pending" }
                ]
            },
            {
                projectNumber: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                projectName: projects[2] ? projects[2].projectName : projects[0].projectName,
                projectCost: projects[2] ? projects[2].estimatedCost : 22000000,
                branchCode: "BR-003",
                executingBranchName: "فرع التعليم",
                collectorName: "نور الدين",
                paymentButtons: [
                    { buttonLabel: "تأمين التنفيذ", buttonAction: "processing" }
                ]
            },
            {
                projectNumber: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                projectName: projects[2] ? projects[2].projectName : projects[0].projectName,
                projectCost: projects[2] ? projects[2].estimatedCost : 22000000,
                branchCode: "BR-003",
                executingBranchName: "فرع التعليم",
                collectorName: "عائشة سالم",
                paymentButtons: [
                    { buttonLabel: "دفعة الإنجاز 50%", buttonAction: "pending" }
                ]
            }
        ];

        const createdCollections = await Collection.insertMany(sampleCollections);
        
        logger.info(`Successfully created ${createdCollections.length} Collections`);

    } catch (error) {
        logger.error("Error seeding Collections:", error.message || error);
        throw error;
    }
};

export const seedBookletSales = async () => {
    try {
        const existingBookletSales = await BookletSale.countDocuments();
        
        if (existingBookletSales > 0) {
            logger.info(`${existingBookletSales} Booklet Sale(s) already exist. Skipping seeding.`);
            return;
        }

        // Get sample projects
        const projects = await projectModel.find().limit(3);
        
        if (projects.length === 0) {
            logger.warn("No projects found for Booklet Sales seeding.");
            return;
        }

        const sampleBookletSales = [
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                printMemoAction: "طباعة مذكرة النشر",
                staffType: "عسكري",
                actions: [
                    { actionType: "info", actionValue: "معلومات الشركة" },
                    { actionType: "edit", actionValue: "تعديل البيانات" },
                    { actionType: "view", actionValue: "عرض التفاصيل" }
                ]
            },
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                printMemoAction: "طباعة مذكرة النشر",
                staffType: "مدني",
                actions: [
                    { actionType: "info", actionValue: "معلومات الشركة" },
                    { actionType: "letter", actionValue: "خطاب رسمي" }
                ]
            },
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                printMemoAction: "طباعة مذكرة النشر",
                staffType: "عسكري/مدني",
                actions: [
                    { actionType: "view", actionValue: "عرض التفاصيل" }
                ]
            },
            {
                projectNumber: projects[1].projectCode,
                projectName: projects[1].projectName,
                projectCost: projects[1].estimatedCost || 8500000,
                branchCode: "BR-002",
                executingBranchName: "فرع الأحياء الشرقية",
                printMemoAction: "طباعة مذكرة النشر",
                staffType: "عسكري",
                actions: [
                    { actionType: "info", actionValue: "معلومات الشركة" },
                    { actionType: "edit", actionValue: "تعديل البيانات" }
                ]
            },
            {
                projectNumber: projects[1].projectCode,
                projectName: projects[1].projectName,
                projectCost: projects[1].estimatedCost || 8500000,
                branchCode: "BR-002",
                executingBranchName: "فرع الأحياء الشرقية",
                printMemoAction: "طباعة مذكرة النشر",
                staffType: "مدني",
                actions: [
                    { actionType: "view", actionValue: "عرض التفاصيل" },
                    { actionType: "letter", actionValue: "خطاب رسمي" }
                ]
            },
            {
                projectNumber: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                projectName: projects[2] ? projects[2].projectName : projects[0].projectName,
                projectCost: projects[2] ? projects[2].estimatedCost : 22000000,
                branchCode: "BR-003",
                executingBranchName: "فرع التعليم",
                printMemoAction: "طباعة مذكرة النشر",
                staffType: "عسكري/مدني",
                actions: [
                    { actionType: "info", actionValue: "معلومات الشركة" },
                    { actionType: "edit", actionValue: "تعديل البيانات" },
                    { actionType: "view", actionValue: "عرض التفاصيل" }
                ]
            },
            {
                projectNumber: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                projectName: projects[2] ? projects[2].projectName : projects[0].projectName,
                projectCost: projects[2] ? projects[2].estimatedCost : 22000000,
                branchCode: "BR-003",
                executingBranchName: "فرع التعليم",
                printMemoAction: "طباعة مذكرة النشر",
                staffType: "مدني",
                actions: [
                    { actionType: "view", actionValue: "عرض التفاصيل" }
                ]
            },
            {
                projectNumber: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                projectName: projects[2] ? projects[2].projectName : projects[0].projectName,
                projectCost: projects[2] ? projects[2].estimatedCost : 22000000,
                branchCode: "BR-003",
                executingBranchName: "فرع التعليم",
                printMemoAction: "طباعة مذكرة النشر",
                staffType: "عسكري",
                actions: [
                    { actionType: "info", actionValue: "معلومات الشركة" },
                    { actionType: "letter", actionValue: "خطاب رسمي" }
                ]
            }
        ];

        const createdBookletSales = await BookletSale.insertMany(sampleBookletSales);
        
        logger.info(`Successfully created ${createdBookletSales.length} Booklet Sales`);

    } catch (error) {
        logger.error("Error seeding Booklet Sales:", error.message || error);
        throw error;
    }
};

export const seedPublicationMemos = async () => {
    try {
        const existingMemos = await PublicationMemo.countDocuments();
        
        if (existingMemos > 0) {
            logger.info(`${existingMemos} Publication Memo(s) already exist. Skipping seeding.`);
            return;
        }

        // Get sample projects
        const projects = await projectModel.find().limit(3);
        
        if (projects.length === 0) {
            logger.warn("No projects found for Publication Memos seeding.");
            return;
        }

        const sampleMemos = [
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                printAction: "طباعة"
            },
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                printAction: "طباعة"
            },
            {
                projectNumber: projects[0].projectCode,
                projectName: projects[0].projectName,
                projectCost: projects[0].estimatedCost || 15000000,
                branchCode: "BR-001",
                executingBranchName: "فرع المدينة",
                printAction: "طباعة"
            },
            {
                projectNumber: projects[1].projectCode,
                projectName: projects[1].projectName,
                projectCost: projects[1].estimatedCost || 8500000,
                branchCode: "BR-002",
                executingBranchName: "فرع الأحياء الشرقية",
                printAction: "طباعة"
            },
            {
                projectNumber: projects[1].projectCode,
                projectName: projects[1].projectName,
                projectCost: projects[1].estimatedCost || 8500000,
                branchCode: "BR-002",
                executingBranchName: "فرع الأحياء الشرقية",
                printAction: "طباعة"
            },
            {
                projectNumber: projects[1].projectCode,
                projectName: projects[1].projectName,
                projectCost: projects[1].estimatedCost || 8500000,
                branchCode: "BR-002",
                executingBranchName: "فرع الأحياء الشرقية",
                printAction: "طباعة"
            },
            {
                projectNumber: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                projectName: projects[2] ? projects[2].projectName : projects[0].projectName,
                projectCost: projects[2] ? projects[2].estimatedCost : 22000000,
                branchCode: "BR-003",
                executingBranchName: "فرع التعليم",
                printAction: "طباعة"
            },
            {
                projectNumber: projects[2] ? projects[2].projectCode : projects[0].projectCode,
                projectName: projects[2] ? projects[2].projectName : projects[0].projectName,
                projectCost: projects[2] ? projects[2].estimatedCost : 22000000,
                branchCode: "BR-003",
                executingBranchName: "فرع التعليم",
                printAction: "طباعة"
            }
        ];

        const createdMemos = await PublicationMemo.insertMany(sampleMemos);
        
        logger.info(`Successfully created ${createdMemos.length} Publication Memos`);

    } catch (error) {
        logger.error("Error seeding Publication Memos:", error.message || error);
        throw error;
    }
};
