import mongoose from "mongoose";
import { seedBillOfQuantities, seedSuperAdmin, seedProjects, seedOrganizationalUnit, seedUser } from "./seed.js";
import { seedProjectPublications, seedCollections, seedBookletSales, seedPublicationMemos } from "./seedPublishingOffice.js";
import { seedContractBudgetStatements, seedFinancialDeductions } from "./seedBudgetOffice.js";
import projectModel from "../modules/project/models/project.model.js";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
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
        
        console.log("All seeding completed successfully!");
    } catch (err) {
        console.error("DB Error:", err);
        console.log("Continuing without DB connection for development purposes");
    }
}
