'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function checkInPatient(data: {
    name: string;
    phone: string;
    birthDate?: string;
}) {
    try {
        // Check if patient exists
        let patient = await db.select().from(users).where(
            and(
                eq(users.name, data.name),
                eq(users.phone, data.phone)
            )
        ).get();

        // If not, register new patient
        if (!patient) {
            console.log('Registering new patient:', data.name);
            const result = await db.insert(users).values({
                name: data.name,
                phone: data.phone,
                birthDate: data.birthDate,
                role: 'patient',
            }).returning();
            patient = result[0];
        } else {
            console.log('Patient checked in:', patient.name);
        }

        return { success: true, patientId: patient.id, name: patient.name };
    } catch (error) {
        console.error('Check-in failed:', error);
        return { success: false, error: 'Check-in failed.' };
    }
}
