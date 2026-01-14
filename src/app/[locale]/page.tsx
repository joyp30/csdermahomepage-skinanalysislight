'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Sun, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLightRecommendation, LightAnswers, RecommendationResult } from '@/lib/logic/light-mode';
import { useTranslations, useLocale } from 'next-intl';
import { Label } from '@/components/ui/label';

// ----------------------------------------------------------------------
// Constants & Types
// ----------------------------------------------------------------------

const CONCERN_ITEMS = [
  { id: 'pigmentation', icon: '✨', color: 'from-amber-200 to-yellow-400' },
  { id: 'acne', icon: '🔴', color: 'from-red-200 to-pink-400' },
  { id: 'pores', icon: '🕳️', color: 'from-gray-200 to-slate-400' },
  { id: 'wrinkles', icon: '👵', color: 'from-purple-200 to-violet-400' },
  { id: 'sagging', icon: '🆙', color: 'from-blue-200 to-indigo-400' },
  { id: 'redness', icon: '😳', color: 'from-rose-200 to-red-400' }
];

const SKIN_TYPES = [
  { id: 'dry', label: 'Dry', emoji: '🌵' },
  { id: 'oily', label: 'Oily', emoji: '💧' },
  { id: 'combination', label: 'Combination', emoji: '🌗' },
  { id: 'sensitive', label: 'Sensitive', emoji: '🌿' },
  { id: 'normal', label: 'Normal', emoji: '✨' }
];

const BUDGETS = [
  { id: 'economy', label: 'Economy', emoji: '💰' },
  { id: 'standard', label: 'Standard', emoji: '💳' },
  { id: 'premium', label: 'Premium', emoji: '💎' }
];

type LightStep = 'checkin' | 'survey' | 'deep_dive' | 'analyzing' | 'result';

// Define local state type that includes 'budget' which is not in the core Logic interface
interface PageAnswers extends LightAnswers {
  budget?: string;
}

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

// Premium Choice Card
const ChoiceCard = ({
  selected,
  onClick,
  children,
  className,
  icon,
  imageUrl
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "relative w-full rounded-2xl text-left transition-all duration-300 border overflow-hidden group hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1",
      selected
        ? "border-indigo-500/50 bg-indigo-50/80 shadow-indigo-100 shadow-lg"
        : "border-slate-100 bg-white/80 hover:bg-white/95 shadow-sm backdrop-blur-sm",
      className
    )}
  >
    {selected && (
      <motion.div
        layoutId="check"
        className="absolute top-4 right-4 z-20 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-md"
      >
        <Check size={14} strokeWidth={3} />
      </motion.div>
    )}

    {/* Image Section */}
    {imageUrl && (
      <div className="w-full aspect-[4/3] relative overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-slate-200 animate-pulse" /> {/* Placeholder */}
        <img
          src={imageUrl}
          alt="Visual Reference"
          className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-110"
        />
        <div className={cn("absolute inset-0 z-10 transition-colors duration-300", selected ? "bg-indigo-500/10" : "bg-transparent")} />
      </div>
    )}

    <div className={cn("relative z-10 flex items-center gap-4", imageUrl ? "p-5" : "p-5")}>
      {icon && <div className="text-2xl opacity-90">{icon}</div>}
      <div className="flex-1">
        {children}
      </div>
    </div>
  </motion.button>
);

// Progress Bar
const ProgressBar = ({ step }: { step: LightStep }) => {
  const steps = ['survey', 'deep_dive', 'result'];
  const currentIndex = steps.indexOf(step === 'analyzing' ? 'deep_dive' : step);
  const progress = Math.max(5, ((currentIndex + 1) / steps.length) * 100);

  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function Home() {
  const [step, setStep] = useState<LightStep>('survey');
  const t = useTranslations('LightMode');
  const locale = useLocale();

  // Initialize with PageAnswers type
  const [data, setData] = useState<PageAnswers>({
    concerns: [],
    skinType: '',
    budget: '',
  });

  const [result, setResult] = useState<RecommendationResult | null>(null);

  const handleNext = async () => {
    if (step === 'survey') {
      if (data.concerns.includes('pigmentation') || data.concerns.includes('acne') ||
        data.concerns.includes('wrinkles') || data.concerns.includes('sagging')) {
        setStep('deep_dive');
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = () => {
    setStep('analyzing');
    const rec = getLightRecommendation(data);
    setResult(rec);
    setTimeout(() => { setStep('result'); }, 2500);
  };

  const getDeepDiveModule = () => {
    if (!data.concerns) return null;
    if (data.concerns.includes('pigmentation')) return 'pigmentation';
    if (data.concerns.includes('acne')) return 'acne';
    if (data.concerns.includes('wrinkles') || data.concerns.includes('sagging')) return 'lifting';
    return null;
  };

  const activeModule = step === 'deep_dive' ? getDeepDiveModule() : null;

  const getTreatmentName = (rec: any) => {
    if (!rec) return '';
    if (rec.machineNames && rec.machineNames.length > 0) return rec.machineNames.join(' + ');
    return locale === 'ko' ? rec.name : rec.nameEn;
  };
  const getTreatmentDesc = (rec: any) => {
    if (!rec) return '';
    return locale === 'ko' ? rec.description : (rec.descriptionEn || rec.description);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* LEFT PANEL: Premium Visual */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-slate-900 overflow-hidden shadow-2xl z-10">
        <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: "url('/premium_bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-slate-900/95 to-black" />

        {/* Clean Abstract Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="absolute inset-0 p-16 flex flex-col justify-end text-white z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
              <Sparkles className="w-10 h-10 text-indigo-300" />
            </div>
            <h1 className="text-6xl font-black mb-6 leading-tight tracking-tight font-serif">
              Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">AI Analysis</span>
            </h1>
            <p className="text-xl text-indigo-100/80 max-w-md leading-relaxed font-light font-serif italic">{t('subtitle')}</p>

            <div className="mt-12 flex items-center gap-4 text-sm text-indigo-300/60 font-medium uppercase tracking-widest">
              <div className="h-px w-8 bg-indigo-300/30" />
              <span>Powered by CS Derma Logic</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL: Interaction Area */}
      <div className="w-full lg:w-7/12 relative flex flex-col bg-slate-50">
        <div className="absolute inset-0 bg-noise opacity-40 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/40 via-transparent to-transparent z-0" />

        <div className="flex-1 overflow-y-auto relative z-10 p-6 md:p-12 lg:p-20 flex items-center justify-center">
          <div className="w-full max-w-xl">

            {/* Progress Bar (except on checkin/result) */}
            {step !== 'checkin' && step !== 'result' && <ProgressBar step={step} />}

            <AnimatePresence mode="wait">

              {/* STEP 2: SURVEY */}
              {step === 'survey' && (
                <motion.div
                  key="survey"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <h2 className="text-2xl font-medium flex items-center gap-3 font-serif lg:text-3xl">
                      <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-light font-sans">1</span>
                      {t('concerns.label')} <span className="text-sm font-normal text-slate-400 ml-auto font-sans tracking-wide">Select up to 2</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {CONCERN_ITEMS.map((c) => (
                        <ChoiceCard
                          key={c.id}
                          selected={data.concerns.includes(c.id)}
                          onClick={() => {
                            const selected = data.concerns.includes(c.id);
                            setData(prev => ({
                              ...prev,
                              concerns: selected ? prev.concerns.filter(id => id !== c.id) : [...prev.concerns, c.id].slice(0, 2)
                            }));
                          }}
                          icon={<span className="text-2xl">{c.icon}</span>}
                        >
                          <span className="font-bold text-lg">{t(`concerns.${c.id}`)}</span>
                        </ChoiceCard>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-medium flex items-center gap-3 font-serif lg:text-3xl">
                      <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-light font-sans">2</span>
                      {t('skinType.label')}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {SKIN_TYPES.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setData({ ...data, skinType: type.id })}
                          className={cn(
                            "px-6 py-3 rounded-full transition-all text-sm lg:text-base border hover:scale-105",
                            data.skinType === type.id
                              ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                              : "bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white"
                          )}
                        >
                          <span className="mr-2">{type.emoji}</span> {t(`skinType.${type.id}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-medium flex items-center gap-3 font-serif lg:text-3xl">
                      <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-light font-sans">3</span>
                      {t('budget.label')}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {BUDGETS.map(b => (
                        <button
                          key={b.id}
                          onClick={() => setData({ ...data, budget: b.id })}
                          className={cn(
                            "px-6 py-3 rounded-full transition-all text-sm lg:text-base border hover:scale-105",
                            data.budget === b.id
                              ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                              : "bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white"
                          )}
                        >
                          <span className="mr-2">{b.emoji}</span> {t(`budget.${b.id}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button
                      className="w-full h-16 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                      onClick={handleNext}
                      disabled={data.concerns.length === 0 || !data.skinType}
                    >
                      {t('next_button') || 'Next Step'} <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DEEP DIVE */}
              {step === 'deep_dive' && (
                <motion.div
                  key="deep_dive"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100 font-sans">
                      <Sparkles size={12} /> AI Deep Analysis
                    </span>
                    <h2 className="text-3xl font-medium text-slate-900 mb-2 font-serif lg:text-4xl">상세 정밀 진단</h2>
                    <p className="text-slate-500 font-sans font-light">더 정확한 진단을 위해 추가 정보를 입력해주세요.</p>
                  </div>

                  {/* MODULE I: Pigmentation */}
                  {activeModule === 'pigmentation' && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-slate-900 font-serif">Q. 거울을 보셨을 때 가장 비슷한 증상은?</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <ChoiceCard
                            selected={data.pigment_visual === 'melasma'}
                            onClick={() => setData({ ...data, pigment_visual: 'melasma' })}
                            imageUrl="/images/consult/melasma.png"
                          >
                            <span className="font-bold text-base block mb-1">기미 (Melasma)</span>
                            <span className="text-xs text-slate-500 leading-tight block">뿌연 안개처럼 넓게 퍼진 갈색 반점</span>
                          </ChoiceCard>

                          <ChoiceCard
                            selected={data.pigment_visual === 'freckle'}
                            onClick={() => setData({ ...data, pigment_visual: 'freckle' })}
                            imageUrl="/images/consult/freckles.png"
                          >
                            <span className="font-bold text-base block mb-1">주근깨/잡티 (Lentigines)</span>
                            <span className="text-xs text-slate-500 leading-tight block">깨알처럼 경계가 뚜렷한 진한 점</span>
                          </ChoiceCard>

                          <ChoiceCard
                            selected={data.pigment_visual === 'pih'}
                            onClick={() => setData({ ...data, pigment_visual: 'pih' })}
                            imageUrl="/images/consult/pih.png"
                          >
                            <span className="font-bold text-base block mb-1">여드름 자국 (PIH)</span>
                            <span className="text-xs text-slate-500 leading-tight block">염증 후 남은 붉거나 거뭇한 자국</span>
                          </ChoiceCard>

                          <ChoiceCard
                            selected={data.pigment_visual === 'dullness'}
                            onClick={() => setData({ ...data, pigment_visual: 'dullness' })}
                            imageUrl="/images/consult/dullness.png"
                          >
                            <span className="font-bold text-base block mb-1">칙칙함 (Dullness)</span>
                            <span className="text-xs text-slate-500 leading-tight block">전체적으로 어둡고 고르지 못한 톤</span>
                          </ChoiceCard>
                        </div>
                      </div>

                      {data.pigment_visual === 'freckle' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-6 border-t border-slate-100">
                          <Label className="text-lg font-bold text-slate-900">Q. 회복 기간(다운타임) 허용 범위</Label>
                          <div className="grid grid-cols-1 gap-3">
                            <ChoiceCard selected={data.pigment_downtime === 'strict'} onClick={() => setData({ ...data, pigment_downtime: 'strict' })}>
                              <span className="font-bold block text-slate-900">🩹 2주간 듀오덤 부착 가능 (확실한 제거)</span>
                            </ChoiceCard>
                            <ChoiceCard selected={data.pigment_downtime === 'social'} onClick={() => setData({ ...data, pigment_downtime: 'social' })}>
                              <span className="font-bold block text-slate-900">🍂 테이프 없음 (5~7일간 거친 피부결 감수)</span>
                            </ChoiceCard>
                            <ChoiceCard selected={data.pigment_downtime === 'immediate'} onClick={() => setData({ ...data, pigment_downtime: 'immediate' })}>
                              <span className="font-bold block text-slate-900">✨ 즉시 일상생활 복귀 (티 안 나게)</span>
                            </ChoiceCard>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* MODULE II: Acne */}
                  {activeModule === 'acne' && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-slate-900 font-serif">Q. 골프, 등산, 여행 등 야외 활동이 많으신가요?</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <ChoiceCard selected={data.acne_uv_risk === true} onClick={() => setData({ ...data, acne_uv_risk: true })} className="text-center block">
                            <Sun className="w-8 h-8 mx-auto mb-3 text-amber-500" />
                            <span className="font-bold block">네, 많습니다</span>
                          </ChoiceCard>
                          <ChoiceCard selected={data.acne_uv_risk === false} onClick={() => setData({ ...data, acne_uv_risk: false })} className="text-center block">
                            <Shield className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
                            <span className="font-bold block">아니오 (실내 위주)</span>
                          </ChoiceCard>
                        </div>
                      </div>

                      {data.acne_uv_risk === false && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-6 border-t border-slate-100">
                          <Label className="text-lg font-bold text-slate-900">Q. 선호하는 치료 방향은?</Label>
                          <div className="flex gap-4">
                            <ChoiceCard selected={data.acne_value === 'economy'} onClick={() => setData({ ...data, acne_value: 'economy' })} className="flex-1">
                              <div className="text-center">
                                <span className="text-2xl block mb-2">💰</span>
                                <span className="font-bold block">가성비</span>
                                <span className="text-xs text-slate-500">자외선 차단 필수</span>
                              </div>
                            </ChoiceCard>
                            <ChoiceCard selected={data.acne_value === 'convenience'} onClick={() => setData({ ...data, acne_value: 'convenience' })} className="flex-1">
                              <div className="text-center">
                                <span className="text-2xl block mb-2">⚡</span>
                                <span className="font-bold block">편의성</span>
                                <span className="text-xs text-slate-500">관리 편함</span>
                              </div>
                            </ChoiceCard>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* MODULE III: Lifting */}
                  {activeModule === 'lifting' && (
                    <div className="space-y-4">
                      <Label className="text-lg font-medium text-slate-900 font-serif">Q. 가장 고민되는 노화 증상은?</Label>
                      <div className="flex flex-col gap-3">
                        <ChoiceCard selected={data.lifting_type === 'sagging'} onClick={() => setData({ ...data, lifting_type: 'sagging' })}>
                          <span className="font-bold block text-lg mb-1">🔽 턱선 무너짐 / 심부볼 처짐</span>
                        </ChoiceCard>
                        <ChoiceCard selected={data.lifting_type === 'thin'} onClick={() => setData({ ...data, lifting_type: 'thin' })}>
                          <span className="font-bold block text-lg mb-1">👵 잔주름 / 피부가 얇고 패임</span>
                        </ChoiceCard>
                        <ChoiceCard selected={data.lifting_type === 'fat'} onClick={() => setData({ ...data, lifting_type: 'fat' })}>
                          <span className="font-bold block text-lg mb-1">🐷 이중턱 / 얼굴 살이 많음</span>
                        </ChoiceCard>
                      </div>
                    </div>
                  )}

                  <div className="pt-8">
                    <Button
                      className="w-full h-16 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                      onClick={handleNext}
                      disabled={data.concerns.length === 0 || !data.skinType}
                    >
                      {t('analyze_button')} <Sparkles className="ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: ANALYZING */}
              {step === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <div className="relative w-32 h-32 mx-auto mb-10">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-purple-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
                    </div>
                    {/* Orbiting particles */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute -inset-4 rounded-full border border-indigo-100 border-dashed"
                    />
                  </div>
                  <h2 className="text-3xl font-medium text-slate-900 mb-4 font-serif lg:text-4xl">{t('analyzing.title')}</h2>
                  <p className="text-slate-500 text-lg font-sans font-light">{t('analyzing.subtitle')}</p>
                </motion.div>
              )}

              {/* STEP 5: RESULT */}
              {step === 'result' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="space-y-8 pb-20"
                >
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-lg shadow-emerald-100"
                    >
                      <Check size={40} strokeWidth={4} />
                    </motion.div>
                    <h2 className="text-4xl font-black text-slate-900 font-serif">Analysis Complete</h2>
                    <p className="text-slate-500 text-base px-4 font-medium leading-relaxed break-keep font-sans">{result.script}</p>
                  </div>

                  {/* Main Recommendation Card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100 text-left border border-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500"
                  >
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    <div className="relative z-10">
                      <span className="bg-slate-900 text-white text-xs uppercase font-bold px-4 py-2 rounded-full inline-block tracking-wide shadow-lg mb-6 ring-2 ring-white/50">
                        Best Solution
                      </span>
                      <h3 className="text-3xl font-black text-slate-900 mb-3 leading-tight font-serif">{getTreatmentName(result.main)}</h3>
                      <p className="text-slate-500 mb-8 leading-relaxed text-lg font-sans font-light">{getTreatmentDesc(result.main)}</p>

                      <div className="flex items-end justify-between border-t border-slate-100 pt-6">
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Estimated Cost</p>
                          <span className="text-3xl font-black text-indigo-600 tracking-tight">{result.main.price}</span>
                        </div>
                        {result.package_info && (
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-lg">
                            {result.package_info}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Upsell Item */}
                  {result.upsell && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-24 h-24" />
                      </div>
                      <div className="flex items-start gap-4 relaitve z-10">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                          <Sparkles size={24} fill="currentColor" className="text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-lg">{getTreatmentName(result.upsell)}</h4>
                            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Better Together</span>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{getTreatmentDesc(result.upsell)}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700">{result.upsell.price}</span>
                            <Button size="sm" variant="outline" className="h-9 px-4 text-xs font-bold border-slate-200 hover:bg-slate-100 hover:text-slate-900">
                              + 추가하기
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Final CTA */}
                  <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    href={`/${locale}/consult/light`}
                    className="block w-full text-center bg-slate-900 text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-2xl hover:scale-[1.01] transition-all active:scale-[0.98]"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.reload();
                    }}
                  >
                    예약 및 상담 신청하기
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
