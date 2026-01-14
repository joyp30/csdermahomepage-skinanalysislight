'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock, Check } from 'lucide-react';

interface PaymentSummaryProps {
    amount: string;
    treatmentName: string;
    onSuccess: () => void;
}

export default function PaymentSummary({ amount, treatmentName, onSuccess }: PaymentSummaryProps) {
    const [processing, setProcessing] = useState(false);

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            onSuccess();
        }, 2000); // Simulate API call
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900">Payment Summary</h3>
                <Lock className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Treatment</span>
                    <span className="font-medium text-slate-900 text-right w-1/2 truncate">{treatmentName}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service Fee</span>
                    <span className="font-medium text-slate-900">Included</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-xl font-black text-blue-600">{amount}</span>
                </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-700">Test Card</p>
                        <p className="text-[10px] text-slate-500">**** 1234</p>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                    This is a simulated secure payment environment.
                </p>
            </div>

            <Button
                onClick={handlePay}
                disabled={processing}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
            >
                {processing ? 'Processing...' : `Pay ${amount}`}
            </Button>
        </div>
    );
}
