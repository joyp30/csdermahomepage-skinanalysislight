'use client';

import { useState } from 'react';
import { Phone, MessageCircle, MapPin, Calendar, FileText, Users, Menu, X, Monitor, BookOpen, Instagram, AtSign, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    external?: boolean;
    color: string;
    image?: string;
}

export default function QuickMenu() {
    const [isOpen, setIsOpen] = useState(false);

    // Hardcoded items to match csderma.kr live site, pointing to main site
    const menuItems: MenuItem[] = [
        {
            icon: <Home className="h-5 w-5" />,
            title: "홈페이지",
            description: "서울피부과 메인",
            href: 'https://csderma.kr',
            external: true,
            color: 'bg-slate-100 text-slate-600'
        },
        {
            icon: <Phone className="h-5 w-5" />,
            title: "전화 상담",
            description: '043-284-1300',
            href: 'tel:043-284-1300',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: <MessageCircle className="h-5 w-5" />,
            title: "카카오톡 상담",
            description: "간편 예약/상담",
            href: 'https://pf.kakao.com/_YxkwHxj/chat',
            external: true,
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            icon: <MapPin className="h-5 w-5" />,
            title: "오시는 길",
            description: "청주시 서원구",
            href: 'https://csderma.kr/#location',
            external: true,
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: <Calendar className="h-5 w-5" />,
            title: "진료 안내",
            description: "진료 시간 확인",
            href: 'https://csderma.kr/#about',
            external: true,
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: <FileText className="h-5 w-5" />,
            title: "시술 정보",
            description: "다양한 시술 소개",
            href: 'https://csderma.kr/#treatments',
            external: true,
            color: 'bg-rose-100 text-rose-600'
        },
        {
            icon: <Monitor className="h-5 w-5" />,
            title: "보유 장비",
            description: "첨단 레이저 장비",
            href: 'https://csderma.kr/#equipment',
            external: true,
            color: 'bg-cyan-100 text-cyan-600'
        },
        {
            icon: <BookOpen className="h-5 w-5" />,
            title: "피부과 이야기",
            description: "피부 건강 정보",
            href: 'https://csderma.kr/#blog',
            external: true,
            color: 'bg-orange-100 text-orange-600'
        },
        {
            icon: <Instagram className="h-5 w-5" />,
            title: "Instagram",
            description: "@seoul_derma_cj",
            href: 'https://www.instagram.com/seoul_derma_cj?igsh=MTQ5cTMzODBpb3FsNg==',
            external: true,
            color: 'bg-pink-100 text-pink-600'
        },
        {
            icon: <AtSign className="h-5 w-5" />,
            title: "Threads",
            description: "@seoul_derma_cj",
            href: 'https://www.threads.net/@seoul_derma_cj',
            external: true,
            color: 'bg-neutral-100 text-neutral-900'
        },
        {
            icon: <Users className="h-5 w-5" />,
            title: "의료진 소개",
            description: "피부과 전문의",
            href: 'https://csderma.kr/doctors',
            external: true,
            color: 'bg-indigo-100 text-indigo-600'
        }
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            <div className="fixed right-6 bottom-6 md:bottom-10 z-50 flex flex-col items-end gap-4 pointer-events-none">
                {/* Menu Items */}
                <div className={cn(
                    "flex flex-col gap-3 transition-all duration-300 origin-bottom-right items-center mb-2 pointer-events-auto",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"
                )}>
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            target={item.external || item.href.startsWith('http') ? "_blank" : undefined}
                            rel={item.external || item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                            className="flex flex-col items-center gap-1 group"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className={cn(
                                "rounded-full shadow-md transition-all duration-200 group-hover:scale-110 border border-white/20 flex items-center justify-center w-11 h-11 bg-white",
                                !item.image && item.color.replace('bg-', 'bg-white text-').replace('text-', 'text-')
                            )}>
                                {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    item.icon
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                                {item.title}
                            </span>
                        </a>
                    ))}
                </div>

                {/* Trigger Button */}
                <Button
                    size="icon"
                    className={cn(
                        "h-14 w-14 rounded-full shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-0.5 pointer-events-auto",
                        isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-[#D4AF37] hover:bg-[#B4941F]"
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-white" />
                    ) : (
                        <>
                            <Menu className="h-5 w-5 text-white" />
                            <span className="text-[10px] text-white font-bold leading-none">퀵메뉴</span>
                        </>
                    )}
                </Button>
            </div>
        </>
    );
}
