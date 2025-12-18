'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SURVEY_QUESTIONS } from '@/lib/data/survey-questions';
import { cn } from '@/lib/utils';
import { submitSurvey } from '../../../actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppMode } from "@/context/AppModeContext";


export default function SurveyWizard() {
    const t = useTranslations('Survey');
    const t_questions = useTranslations('Questions');
    const locale = useLocale();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patientId');
    const { mode } = useAppMode();

    const currentQuestion = SURVEY_QUESTIONS[currentStep];
    const isLastStep = currentStep === SURVEY_QUESTIONS.length - 1;

    const handleOptionSelect = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        let nextStep = currentStep + 1;
        while (nextStep < SURVEY_QUESTIONS.length) {
            const q = SURVEY_QUESTIONS[nextStep];
            const Mode = mode as 'light' | 'full' | 'pro';
            const isModeMatch = !q.modes || q.modes.includes(Mode);

            if (isModeMatch && (!q.condition || q.condition(answers))) {
                break;
            }
            nextStep++;
        }

        if (nextStep < SURVEY_QUESTIONS.length) {
            setCurrentStep(nextStep);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        let prevStep = currentStep - 1;
        while (prevStep >= 0) {
            const q = SURVEY_QUESTIONS[prevStep];
            const Mode = mode as 'light' | 'full' | 'pro';
            const isModeMatch = !q.modes || q.modes.includes(Mode);

            if (isModeMatch && (!q.condition || q.condition(answers))) {
                break;
            }
            prevStep--;
        }
        if (prevStep >= 0) setCurrentStep(prevStep);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitSurvey({
                patientId: patientId ? parseInt(patientId) : null,
                answers
            });

            if (result.success) {
                let nextPath = `/${locale}/results`;
                if (mode === 'pro') nextPath = `/${locale}/consult/pro/results`;
                else if (mode === 'full') nextPath = `/${locale}/consult/full/results`;

                router.push(`${nextPath}?id=${result.surveyId}`);
            } else {
                alert('Failed to submit survey.');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="h-1.5 w-full bg-[#E5E5E5] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#BFA181]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / SURVEY_QUESTIONS.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
                <div className="flex justify-between mt-3 text-xs font-medium tracking-widest text-[#999] uppercase">
                    <span>Question {currentStep + 1}</span>
                    <span>{SURVEY_QUESTIONS.length} Total</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-white/50"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1C1C] mb-4 leading-tight">
                            {t_questions(`${currentQuestion.id}.title`)}
                        </h2>
                        {currentQuestion.subtitle && (
                            <p className="text-[#666] font-light text-lg">
                                {t_questions.has(`${currentQuestion.id}.subtitle`) ? t_questions(`${currentQuestion.id}.subtitle`) : ''}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4 mb-12">
                        {currentQuestion.options.map((option) => {
                            const isSelected = Array.isArray(answers[currentQuestion.id])
                                ? answers[currentQuestion.id].includes(option.value)
                                : answers[currentQuestion.id] === option.value;

                            return (
                                <ChoiceCard
                                    key={option.value}
                                    selected={isSelected}
                                    label={t_questions(`${currentQuestion.id}.options.${option.id}`)}
                                    onClick={() => {
                                        let newValue;
                                        if (currentQuestion.type === 'multiple') {
                                            const current = answers[currentQuestion.id] || [];
                                            const currentArray = Array.isArray(current) ? current : [];

                                            if (currentArray.includes(option.value)) {
                                                newValue = currentArray.filter((v: string) => v !== option.value);
                                            } else {
                                                newValue = [...currentArray, option.value];
                                            }
                                        } else {
                                            newValue = option.value;
                                            // Optional: Auto-advance for single choice? maybe not for better UX control
                                        }
                                        handleOptionSelect(currentQuestion.id, newValue);
                                    }}
                                />
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <Button
                            variant="ghost"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="text-[#999] hover:text-[#1C1C1C] hover:bg-transparent font-medium tracking-wide uppercase"
                        >
                            {t('prev_button')}
                        </Button>

                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={!answers[currentQuestion.id] || isSubmitting}
                            className="bg-[#1C1C1C] text-white hover:bg-[#333] h-14 px-8 rounded-xl text-lg tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLastStep ? t('complete_button') : t('next_button')}
                                    {!isSubmitting && <ArrowRight size={18} />}
                                </span>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Helper for rendering choice cards
const ChoiceCard = ({
    selected,
    onClick,
    label,
    className
}: {
    selected: boolean;
    onClick: () => void;
    label: string;
    className?: string;
}) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
            "relative w-full p-6 rounded-xl text-left transition-all duration-300 border cursor-pointer flex items-center gap-4 group",
            selected
                ? "border-[#BFA181] bg-[#FDFBF7] shadow-lg ring-1 ring-[#BFA181]"
                : "border-slate-100 bg-white hover:border-[#BFA181]/50 hover:shadow-md",
            className
        )}
    >
        <div className={cn(
            "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
            selected ? "border-[#BFA181] bg-[#BFA181] text-white" : "border-slate-300 group-hover:border-[#BFA181]"
        )}>
            {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
        </div>
        <span className={cn(
            "font-medium text-lg transition-colors",
            selected ? "text-[#1C1C1C]" : "text-slate-600 group-hover:text-[#1C1C1C]"
        )}>
            {label}
        </span>
    </motion.div>
);
