import { db } from '../src/db';
import { leads, bookings } from '../src/db/schema';
import { desc } from 'drizzle-orm';

async function verifyPersistence() {
    console.log('--- Verifying Leads ---');
    const recentLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5);
    console.log('Recent Leads:', JSON.stringify(recentLeads, null, 2));

    console.log('--- Verifying Bookings ---');
    const recentBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(5);
    console.log('Recent Bookings:', JSON.stringify(recentBookings, null, 2));
}

verifyPersistence();
