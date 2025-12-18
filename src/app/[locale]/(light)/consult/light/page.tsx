'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, User, Phone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getRecommendations } from '@/lib/data/treatments';
import { createLead } from './actions';
import { useTranslations, useLocale } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// ----------------------------------------------------------------------
// Constants (IDs only)
// ----------------------------------------------------------------------

const CONCERN_IDS = [
    { id: 'pigmentation', icon: '✨' },
    { id: 'acne', icon: '🔴' },
    { id: 'pores', icon: '🕳️' },
    { id: 'wrinkles', icon: '👵' },
    { id: 'sagging', icon: '🆙' },
    { id: 'redness', icon: '😳' }
];

const SKIN_TYPE_IDS = ['dry', 'oily', 'combination', 'sensitive', 'normal'];

const BUDGET_IDS = ['economy', 'standard', 'premium'];

type LightStep = 'checkin' | 'survey' | 'analyzing' | 'result';

interface LightState {
    name: string;
    phone: string;
    concerns: string[];
    skinType: string;
    budget: string;
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function LightConsultationPage() {
    const [step, setStep] = useState<LightStep>('checkin');
    const t = useTranslations('LightMode');
    const locale = useLocale();
    const [data, setData] = useState<LightState>({
        name: '',
        phone: '',
        concerns: [],
        skinType: '',
        budget: ''
    });

    const handleNext = async () => {
        if (step === 'checkin') {
            if (data.name && data.phone) {
                // Fixed: Removed 'source' property if not supported by createLead type
                await createLead({ name: data.name, phone: data.phone });
                setStep('survey');
            }
        }
    };

    const handleFinish = () => {
        setStep('analyzing');
        setTimeout(() => {
            setStep('result');
        }, 2500);
    };

    const getLogicInputs = () => ({
        q1_concerns: data.concerns,
        q2_skin_type: data.skinType,
        q_budget: data.budget,
        q_downtime: 'weekend',
        q_pigment_type: data.concerns.includes('pigmentation') ? 'spot' : undefined,
    });

    const recommendations = step === 'result' ? getRecommendations(getLogicInputs()) : [];
    const topRec = recommendations[0];

    // Localized Treatment Display
    const getTreatmentName = (rec: any) => {
        if (rec.machineNames && rec.machineNames.length > 0) {
            return rec.machineNames.join(' + ');
        }
        return locale === 'ko' ? rec.name : rec.nameEn;
    };
    const getTreatmentDesc = (rec: any) => locale === 'ko' ? rec.description : (rec.descriptionEn || rec.description);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">

            {/* ----------------------------- */}
            {/* LEFT PANEL (DESKTOP ONLY)     */}
            {/* ----------------------------- */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: "url('/premium_bg.png')" }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Branding Content */}
                <div className="absolute bottom-0 left-0 p-16 w-full text-white z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-5xl font-black mb-4 leading-tight">
                            Premium <br /> AI Consultation
                        </h1>
                        <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ----------------------------- */}
            {/* RIGHT PANEL (Main Content)    */}
            {/* ----------------------------- */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 md:p-12 lg:p-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100">

                {/* MOBILE BACKGROUND (Only visible < lg) */}
                <div className="lg:hidden absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white z-0" />

                <div className="w-full max-w-md relative z-10">

                    {/* Progress Bar */}
                    <div className="mb-8 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-slate-900"
                            initial={{ width: '0%' }}
                            animate={{ width: step === 'checkin' ? '33%' : step === 'survey' ? '66%' : '100%' }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <AnimatePresence mode="wait">

                        {/* STEP 1: CHECK-IN */}
                        {step === 'checkin' && (
                            <motion.div
                                key="checkin"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Mobile-only Header */}
                                <div className="lg:hidden text-center space-y-2 mb-8">
                                    <h1 className="text-3xl font-black text-slate-900">{t('title')}</h1>
                                    <p className="text-slate-500 text-sm">{t('subtitle')}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
                                            {t('name_label')}
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder={t('name_placeholder')}
                                            className="h-14 bg-white border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl text-lg transition-all shadow-sm"
                                            value={data.name}
                                            onChange={(e) => setData({ ...data, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
                                            {t('phone_label')}
                                        </Label>
                                        <Input
                                            id="phone"
                                            placeholder={t('phone_placeholder')}
                                            className="h-14 bg-white border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl text-lg transition-all shadow-sm"
                                            value={data.phone}
                                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                                    onClick={handleNext}
                                    disabled={!data.name || !data.phone}
                                >
                                    {t('start_button')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
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
                                className="space-y-8"
                            >
                                {/* Q1 Concerns */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-400">{t('concerns.label')}</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {CONCERN_IDS.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => {
                                                    const selected = data.concerns.includes(c.id);
                                                    if (selected) setData({ ...data, concerns: data.concerns.filter(id => id !== c.id) });
                                                    else if (data.concerns.length < 3) setData({ ...data, concerns: [...data.concerns, c.id] });
                                                }}
                                                className={cn(
                                                    "p-4 rounded-2xl text-left text-sm font-semibold transition-all border shadow-sm flex items-center gap-2",
                                                    data.concerns.includes(c.id)
                                                        ? "border-slate-900 bg-slate-900 text-white shadow-slate-900/20"
                                                        : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                                                )}
                                            >
                                                <span>{c.icon}</span> {t(`concerns.${c.id}`)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Q2 Skin Type */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-400">{t('skinType.label')}</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {SKIN_TYPE_IDS.map((id) => (
                                            <button
                                                key={id}
                                                onClick={() => setData({ ...data, skinType: id })}
                                                className={cn(
                                                    "p-4 rounded-2xl text-left transition-all border shadow-sm flex flex-col gap-1",
                                                    data.skinType === id
                                                        ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                        : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                                                )}
                                            >
                                                <span className="font-bold text-sm">{t(`skinType.${id}`)}</span>
                                                <span className={cn("text-xs", data.skinType === id ? "text-slate-300" : "text-slate-400")}>
                                                    {t(`skinType.${id}_desc`)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Q3 Budget */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-400">{t('budget.label')}</Label>
                                    <select
                                        className="w-full h-14 px-4 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:border-slate-900 text-slate-900 font-medium appearance-none shadow-sm"
                                        value={data.budget}
                                        onChange={(e) => setData({ ...data, budget: e.target.value })}
                                    >
                                        <option value="" disabled>{t('budget.placeholder')}</option>
                                        {BUDGET_IDS.map(id => <option key={id} value={id}>{t(`budget.${id}`)}</option>)}
                                    </select>
                                </div>

                                <Button
                                    onClick={handleFinish}
                                    disabled={data.concerns.length === 0 || !data.skinType || !data.budget}
                                    className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-purple-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all hover:scale-[1.01]"
                                >
                                    {t('analyze_button')} <Sparkles className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 2.5: ANALYZING */}
                        {step === 'analyzing' && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20"
                            >
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-purple-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                    <Sparkles className="absolute inset-0 m-auto text-purple-600 animate-pulse" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('analyzing.title')}</h2>
                                <p className="text-slate-500">{t('analyzing.subtitle')}</p>
                            </motion.div>
                        )}

                        {/* STEP 3: RESULT */}
                        {step === 'result' && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm border border-green-200">
                                        <Check size={32} strokeWidth={4} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">{t('result.title')}</h2>
                                    <p className="text-slate-500">{t('result.subtitle')}</p>
                                </div>

                                {/* Top Recommendation Card */}
                                {topRec ? (
                                    <div className="bg-white rounded-[2rem] p-8 shadow-2xl text-left border border-slate-100 relative overflow-hidden group hover:shadow-3xl transition-shadow">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50"></div>

                                        <div className="flex items-start justify-between mb-4">
                                            <span className="bg-slate-900 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full inline-block tracking-wide shadow-lg">
                                                {t('result.best_match')}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">
                                                {topRec.category}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight relative z-10">
                                            {getTreatmentName(topRec)}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-3 relative z-10">
                                            {getTreatmentDesc(topRec)}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-slate-500">No matching treatment found.</p>
                                    </div>
                                )}

                                {/* Lead Magnet CTA */}
                                <div className="bg-slate-900 rounded-[2rem] p-8 text-white text-left relative overflow-hidden shadow-2xl">
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-xl mb-2">{locale === 'ko' ? '상세 견적이 필요하신가요?' : t('result.cta_title')}</h4>
                                        <p className="text-slate-400 text-sm mb-6">{locale === 'ko' ? '정확한 비용과 시술 과정을 전문 의료진과 상담하세요.' : t('result.cta_desc')}</p>
                                        <a
                                            href={`/${locale}/consult/full`}
                                            className="block w-full text-center bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
                                        >
                                            {locale === 'ko' ? '비용 확인 및 예약하기' : t('result.cta_button')}
                                        </a>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
