import mongoose from "mongoose";
import { seedBillOfQuantities, seedSuperAdmin, seedProjects, seedOrganizationalUnit, seedUser } from "./seed.js";
import { seedProjectPublications, seedCollections, seedBookletSales, seedPublicationMemos } from "./seedPublishingOffice.js";
import { seedContractBudgetStatements, seedFinancialDeductions } from "./seedBudgetOffice.js";
import { seedProjectData } from "./seedProjectData.js";   // ← ADD THIS IMPORT
import projectModel from "../modules/project/models/project.model.js";

export default async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/engineering-system";

        if (!process.env.MONGO_URL && !process.env.MONGODB_URI) {
            console.warn("No MONGO_URL or MONGODB_URI found in environment. Falling back to local MongoDB URI.");
        }

        await mongoose.connect(mongoUri);
        console.log("DB Connected");
        
        // Seed base data
        await seedSuperAdmin();
        const organizationalUnit = await seedOrganizationalUnit();
        const user = await seedUser(organizationalUnit);
        await seedProjects();
        const project = await projectModel.findOne();
        await seedBillOfQuantities(user, project);
        
        // Seed Publishing Office modules
        console.log("Seeding Publishing Office modules...");
        await seedProjectPublications();
        await seedCollections();
        await seedBookletSales();
        await seedPublicationMemos();
        
        // Seed Budget Office modules
        console.log("Seeding Budget Office modules...");
        await seedContractBudgetStatements();
        await seedFinancialDeductions();

        // Seed Project Data module  ← ADD THIS BLOCK
        console.log("Seeding Project Data module...");
        await seedProjectData();
        
        console.log("All seeding completed successfully!");
    } catch (err) {
        console.error("DB Error:", err);
        console.log("Continuing without DB connection for development purposes");
    }
}
