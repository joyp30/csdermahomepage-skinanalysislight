'use server';

import { db } from '@/db';
import { surveys } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

export async function uploadConsultationImages(formData: FormData) {
    const surveyId = parseInt(formData.get('surveyId') as string);
    const files = [
        { type: 'front', file: formData.get('front') as File },
        { type: 'left', file: formData.get('left') as File },
        { type: 'right', file: formData.get('right') as File },
    ].filter(item => item.file && item.file.size > 0);

    if (files.length === 0) {
        return { success: false, error: 'No files uploaded' };
    }

    const imagePaths: string[] = [];

    try {
        for (const item of files) {
            const bytes = await item.file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `consultation_${surveyId}_${item.type}_${Date.now()}.jpg`;
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            const filePath = join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            imagePaths.push(`/uploads/${fileName}`);
        }

        // Update database
        // Fetch existing images first to append? Or overwrite?
        // For MVP, lets overwrite or simple merge logic could be added.
        // Here we just save what we got.

        await db.update(surveys)
            .set({
                images: JSON.stringify(imagePaths),
                status: 'reviewed' // Auto mark as reviewed/analyzed when photos add
            })
            .where(eq(surveys.id, surveyId));

        revalidatePath(`/admin`);
        revalidatePath(`/results`); // In case user is looking at results

        return { success: true };
    } catch (error) {
        console.error('Upload failed:', error);
        return { success: false, error: 'Upload failed' };
    }
}
