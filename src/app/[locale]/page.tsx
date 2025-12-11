'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const t = useTranslations('Index');
  const locale = useLocale();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8 overflow-hidden relative">
      <LanguageSwitcher />
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <motion.main
        className="z-10 w-full max-w-4xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-sm mb-4 border border-slate-200">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full mr-2">{t('new_badge')}</span>
            <span className="text-slate-600 text-sm pr-2">{t('ai_evaluation')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
            {t('hero_title_1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">{t('hero_title_2')}</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            {t('welcome')}
          </p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href={`/${locale}/checkin`} className="group">
            <div className="h-full bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-slate-200/50">
              <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Sparkles size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('card_consultation_title')}</h2>
              <p className="text-slate-500 mb-6">{t('card_consultation_desc')}</p>
              <div className="flex items-center text-blue-600 font-semibold">
                {t('card_consultation_action')} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <div className="grid grid-rows-2 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-200/50 flex items-center gap-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{t('feature_analysis_title')}</h3>
                <p className="text-sm text-slate-500">{t('feature_analysis_desc')}</p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-200/50 flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{t('feature_reports_title')}</h3>
                <p className="text-sm text-slate-500">{t('feature_reports_desc')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="text-center">
          <Link href={`/${locale}/checkin`}>
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all bg-gradient-to-r from-slate-900 to-slate-800 border-none">
              {t('start_button')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.main>
    </div>
  );
}
