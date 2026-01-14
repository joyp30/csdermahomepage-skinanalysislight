import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, FileCheck, Activity } from 'lucide-react';
import { getSurveys } from './actions';
import { getTranslations } from 'next-intl/server';

export default async function AdminDashboard() {
    const surveysData = await getSurveys();
    const t = await getTranslations('Admin');

    return (
        <div className="space-y-8 p-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t('dashboard_title')}</h2>
                <p className="text-slate-500">{t('overview')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('total_consultations')}</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{surveysData.length}</div>
                        <p className="text-xs text-muted-foreground">{t('total_records')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('recent_activity')}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{surveysData.length > 0 ? 'Active' : 'Idle'}</div>
                        <p className="text-xs text-muted-foreground">{t('system_status')}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="font-semibold text-lg">{t('recent_consultations')}</h3>
                </div>
                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>{t('table.time')}</TableHead>
                                <TableHead>{t('table.concerns')}</TableHead>
                                <TableHead>{t('table.status')}</TableHead>
                                <TableHead className="text-right">{t('table.action')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {surveysData.map((survey) => (
                                <TableRow key={survey.id}>
                                    <TableCell className="font-medium">#{survey.id}</TableCell>
                                    <TableCell>{new Date(survey.createdAt!).toLocaleTimeString()}</TableCell>
                                    <TableCell>{survey.concerns.join(', ')}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                            {survey.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/consultations/${survey.id}`}>
                                            <Button variant="ghost" size="sm">{t('table.view')}</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {surveysData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                                        {t('table.no_data')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
