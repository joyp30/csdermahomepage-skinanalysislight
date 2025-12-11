import { redirect } from 'next/navigation';

export default function ProModePage({ params }: { params: { locale: string } }) {
    redirect(`/${params.locale}/consult/pro/checkin`);
}
