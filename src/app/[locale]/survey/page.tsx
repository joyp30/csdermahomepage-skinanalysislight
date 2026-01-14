import { useTranslations } from 'next-intl';
import SurveyWizard from './components/SurveyWizard';

export default function SurveyPage() {
    const t = useTranslations('Brand');
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
            <header className="fixed w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="font-bold text-xl text-slate-800 tracking-tight">
                        {t('name')} <span className="text-blue-600 font-normal ml-2">{t('app_name')}</span>
                    </div>
                    <div className="text-sm text-slate-500 font-medium">{t('guest_mode')}</div>
                </div>
            </header>

            <main className="flex-1 py-12 mt-16 flex justify-center">
                <SurveyWizard />
            </main>
        </div>
    );
}
