'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, ArrowRight, Wifi, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

export default function PhotoAnalysisPage() {
    const router = useRouter();
    const pathname = usePathname();
    // Steps: connect -> fetching -> result
    const [step, setStep] = useState<'connect' | 'fetching' | 'review'>('connect');
    const [progress, setProgress] = useState(0);

    // Mock Data from "Analyzer"
    const mockPhotos = [
        { angle: 'Front', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
        { angle: 'Left 45°', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }, // Placeholder: same image for demo
        { angle: 'Right 45°', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
    ];

    useEffect(() => {
        if (step === 'connect') {
            const timer = setTimeout(() => setStep('fetching'), 2000);
            return () => clearTimeout(timer);
        }
        if (step === 'fetching') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStep('review');
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handleNext = () => {
        // Skip manual survey, go straight to results (or survey with pre-filled data)
        // For now, let's assume we go to survey to confirm details
        const nextPath = pathname?.replace('/photo', '/survey');
        if (nextPath) router.push(nextPath);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-white relative overflow-hidden">
            {/* Background Tech Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />

            <div className="max-w-4xl w-full z-10">
                <AnimatePresence mode="wait">

                    {/* STEP 1: CONNECTING */}
                    {step === 'connect' && (
                        <motion.div
                            key="connect"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-96"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
                                <Wifi className="w-24 h-24 text-cyan-400 animate-pulse" />
                            </div>
                            <h2 className="text-3xl font-light mb-2">Connecting to Face Analyzer...</h2>
                            <p className="text-slate-500 font-mono text-sm">Waiting for device handshake [192.168.1.104]</p>
                        </motion.div>
                    )}

                    {/* STEP 2: FETCHING DATA */}
                    {step === 'fetching' && (
                        <motion.div
                            key="fetching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-96"
                        >
                            <div className="w-full max-w-md space-y-4">
                                <div className="flex justify-between text-xs font-mono text-cyan-400">
                                    <span>DOWNLOADING ASSETS</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-cyan-500 shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="space-y-1 text-center mt-4">
                                    <p className="text-slate-400 text-sm animate-pulse">
                                        {progress < 30 ? 'Receiving Frontal Capture...' :
                                            progress < 60 ? 'Receiving Lateral Maps...' :
                                                progress < 90 ? 'Processing UV Data...' :
                                                    'Finalizing Report...'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: REVIEW / SUCCESS */}
                    {step === 'review' && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <CheckCircle className="text-green-400" />
                                        Analysis Complete
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">Data successfully retrieved from device.</p>
                                </div>
                                <Button variant="outline" onClick={() => setStep('connect')} className="border-white/10 hover:bg-white/5 text-slate-300">
                                    <RefreshCw className="mr-2 w-4 h-4" /> Rewrite
                                </Button>
                            </div>

                            {/* Photos Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {mockPhotos.map((photo, idx) => (
                                    <div key={idx} className="group relative rounded-xl overflow-hidden border border-white/10 bg-black">
                                        <div className="aspect-[3/4] relative opacity-80 group-hover:opacity-100 transition-opacity">
                                            {/* Simulate Image */}
                                            <div
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{ backgroundImage: `url('${photo.src}')` }}
                                            />
                                            {/* Overlay UI */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                <span className="text-cyan-400 font-mono text-xs mb-1">ANALYSIS MAP</span>
                                                <span className="text-white font-bold">{photo.angle}</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-mono border border-white/10 text-cyan-400">
                                            RAW_IMG_{idx + 1}.CR2
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Detected Attributes Summary */}
                            <div className="grid grid-cols-4 gap-4 mb-8">
                                {[
                                    { label: 'Pores', val: 'High', col: 'text-red-400' },
                                    { label: 'Wrinkles', val: 'Avg', col: 'text-yellow-400' },
                                    { label: 'Pigment', val: 'Low', col: 'text-green-400' },
                                    { label: 'Elasticity', val: 'Good', col: 'text-blue-400' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-800/50 rounded-lg p-3 text-center border border-white/5">
                                        <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">{item.label}</div>
                                        <div className={`text-xl font-black ${item.col}`}>{item.val}</div>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={handleNext} className="w-full h-16 text-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20">
                                Proceed to Consultation <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
