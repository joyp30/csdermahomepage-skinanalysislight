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

        <motion.div variants={item} className="flex flex-col gap-8 mb-12 w-full">

          {/* Main Action: Light Mode (Free) */}
          <Link href={`/${locale}/consult/light`} className="group w-full">
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl hover:scale-[1.01] transition-all duration-300">
              {/* Abstract decorative background */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/30 to-purple-600/30 blur-3xl rounded-full -mr-32 -mt-32"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-4 max-w-lg">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
                    <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                    <span className="text-white text-sm font-bold tracking-wide">{t('mode_light_badge')}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    {t('mode_light_desc')}
                  </h2>
                  <p className="text-slate-300 text-lg">
                    {t('card_consultation_desc')}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <div className="h-16 w-16 md:h-20 md:w-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-white/10">
                    <ArrowRight className="w-8 h-8 md:w-10 md:h-10 text-slate-900" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary Action: Full Mode (Premium) */}
          <Link href={`/${locale}/consult/full/intro`} className="group w-full">
            <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-8 hover:bg-white/80 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left group-hover:shadow-lg">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <Activity size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 justify-center md:justify-start">
                    {t('mode_full_title')}
                    <span className="bg-purple-100 text-purple-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Premium</span>
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{t('mode_full_desc')}</p>
                </div>
              </div>
              <div className="flex items-center text-purple-600 font-semibold text-sm bg-purple-50 px-6 py-3 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">
                {t('start_button')} <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>

        </motion.div>
      </motion.main>
    </div>
  );
}
