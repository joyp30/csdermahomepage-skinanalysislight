import Header from '@/components/Header';

export default function FullModeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-premium-mesh">
            <Header />
            <main className="min-h-[calc(100vh-80px)]">
                {children}
            </main>
        </div>
    );
}
