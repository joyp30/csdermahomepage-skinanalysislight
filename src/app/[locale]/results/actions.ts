'use server';

import { db } from '@/db';
import { surveys, bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getRecommendations } from '@/lib/data/treatments';

export async function createBooking(data: {
    patientId: number;
    treatmentId: string;
    treatmentName: string;
    date: string;
    time: string;
}) {
    try {
        await db.insert(bookings).values({
            patientId: data.patientId,
            treatmentId: data.treatmentId,
            treatmentName: data.treatmentName,
            date: data.date,
            time: data.time,
            status: 'confirmed',
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to create booking:', error);
        return { success: false, error: 'Failed to create booking' };
    }
}

export async function getSurveyResult(id: number) {
    try {
        const result = await db.select().from(surveys).where(eq(surveys.id, id)).get();

        if (!result) return null;

        const concerns = JSON.parse(result.concerns as string) as string[];
        const answers = result.answers ? JSON.parse(result.answers as string) : {};
        const skinType = result.skinType as string;
        const recommendations = getRecommendations(answers);
        const images = result.images ? JSON.parse(result.images as string) as string[] : [];

        return {
            concerns,
            recommendations,
            images,
            createdAt: result.createdAt,
            patientId: result.patientId,
        };
    } catch (error) {
        console.error('Failed to fetch survey:', error);
        return null;
    }
}
