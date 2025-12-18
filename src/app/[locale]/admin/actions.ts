'use server';

import { db } from '@/db';
import { surveys, leads, bookings, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getSurveys() {
    try {
        const recentSurveys = await db.select().from(surveys).orderBy(desc(surveys.createdAt)).limit(50);
        return recentSurveys.map(s => ({
            ...s,
            concerns: JSON.parse(s.concerns as string) as string[],
            answers: s.answers ? JSON.parse(s.answers as string) : {},
            images: s.images ? JSON.parse(s.images as string) as string[] : []
        }));
    } catch (error) {
        console.error('Failed to fetch surveys:', error);
        return [];
    }
}

export async function getAdminData() {
    try {
        const recentLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(20);

        // Join with users to get patient names for bookings if needed, but bookings has patientId
        // For simplicity, let's just fetch bookings directly. 
        // Ideally we join with users table to get patient name.

        const recentBookings = await db.select({
            id: bookings.id,
            patientId: bookings.patientId,
            treatmentName: bookings.treatmentName,
            date: bookings.date,
            time: bookings.time,
            status: bookings.status,
            createdAt: bookings.createdAt,
            patientName: users.name,
            patientPhone: users.phone,
        })
            .from(bookings)
            .leftJoin(users, eq(bookings.patientId, users.id))
            .orderBy(desc(bookings.createdAt))
            .limit(20);

        return {
            leads: recentLeads,
            bookings: recentBookings
        };
    } catch (error) {
        console.error('Failed to fetch admin data:', error);
        return { leads: [], bookings: [] };
    }
}
