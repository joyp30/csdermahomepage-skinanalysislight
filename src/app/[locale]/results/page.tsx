'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Treatment } from '@/lib/data/treatments';
import Link from 'next/link';
import { Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { getSurveyResult } from './actions';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useAppMode } from '@/context/AppModeContext';
import BookingCalendar from '@/components/BookingCalendar';
import PaymentSummary from '@/components/PaymentSummary';
import { createBooking } from './actions';

function ResultsContent() {
    const t = useTranslations('Results');
    const searchParams = useSearchParams();
    const surveyId = searchParams.get('id');

    // Define Motion Variants
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

    const [analyzing, setAnalyzing] = useState(true);
    const [recommendations, setRecommendations] = useState<Treatment[]>([]);
    const [concerns, setConcerns] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState(false);
    const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);
    const [patientId, setPatientId] = useState<number | null>(null);

    // Full Mode State
    const { mode, enableBooking } = useAppMode();
    const [bookingStep, setBookingStep] = useState<'none' | 'calendar' | 'payment' | 'success'>('none');
    const [bookingDate, setBookingDate] = useState<{ date: Date, time: string } | null>(null);

    const selectedTreatment = recommendations.find(r => r.id === selectedTreatmentId);

    useEffect(() => {
        if (!surveyId) {
            setAnalyzing(false);
            return;
        }

        const fetchData = async () => {
            // Artificial delay for experience
            await new Promise(r => setTimeout(r, 2000));

            const result = await getSurveyResult(parseInt(surveyId));
            if (result) {
                setRecommendations(result.recommendations);
                setConcerns(result.concerns);
                setImages(result.images);
                setPatientId(result.patientId as number);
            } else {
                setError(true);
            }
            setAnalyzing(false);
        };

        fetchData();
    }, [surveyId]);

    if (analyzing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">{t('analyzing_title')}</h2>
                <p className="text-slate-500 mt-2">{t('analyzing_desc')}</p>
            </div>
        );
    }

    if (error || !surveyId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('analysis_not_found')}</h2>
                <p className="text-slate-500 mb-8">{t('not_found_desc')}</p>
                <Link href="/survey">
                    <Button>{t('retake_button')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <motion.div
                className="max-w-5xl mx-auto"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.header variants={item} className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-full mb-4">
                        <CheckCircle className="h-6 w-6 mr-2" />
                        <span className="font-semibold">{t('complete_badge')}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('title')}</h1>
                    <p className="text-xl text-slate-600">
                        {t('subtitle', { concerns: concerns.join(', ') })}
                    </p>
                </motion.header>

                {images.length > 0 && (
                    <motion.div variants={item} className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">{t('photos_title')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {images.map((img, i) => (
                                <div key={i} className="relative aspect-square bg-white rounded-lg shadow-sm border overflow-hidden">
                                    <Image src={img} alt={`Analysis ${i}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendations.map((treatment, index) => {
                        const isSelected = selectedTreatmentId === treatment.id;
                        return (
                            <motion.div key={treatment.id} variants={item} className="relative">
                                {/* Ranking Badge */}
                                <div className="absolute -top-3 -left-3 z-10 bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white">
                                    {index + 1}
                                </div>

                                <Card
                                    className={`flex flex-col border-2 transition-all duration-200 h-full hover:shadow-xl cursor-pointer ${isSelected ? 'border-blue-600 ring-2 ring-blue-100 shadow-xl scale-[1.02]' : 'border-slate-200 hover:border-blue-200 hover:-translate-y-1'}`}
                                    onClick={() => setSelectedTreatmentId(treatment.id)}
                                >
                                    <CardHeader>
                                        <div className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide flex justify-between">
                                            <span>{treatment.category}</span>
                                            {index === 0 && <span className="text-amber-500 font-bold">★ Best Match</span>}
                                        </div>
                                        <CardTitle className="text-2xl">{treatment.name}</CardTitle>
                                        <CardDescription className="text-base mt-2">
                                            {treatment.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                                <span className="text-slate-500">{t('price_label')}</span>
                                                <span className="font-semibold text-slate-900">{treatment.price}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                                <span className="text-slate-500">{t('downtime_label')}</span>
                                                <span className="font-medium text-slate-900">{treatment.downtime}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-6">
                                        <Button
                                            className={`w-full ${isSelected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                                            size="lg"
                                        >
                                            {isSelected ? <><CheckCircle className="mr-2 h-4 w-4" /> {t('selected_button')}</> : t('select_button')}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Booking & Payment Flow (Full Mode Only) */}
                {enableBooking && selectedTreatmentId && (
                    <motion.div variants={item} className="mt-8 max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 overflow-hidden">
                            {bookingStep === 'none' && (
                                <div className="p-8 text-center bg-slate-50/50">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to transform your skin?</h3>
                                    <p className="text-slate-500 mb-6">Book your appointment now to secure this treatment plan.</p>
                                    <Button
                                        size="lg"
                                        onClick={() => setBookingStep('calendar')}
                                        className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg w-full sm:w-auto"
                                    >
                                        Book Appointment
                                    </Button>
                                </div>
                            )}

                            {bookingStep === 'calendar' && (
                                <BookingCalendar onConfirm={(date, time) => {
                                    setBookingDate({ date, time });
                                    setBookingStep('payment');
                                }} />
                            )}

                            {bookingStep === 'payment' && selectedTreatment && bookingDate && (
                                <PaymentSummary
                                    amount={selectedTreatment.price}
                                    treatmentName={selectedTreatment.name}
                                    onSuccess={async () => {
                                        if (patientId) {
                                            await createBooking({
                                                patientId,
                                                treatmentId: selectedTreatment.id,
                                                treatmentName: selectedTreatment.name,
                                                date: bookingDate.date.toISOString().split('T')[0],
                                                time: bookingDate.time
                                            });
                                        }
                                        setBookingStep('success');
                                    }}
                                />
                            )}

                            {bookingStep === 'success' && (
                                <div className="p-8 text-center bg-green-50">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                                    <p className="text-slate-600">
                                        We'll see you on <span className="font-bold">{bookingDate?.date.toLocaleDateString()}</span> at <span className="font-bold">{bookingDate?.time}</span>.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div >
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}
