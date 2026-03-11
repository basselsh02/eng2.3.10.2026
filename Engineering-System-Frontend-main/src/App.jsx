// App.jsx
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./components/layouts/MainLayout/MainLayout";
import GuestLayout from "./components/layouts/GuestLayout/GuestLayout";
import Home from "./components/pages/Home/Home";
import Login from "./components/pages/Login/Login";
import NotFound from "./components/pages/NotFound/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import { Provider } from "react-redux";
import store from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Forbidden from "./components/pages/Forbidden/Forbidden";
import Profile from "./components/pages/Profile/Profile";
import UpdateProfile from "./components/pages/Profile/UpdateProfile";
import ChangePassword from "./components/pages/Profile/ChangePassword";
import User from "./components/pages/User/User";
import AddUser from "./components/pages/User/AddUser";
import PermissionsUser from "./components/pages/User/PermissionsUser";
import PermissionsManagement from "./components/pages/User/PermissionsManagement";
import UpdateUser from "./components/pages/User/UpdateUser";
import OrganizationUnits from "./components/pages/OrganizationUnits/OrganizationUnits";
import AddOrganizationUnits from "./components/pages/OrganizationUnits/AddOrganizationUnits";
import SpecificUser from "./components/pages/User/SpecificUser";
import Company from "./components/pages/Company/Company";
import AddCompany from "./components/pages/Company/AddCompany";
import FinancialRegistration from "./components/pages/BillOfQuantities/FinancialRegistration";
import FinancialTransactions from "./components/pages/FinancialTransactions/FinancialTransactions";
import Procedures from "./components/pages/Procedures/Procedures";
import CreateProcedureForm from "./components/pages/Procedures/CreateProcedureForm";
import FinancialProcedures from "./components/pages/FinancialProcedures/FinancialProcedures";
import CreateFinancialProcedureForm from "./components/pages/FinancialProcedures/CreateFinancialProcedureForm";
import FinancialStatus from "./components/pages/FinancialStatus/FinancialStatus";
import CreateFinancialStatusForm from "./components/pages/FinancialStatus/CreateFinancialStatusForm";
import Offices from "./components/pages/Offices/Offices";
import Workflows from "./components/pages/Workflows/Workflows";
import WorkflowDetail from "./components/pages/Workflows/WorkflowDetail";
import ProjectsList from "./components/pages/Project/ProjectsList";
import ProjectFullDetails from "./components/pages/Project/ProjectFullDetails";
import FieldPermissions from "./components/pages/FieldPermissions/FieldPermissions";
import { FieldPermissionsProvider } from "./components/common/FieldGate/FieldGate";
import ProjectPublication from "./components/pages/ProjectPublication/ProjectPublication";
import Collections from "./components/pages/Collections/Collections";
import BookletSales from "./components/pages/BookletSales/BookletSales";
import PublicationMemos from "./components/pages/PublicationMemos/PublicationMemos";
import TaskActivityReport from "./components/pages/TaskActivityReport/TaskActivityReport";
import ContractBudgetStatement from "./components/pages/BudgetOffice/ContractBudgetStatement/index";
import FinancialDeductions from "./components/pages/BudgetOffice/FinancialDeductions";
import PublishingProjects from "./components/pages/PublishingOffice/PublishingProjects";
import ProjectDetail from "./components/pages/PublishingOffice/ProjectDetail/index";
import BudgetProjects from "./components/pages/BudgetOffice/BudgetProjects";
import BudgetProjectDetail from "./components/pages/BudgetOffice/ProjectDetail/index";
import ProjectsData from "./components/pages/PublishingOffice/ProjectsData/index";
import ProjectsDetails from "./components/pages/PublishingOffice/ProjectsDetails";
import ProjectCollectionFollowupHome from "./components/pages/ProjectCollectionFollowup/ProjectCollectionFollowupHome";
import SettlementsFollowupPage from "./components/pages/ProjectCollectionFollowup/SettlementsFollowupPage";
import ReportsPrintPage from "./components/pages/ProjectCollectionFollowup/ReportsPrintPage";
import ProjectStatusRegisterPage from "./components/pages/ProjectCollectionFollowup/ProjectStatusRegisterPage";
import SalesTaxFormPage from "./components/pages/ProjectCollectionFollowup/SalesTaxFormPage";
import ProcurementMemos from "./components/pages/ProcurementMemos/ProcurementMemos";



const router = createBrowserRouter([
  {
    path: "/login",
    element: <GuestLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/change-password",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/projects",
        element: (
          <ProtectedRoute>
            <ProjectsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/projects/:id",
        element: (
          <ProtectedRoute>
            <ProjectFullDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "publishing-office/projects-details",
        element: (
          <ProtectedRoute>
            <ProjectsDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "organization-units",
        element: (
          <ProtectedRoute>
            <OrganizationUnits />
          </ProtectedRoute>
        ),
      },
      {
        path: "organization-units/new",
        element: (
          <ProtectedRoute>
            <AddOrganizationUnits />
          </ProtectedRoute>
        ),
      },
      {
        path: "publishing-office/projects-data",
        element: (
          <ProtectedRoute>
            <ProjectsData />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requirePermissions="users:read">
            <User />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/read/:id",
        element: (
          <ProtectedRoute requirePermissions="users:read">
            <SpecificUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/create",
        element: (
          <ProtectedRoute requirePermissions="users:create">
            <AddUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/permissions-management",
        element: (
          <ProtectedRoute requirePermissions="users:read">
            <PermissionsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "field-permissions",
        element: (
          <ProtectedRoute requirePermissions="users:read">
            <FieldPermissions />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/permissions/:id",
        element: (
          <ProtectedRoute requirePermissions="users:update:updatePermissions">
            <PermissionsUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/update/:id",
        element: (
          <ProtectedRoute requirePermissions="companies:update">
            <UpdateUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies",
        element: (
          <ProtectedRoute requirePermissions="companies:read">
            <Company />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies/create",
        element: (
          <ProtectedRoute requirePermissions="companies:create">
            <AddCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "financial-registration",
        element: (
          <ProtectedRoute>
            <FinancialRegistration />
          </ProtectedRoute>
        ),
      },
      {
        path: "financial-transactions",
        element: (
          <ProtectedRoute>
            <FinancialTransactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "procedures",
        element: (
          <ProtectedRoute>
            <Procedures />
          </ProtectedRoute>
        ),
      },
      {
        path: "procedures/create",
        element: (
          <ProtectedRoute>
            <CreateProcedureForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "financial-procedures",
        element: (
          <ProtectedRoute>
            <FinancialProcedures />
          </ProtectedRoute>
        ),
      },
      {
        path: "financial-procedures/create",
        element: (
          <ProtectedRoute>
            <CreateFinancialProcedureForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "financial-status",
        element: (
          <ProtectedRoute>
            <FinancialStatus />
          </ProtectedRoute>
        ),
      },
      {
        path: "financial-status/create",
        element: (
          <ProtectedRoute>
            <CreateFinancialStatusForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "offices",
        element: (
          <ProtectedRoute>
            <Offices />
          </ProtectedRoute>
        ),
      },
      {
        path: "workflows",
        element: (
          <ProtectedRoute>
            <Workflows />
          </ProtectedRoute>
        ),
      },
      {
        path: "workflows/:id",
        element: (
          <ProtectedRoute>
            <WorkflowDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-publication",
        element: (
          <ProtectedRoute>
            <ProjectPublication />
          </ProtectedRoute>
        ),
      },
      {
        path: "collections",
        element: (
          <ProtectedRoute>
            <Collections />
          </ProtectedRoute>
        ),
      },
      {
        path: "booklet-sales",
        element: (
          <ProtectedRoute>
            <BookletSales />
          </ProtectedRoute>
        ),
      },
      {
        path: "publication-memos",
        element: (
          <ProtectedRoute>
            <PublicationMemos />
          </ProtectedRoute>
        ),
      },
      {
        path: "task-activity-report",
        element: (
          <ProtectedRoute>
            <TaskActivityReport />
          </ProtectedRoute>
        ),
      },
      {
        path: "budget-office/contract-budget-statement",
        element: (
          <ProtectedRoute>
            <ContractBudgetStatement />
          </ProtectedRoute>
        ),
      },
      {
        path: "budget-office/financial-deductions",
        element: (
          <ProtectedRoute>
            <FinancialDeductions />
          </ProtectedRoute>
        ),
      },
      {
        path: "publishing-office/projects",
        element: (
          <ProtectedRoute>
            <PublishingProjects />
          </ProtectedRoute>
        ),
      },
      {
        path: "publishing-office/projects/:projectCode",
        element: (
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "budget-office/projects",
        element: (
          <ProtectedRoute>
            <BudgetProjects />
          </ProtectedRoute>
        ),
      },
      {
        path: "budget-office/projects/:projectId",
        element: (
          <ProtectedRoute>
            <BudgetProjectDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-collection-followup",
        element: (
          <ProtectedRoute>
            <ProjectCollectionFollowupHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-collection-followup/settlements",
        element: (
          <ProtectedRoute>
            <SettlementsFollowupPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-collection-followup/reports",
        element: (
          <ProtectedRoute>
            <ReportsPrintPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-collection-followup/project-status/:id",
        element: (
          <ProtectedRoute>
            <ProjectStatusRegisterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-collection-followup/sales-tax/:projectId",
        element: (
          <ProtectedRoute>
            <SalesTaxFormPage />
        path: "procurement/memos",
        element: (
          <ProtectedRoute>
            <ProcurementMemos />
          </ProtectedRoute>
        ),
      },
      {
        path: "forbidden",
        element: (
          <ProtectedRoute>
            <Forbidden />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <FieldPermissionsProvider>
          <Toaster position="bottom-right" />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </FieldPermissionsProvider>
      </Provider>
    </QueryClientProvider>
  );
}
