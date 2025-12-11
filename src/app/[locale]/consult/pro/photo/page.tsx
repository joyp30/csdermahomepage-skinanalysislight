'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Scan, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

export default function PhotoAnalysisPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [step, setStep] = useState<'camera' | 'scanning' | 'results'>('camera');
    const [cameraStream, setCameraStream] = useState<boolean>(true);

    // Mock Analysis Data
    const analysisResults = [
        { label: 'Pore Size', score: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Pigmentation', score: 'Attention', color: 'text-red-600', bg: 'bg-red-100' },
        { label: 'Wrinkles', score: 'Good', color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Sensitivity', score: 'Detected', color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    const handleCapture = () => {
        setStep('scanning');
        setTimeout(() => {
            setStep('results');
        }, 3000);
    };

    const handleNext = () => {
        // Navigate to Survey (in Pro mode, this is ../survey)
        const nextPath = pathname?.replace('/photo', '/survey');
        if (nextPath) router.push(nextPath);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-900/50 z-10 hidden md:block" />

            <div className="w-full max-w-lg relative z-20">
                <AnimatePresence mode="wait">

                    {step === 'camera' && (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
                        >
                            <div className="relative aspect-[3/4] bg-slate-800 flex items-center justify-center">
                                {/* Mock Camera Feed */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center mix-blend-overlay" />
                                </div>

                                {/* Face Guide Overlay */}
                                <div className="w-64 h-80 border-2 border-white/30 rounded-[50%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 box-content shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 text-white/80 text-xs uppercase tracking-widest font-bold">Align Face</div>
                                </div>

                                <div className="absolute bottom-8 w-full flex justify-center">
                                    <button
                                        onClick={handleCapture}
                                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-full group-hover:scale-95 transition-transform" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-900 text-center">
                                <h2 className="text-white font-bold text-xl mb-1">AI Skin Analysis</h2>
                                <p className="text-slate-400 text-sm">Please remove glasses and masks.</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 'scanning' && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-[600px] w-full bg-slate-900 rounded-3xl border border-slate-700 relative overflow-hidden"
                        >
                            {/* Scanning Grid Animation */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-scan" style={{ height: '50%' }} />

                            <div className="w-32 h-32 relative mb-8">
                                <Scan size={128} className="text-green-500 absolute inset-0 animate-pulse" strokeWidth={1} />
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-green-500 font-bold text-2xl">
                                    ...
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 z-10">Analyzing Skin Texture...</h2>
                            <p className="text-slate-400 z-10">Detecting hydration levels, pores, and pigmentation.</p>
                        </motion.div>
                    )}

                    {step === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                                <h2 className="font-bold text-xl">Analysis Report</h2>
                                <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">ID: #9283</span>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden relative">
                                        {/* Placeholder for captured image */}
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                            <span className="text-xs">Captured<br />Image</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800">Skin Age: 28</h3>
                                        <p className="text-slate-500 text-sm">Actual Age: 30 (-2 Years)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {analysisResults.map((r, i) => (
                                        <div key={i} className={`p-4 rounded-xl border ${r.bg} border-transparent`}>
                                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{r.label}</div>
                                            <div className={`text-lg font-bold ${r.color}`}>{r.score}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
                                    <strong className="text-slate-900 block mb-1">AI Recommendation:</strong>
                                    Pigmentation treatment suggested due to detected melanin activity in cheek area.
                                </div>

                                <Button
                                    onClick={handleNext}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg rounded-xl shadow-lg shadow-blue-500/30"
                                >
                                    Proceed to Detailed Survey <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
