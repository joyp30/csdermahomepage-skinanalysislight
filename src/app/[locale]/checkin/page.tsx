'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkInPatient } from './actions';
import { Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAppMode } from '@/context/AppModeContext';

export default function CheckInPage() {
    const t = useTranslations('CheckIn');
    const router = useRouter();
    const locale = useLocale();
    const { mode } = useAppMode();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) return;

        setIsLoading(true);
        try {
            const formData = { name, phone };
            const result = await checkInPatient(formData);

            if (result.success) {
                console.log('Redirecting to survey:', result.patientId);

                let nextPath = `/${locale}/survey`;
                if (mode === 'pro') nextPath = `/${locale}/consult/pro/photo`;
                else if (mode === 'full') nextPath = `/${locale}/consult/full/survey`;

                router.push(`${nextPath}?patientId=${result.patientId}`);
            } else {
                console.error('Check-in failed:', result.error);
                alert('Check-in failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative">
            <LanguageSwitcher />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">{t('title')}</CardTitle>
                    <CardDescription className="text-center">
                        {t('description')}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('name_label')}</Label>
                            <Input
                                id="name"
                                placeholder={t('name_placeholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('phone_label')}</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder={t('phone_placeholder')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('loading')}
                                </>
                            ) : (
                                t('submit_button')
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
