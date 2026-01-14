'use server';

import { db } from '@/db';
import { surveys } from '@/db/schema';

export async function submitSurvey(data: {
    patientId: number | null;
    answers: Record<string, any>;
}) {
    console.log('Submitting survey:', data);

    try {
        const concerns = data.answers['q1_concerns'] as string[] || [];
        const skinType = data.answers['q2_skin_type'] as string;
        // q3_history is ignored for now or can be logged

        const result = await db.insert(surveys).values({
            patientId: data.patientId,
            concerns: JSON.stringify(concerns),
            answers: JSON.stringify(data.answers),
            skinType: skinType,
            status: 'pending',
        }).returning({ id: surveys.id });

        return { success: true, surveyId: result[0].id };
    } catch (error) {
        console.error('Failed to submit survey:', error);
        return { success: false, error: 'Failed to submit survey' };
    }
}
