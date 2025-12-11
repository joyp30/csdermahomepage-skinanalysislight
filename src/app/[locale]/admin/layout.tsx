import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight">Staff Portal</h1>
                    <p className="text-sm text-slate-400 mt-1">Seoul Dermatology</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/surveys">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <FileText className="mr-2 h-4 w-4" />
                            Consultations
                        </Button>
                    </Link>
                    <Link href="/admin/patients">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <Users className="mr-2 h-4 w-4" />
                            Patients
                        </Button>
                    </Link>
                    <Link href="/admin/settings">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
