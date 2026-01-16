'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Treatment } from '@/lib/data/treatments';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
                <Loader2 className="h-12 w-12 text-[#BFA181] animate-spin mb-6" />
                <h2 className="text-3xl font-serif text-[#1C1C1C] tracking-wide">{t('analyzing_title')}</h2>
                <p className="text-[#666] mt-4 font-light text-lg">{t('analyzing_desc')}</p>
            </div>
        );
    }

    if (error || !surveyId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-8 text-center">
                <h2 className="text-3xl font-serif text-[#1C1C1C] mb-6">{t('analysis_not_found')}</h2>
                <p className="text-[#666] mb-10 text-lg">{t('not_found_desc')}</p>
                <Link href="/survey">
                    <Button className="bg-[#1C1C1C] text-white hover:bg-[#333] px-8 py-6 rounded-none text-lg tracking-widest uppercase transition-all duration-300">
                        {t('retake_button')}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1C1C1C] font-sans selection:bg-[#E0D4C5] selection:text-[#1C1C1C]">
            <motion.div
                className="max-w-7xl mx-auto px-6 py-20 lg:py-32"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Header Section */}
                <motion.header variants={item} className="mb-24 text-center relative">
                    <div className="inline-flex items-center justify-center px-4 py-1 border border-[#BFA181] text-[#BFA181] rounded-full mb-6 uppercase tracking-[0.2em] text-xs font-medium">
                        <CheckCircle className="h-3 w-3 mr-2" />
                        <span>{t('complete_badge')}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-medium text-[#1C1C1C] mb-6 tracking-tight leading-tight">
                        {t('title')}
                    </h1>
                    <div className="h-px w-24 bg-[#BFA181] mx-auto mb-8"></div>
                    <p className="text-xl md:text-2xl text-[#666] font-light max-w-2xl mx-auto leading-relaxed">
                        {t('subtitle', { concerns: concerns.join(', ') })}
                    </p>
                </motion.header>

                {/* Patient Images Section (if available) */}
                {images.length > 0 && (
                    <motion.div variants={item} className="mb-24">
                        <div className="flex items-center justify-center gap-4 mb-10">
                            <span className="h-px bg-[#E5E5E5] w-12"></span>
                            <h2 className="text-lg font-medium text-[#999] uppercase tracking-widest">{t('photos_title')}</h2>
                            <span className="h-px bg-[#E5E5E5] w-12"></span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {images.map((img, i) => (
                                <div key={i} className="relative aspect-[3/4] bg-white shadow-xl hover:shadow-2xl transition-shadow duration-500 overflow-hidden group">
                                    <Image
                                        src={img}
                                        alt={`Analysis ${i}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent opacity-60"></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recommendations Grid */}
                <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {recommendations.map((treatment, index) => {
                        const isSelected = selectedTreatmentId === treatment.id;
                        // Placeholder image logic if treatment.image is missing
                        const displayImage = treatment.image || `/images/treatments/default-${(index % 3) + 1}.jpg`;

                        return (
                            <motion.div
                                key={treatment.id}
                                variants={item}
                                className={`relative group cursor-pointer transition-all duration-500 ${isSelected ? 'transform -translate-y-2' : 'hover:-translate-y-2'}`}
                                onClick={() => setSelectedTreatmentId(treatment.id)}
                            >
                                <div className={`relative h-full bg-white shadow-sm transition-all duration-300 ${isSelected ? 'shadow-2xl ring-1 ring-[#BFA181]' : 'shadow-lg hover:shadow-2xl'}`}>

                                    {/* Image Area */}
                                    <div className="relative h-80 overflow-hidden bg-[#f0f0f0]">
                                        <Image
                                            src={displayImage}
                                            alt={treatment.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                // Fallback if image fails to load - just hides the broken image icon
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                        <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-black/20' : 'bg-black/10 group-hover:bg-black/0'}`}></div>

                                        {/* Badge */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <span className="bg-white/90 backdrop-blur-sm text-[#1C1C1C] text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-sm">
                                                {t(`cat_${treatment.category}`)}
                                            </span>
                                            {index === 0 && (
                                                <span className="bg-[#BFA181] text-white text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-sm">
                                                    {t('best_match')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8 md:p-10 flex flex-col h-[calc(100%-20rem)]">
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-serif font-medium text-[#1C1C1C] mb-2 leading-tight">
                                                {treatment.name}
                                            </h3>
                                            <p className="text-[#999] text-sm uppercase tracking-wider font-light mb-4">
                                                {treatment.nameEn}
                                            </p>
                                            <div className="h-px w-12 bg-[#BFA181] mb-6"></div>
                                            <p className="text-[#555] font-light leading-relaxed min-h-[3rem]">
                                                {treatment.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto space-y-4 pt-6 border-t border-[#F5F5F5]">
                                            <div className="flex justify-between items-baseline group-hover:text-[#BFA181] transition-colors duration-300">
                                            </div>
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-xs font-bold text-[#999] uppercase tracking-widest">{t('downtime_label')}</span>
                                                <span className="text-sm text-[#555]">{treatment.downtime}</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-2">
                                            <button
                                                className={`w-full py-4 px-6 text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 ${isSelected
                                                    ? 'bg-[#1C1C1C] text-white shadow-lg'
                                                    : 'bg-transparent border border-[#E5E5E5] text-[#1C1C1C] hover:border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white'
                                                    }`}
                                            >
                                                {isSelected ? t('selected_button') : t('select_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Booking & Payment Flow (Full Mode Only) */}
                {enableBooking && selectedTreatmentId && (
                    <motion.div variants={item} className="mt-20 max-w-2xl mx-auto">
                        <div className="bg-white p-1 shadow-2xl overflow-hidden">
                            {bookingStep === 'none' && (
                                <div className="p-10 text-center bg-[#FDFBF7] border border-[#F0F0F0]">
                                    <h3 className="text-2xl font-serif text-[#1C1C1C] mb-4">{t('booking_title')}</h3>
                                    <p className="text-[#666] mb-8 font-light">{t('booking_desc')}</p>
                                    <Button
                                        size="lg"
                                        onClick={() => setBookingStep('calendar')}
                                        className="bg-[#BFA181] hover:bg-[#A88B6A] text-white h-14 px-10 text-lg uppercase tracking-widest w-full sm:w-auto rounded-none transition-colors"
                                    >
                                        {t('book_button')}
                                    </Button>
                                </div>
                            )}

                            {bookingStep === 'calendar' && (
                                <div className="p-6">
                                    <BookingCalendar onConfirm={(date, time) => {
                                        setBookingDate({ date, time });
                                        setBookingStep('payment');
                                    }} />
                                </div>
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
                                <div className="p-12 text-center bg-[#FDFBF7]">
                                    <div className="w-20 h-20 border-2 border-[#BFA181] rounded-full flex items-center justify-center mx-auto mb-6 text-[#BFA181]">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-3xl font-serif text-[#1C1C1C] mb-4">{t('confirmed_title')}</h3>
                                    <p className="text-[#666] text-lg font-light">
                                        {t('confirmed_desc_pre')} <br />
                                        <span className="font-medium text-[#1C1C1C] mt-2 block">{bookingDate?.date.toLocaleDateString()} {bookingDate?.time}</span>
                                        {t('confirmed_desc_post')}
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
