import { redirect } from 'next/navigation';

export default function FullModePage({ params }: { params: { locale: string } }) {
    // Redirect to the check-in page within the full mode
    redirect(`/${params.locale}/consult/full/checkin`);
}
