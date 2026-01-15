'use client';

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from 'next-intl';

export default function ResearchEthicsModal() {
    const locale = useLocale();
    const title = locale === 'ko' ? "연구 대상자 관리" : "Research Subject Management";

    return (
        <DialogPrimitive.Root>
            <DialogPrimitive.Trigger asChild>
                <button className="text-white/80 hover:text-white transition-colors text-sm underline decoration-white/30 underline-offset-4 text-left">
                    5) {title}
                </button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
                )}>
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                        <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight text-slate-900">
                            {title}
                        </DialogPrimitive.Title>
                    </div>
                    <div className="prose prose-sm max-w-none text-slate-700 space-y-4 max-h-[60vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-slate-900">5) {title}</h3>

                        <p className="leading-relaxed">
                            {locale === 'ko'
                                ? "본 연구의 의뢰자 및 시험자는 헬싱키 선언의 근본정신을 준수하고, 연구 대상자의 권익을 보호하고자 노력하며 연구 수행과 결과 기록 등에 있어 인체시험관리기준 (GCP) 및 관련 국내 법규를 준수하도록 노력한다."
                                : "The sponsor and investigator of this study adhere to the fundamental principles of the Declaration of Helsinki, strive to protect the rights and welfare of study subjects, and endeavor to comply with Good Clinical Practice (GCP) and relevant domestic regulations in the conduct of the study and recording of results."}
                        </p>

                        <p className="leading-relaxed">
                            {locale === 'ko'
                                ? "시험 전 모든 연구 대상자들의 시험참여 동의를 받고, 식품의약품안전처가 발간한 [화장품 인체적용시험 및 효력시험 가이드라인, 2021.10]에 따라 연구 대상자들의 동의를 얻는데 마땅히 제공해야 할 모든 정보들을 성실히 전달한다."
                                : "Prior to the study, informed consent for participation is obtained from all study subjects. In accordance with the [Guidelines for Human Application Tests and Efficacy Tests of Cosmetics, 2021.10] published by the Ministry of Food and Drug Safety, all information that must be provided to obtain the consent of study subjects is faithfully delivered."}
                        </p>
                    </div>
                    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4 text-slate-500" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
