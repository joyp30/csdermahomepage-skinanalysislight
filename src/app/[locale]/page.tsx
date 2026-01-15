'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Sun, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLightRecommendation, LightAnswers, RecommendationResult } from '@/lib/logic/light-mode';
import { useTranslations, useLocale } from 'next-intl';
import { Label } from '@/components/ui/label';

// ----------------------------------------------------------------------
// Constants & Types
// ----------------------------------------------------------------------

const CONCERN_ITEMS = [
  { id: 'pigmentation', icon: '✨', color: 'text-amber-500' },
  { id: 'acne', icon: '🔴', color: 'text-rose-500' },
  { id: 'pores', icon: '🕳️', color: 'text-slate-500' },
  { id: 'wrinkles', icon: '👵', color: 'text-purple-500' },
  { id: 'sagging', icon: '🆙', color: 'text-indigo-500' },
  { id: 'redness', icon: '😳', color: 'text-red-500' }
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

// Premium Choice Card v2 (Luxurious & High Contrast)
const ChoiceCard = ({
  selected,
  onClick,
  children,
  className,
  icon,
  imageUrl,
  compact = false
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  compact?: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "relative w-full text-left transition-all duration-300 border group",
      // Shape
      compact ? "rounded-xl" : "rounded-2xl",
      // Colors & Shadows - Fixed rendering issue by using specific hex codes if Tailwind defaults fail
      selected
        ? "bg-[#0f172a] border-[#0f172a] text-white shadow-xl shadow-slate-900/20"
        : "bg-white border-slate-100 text-slate-800 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100",
      className
    )}
  >
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          "absolute z-20 flex items-center justify-center bg-white text-[#0f172a] rounded-full shadow-sm",
          compact ? "top-3 right-3 w-5 h-5" : "top-4 right-4 w-6 h-6"
        )}
      >
        <Check size={compact ? 12 : 14} strokeWidth={3} />
      </motion.div>
    )}

    {/* Image Section */}
    {imageUrl && (
      <div className={cn("w-full relative overflow-hidden bg-slate-50", compact ? "aspect-[3/2]" : "aspect-[4/3]")}>
        <div className="absolute inset-0 bg-slate-200 animate-pulse" /> {/* Placeholder */}
        <img
          src={imageUrl}
          alt="Visual Reference"
          className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
        />
        <div className={cn("absolute inset-0 z-10 transition-colors duration-300", selected ? "bg-[#0f172a]/20" : "bg-transparent")} />
      </div>
    )}

    <div className={cn("relative z-10 flex items-center gap-4", imageUrl ? "p-5" : "p-5")}>
      {icon && <div className={cn("text-2xl transition-opacity", selected ? "opacity-100" : "opacity-80")}>{icon}</div>}
      <div className="flex-1">
        {children}
      </div>
    </div>
  </motion.button>
);

// Minimalist Progress Bar
const ProgressBar = ({ step }: { step: LightStep }) => {
  const steps = ['survey', 'deep_dive', 'result'];
  const currentIndex = steps.indexOf(step === 'analyzing' ? 'deep_dive' : step);
  const progress = Math.max(5, ((currentIndex + 1) / steps.length) * 100);

  return (
    <div className="w-full h-1 bg-slate-100/50 fixed top-0 left-0 lg:absolute lg:top-0 lg:left-0 z-50">
      <motion.div
        className="h-full bg-[#0f172a]"
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

  // Dynamic Text Handling for "Next Step"
  // Use fallback if translation key is missing in build
  const nextButtonText = t.has('next_button') ? t('next_button') : (locale === 'ko' ? '다음 단계' : 'Next Step');

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-[#0f172a]">

      {/* GLOBAL PROGRESS */}
      {step !== 'checkin' && step !== 'result' && <ProgressBar step={step} />}

      {/* LEFT PANEL: Premium Visual (Dark Mode Aesthetics) */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-[#0B0F19] overflow-hidden z-10">
        {/* Background Image - User Reference */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/skin_layer_bg.png')" }}
        />

        {/* Overlay Gradient - Stronger for text readability on busy background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F19]/90 via-[#0B0F19]/60 to-transparent" />

        <div className="absolute inset-0 px-12 py-16 flex flex-col justify-between z-20 text-white">
          <div>
            {/* Logo - Resized and Styled */}
            <div className="mb-10 flex justify-start">
              <img src="/logo_final.jpg" alt="Seoul Skin Clinic" className="h-8 w-auto object-contain brightness-0 invert opacity-80" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-amber-300 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Premium AI Analysis
            </div>

            {/* Enhanced Typography for "Eye-catching" request */}
            <h1 className="text-5xl xl:text-6xl font-serif font-medium leading-tight mb-8 tracking-tight drop-shadow-2xl">
              Discover <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white font-semibold">
                Perfect Skin
              </span> <br />
              Solution
            </h1>

            <div className="relative pl-6 border-l-2 border-amber-500/50">
              <p className="text-lg text-slate-200 font-light max-w-sm leading-relaxed drop-shadow-md">
                {t('subtitle') || "Advanced AI analysis for personalized dermatological treatments."}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-12 backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/5 shadow-2xl">
            <div className="flex gap-8">
              <div className="text-center">
                <span className="block text-3xl font-serif text-white drop-shadow-lg">15k+</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold mt-1">Cases</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <span className="block text-3xl font-serif text-white drop-shadow-lg">98%</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold mt-1">Accuracy</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold mb-1">Powered by</p>
              <p className="font-serif italic text-lg text-amber-200/90">CS Derma Logic</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Interaction Area */}
      <div className="w-full lg:w-7/12 relative flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto relative z-10 px-6 py-12 md:px-12 md:py-16 lg:px-24 flex items-center justify-center">
          <div className="w-full max-w-2xl">

            {/* Mobile Logo Only */}
            <div className="lg:hidden mb-8 flex justify-center">
              <img src="/logo_final.jpg" alt="Seoul Skin Clinic" className="h-8 w-auto mix-blend-multiply opacity-80" />
            </div>

            <AnimatePresence mode="wait">

              {/* STEP 2: SURVEY */}
              {step === 'survey' && (
                <motion.div
                  key="survey"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-12"
                >
                  {/* Question 1 */}
                  <div className="space-y-6">
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Q.01</span>
                      <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#0f172a]">
                        {t('concerns.label')}
                      </h2>
                    </div>
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
                          icon={<span className="text-xl">{c.icon}</span>}
                        >
                          <span className={cn("font-medium text-lg", data.concerns.includes(c.id) ? "text-white" : "text-[#0f172a]")}>
                            {t(`concerns.${c.id}`)}
                          </span>
                        </ChoiceCard>
                      ))}
                    </div>
                  </div>

                  {/* Question 2 & 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex items-baseline gap-4">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Q.02</span>
                        <h2 className="text-xl md:text-2xl font-serif font-medium text-[#0f172a]">
                          {t('skinType.label')}
                        </h2>
                      </div>
                      <div className="flex flex-col gap-2">
                        {SKIN_TYPES.map(type => (
                          <button
                            key={type.id}
                            onClick={() => setData({ ...data, skinType: type.id })}
                            className={cn(
                              "w-full flex items-center justify-between px-5 py-3 rounded-xl text-left border transition-all duration-200",
                              data.skinType === type.id
                                ? "bg-[#0f172a] text-white border-[#0f172a] shadow-lg"
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <span className="text-sm font-medium">{t(`skinType.${type.id}`)}</span>
                            {data.skinType === type.id && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-baseline gap-4">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Q.03</span>
                        <h2 className="text-xl md:text-2xl font-serif font-medium text-[#0f172a]">
                          {t('budget.label')}
                        </h2>
                      </div>
                      <div className="flex flex-col gap-2">
                        {BUDGETS.map(b => (
                          <button
                            key={b.id}
                            onClick={() => setData({ ...data, budget: b.id })}
                            className={cn(
                              "w-full flex items-center justify-between px-5 py-3 rounded-xl text-left border transition-all duration-200",
                              data.budget === b.id
                                ? "bg-[#0f172a] text-white border-[#0f172a] shadow-lg"
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <span className="text-sm font-medium">{t(`budget.${b.id}`)}</span>
                            {data.budget === b.id && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <Button
                      size="lg"
                      className="h-14 px-8 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-base font-medium transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                      onClick={handleNext}
                      disabled={data.concerns.length === 0 || !data.skinType}
                    >
                      {nextButtonText}
                      <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DEEP DIVE */}
              {step === 'deep_dive' && (
                <motion.div
                  key="deep_dive"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="mb-10">
                    <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-widest text-[#0f172a] uppercase bg-slate-100 rounded-full border border-slate-200">
                      Deep Architecture
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#0f172a] leading-tight">
                      상세 정밀 진단
                    </h2>
                    <p className="mt-3 text-slate-500 font-light text-lg">
                      더 정확한 처방을 위해 추가 정보를 확인합니다.
                    </p>
                  </div>

                  {/* MODULE I: Pigmentation */}
                  {activeModule === 'pigmentation' && (
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <Label className="text-xl font-medium text-[#0f172a] font-serif">거울을 보셨을 때 가장 비슷한 증상은?</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <ChoiceCard
                            selected={data.pigment_visual === 'melasma'}
                            onClick={() => setData({ ...data, pigment_visual: 'melasma' })}
                            imageUrl="/images/consult/melasma.png"
                          >
                            <span className="font-bold text-base block mb-1">기미 (Melasma)</span>
                            <span className="text-xs opacity-70 leading-tight block">뿌연 안개처럼 넓게 퍼진 반점</span>
                          </ChoiceCard>

                          <ChoiceCard
                            selected={data.pigment_visual === 'freckle'}
                            onClick={() => setData({ ...data, pigment_visual: 'freckle' })}
                            imageUrl="/images/consult/freckles.png"
                          >
                            <span className="font-bold text-base block mb-1">주근깨/잡티</span>
                            <span className="text-xs opacity-70 leading-tight block">경계가 뚜렷한 진한 점</span>
                          </ChoiceCard>

                          <ChoiceCard
                            selected={data.pigment_visual === 'pih'}
                            onClick={() => setData({ ...data, pigment_visual: 'pih' })}
                            imageUrl="/images/consult/pih.png"
                          >
                            <span className="font-bold text-base block mb-1">여드름 자국</span>
                            <span className="text-xs opacity-70 leading-tight block">염증 후 남은 붉거나 거뭇한 자국</span>
                          </ChoiceCard>

                          <ChoiceCard
                            selected={data.pigment_visual === 'dullness'}
                            onClick={() => setData({ ...data, pigment_visual: 'dullness' })}
                            imageUrl="/images/consult/dullness.png"
                          >
                            <span className="font-bold text-base block mb-1">칙칙함 (Dullness)</span>
                            <span className="text-xs opacity-70 leading-tight block">전체적으로 어두운 톤</span>
                          </ChoiceCard>
                        </div>
                      </div>

                      {data.pigment_visual === 'freckle' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-8 border-t border-slate-100">
                          <Label className="text-xl font-medium text-[#0f172a] font-serif">회복 기간(다운타임) 허용 범위</Label>
                          <div className="grid grid-cols-1 gap-3">
                            <ChoiceCard selected={data.pigment_downtime === 'strict'} onClick={() => setData({ ...data, pigment_downtime: 'strict' })}>
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium text-base">🩹 2주간 듀오덤 부착 가능 (확실한 제거)</span>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-50">High Effect</span>
                              </div>
                            </ChoiceCard>
                            <ChoiceCard selected={data.pigment_downtime === 'social'} onClick={() => setData({ ...data, pigment_downtime: 'social' })}>
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium text-base">🍂 테이프 없음 (거친 피부결 감수)</span>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-50">Balanced</span>
                              </div>
                            </ChoiceCard>
                            <ChoiceCard selected={data.pigment_downtime === 'immediate'} onClick={() => setData({ ...data, pigment_downtime: 'immediate' })}>
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium text-base">✨ 즉시 일상생활 복귀 (티 안 나게)</span>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-50">Safe</span>
                              </div>
                            </ChoiceCard>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* MODULE II: Acne - Simplified UI within Deep Dive */}
                  {activeModule === 'acne' && (
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <Label className="text-xl font-medium text-[#0f172a] font-serif">야외 활동(골프, 등산)이 잦으신가요?</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <ChoiceCard selected={data.acne_uv_risk === true} onClick={() => setData({ ...data, acne_uv_risk: true })} className="text-center py-8">
                            <Sun className="w-8 h-8 mx-auto mb-4 text-amber-500" />
                            <span className="font-bold text-lg block">네, 자주 합니다</span>
                          </ChoiceCard>
                          <ChoiceCard selected={data.acne_uv_risk === false} onClick={() => setData({ ...data, acne_uv_risk: false })} className="text-center py-8">
                            <Shield className="w-8 h-8 mx-auto mb-4 text-emerald-500" />
                            <span className="font-bold text-lg block">아니오 (실내 위주)</span>
                          </ChoiceCard>
                        </div>
                      </div>

                      {data.acne_uv_risk === false && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-8 border-t border-slate-100">
                          <Label className="text-xl font-medium text-[#0f172a] font-serif">선호하는 치료 방향</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <ChoiceCard selected={data.acne_value === 'economy'} onClick={() => setData({ ...data, acne_value: 'economy' })} className="py-6">
                              <div className="text-center">
                                <span className="font-bold block text-lg mb-1">가성비</span>
                                <span className="text-xs opacity-60">자외선 차단 필수</span>
                              </div>
                            </ChoiceCard>
                            <ChoiceCard selected={data.acne_value === 'convenience'} onClick={() => setData({ ...data, acne_value: 'convenience' })} className="py-6">
                              <div className="text-center">
                                <span className="font-bold block text-lg mb-1">편의성</span>
                                <span className="text-xs opacity-60">관리가 편함</span>
                              </div>
                            </ChoiceCard>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* MODULE III: Lifting */}
                  {activeModule === 'lifting' && (
                    <div className="space-y-6">
                      <Label className="text-xl font-medium text-[#0f172a] font-serif">가장 고민되는 노화 증상</Label>
                      <div className="grid grid-cols-1 gap-4">
                        <ChoiceCard selected={data.lifting_type === 'sagging'} onClick={() => setData({ ...data, lifting_type: 'sagging' })}>
                          <span className="font-bold block text-lg">🔽 턱선 무너짐 / 심부볼 처짐</span>
                        </ChoiceCard>
                        <ChoiceCard selected={data.lifting_type === 'thin'} onClick={() => setData({ ...data, lifting_type: 'thin' })}>
                          <span className="font-bold block text-lg">👵 잔주름 / 피부가 얇고 패임</span>
                        </ChoiceCard>
                        <ChoiceCard selected={data.lifting_type === 'fat'} onClick={() => setData({ ...data, lifting_type: 'fat' })}>
                          <span className="font-bold block text-lg">🐷 이중턱 / 얼굴 살이 많음</span>
                        </ChoiceCard>
                      </div>
                    </div>
                  )}

                  <div className="pt-10 flex justify-end">
                    <Button
                      size="lg"
                      className="h-14 px-8 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-base font-medium shadow-xl hover:shadow-2xl transition-all"
                      onClick={handleFinish}
                      disabled={
                        (activeModule === 'pigmentation' && (!data.pigment_visual || (data.pigment_visual === 'freckle' && !data.pigment_downtime))) ||
                        (activeModule === 'acne' && (data.acne_uv_risk === undefined || (data.acne_uv_risk === false && !data.acne_value))) ||
                        (activeModule === 'lifting' && !data.lifting_type)
                      }
                    >
                      {t('analyze_button') || "Analyze Now"}
                      <Sparkles className="ml-2 w-4 h-4" />
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
                  className="flex flex-col items-center justify-center py-32"
                >
                  <div className="relative w-24 h-24 mb-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-slate-100 border-t-[#0f172a]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-[#0f172a]" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-serif font-medium text-[#0f172a] mb-3">{t('analyzing.title')}</h2>
                  <p className="text-slate-400 font-light text-sm tracking-wide uppercase">{t('analyzing.subtitle')}</p>
                </motion.div>
              )}

              {/* STEP 5: RESULT - Minimalist Prescription Card */}
              {step === 'result' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Elegant easing
                  className="space-y-10 pb-20"
                >
                  <div className="text-center space-y-4 pt-10">
                    <h2 className="text-4xl md:text-5xl font-serif text-[#0f172a]">Rx. Prescription</h2>
                    <p className="text-slate-500 text-lg font-light leading-relaxed max-w-lg mx-auto break-keep italic">
                      "{result.script}"
                    </p>
                  </div>

                  {/* Main Card */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0f172a] rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                      <span className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 text-amber-200">
                        Best Solution
                      </span>
                      <h3 className="text-3xl font-serif font-medium mb-4">{getTreatmentName(result.main)}</h3>
                      <p className="text-white/60 mb-10 text-lg font-light leading-relaxed border-l-2 border-amber-500 pl-4">
                        {getTreatmentDesc(result.main)}
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-amber-300/80 uppercase tracking-wider mb-2">Estimated Price</p>
                          <span className="text-4xl font-serif">{result.main.price}</span>
                        </div>
                        {result.package_info && (
                          <div className="text-right">
                            <span className="block text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Package Offer</span>
                            <span className="text-sm text-white/80">{result.package_info}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Upsell (Minimalist) */}
                  {result.upsell && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-6"
                    >
                      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                        <Sparkles size={20} />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">Synergy Booster</span>
                        <h4 className="text-lg font-medium text-[#0f172a]">{getTreatmentName(result.upsell)}</h4>
                        <p className="text-sm text-slate-500 mt-1">{result.upsell.price}</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full border-slate-200 hover:bg-slate-50">
                        View Details
                      </Button>
                    </motion.div>
                  )}

                  {/* CTA */}
                  <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    href={`/${locale}/consult/light`}
                    className="block w-full py-6 text-center text-lg font-medium text-slate-400 hover:text-[#0f172a] transition-colors underline decoration-1 underline-offset-4"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.reload();
                    }}
                  >
                    Start New Analysis
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
