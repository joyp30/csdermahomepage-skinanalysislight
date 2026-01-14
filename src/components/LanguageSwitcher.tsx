'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
    const t = useTranslations('Index');
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();

    const languages = [
        { code: 'ko', label: '한국어', sub: 'Korean' },
        { code: 'en', label: 'English', sub: 'English' },
        { code: 'zh', label: '中文', sub: 'Chinese' },
        { code: 'ja', label: '日本語', sub: 'Japanese' },
    ];

    const handleLanguageChange = (newLocale: string) => {
        const pathSegments = pathname.split('/');
        pathSegments[1] = newLocale;
        router.push(pathSegments.join('/'));
    };

    return (
        <div className="absolute top-4 right-4 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-slate-100 transition-all hover:scale-105"
                    >
                        <Globe className="h-6 w-6 text-slate-700" />
                        <span className="sr-only">Select Language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] bg-white/95 backdrop-blur-md border-slate-200 shadow-xl rounded-xl p-2">
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${currentLocale === lang.code
                                    ? "bg-blue-50 text-blue-700 font-bold"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            <span className="text-lg">{lang.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
