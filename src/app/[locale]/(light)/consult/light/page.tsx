'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, User, Phone, ChevronRight, AlertCircle, Sun, Shield, Leaf, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLightRecommendation, LightAnswers, RecommendationResult } from '@/lib/logic/light-mode';
import { createLead } from './actions';
import { useTranslations, useLocale } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

// Premium Choice Card
const ChoiceCard = ({
    selected,
    onClick,
    children,
    className,
    icon
}: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
            "relative w-full p-5 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden group",
            selected
                ? "border-indigo-500 bg-indigo-50/50 shadow-indigo-100 shadow-lg"
                : "border-transparent bg-white/60 hover:bg-white/90 hover:shadow-lg hover:border-indigo-100 shadow-sm backdrop-blur-sm",
            className
        )}
    >
        {selected && (
            <motion.div
                layoutId="check"
                className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white"
            >
                <Check size={14} strokeWidth={3} />
            </motion.div>
        )}
        <div className="relative z-10 flex items-center gap-4">
            {icon && <div className="text-2xl opacity-90">{icon}</div>}
            <div className="flex-1">
                {children}
            </div>
        </div>
    </motion.button>
);

// Progress Bar
const ProgressBar = ({ step }: { step: LightStep }) => {
    const steps = ['checkin', 'survey', 'deep_dive', 'result'];
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

export default function LightConsultationPage() {
    const [step, setStep] = useState<LightStep>('checkin');
    const t = useTranslations('LightMode');
    const locale = useLocale();

    const [data, setData] = useState<LightAnswers & { name: string, phone: string, budget: string }>({
        name: '',
        phone: '',
        concerns: [],
        skinType: '',
        budget: '',
    });

    const [result, setResult] = useState<RecommendationResult | null>(null);

    const handleNext = async () => {
        if (step === 'checkin') {
            if (data.name && data.phone) {
                await createLead({ name: data.name, phone: data.phone });
                setStep('survey');
            }
        } else if (step === 'survey') {
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
                        <h1 className="text-6xl font-black mb-6 leading-tight tracking-tight">
                            Premium <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">AI Analysis</span>
                        </h1>
                        <p className="text-xl text-indigo-100/80 max-w-md leading-relaxed font-light">{t('subtitle')}</p>

                        <div className="mt-12 flex items-center gap-4 text-sm text-indigo-300/60 font-medium uppercase tracking-widest">
                            <div className="h-px w-8 bg-indigo-300/30" />
                            <span>Powered by CS Derma Logic</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT PANEL: Interaction Area */}
            <div className="w-full lg:w-7/12 relative flex flex-col">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white z-0" />

                <div className="flex-1 overflow-y-auto relative z-10 p-6 md:p-12 lg:p-20 flex items-center justify-center">
                    <div className="w-full max-w-xl">

                        {/* Progress Bar (except on checkin/result) */}
                        {step !== 'checkin' && step !== 'result' && <ProgressBar step={step} />}

                        <AnimatePresence mode="wait">

                            {/* STEP 1: CHECK-IN */}
                            {step === 'checkin' && (
                                <motion.div
                                    key="checkin"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2">
                                        <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm">Welcome</span>
                                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
                                    </div>

                                    <div className="space-y-5 bg-white/50 backdrop-blur-lg p-8 rounded-3xl border border-white/60 shadow-xl">
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 font-medium ml-1">이름</Label>
                                            <Input
                                                placeholder={t('name_placeholder')}
                                                value={data.name}
                                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                                className="h-16 text-xl bg-white/80 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-2xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 font-medium ml-1">연락처</Label>
                                            <Input
                                                placeholder={t('phone_placeholder')}
                                                value={data.phone}
                                                onChange={(e) => setData({ ...data, phone: e.target.value })}
                                                className="h-16 text-xl bg-white/80 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-2xl"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-16 text-xl font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01]"
                                        onClick={handleNext}
                                        disabled={!data.name || !data.phone}
                                    >
                                        {t('start_button')} <ArrowRight className="ml-2 w-6 h-6" />
                                    </Button>
                                </motion.div>
                            )}

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
                                        <h2 className="text-2xl font-bold flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-black">1</span>
                                            {t('concerns.label')} <span className="text-sm font-normal text-slate-400 ml-auto">최대 2개 선택</span>
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
                                        <h2 className="text-2xl font-bold flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-black">2</span>
                                            {t('skinType.label')}
                                        </h2>
                                        <div className="flex flex-wrap gap-3">
                                            {SKIN_TYPES.map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setData({ ...data, skinType: type.id })}
                                                    className={cn(
                                                        "px-5 py-3 rounded-xl font-medium transition-all text-sm lg:text-base border hover:scale-105",
                                                        data.skinType === type.id
                                                            ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                                                    )}
                                                >
                                                    <span className="mr-2">{type.emoji}</span> {t(`skinType.${type.id}`)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-black">3</span>
                                            {t('budget.label')}
                                        </h2>
                                        <div className="flex flex-wrap gap-3">
                                            {BUDGETS.map(b => (
                                                <button
                                                    key={b.id}
                                                    onClick={() => setData({ ...data, budget: b.id })}
                                                    className={cn(
                                                        "px-5 py-3 rounded-xl font-medium transition-all text-sm lg:text-base border hover:scale-105",
                                                        data.budget === b.id
                                                            ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
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
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
                                            <Sparkles size={12} /> AI Deep Analysis
                                        </span>
                                        <h2 className="text-3xl font-black text-slate-900 mb-2">상세 정밀 진단</h2>
                                        <p className="text-slate-500">더 정확한 진단을 위해 추가 정보를 입력해주세요.</p>
                                    </div>

                                    {/* MODULE I: Pigmentation */}
                                    {activeModule === 'pigmentation' && (
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <Label className="text-lg font-bold text-slate-900">Q. 가장 고민되는 형태는 무엇인가요?</Label>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <ChoiceCard selected={data.pigment_visual === 'melasma'} onClick={() => setData({ ...data, pigment_visual: 'melasma' })}>
                                                        <span className="font-bold text-lg block mb-1">🌫️ 기미 / 칙칙함</span>
                                                        <span className="text-sm text-slate-500">뿌연 안개처럼 넓게 퍼져 있고 경계가 흐릿함</span>
                                                    </ChoiceCard>
                                                    <ChoiceCard selected={data.pigment_visual === 'freckle'} onClick={() => setData({ ...data, pigment_visual: 'freckle' })}>
                                                        <span className="font-bold text-lg block mb-1">🍪 주근깨 / 잡티</span>
                                                        <span className="text-sm text-slate-500">깨알 같은 점들이 흩뿌려져 있고 경계가 뚜렷함</span>
                                                    </ChoiceCard>
                                                    <ChoiceCard selected={data.pigment_visual === 'pih'} onClick={() => setData({ ...data, pigment_visual: 'pih' })}>
                                                        <span className="font-bold text-lg block mb-1">🔴 여드름 자국</span>
                                                        <span className="text-sm text-slate-500">염증 후 남은 붉거나 거뭇한 자국</span>
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
                                                <Label className="text-lg font-bold text-slate-900">Q. 골프, 등산, 여행 등 야외 활동이 많으신가요?</Label>
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
                                            <Label className="text-lg font-bold text-slate-900">Q. 가장 고민되는 노화 증상은?</Label>
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
                                            onClick={handleFinish}
                                            disabled={
                                                (activeModule === 'pigmentation' && (!data.pigment_visual || (data.pigment_visual === 'freckle' && !data.pigment_downtime))) ||
                                                (activeModule === 'acne' && (data.acne_uv_risk === undefined || (data.acne_uv_risk === false && !data.acne_value))) ||
                                                (activeModule === 'lifting' && !data.lifting_type)
                                            }
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
                                    <h2 className="text-3xl font-black text-slate-900 mb-4">{t('analyzing.title')}</h2>
                                    <p className="text-slate-500 text-lg">{t('analyzing.subtitle')}</p>
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
                                        <h2 className="text-4xl font-black text-slate-900">Analysis Complete</h2>
                                        <p className="text-slate-500 text-base px-4 font-medium leading-relaxed break-keep">{result.script}</p>
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
                                            <h3 className="text-3xl font-black text-slate-900 mb-3 leading-tight">{getTreatmentName(result.main)}</h3>
                                            <p className="text-slate-500 mb-8 leading-relaxed text-lg">{getTreatmentDesc(result.main)}</p>

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
