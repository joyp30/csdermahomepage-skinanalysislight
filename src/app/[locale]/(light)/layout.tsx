import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function LightModeLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Simple Mobile Header */}
            <header className="bg-white border-b border-slate-100 h-14 flex items-center px-4 sticky top-0 z-50">
                <Link href={`/${locale}`} className="mr-4">
                    <ArrowLeft className="w-6 h-6 text-slate-800" />
                </Link>
                <span className="font-bold text-slate-900 text-lg">Seoul Skin Light</span>
            </header>
            <main className="max-w-md mx-auto">
                {children}
            </main>
        </div>
    );
}
