import { redirect } from 'next/navigation';

export default async function FullModePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // Redirect to the check-in page within the full mode
    redirect(`/${locale}/consult/full/checkin`);
}
