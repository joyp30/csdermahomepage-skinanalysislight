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
        <div className="w-full max-w-2xl">
            <div className="mb-8">
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / SURVEY_QUESTIONS.length) * 100}%` }}
                    />
                </div>
                <p className="text-right text-sm text-slate-500 mt-2">
                    {t('step_progress', { current: currentStep + 1, total: SURVEY_QUESTIONS.length })}
                </p>
            </div>

            <Card className="border-2 border-slate-100 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center py-4 text-slate-900">
                        {t_questions(`${currentQuestion.id}.title`)}
                    </CardTitle>
                    {currentQuestion.subtitle && (
                        <p className="text-center text-slate-500 font-normal text-lg">
                            {t_questions.has(`${currentQuestion.id}.subtitle`) ? t_questions(`${currentQuestion.id}.subtitle`) : ''}
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="mb-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-3"
                            >
                                {currentQuestion.options.map((option) => {
                                    const checked = Array.isArray(answers[currentQuestion.id])
                                        ? answers[currentQuestion.id].includes(option.value)
                                        : answers[currentQuestion.id] === option.value;

                                    return (
                                        <motion.div
                                            key={option.value}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div
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
                                                    }
                                                    handleOptionSelect(currentQuestion.id, newValue);
                                                }}
                                                className={cn(
                                                    "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                                    checked
                                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                                        : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                                                )}
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    className="mr-3 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 pointer-events-none"
                                                />
                                                <span className={cn("font-medium", checked ? "text-blue-700" : "text-slate-700")}>
                                                    {t_questions(`${currentQuestion.id}.options.${option.id}`)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-6 border-t border-slate-50 bg-slate-50/50">
                    <Button
                        variant="ghost"
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className="text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    >
                        {t('prev_button')}
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleNext}
                        className="min-w-[140px] text-lg h-12 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200"
                        disabled={!answers[currentQuestion.id] || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('submitting')}
                            </>
                        ) : (
                            isLastStep ? (
                                <span className="flex items-center gap-2">{t('complete_button')} <ArrowRight size={18} /></span>
                            ) : (
                                t('next_button')
                            )
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
