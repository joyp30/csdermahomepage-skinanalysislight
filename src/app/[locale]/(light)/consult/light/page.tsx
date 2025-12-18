'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, User, Phone, ChevronRight, AlertCircle, Sun, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLightRecommendation, LightAnswers, RecommendationResult } from '@/lib/logic/light-mode';
import { createLead } from './actions';
import { useTranslations, useLocale } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// ----------------------------------------------------------------------
// Constants
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

type LightStep = 'checkin' | 'survey' | 'deep_dive' | 'analyzing' | 'result';

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function LightConsultationPage() {
    const [step, setStep] = useState<LightStep>('checkin');
    const t = useTranslations('LightMode');
    const locale = useLocale();

    // State using the new Logic Interface
    const [data, setData] = useState<LightAnswers & { name: string, phone: string, budget: string }>({
        name: '',
        phone: '',
        concerns: [],
        skinType: '',
        budget: '', // Legacy field, kept for compatibility if needed or simplified
        // Dynamic fields initialized as undefined
    });

    const [result, setResult] = useState<RecommendationResult | null>(null);

    const handleNext = async () => {
        if (step === 'checkin') {
            if (data.name && data.phone) {
                await createLead({ name: data.name, phone: data.phone });
                setStep('survey');
            }
        } else if (step === 'survey') {
            // Determine if Deep Dive is needed
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

        setTimeout(() => {
            setStep('result');
        }, 2000);
    };

    // Helper to get Deep Dive Priority
    const getDeepDiveModule = () => {
        if (data.concerns.includes('pigmentation')) return 'pigmentation';
        if (data.concerns.includes('acne')) return 'acne';
        if (data.concerns.includes('wrinkles') || data.concerns.includes('sagging')) return 'lifting';
        return null; // Should not happen if logic in handleNext is correct
    };

    const activeModule = step === 'deep_dive' ? getDeepDiveModule() : null;

    // Localized Text Helper
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
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* LEFT PANEL (Unchanged) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('/premium_bg.png')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-16 w-full text-white z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-5xl font-black mb-4 leading-tight">Premium <br /> AI Consultation</h1>
                        <p className="text-lg text-slate-300 max-w-md leading-relaxed">{t('subtitle')}</p>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 md:p-12 lg:p-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100">
                <div className="w-full max-w-md relative z-10">

                    {/* Checkin */}
                    {step === 'checkin' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h1 className="text-3xl font-black text-slate-900 mb-2">{t('title')}</h1>
                            <div className="space-y-4">
                                <Input placeholder={t('name_placeholder')} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="h-14 text-lg" />
                                <Input placeholder={t('phone_placeholder')} value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className="h-14 text-lg" />
                            </div>
                            <Button className="w-full h-14 text-lg" onClick={handleNext} disabled={!data.name || !data.phone}>{t('start_button')}</Button>
                        </motion.div>
                    )}

                    {/* Survey (Concerns) */}
                    {step === 'survey' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <h2 className="text-xl font-bold">{t('concerns.label')}</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {CONCERN_IDS.map((c) => (
                                    <button key={c.id}
                                        onClick={() => {
                                            const selected = data.concerns.includes(c.id);
                                            // Toggle selection
                                            setData(prev => ({
                                                ...prev,
                                                concerns: selected ? prev.concerns.filter(id => id !== c.id) : [...prev.concerns, c.id].slice(0, 2) // Limit 2
                                            }));
                                        }}
                                        className={cn("p-4 rounded-xl border text-left", data.concerns.includes(c.id) ? "bg-slate-900 text-white" : "bg-white")}
                                    >
                                        <span>{c.icon}</span> {t(`concerns.${c.id}`)}
                                    </button>
                                ))}
                            </div>

                            <h2 className="text-xl font-bold mt-6">{t('skinType.label')}</h2>
                            <div className="flex flex-wrap gap-2">
                                {SKIN_TYPE_IDS.map(id => (
                                    <button key={id} onClick={() => setData({ ...data, skinType: id })}
                                        className={cn("px-4 py-2 rounded-full border", data.skinType === id ? "bg-slate-900 text-white" : "bg-white")}
                                    >
                                        {t(`skinType.${id}`)}
                                    </button>
                                ))}
                            </div>

                            <h2 className="text-xl font-bold mt-6">{t('budget.label')}</h2>
                            <div className="flex flex-wrap gap-2">
                                {BUDGET_IDS.map(id => (
                                    <button key={id} onClick={() => setData({ ...data, budget: id })}
                                        className={cn("px-4 py-2 rounded-full border", data.budget === id ? "bg-slate-900 text-white" : "bg-white")}
                                    >
                                        {t(`budget.${id}`)}
                                    </button>
                                ))}
                            </div>

                            <Button className="w-full h-14 mt-8" onClick={handleNext} disabled={data.concerns.length === 0 || !data.skinType}>{t('next_button') || 'Next'}</Button>
                        </motion.div>
                    )}

                    {/* Deep Dive (Dynamic) */}
                    {step === 'deep_dive' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <div className="text-center mb-6">
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">AI Deep Analysis</span>
                                <h2 className="text-2xl font-bold mt-2 text-slate-900">상세 정밀 진단</h2>
                                <p className="text-slate-500 text-sm">더 정확한 진단을 위해 추가 정보를 입력해주세요.</p>
                            </div>

                            {/* MODULE I: Pigmentation Questions */}
                            {activeModule === 'pigmentation' && (
                                <>
                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-slate-700">Q. 가장 고민되는 형태는 무엇인가요?</Label>
                                        <div className="grid grid-cols-1 gap-3">
                                            <button onClick={() => setData({ ...data, pigment_visual: 'melasma' })} className={cn("p-4 border rounded-xl text-left hover:bg-slate-50", data.pigment_visual === 'melasma' && "ring-2 ring-indigo-500 bg-indigo-50")}>
                                                <span className="font-bold block">🌫️ 기미 / 칙칙함</span>
                                                <span className="text-xs text-slate-500">경계가 불분명하고 안개처럼 퍼져 있음</span>
                                            </button>
                                            <button onClick={() => setData({ ...data, pigment_visual: 'freckle' })} className={cn("p-4 border rounded-xl text-left hover:bg-slate-50", data.pigment_visual === 'freckle' && "ring-2 ring-indigo-500 bg-indigo-50")}>
                                                <span className="font-bold block">🍪 주근깨 / 잡티</span>
                                                <span className="text-xs text-slate-500">깨알처럼 경계가 뚜렷하고 진함</span>
                                            </button>
                                            <button onClick={() => setData({ ...data, pigment_visual: 'pih' })} className={cn("p-4 border rounded-xl text-left hover:bg-slate-50", data.pigment_visual === 'pih' && "ring-2 ring-indigo-500 bg-indigo-50")}>
                                                <span className="font-bold block">🔴 여드름 자국</span>
                                                <span className="text-xs text-slate-500">염증 후 남은 붉거나 거뭇한 자국</span>
                                            </button>
                                        </div>
                                    </div>

                                    {data.pigment_visual === 'freckle' && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <Label className="text-sm font-bold text-slate-700">Q. 회복 기간(다운타임) 허용 범위</Label>
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => setData({ ...data, pigment_downtime: 'strict' })} className={cn("p-3 border rounded-lg text-sm text-left", data.pigment_downtime === 'strict' && "bg-slate-900 text-white")}>
                                                    🩹 2주간 재생 테이프 부착 가능 (확실한 제거)
                                                </button>
                                                <button onClick={() => setData({ ...data, pigment_downtime: 'social' })} className={cn("p-3 border rounded-lg text-sm text-left", data.pigment_downtime === 'social' && "bg-slate-900 text-white")}>
                                                    🍂 딱지/테이프 없음 (거친 피부결 5일 감수)
                                                </button>
                                                <button onClick={() => setData({ ...data, pigment_downtime: 'immediate' })} className={cn("p-3 border rounded-lg text-sm text-left", data.pigment_downtime === 'immediate' && "bg-slate-900 text-white")}>
                                                    ✨ 티가 나면 안 됨 (즉시 일상생활 복귀)
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* MODULE II: Acne Questions */}
                            {activeModule === 'acne' && (
                                <>
                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-slate-700">Q. 3일 이내 야외 활동(골프, 여행) 계획이 있나요?</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => setData({ ...data, acne_uv_risk: true })} className={cn("p-4 border rounded-xl text-center", data.acne_uv_risk === true && "bg-slate-900 text-white")}>
                                                <Sun className="mx-auto mb-2" /> 네, 있습니다
                                            </button>
                                            <button onClick={() => setData({ ...data, acne_uv_risk: false })} className={cn("p-4 border rounded-xl text-center", data.acne_uv_risk === false && "bg-slate-900 text-white")}>
                                                <Shield className="mx-auto mb-2" /> 아니오 (실내 생활)
                                            </button>
                                        </div>
                                    </div>
                                    {data.acne_uv_risk === false && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <Label className="text-sm font-bold text-slate-700">Q. 선호하는 가치는?</Label>
                                            <div className="flex gap-2">
                                                <button onClick={() => setData({ ...data, acne_value: 'economy' })} className={cn("flex-1 p-3 border rounded-lg text-sm", data.acne_value === 'economy' && "bg-slate-900 text-white")}>
                                                    💰 가성비 우선
                                                </button>
                                                <button onClick={() => setData({ ...data, acne_value: 'convenience' })} className={cn("flex-1 p-3 border rounded-lg text-sm", data.acne_value === 'convenience' && "bg-slate-900 text-white")}>
                                                    ⚡ 편의성 우선
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* MODULE III: Lifting Questions */}
                            {activeModule === 'lifting' && (
                                <div className="space-y-4">
                                    <Label className="text-sm font-bold text-slate-700">Q. 가장 고민되는 노화 증상은?</Label>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => setData({ ...data, lifting_type: 'sagging' })} className={cn("p-4 border rounded-xl text-left", data.lifting_type === 'sagging' && "bg-slate-900 text-white")}>
                                            🔽 턱선 무너짐 / 심부볼 처짐
                                        </button>
                                        <button onClick={() => setData({ ...data, lifting_type: 'thin' })} className={cn("p-4 border rounded-xl text-left", data.lifting_type === 'thin' && "bg-slate-900 text-white")}>
                                            👵 잔주름 / 피부가 얇고 패임
                                        </button>
                                        <button onClick={() => setData({ ...data, lifting_type: 'fat' })} className={cn("p-4 border rounded-xl text-left", data.lifting_type === 'fat' && "bg-slate-900 text-white")}>
                                            🐷 이중턱 / 얼굴 살이 많음
                                        </button>
                                    </div>
                                </div>
                            )}

                            <Button className="w-full h-14 font-bold text-lg" onClick={handleFinish}
                                disabled={
                                    (activeModule === 'pigmentation' && (!data.pigment_visual || (data.pigment_visual === 'freckle' && !data.pigment_downtime))) ||
                                    (activeModule === 'acne' && (data.acne_uv_risk === undefined || (data.acne_uv_risk === false && !data.acne_value))) ||
                                    (activeModule === 'lifting' && !data.lifting_type)
                                }>
                                {t('analyze_button')} <Sparkles className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Analyzing */}
                    {step === 'analyzing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                            <div className="relative w-24 h-24 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-purple-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                <Sparkles className="absolute inset-0 m-auto text-purple-600 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('analyzing.title')}</h2>
                            <p className="text-slate-500">{t('analyzing.subtitle')}</p>
                        </motion.div>
                    )}

                    {/* Result */}
                    {step === 'result' && result && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                                    <Check size={32} strokeWidth={4} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900">Analysis Complete</h2>
                                <p className="text-slate-500 text-sm mt-2 px-6 break-keep">{result.script}</p>
                            </div>

                            {/* Main Recommendation */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-2xl text-left border border-slate-100 relative overflow-hidden group">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-50"></div>
                                <span className="bg-slate-900 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full inline-block tracking-wide shadow-lg mb-4">
                                    Best Recommendation
                                </span>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight relative z-10">{getTreatmentName(result.main)}</h3>
                                <p className="text-sm text-slate-500 mb-4 leading-relaxed relative z-10">{getTreatmentDesc(result.main)}</p>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-indigo-600">{result.main.price}</span>
                                    {result.package_info && <p className="text-xs text-slate-400 font-medium mt-1">{result.package_info}</p>}
                                </div>
                            </div>

                            {/* Upsell Item */}
                            {result.upsell && (
                                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        <span className="text-xs font-bold uppercase text-slate-400">Better Together</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900">{getTreatmentName(result.upsell)}</h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{getTreatmentDesc(result.upsell)}</p>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-700">{result.upsell.price}</span>
                                        <Button size="sm" variant="outline" className="h-8 text-xs border-slate-300">추가하기</Button>
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <a href={`/${locale}/consult/light`} className="block w-full text-center bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl active:scale-[0.98]">
                                예약 및 상담 신청
                            </a>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
