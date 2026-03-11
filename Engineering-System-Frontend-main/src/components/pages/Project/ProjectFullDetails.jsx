import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import PageTitle from '../../ui/PageTitle/PageTitle';
import Loading from '../../common/Loading/Loading';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/Table/Table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjectById } from '../../../api/projectAPI';
import { getFinancialProceduresByProject } from '../../../api/financialProceduresAPI';
import { getFinancialStatusesByProject } from '../../../api/financialStatusAPI';
import { getProceduresByProject } from '../../../api/proceduresAPI';
import CreateFinancialProcedureForm from '../FinancialProcedures/CreateFinancialProcedureForm';
import CreateFinancialStatusForm from '../FinancialStatus/CreateFinancialStatusForm';
import CreateProcedureForm from '../Procedures/CreateProcedureForm';
import toast from 'react-hot-toast';

const ProjectFullDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('financial-procedures');
    const [showFormTab, setShowFormTab] = useState({
        'financial-procedures': false,
        'financial-status': false,
        'procedures': false
    });

    // Fetch project details
    const { data, isLoading, error } = useQuery({
        queryKey: ['project-full-details', id],
        queryFn: () => getProjectById(id),
        enabled: !!id
    });

    // Fetch Financial Procedures by Project
    const { data: fpData, isLoading: fpLoading, refetch: refetchFP } = useQuery({
        queryKey: ['financial-procedures-by-project', id],
        queryFn: () => getFinancialProceduresByProject(id),
        enabled: !!id,
        staleTime: 0
    });

    // Fetch Financial Status by Project
    const { data: fsData, isLoading: fsLoading, refetch: refetchFS } = useQuery({
        queryKey: ['financial-status-by-project', id],
        queryFn: () => getFinancialStatusesByProject(id),
        enabled: !!id,
        staleTime: 0
    });

    // Fetch Procedures by Project
    const { data: procData, isLoading: procLoading, refetch: refetchProc } = useQuery({
        queryKey: ['procedures-by-project', id],
        queryFn: () => getProceduresByProject(id),
        enabled: !!id,
        staleTime: 0
    });

    if (isLoading) return <Loading />;

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">حدث خطأ أثناء تحميل تفاصيل المشروع</p>
                <p className="text-gray-600">{error?.message || 'خطأ غير معروف'}</p>
            </div>
        );
    }

    const project = data?.data || {};

    const renderDetailItem = (label, value) => (
        <div className="py-3 border-b last:border-b-0">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="font-medium">{value || 'غير محدد'}</p>
        </div>
    );

    const tabs = [
        { id: 'procedures', label: 'الإجراءات' },
        { id: 'financial-procedures', label: 'الإجراءات المالية' },
        { id: 'financial-status', label: 'تسجيل الموقف المالي للمشروعات' }
    ];

    const handleFormSuccess = (tabId) => {
        setShowFormTab(prev => ({ ...prev, [tabId]: false }));
        
        // Refresh the specific tab's data
        if (tabId === 'financial-procedures') {
            refetchFP();
        } else if (tabId === 'financial-status') {
            refetchFS();
        } else if (tabId === 'procedures') {
            refetchProc();
        }
        
        toast.success('تم حفظ البيانات بنجاح');
    };

    // Financial Procedures Tab Content
    const renderFinancialProceduresTab = () => (
        <div className="space-y-6">
            {/* Data Display Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">الإجراءات المالية</h3>
                    <Button
                        size="sm"
                        onClick={() => setShowFormTab(prev => ({ ...prev, 'financial-procedures': !prev['financial-procedures'] }))}
                    >
                        {showFormTab['financial-procedures'] ? 'إغلاق النموذج' : 'إضافة إجراء مالي جديد'}
                    </Button>
                </div>

                {fpLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">جاري تحميل البيانات...</p>
                    </div>
                ) : fpData?.data && fpData.data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>تاريخ الإنشاء</TableHead>
                                <TableHead>نوع الإجراء</TableHead>
                                <TableHead>الإجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fpData.data.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                                    </TableCell>
                                    <TableCell>{item.procedureType || '-'}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => navigate(`/financial-procedure/${item._id}`)}
                                        >
                                            عرض التفاصيل
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 border rounded-lg bg-gray-50">
                        <p className="text-gray-500">لا توجد إجراءات مالية لهذا المشروع</p>
                    </div>
                )}
            </div>

            {/* Form Section */}
            {showFormTab['financial-procedures'] && (
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">إضافة إجراء مالي جديد</h3>
                        <CreateFinancialProcedureForm
                            onSuccess={() => handleFormSuccess('financial-procedures')}
                        />
                    </div>
                </Card>
            )}
        </div>
    );

    // Financial Status Tab Content
    const renderFinancialStatusTab = () => (
        <div className="space-y-6">
            {/* Data Display Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">سجل الموقف المالي</h3>
                    <Button
                        size="sm"
                        onClick={() => setShowFormTab(prev => ({ ...prev, 'financial-status': !prev['financial-status'] }))}
                    >
                        {showFormTab['financial-status'] ? 'إغلاق النموذج' : 'إضافة موقف مالي جديد'}
                    </Button>
                </div>

                {fsLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">جاري تحميل البيانات...</p>
                    </div>
                ) : fsData?.data && fsData.data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>تاريخ الإنشاء</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead>المبلغ التقديري</TableHead>
                                <TableHead>المبلغ الفعلي</TableHead>
                                <TableHead>الإجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fsData.data.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            item.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                                            item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                            item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {item.status === 'planned' ? 'مخطط' :
                                             item.status === 'in_progress' ? 'قيد التنفيذ' :
                                             item.status === 'completed' ? 'مكتمل' :
                                             'معلق'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {item.estimatedAmount?.toLocaleString('ar-EG') || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {item.actualAmount?.toLocaleString('ar-EG') || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => navigate(`/financial-status/${item._id}`)}
                                        >
                                            عرض التفاصيل
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 border rounded-lg bg-gray-50">
                        <p className="text-gray-500">لا توجد مواقف مالية لهذا المشروع</p>
                    </div>
                )}
            </div>

            {/* Form Section */}
            {showFormTab['financial-status'] && (
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">إضافة موقف مالي جديد</h3>
                        <CreateFinancialStatusForm
                            onSuccess={() => handleFormSuccess('financial-status')}
                        />
                    </div>
                </Card>
            )}
        </div>
    );

    // Procedures Tab Content
    const renderProceduresTab = () => (
        <div className="space-y-6">
            {/* Data Display Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">عروض الشركات والإجراءات الفنية</h3>
                    <Button
                        size="sm"
                        onClick={() => setShowFormTab(prev => ({ ...prev, 'procedures': !prev['procedures'] }))}
                    >
                        {showFormTab['procedures'] ? 'إغلاق النموذج' : 'إضافة إجراء جديد'}
                    </Button>
                </div>

                {procLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">جاري تحميل البيانات...</p>
                    </div>
                ) : procData?.data && procData.data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>تاريخ الإنشاء</TableHead>
                                <TableHead>نوع الإجراء</TableHead>
                                <TableHead>الإجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {procData.data.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                                    </TableCell>
                                    <TableCell>{item.procedureType || '-'}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => navigate(`/procedure/${item._id}`)}
                                        >
                                            عرض التفاصيل
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 border rounded-lg bg-gray-50">
                        <p className="text-gray-500">لا توجد إجراءات لهذا المشروع</p>
                    </div>
                )}
            </div>

            {/* Form Section */}
            {showFormTab['procedures'] && (
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">إضافة إجراء جديد</h3>
                        <CreateProcedureForm
                            onSuccess={() => handleFormSuccess('procedures')}
                        />
                    </div>
                </Card>
            )}
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <PageTitle title="المشروع" />
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    العودة
                </Button>
            </div>

            <div className="space-y-6">
                {/* Project General Information */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-primary-200">
                            بيانات المشروع الأساسية
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                {renderDetailItem('كود المشروع', project.projectCode)}
                                {renderDetailItem('اسم المشروع', project.projectName)}
                                {renderDetailItem('العام المالي', project.financialYear)}
                                {renderDetailItem('كود نوع المشروع', project.projectTypeCode || project.projectType)}
                            </div>
                            <div>
                                {renderDetailItem('اسلوب النشر والتعاقد', project.publicationMethod || project.contractingMethod)}
                                {renderDetailItem('الجهة الطالبة', project.requestingEntity || project.ownerEntity)}
                                {renderDetailItem('الفرع المسؤول', project.responsibleBranch)}
                                {renderDetailItem('الموظف المسؤول', project.responsibleEmployeeId || project.responsibleEmployee)}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                {renderDetailItem('التكلفة التقديرية', project.estimatedCost ? project.estimatedCost.toLocaleString('ar-EG') : '-')}
                                {renderDetailItem('نسبة العلاوة', project.premiumRate)}
                                {renderDetailItem('رقم تذكرة الفرع المالي', project.branchMemoNumber)}
                            </div>
                            <div>
                                {renderDetailItem('تاريخ الإصدار', project.issueDate ? new Date(project.issueDate).toLocaleDateString('ar-EG') : '-')}
                                {renderDetailItem('تاريخ ورود الكارت', project.cartArrivalDate ? new Date(project.cartArrivalDate).toLocaleDateString('ar-EG') : '-')}
                                {renderDetailItem('تاريخ البداية الفعلي', project.actualStartDate ? new Date(project.actualStartDate).toLocaleDateString('ar-EG') : '-')}
                                {renderDetailItem('تاريخ النهاية الفعلي', project.actualEndDate ? new Date(project.actualEndDate).toLocaleDateString('ar-EG') : '-')}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                {renderDetailItem('تاريخ الفتح الفعلي', project.actualOpeningDate ? new Date(project.actualOpeningDate).toLocaleDateString('ar-EG') : '-')}
                                {renderDetailItem('تاريخ النشر', project.publicationDate ? new Date(project.publicationDate).toLocaleDateString('ar-EG') : '-')}
                            </div>
                            <div>
                                {renderDetailItem('اسم الشركة', project.company)}
                                {renderDetailItem('المشروع الرئيسي', project.mainProjectCode || project.mainProject)}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Financial Procedure Data */}
                {(project.financialProcedure || project.company || project.offerType) && (
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 pb-4 border-b border-primary-200">
                                البيانات المالية
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    {renderDetailItem('شركة', project.financialProcedure?.company || project.company)}
                                    {renderDetailItem('نوع العرض', project.financialProcedure?.offerType || project.offerType)}
                                </div>
                                <div>
                                    {renderDetailItem('رقم العرض', project.financialProcedure?.offerNumber || project.offerNumber)}
                                    {renderDetailItem('تاريخ العرض', project.financialProcedure?.offerDate || project.offerDate)}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Financial Status */}
                {(project.financialStatus || project.status) && (
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 pb-4 border-b border-primary-200">
                                الحالة المالية
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    {renderDetailItem('الحالة', project.financialStatus?.status || project.status)}
                                    {renderDetailItem('المبلغ التقديري', project.financialStatus?.estimatedAmount || project.estimatedAmount)}
                                </div>
                                <div>
                                    {renderDetailItem('المبلغ الفعلي', project.financialStatus?.actualAmount || project.actualAmount)}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Procedures Data */}
                {(project.procedure || project.responsibleParty) && (
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 pb-4 border-b border-primary-200">
                                الإجراءات
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    {renderDetailItem('اسم الجهة المسؤولة', project.procedure?.responsibleParty || project.responsibleParty)}
                                    {renderDetailItem('نوع العقد', project.procedure?.contractType || project.contractType)}
                                </div>
                                <div>
                                    {renderDetailItem('عرض السعر', project.procedure?.priceOffer || project.priceOffer)}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Tabbed Section for Sub-modules */}
                <Card>
                    <div className="p-6">
                        {/* Tabs Navigation */}
                        <div className="border-b border-gray-200 mb-6">
                            <div className="flex gap-0">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                                            activeTab === tab.id
                                                ? 'border-primary-600 text-primary-600 bg-primary-50'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div>
                            {activeTab === 'financial-procedures' && renderFinancialProceduresTab()}
                            {activeTab === 'financial-status' && renderFinancialStatusTab()}
                            {activeTab === 'procedures' && renderProceduresTab()}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProjectFullDetails;
