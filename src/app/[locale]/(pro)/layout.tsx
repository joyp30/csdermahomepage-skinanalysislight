export default function ProModeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500 selection:text-white">
            {/* Kiosk Mode: No Navigation, Fullscreen focus */}
            <header className="fixed top-0 left-0 w-full p-4 z-50 pointer-events-none">
                <div className="inline-block bg-black/50 backdrop-blur-md px-4 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400">
                        Professional Mode
                    </span>
                </div>
            </header>
            <main className="h-screen w-full overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
