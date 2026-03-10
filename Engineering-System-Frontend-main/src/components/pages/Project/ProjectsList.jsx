import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/Table/Table';
import Button from '../../ui/Button/Button';
import PageTitle from '../../ui/PageTitle/PageTitle';
import Pagination from '../../ui/Pagination/Pagination';
import SearchInput from '../../ui/SearchInput/SearchInput';
import Loading from '../../common/Loading/Loading';
import { getProjects } from '../../../api/projectAPI';
import toast from 'react-hot-toast';
import Can from '../../common/Can/Can';

const ProjectsList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    // Fetch projects with React Query
    const { data, isLoading, error } = useQuery({
        queryKey: ['projects', page, search],
        queryFn: () => getProjects({ page, search }),
        keepPreviousData: true,
    });

    const handleSearch = (value) => {
        setPage(1);
        setSearch(value?.value || '');
    };

    if (isLoading) return <Loading />;

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
                <p className="text-gray-600">{error?.message || 'خطأ غير معروف'}</p>
            </div>
        );
    }

    const projects = data?.data?.docs || data?.data || [];
    const totalPages = data?.data?.totalPages || 1;

    return (
        <div>
            <PageTitle title="قائمة المشاريع" />

            <div className="bg-white shadow rounded-lg p-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <SearchInput
                        type="column"
                        model="projects"
                        column="projectName"
                        onSelect={handleSearch}
                        placeholder="ابحث عن المشروع..."
                    />
                    <Can action="projects:create">
                        <Link to="/projects/create">
                            <Button>إضافة مشروع جديد</Button>
                        </Link>
                    </Can>
                </div>

                {/* Projects Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الإجراءات</TableHead>
                            <TableHead>الفرع المسئول</TableHead>
                            <TableHead>السنة المالية</TableHead>
                            <TableHead>تكلفة المشروع</TableHead>
                            <TableHead>اسم المشروع</TableHead>
                            <TableHead>كود المشروع</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.length > 0 ? (
                            projects.map(project => (
                                <TableRow key={project._id}>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link to={`/projects/${project._id}`}>
                                                <Button size="sm" variant="primary">
                                                    عرض التفاصيل
                                                </Button>
                                            </Link>
                                            <Can action="projects:update">
                                                <Link to={`/projects/update/${project._id}`}>
                                                    <Button size="sm" variant="secondary">
                                                        تعديل
                                                    </Button>
                                                </Link>
                                            </Can>
                                        </div>
                                    </TableCell>
                                    <TableCell>{project.responsibleBranch || '-'}</TableCell>
                                    <TableCell>{project.financialYear || '-'}</TableCell>
                                    <TableCell>{project.estimatedCost ? project.estimatedCost.toLocaleString('ar-EG') : '-'}</TableCell>
                                    <TableCell>{project.projectName}</TableCell>
                                    <TableCell className="font-semibold">{project.projectCode}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                                    لا توجد مشاريع
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectsList;
