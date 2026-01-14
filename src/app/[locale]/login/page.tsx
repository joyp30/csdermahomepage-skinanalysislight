'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { login } from './actions';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const t = useTranslations('Index'); // Reusing Index for now, or add Login keys

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await login(password);
        if (result.success) {
            router.push('/admin');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-slate-900 p-3 rounded-full w-fit mb-4">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Staff Login</CardTitle>
                    <CardDescription>Enter access code to continue</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Access Code"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
                            Login
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
