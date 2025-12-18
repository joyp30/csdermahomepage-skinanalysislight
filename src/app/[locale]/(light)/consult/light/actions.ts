'use server';

import { db } from '@/db';
import { leads } from '@/db/schema';

export async function createLead(data: {
    name: string;
    phone: string;
}) {
    try {
        await db.insert(leads).values({
            name: data.name,
            phone: data.phone,
            source: 'light_mode',
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to create lead:', error);
        return { success: false, error: 'Failed to create lead' };
    }
}
