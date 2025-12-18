'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { motion } from 'framer-motion';

export default function Header() {
    const locale = useLocale();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
        >
            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link href={`/${locale}`} className="flex items-center gap-3 group">
                    <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-full border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <Image
                            src="/logo.jpg"
                            alt="Seoul Dermatology Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                            서울피부과의원
                        </span>
                        <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-medium">
                            Seoul Dermatology
                        </span>
                    </div>
                </Link>

                {/* Right Section: Language */}
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                </div>
            </div>
        </motion.header>
    );
}
