import { db } from '@/db';
import { surveys } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UploadForm from './UploadForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const surveyId = parseInt(id);
    const t = await getTranslations('Admin');

    const survey = await db.select().from(surveys).where(eq(surveys.id, surveyId)).get();

    if (!survey) {
        return <div>Consultation not found</div>;
    }

    const concerns = JSON.parse(survey.concerns as string) as string[];
    const existingImages = survey.images ? JSON.parse(survey.images as string) as string[] : [];

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Consultation #{survey.id}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('table.patient')} Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-semibold">{t('table.concerns')}:</span> {concerns.join(', ')}
                        </div>
                        <div>
                            <span className="font-semibold">Skin Type:</span> {survey.skinType}
                        </div>
                        <div>
                            <span className="font-semibold">{t('table.time')}:</span> {new Date(survey.createdAt!).toLocaleString()}
                        </div>
                        <div>
                            <span className="font-semibold">{t('table.status')}:</span> {survey.status}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard_title')} Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {existingImages.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {existingImages.map((img, i) => (
                                    <div key={i} className="relative aspect-square bg-slate-100 rounded-md overflow-hidden">
                                        <Image src={img} alt={`Analysis ${i}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500 mb-4">No photos uploaded yet.</div>
                        )}

                        <UploadForm surveyId={survey.id} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
