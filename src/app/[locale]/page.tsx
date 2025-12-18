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
        className="w-full max-w-5xl z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="text-center mb-16 space-y-6">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-slate-200/50 to-white/50 backdrop-blur-md border border-white/50 mb-4">
            <span className="px-6 py-2 rounded-full bg-white/80 text-xs font-bold tracking-[0.2em] text-slate-900 uppercase">
              Premium Dermatology
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
            <span className="block text-gradient-navy">Seoul Skin</span>
            <span className="block text-4xl md:text-5xl font-light text-slate-600 mt-2">Analysis System</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            {t('hero_description')}
          </p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 gap-8 mb-12 w-full px-4 md:px-0">

          {/* Main Action: Light Mode (Free) - Dark Premium Card */}
          <Link href={`/${locale}/consult/light`} className="group w-full block">
            <div className="relative overflow-hidden bg-[#0f172a] rounded-[2rem] p-8 md:p-12 shadow-2xl transition-all duration-500 hover:shadow-blue-900/20 hover:-translate-y-1 border border-white/10 group-hover:border-blue-500/30">

              {/* Card Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-950 opacity-100 dark:opacity-100"></div>
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                <div className="space-y-6 max-w-xl">
                  <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full pl-2 pr-4 py-1.5 border border-white/10">
                    <div className="bg-gradient-to-r from-amber-300 to-yellow-500 rounded-full p-1.5">
                      <Sparkles className="w-3 h-3 text-white" fill="currentColor" />
                    </div>
                    <span className="text-slate-200 text-xs font-bold tracking-wider uppercase">{t('mode_light_badge')}</span>
                  </div>

                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                      {t('mode_light_desc')}
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-transparent rounded-full mx-auto md:mx-0"></div>
                  </div>

                  <p className="text-slate-400 text-lg font-light leading-relaxed">
                    {t('card_consultation_desc')}
                  </p>

                  <div className="pt-2">
                    <span className="text-blue-400 text-sm font-semibold flex items-center justify-center md:justify-start gap-2 group-hover:gap-3 transition-all duration-300">
                      Start Analysis <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                  <div className="relative h-24 w-24 md:h-32 md:w-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-blue-400" strokeWidth={1} />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary Action: Full Mode (Premium) - Glass Light Card */}
          <Link href={`/${locale}/consult/full/intro`} className="group w-full block">
            <div className="glass-panel rounded-[2rem] p-8 hover:bg-white/80 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border-white/60">
              <div className="flex items-center gap-8 flex-col md:flex-row">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full"></div>
                  <div className="relative h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-purple-50 to-white rounded-2xl flex items-center justify-center border border-purple-100 text-purple-600 shadow-lg group-hover:scale-105 transition-transform duration-300 hover:text-purple-700">
                    <Activity size={32} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {t('mode_full_title')}
                    </h3>
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-md shadow-purple-200">
                      Premium
                    </span>
                  </div>
                  <p className="text-slate-500 font-light">{t('mode_full_desc')}</p>
                </div>
              </div>

              <div className="flex items-center text-slate-400 group-hover:text-purple-600 font-medium text-sm transition-colors duration-300">
                <span className="mr-2 uppercase tracking-wider text-xs font-bold">Details</span>
                <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-purple-200 flex items-center justify-center group-hover:bg-purple-50 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

        </motion.div>
      </motion.main>
    </div>
  );
}
