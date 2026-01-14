'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadConsultationImages } from '../../upload-actions';
// Actually upload-actions.ts IS in the same folder? No, it was in src/app/admin/upload-actions.ts
// If I moved src/app/admin to src/app/[locale]/admin, then upload-actions.ts is at ../../upload-actions.ts from here
// src/app/[locale]/admin/consultations/[id]/UploadForm.tsx
// src/app/[locale]/admin/upload-actions.ts 
// So ../../upload-actions.ts
// Wait, previous import was from './upload-actions' ?
// No, previously the Page was in src/app/admin/consultations/[id]/page.tsx
// upload-actions was in src/app/admin/upload-actions.ts
// So import was `../../upload-actions`.
// Wait, let's check file listing to be sure.

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UploadForm({ surveyId }: { surveyId: number }) {
    // const t = useTranslations('Admin'); // If we add upload strings there
    const [uploading, setUploading] = useState(false);

    // Hardcoded for now or add to messages
    const t_upload = "Upload Photos";
    const t_uploading = "Uploading...";
    const t_front = "Front View";
    const t_left = "Left Profile";
    const t_right = "Right Profile";

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.currentTarget);
        formData.append('surveyId', surveyId.toString());

        const result = await uploadConsultationImages(formData);
        if (!result.success) {
            alert('Upload failed');
        } else {
            // Refresh is handled by action revalidate
        }
        setUploading(false);
    };

    return (
        <form onSubmit={handleUpload} className="space-y-4 border-t pt-4">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="front">{t_front}</Label>
                    <Input id="front" name="front" type="file" accept="image/*" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="left">{t_left}</Label>
                    <Input id="left" name="left" type="file" accept="image/*" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="right">{t_right}</Label>
                    <Input id="right" name="right" type="file" accept="image/*" />
                </div>
            </div>
            <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t_uploading}
                    </>
                ) : (
                    t_upload
                )}
            </Button>
        </form>
    );
}
