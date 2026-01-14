'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, addMonths, subMonths } from 'date-fns';

interface BookingCalendarProps {
    onConfirm: (date: Date, time: string) => void;
}

const TIME_SLOTS = [
    '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export default function BookingCalendar({ onConfirm }: BookingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Generate calendar days
    const startDate = startOfWeek(currentDate);
    const days = Array.from({ length: 14 }).map((_, i) => addDays(startDate, i));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                Select Date & Time
            </h3>

            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-slate-100 rounded-full">
                    <ChevronLeft className="h-5 w-5 text-slate-500" />
                </button>
                <span className="font-semibold text-slate-800">{format(currentDate, 'MMMM yyyy')}</span>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-slate-100 rounded-full">
                    <ChevronRight className="h-5 w-5 text-slate-500" />
                </button>
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
                ))}
                {days.map((day, i) => {
                    const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                    const isToday = format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(day)}
                            className={cn(
                                "rounded-lg py-2 text-sm font-medium transition-all relative overflow-hidden",
                                isSelected ? "bg-blue-600 text-white shadow-md scale-105" : "text-slate-700 hover:bg-slate-50",
                                isToday && !isSelected && "text-blue-600 font-bold bg-blue-50"
                            )}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>

            {/* Time Slots */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-500 mb-3 flex items-center">
                    <Clock className="mr-1 h-3 w-3" /> Available Times
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map(time => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                                "py-2 px-1 rounded-md text-xs font-medium border transition-all",
                                selectedTime === time
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                            )}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <Button
                onClick={() => selectedDate && selectedTime && onConfirm(selectedDate, selectedTime)}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl"
            >
                Confirm Booking
            </Button>
        </div>
    );
}
