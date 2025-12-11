'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FullModeIntroPage() {
    const t = useTranslations('FullModeIntro');
    const locale = useLocale();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate payment processing delay
        setTimeout(() => {
            setIsProcessing(false);
            // On success, redirect to Full Mode Check-in
            router.push(`/${locale}/consult/full/checkin`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white mb-4 shadow-xl shadow-slate-900/20">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">{t('title')}</h1>
                    <p className="text-slate-500">{t('subtitle')}</p>
                </div>

                <Card className="border-0 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <CardHeader className="pb-0">
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('price_label')}</span>
                            <span className="text-3xl font-black text-slate-900">{t('price_value')}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <ul className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="min-w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-slate-700 font-medium">{t(`benefit_${i}` as any)}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="pt-8 pb-8 bg-slate-50 border-t border-slate-100 mt-6">
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                            onClick={handlePayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('processing_payment')}
                                </>
                            ) : (
                                <>
                                    {t('cta_button')} <CreditCard className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <p className="text-center text-xs text-slate-400 mt-8 max-w-xs mx-auto">
                    Secure payment powered by PaymentGate. <br />
                    Satisfaction guaranteed or full refund within 24h.
                </p>
            </motion.div>
        </div>
    );
}
