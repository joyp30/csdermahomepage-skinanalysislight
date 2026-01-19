import { redirect } from 'next/navigation';

export default async function ProModePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    redirect(`/${locale}/consult/pro/checkin`);
}
